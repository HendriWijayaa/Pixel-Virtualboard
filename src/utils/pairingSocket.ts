import { KeyDefinition, KeyModifiers } from '../types/keyboard';
import { DeviceInfo, detectDevice, detectDeviceAsync, detectHostComputer } from './deviceDetector';

export type HostEventHandlers = {
  onRemoteConnected: (device: DeviceInfo, totalRemotes: number) => void;
  onRemoteDisconnected: (totalRemotes: number) => void;
  onRemoteKeystroke: (key: KeyDefinition, isShifted: boolean, modifiers?: KeyModifiers) => void;
};

export type RemoteEventHandlers = {
  onPairedSuccess: (hostOnline: boolean, hostInfo?: string) => void;
  onHostOnline: (hostInfo?: string) => void;
  onHostOffline: () => void;
  onTextSynced?: (textLength: number, preview: string) => void;
};

export class PairingSocket {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private role: 'host' | 'remote' | null = null;
  private isIntentionalClose: boolean = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private hostHandlers: HostEventHandlers | null = null;
  private remoteHandlers: RemoteEventHandlers | null = null;

  private getWsUrl(): string {
    const loc = window.location;
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${loc.host}`;
  }

  public connectAsHost(roomId: string, handlers: HostEventHandlers) {
    this.cleanup();
    this.roomId = roomId;
    this.role = 'host';
    this.hostHandlers = handlers;
    this.isIntentionalClose = false;

    this.initSocket();
  }

  public connectAsRemote(roomId: string, handlers: RemoteEventHandlers) {
    this.cleanup();
    this.roomId = roomId;
    this.role = 'remote';
    this.remoteHandlers = handlers;
    this.isIntentionalClose = false;

    this.initSocket();
  }

  private initSocket() {
    try {
      this.ws = new WebSocket(this.getWsUrl());

      this.ws.onopen = () => {
        if (!this.ws || !this.roomId || !this.role) return;

        if (this.role === 'host') {
          const hostInfo = detectHostComputer();
          this.ws.send(JSON.stringify({
            type: 'register_host',
            roomId: this.roomId,
            hostInfo,
          }));
        } else if (this.role === 'remote') {
          const detected = detectDevice();
          this.ws.send(JSON.stringify({
            type: 'register_remote',
            roomId: this.roomId,
            deviceInfo: JSON.stringify(detected),
          }));

          // Follow up immediately with high entropy Client Hints & GPU verification
          detectDeviceAsync().then((asyncDetected) => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN && this.role === 'remote') {
              this.updateDeviceInfo(asyncDetected);
            }
          }).catch(() => {
            // fallback stays
          });
        }

        // Start heartbeat keepalive
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (this.role === 'host' && this.hostHandlers) {
            if (data.type === 'remote_connected') {
              let parsedDevice: DeviceInfo;
              try {
                if (typeof data.deviceInfo === 'string' && data.deviceInfo.startsWith('{')) {
                  parsedDevice = JSON.parse(data.deviceInfo);
                } else if (typeof data.deviceInfo === 'object') {
                  parsedDevice = data.deviceInfo;
                } else {
                  parsedDevice = {
                    name: data.deviceInfo || 'Smartphone',
                    brand: 'generic',
                    brandLabel: 'Smartphone',
                    os: 'Android',
                    resolution: '1080 × 2400',
                    browser: 'Mobile',
                    isMobile: true,
                    batteryPercent: 88,
                  };
                }
              } catch {
                parsedDevice = {
                  name: String(data.deviceInfo || 'Smartphone'),
                  brand: 'generic',
                  brandLabel: 'Smartphone',
                  os: 'Android',
                  resolution: '1080 × 2400',
                  browser: 'Mobile',
                  isMobile: true,
                  batteryPercent: 88,
                };
              }
              this.hostHandlers.onRemoteConnected(parsedDevice, data.totalRemotes || 1);
            } else if (data.type === 'remote_disconnected') {
              this.hostHandlers.onRemoteDisconnected(data.totalRemotes || 0);
            } else if (data.type === 'remote_keystroke') {
              this.hostHandlers.onRemoteKeystroke(data.key, data.isShifted, data.modifiers);
            }
          }

          if (this.role === 'remote' && this.remoteHandlers) {
            if (data.type === 'paired_success') {
              this.remoteHandlers.onPairedSuccess(data.hostOnline, data.hostInfo);
            } else if (data.type === 'host_online') {
              this.remoteHandlers.onHostOnline(data.hostInfo);
            } else if (data.type === 'host_offline') {
              this.remoteHandlers.onHostOffline();
            } else if (data.type === 'text_synced' && this.remoteHandlers.onTextSynced) {
              this.remoteHandlers.onTextSynced(data.textLength, data.preview);
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      this.ws.onclose = () => {
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }

        if (!this.isIntentionalClose) {
          // Attempt auto-reconnect
          this.reconnectTimer = setTimeout(() => {
            this.initSocket();
          }, 2000);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Pairing socket connection warning:', err);
      };
    } catch (e) {
      console.error('Socket init error:', e);
    }
  }

  public sendKeystroke(key: KeyDefinition, isShifted: boolean, modifiers?: KeyModifiers) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'keystroke',
        key,
        isShifted,
        modifiers: modifiers || {},
      }));
    }
  }

  public updateDeviceInfo(deviceInfo: DeviceInfo) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.role === 'remote') {
      this.ws.send(JSON.stringify({
        type: 'update_device_info',
        deviceInfo: JSON.stringify(deviceInfo),
      }));
    }
  }

  public syncText(textLength: number, preview: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.role === 'host') {
      this.ws.send(JSON.stringify({
        type: 'sync_text',
        textLength,
        preview,
      }));
    }
  }

  public cleanup() {
    this.isIntentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
  }
}

export const pairingSocket = new PairingSocket();
