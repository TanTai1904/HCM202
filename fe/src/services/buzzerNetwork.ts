import mqtt, { type MqttClient } from 'mqtt';
import type { NetworkMessage } from '@/types/buzzer';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class BuzzerNetworkService {
  private client: MqttClient | null = null;
  private ws: WebSocket | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomId: string = '';
  private isHost: boolean = false;
  private clientId: string = '';
  private status: ConnectionStatus = 'disconnected';
  private messageListeners: Set<(msg: NetworkMessage) => void> = new Set();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private topic: string = '';
  private seenMessageIds: Set<string> = new Set();
  private reconnectWsTimer: any = null;

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
    if (this.status === newStatus) return;
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
    // Deduplication check: ignore if already processed
    const msgKey = (msg as any).msgId || `${msg.senderId}_${msg.type}_${msg.timestamp}_${JSON.stringify(msg.payload || '')}`;
    if (this.seenMessageIds.has(msgKey)) {
      return;
    }
    this.seenMessageIds.add(msgKey);

    // Keep seen set small (max 500 items)
    if (this.seenMessageIds.size > 500) {
      const firstEntries = Array.from(this.seenMessageIds).slice(0, 100);
      firstEntries.forEach(k => this.seenMessageIds.delete(k));
    }

    this.messageListeners.forEach(listener => {
      try {
        listener(msg);
      } catch (err) {
        console.error('Error in message listener:', err);
      }
    });
  }

  public connect(roomId: string, isHost: boolean, customClientId?: string) {
    if (this.roomId === roomId && (this.ws?.readyState === WebSocket.OPEN || this.client?.connected)) {
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

    // 1. Setup local BroadcastChannel for zero-latency same-browser / multi-tab synchronization (0ms)
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

    // 2. Setup Direct Local LAN WebSocket Server (1ms ultra-low latency between phone & laptop on Wi-Fi)
    this.initLocalWebSocket();

    // 3. Setup MQTT over WebSocket (Cloud fallback for remote/4G users)
    const brokerUrls = [
      'wss://broker.emqx.io:8084/mqtt',
      'wss://broker.hivemq.com:8884/mqtt'
    ];

    try {
      this.client = mqtt.connect(brokerUrls[0], {
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

      this.client.on('error', (err) => {
        console.warn('[BuzzerNet] MQTT warning/error:', err);
        if (this.ws?.readyState === WebSocket.OPEN || this.broadcastChannel) {
          this.setStatus('connected');
        } else {
          this.setStatus('error');
        }
      });
    } catch (err) {
      console.error('[BuzzerNet] Failed to init MQTT:', err);
    }
  }

  private initLocalWebSocket() {
    if (typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/buzzer-ws`;
      
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        console.log(`[BuzzerNet] Ultra-fast LAN WebSocket connected: ${wsUrl}`);
        this.setStatus('connected');

        // Immediately send room handshake message
        this.publishDirectWs({
          type: 'REQUEST_SYNC',
          senderId: this.clientId,
          roomId: this.roomId,
          payload: { roomId: this.roomId },
          timestamp: Date.now(),
        });
      };

      socket.onmessage = (event) => {
        try {
          const msg: NetworkMessage = JSON.parse(event.data);
          if (msg.senderId !== this.clientId && (!msg.roomId || msg.roomId === this.roomId)) {
            this.dispatchMessage(msg);
          }
        } catch (err) {
          console.error('[BuzzerNet] Local WS message parse error:', err);
        }
      };

      socket.onerror = () => {
        // Local WS failed (e.g. running on static server or Vercel) - MQTT will handle it
      };

      socket.onclose = () => {
        this.ws = null;
        // Retry connection in background if room is still active
        if (this.roomId && !this.reconnectWsTimer) {
          this.reconnectWsTimer = setTimeout(() => {
            this.reconnectWsTimer = null;
            if (this.roomId) this.initLocalWebSocket();
          }, 3000);
        }
      };
    } catch (e) {
      console.warn('[BuzzerNet] Could not initialize local WebSocket:', e);
    }
  }

  private publishDirectWs(msg: NetworkMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.warn('[BuzzerNet] WS send error:', err);
      }
    }
  }

  public publish(type: NetworkMessage['type'], payload: any) {
    const msgId = `${this.clientId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const msg: NetworkMessage & { msgId: string } = {
      type,
      senderId: this.clientId,
      roomId: this.roomId,
      payload,
      timestamp: Date.now(),
      msgId,
    };

    // Mark self as seen so we don't process own echo
    this.seenMessageIds.add(msgId);

    // 1. Broadcast locally in same browser tab (0ms)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {
        console.warn('BroadcastChannel postMessage error:', e);
      }
    }

    // 2. Direct LAN WebSocket (1ms between phone & laptop on Wi-Fi)
    this.publishDirectWs(msg);

    // 3. Publish to Cloud MQTT Broker (for remote fallback)
    if (this.client && this.client.connected) {
      const pubTopic = `hcm202/room/${this.roomId}/${type}`;
      this.client.publish(pubTopic, JSON.stringify(msg), { qos: 0 });
    }
  }

  public disconnect() {
    if (this.reconnectWsTimer) {
      clearTimeout(this.reconnectWsTimer);
      this.reconnectWsTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (err) {
        console.error('Error closing local WS:', err);
      }
      this.ws = null;
    }

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
