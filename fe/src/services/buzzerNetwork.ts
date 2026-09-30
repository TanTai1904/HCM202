import mqtt, { type MqttClient } from 'mqtt';
import type { NetworkMessage } from '@/types/buzzer';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class BuzzerNetworkService {
  private client: MqttClient | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomId: string = '';
  private isHost: boolean = false;
  private clientId: string = '';
  private status: ConnectionStatus = 'disconnected';
  private messageListeners: Set<(msg: NetworkMessage) => void> = new Set();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private topic: string = '';

  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public subscribeStatus(listener: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  public subscribeMessage(listener: (msg: NetworkMessage) => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  private setStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach(listener => {
      try {
        listener(newStatus);
      } catch (err) {
        console.error('Error in status listener:', err);
      }
    });
  }

  private dispatchMessage(msg: NetworkMessage) {
    // Avoid processing message twice if it originated from self via broadcast
    this.messageListeners.forEach(listener => {
      try {
        listener(msg);
      } catch (err) {
        console.error('Error in message listener:', err);
      }
    });
  }

  public connect(roomId: string, isHost: boolean, customClientId?: string) {
    if (this.roomId === roomId && this.client?.connected) {
      return;
    }

    this.disconnect();

    this.roomId = roomId.toUpperCase().trim();
    this.isHost = isHost;
    if (customClientId) {
      this.clientId = customClientId;
    }
    this.topic = `hcm202/room/${this.roomId}/#`;

    this.setStatus('connecting');

    // 1. Setup local BroadcastChannel for zero-latency same-browser / multi-tab synchronization
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`hcm202_room_${this.roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.senderId !== this.clientId) {
            this.dispatchMessage(event.data);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available:', e);
    }

    // 2. Setup MQTT over WebSocket (EMQX public secure WebSocket broker)
    // EMQX port 8084 is SSL/WSS, perfectly compatible with HTTPS deployments
    const brokerUrls = [
      'wss://broker.emqx.io:8084/mqtt',
      'wss://broker.hivemq.com:8884/mqtt'
    ];

    const currentUrl = brokerUrls[0];

    try {
      this.client = mqtt.connect(currentUrl, {
        clientId: `${this.isHost ? 'host' : 'player'}_${this.clientId}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
        keepalive: 60,
      });

      this.client.on('connect', () => {
        console.log(`[BuzzerNet] Connected to MQTT broker for room: ${this.roomId}`);
        this.setStatus('connected');

        if (this.client) {
          this.client.subscribe(this.topic, { qos: 0 }, (err) => {
            if (err) {
              console.error('[BuzzerNet] Subscribe error:', err);
            }
          });
        }
      });

      this.client.on('message', (_topic, payload) => {
        try {
          const msgStr = payload.toString();
          const parsed: NetworkMessage = JSON.parse(msgStr);
          if (parsed.senderId !== this.clientId) {
            this.dispatchMessage(parsed);
          }
        } catch (err) {
          console.error('[BuzzerNet] JSON parse error:', err);
        }
      });

      this.client.on('reconnect', () => {
        this.setStatus('connecting');
      });

      this.client.on('error', (err) => {
        console.warn('[BuzzerNet] MQTT warning/error:', err);
        // Fall back to connected if broadcastChannel is active
        if (this.broadcastChannel) {
          this.setStatus('connected');
        } else {
          this.setStatus('error');
        }
      });

      this.client.on('offline', () => {
        if (!this.broadcastChannel) {
          this.setStatus('disconnected');
        }
      });

    } catch (err) {
      console.error('[BuzzerNet] Failed to init MQTT:', err);
      // Fallback gracefully
      if (this.broadcastChannel) {
        this.setStatus('connected');
      } else {
        this.setStatus('error');
      }
    }
  }

  public publish(type: NetworkMessage['type'], payload: any) {
    const msg: NetworkMessage = {
      type,
      senderId: this.clientId,
      roomId: this.roomId,
      payload,
      timestamp: Date.now(),
    };

    // 1. Broadcast locally (instant)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {
        console.warn('BroadcastChannel postMessage error:', e);
      }
    }

    // 2. Publish to MQTT Broker
    if (this.client && this.client.connected) {
      const pubTopic = `hcm202/room/${this.roomId}/${type}`;
      this.client.publish(pubTopic, JSON.stringify(msg), { qos: 0 });
    }
  }

  public disconnect() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch (err) {
        console.error('Error ending MQTT client:', err);
      }
      this.client = null;
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch (err) {
        console.error('Error closing BroadcastChannel:', err);
      }
      this.broadcastChannel = null;
    }

    this.roomId = '';
    this.setStatus('disconnected');
  }
}

export const buzzerNetwork = new BuzzerNetworkService();
