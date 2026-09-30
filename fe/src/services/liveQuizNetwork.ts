import mqtt, { type MqttClient } from 'mqtt';
import type { LiveQuizNetworkMessage } from '@/types/liveQuiz';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class LiveQuizNetworkService {
  private client: MqttClient | null = null;
  private ws: WebSocket | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private roomId: string = '';
  private isHost: boolean = false;
  private clientId: string = '';
  private status: ConnectionStatus = 'disconnected';
  private messageListeners: Set<(msg: LiveQuizNetworkMessage) => void> = new Set();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private topic: string = '';
  private seenMessageIds: Set<string> = new Set();
  private reconnectWsTimer: any = null;

  constructor() {
    this.clientId = 'lq_' + Math.random().toString(36).substring(2, 9);
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

  public subscribeMessage(listener: (msg: LiveQuizNetworkMessage) => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  private setStatus(newStatus: ConnectionStatus) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusListeners.forEach((listener) => {
      try {
        listener(newStatus);
      } catch (err) {
        console.error('Error in status listener:', err);
      }
    });
  }

  private dispatchMessage(msg: LiveQuizNetworkMessage) {
    const msgKey = (msg as any).msgId || `${msg.senderId}_${msg.type}_${msg.timestamp}_${JSON.stringify(msg.payload || '')}`;
    if (this.seenMessageIds.has(msgKey)) return;
    this.seenMessageIds.add(msgKey);

    if (this.seenMessageIds.size > 500) {
      const firstEntries = Array.from(this.seenMessageIds).slice(0, 100);
      firstEntries.forEach(k => this.seenMessageIds.delete(k));
    }

    this.messageListeners.forEach((listener) => {
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
    this.topic = `hcm202/livequiz/${this.roomId}/#`;

    this.setStatus('connecting');

    // 1. Setup local BroadcastChannel for zero-latency local pairing (0ms)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`hcm202_lq_${this.roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.senderId !== this.clientId) {
            this.dispatchMessage(event.data);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available:', e);
    }

    // 2. Setup Direct Local LAN WebSocket (1ms)
    this.initLocalWebSocket();

    // 3. Setup MQTT over Secure WebSocket (Cloud fallback)
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';

    try {
      this.client = mqtt.connect(brokerUrl, {
        clientId: `${this.isHost ? 'host' : 'player'}_${this.clientId}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
        keepalive: 60,
      });

      this.client.on('connect', () => {
        this.setStatus('connected');
        if (this.client) {
          this.client.subscribe(this.topic, { qos: 0 }, (err) => {
            if (err) {
              console.warn('LiveQuiz MQTT subscribe error:', err);
            }
          });
        }
      });

      this.client.on('message', (_topic, message) => {
        try {
          const parsed: LiveQuizNetworkMessage = JSON.parse(message.toString());
          if (parsed && parsed.senderId !== this.clientId) {
            this.dispatchMessage(parsed);
          }
        } catch (e) {
          console.error('Failed to parse MQTT message:', e);
        }
      });

      this.client.on('error', (err) => {
        console.warn('LiveQuiz MQTT error:', err);
        if (this.ws?.readyState === WebSocket.OPEN || this.broadcastChannel) {
          this.setStatus('connected');
        } else {
          this.setStatus('error');
        }
      });
    } catch (e) {
      console.error('LiveQuiz MQTT connect exception:', e);
    }
  }

  private initLocalWebSocket() {
    if (typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/livequiz-ws`;

      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        console.log(`[LiveQuizNet] Ultra-fast LAN WebSocket connected: ${wsUrl}`);
        this.setStatus('connected');
      };

      socket.onmessage = (event) => {
        try {
          const msg: LiveQuizNetworkMessage = JSON.parse(event.data);
          if (msg.senderId !== this.clientId && (!msg.roomId || msg.roomId === this.roomId)) {
            this.dispatchMessage(msg);
          }
        } catch (err) {
          console.error('[LiveQuizNet] Local WS message parse error:', err);
        }
      };

      socket.onclose = () => {
        this.ws = null;
        if (this.roomId && !this.reconnectWsTimer) {
          this.reconnectWsTimer = setTimeout(() => {
            this.reconnectWsTimer = null;
            if (this.roomId) this.initLocalWebSocket();
          }, 3000);
        }
      };
    } catch (e) {
      console.warn('[LiveQuizNet] Could not initialize local WebSocket:', e);
    }
  }

  private publishDirectWs(msg: LiveQuizNetworkMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.warn('[LiveQuizNet] WS send error:', err);
      }
    }
  }

  public sendMessage(type: LiveQuizNetworkMessage['type'], payload: any) {
    if (!this.roomId) return;

    const msgId = `${this.clientId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const message: LiveQuizNetworkMessage & { msgId: string } = {
      type,
      senderId: this.clientId,
      roomId: this.roomId,
      payload,
      timestamp: Date.now(),
      msgId,
    };

    this.seenMessageIds.add(msgId);

    // 1. BroadcastChannel dispatch (0ms)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel post error:', e);
      }
    }

    // 2. Direct LAN WebSocket (1ms)
    this.publishDirectWs(message);

    // 3. MQTT dispatch
    if (this.client?.connected) {
      try {
        const publishTopic = `hcm202/livequiz/${this.roomId}/${type.toLowerCase()}`;
        this.client.publish(publishTopic, JSON.stringify(message), { qos: 0 });
      } catch (e) {
        console.warn('MQTT publish error:', e);
      }
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

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
    this.status = 'disconnected';
    this.roomId = '';
  }
}

export const liveQuizNetwork = new LiveQuizNetworkService();
