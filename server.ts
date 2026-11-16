import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExtensionZip } from './src/utils/extensionGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SessionRoom {
  roomId: string;
  hosts: Set<WebSocket>;
  hostInfo: string | null;
  remotes: Set<WebSocket>;
  createdAt: number;
}

const rooms = new Map<string, SessionRoom>();

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', roomsCount: rooms.size });
  });

  // Direct download route for Chrome/Edge Extension
  app.get('/api/download-extension', async (req, res) => {
    try {
      const roomId = String(req.query.roomId || 'KV-ROOM');
      const protocol = req.protocol === 'https' ? 'https' : 'http';
      const host = req.get('host') || 'localhost:3000';
      const origin = `${protocol}://${host}`;

      const zip = await buildExtensionZip(roomId, origin);
      const buffer = await zip.generateAsync({ type: 'nodebuffer' });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=KeyVibe-Extension-${roomId}.zip`);
      res.send(buffer);
    } catch (err) {
      console.error('Error serving extension zip:', err);
      res.status(500).json({ error: 'Failed to generate extension zip' });
    }
  });

  // Attach WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    let currentRoomId: string | null = null;
    let clientRole: 'host' | 'remote' | null = null;

    ws.on('message', (data: string | Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'register_host': {
            const { roomId, hostInfo } = message;
            currentRoomId = roomId;
            clientRole = 'host';

            let room = rooms.get(roomId);
            if (!room) {
              room = {
                roomId,
                hosts: new Set([ws]),
                hostInfo: hostInfo || 'Komputer / Laptop',
                remotes: new Set(),
                createdAt: Date.now(),
              };
              rooms.set(roomId, room);
            } else {
              room.hosts.add(ws);
              if (hostInfo) room.hostInfo = hostInfo;
            }

            ws.send(JSON.stringify({
              type: 'registered_host',
              roomId,
              remotesConnected: room.remotes.size,
              totalHosts: room.hosts.size,
            }));

            // If remotes were already waiting, inform them of host status and host computer name
            for (const remote of room.remotes) {
              if (remote.readyState === WebSocket.OPEN) {
                remote.send(JSON.stringify({
                  type: 'host_online',
                  roomId,
                  hostInfo: room.hostInfo || 'Komputer / Laptop',
                }));
              }
            }
            break;
          }

          case 'register_remote': {
            const { roomId, deviceInfo } = message;
            currentRoomId = roomId;
            clientRole = 'remote';

            let room = rooms.get(roomId);
            if (!room) {
              // Create room placeholder waiting for host
              room = {
                roomId,
                hosts: new Set(),
                hostInfo: null,
                remotes: new Set([ws]),
                createdAt: Date.now(),
              };
              rooms.set(roomId, room);
            } else {
              room.remotes.add(ws);
            }

            const isHostOnline = room.hosts.size > 0;

            ws.send(JSON.stringify({
              type: 'paired_success',
              roomId,
              hostOnline: Boolean(isHostOnline),
              hostInfo: room.hostInfo || 'Komputer / Laptop',
            }));

            // Notify all connected hosts (laptop tabs) immediately that a smartphone has paired!
            for (const host of room.hosts) {
              if (host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify({
                  type: 'remote_connected',
                  roomId,
                  deviceInfo: deviceInfo || 'Smartphone',
                  totalRemotes: room.remotes.size,
                }));
              }
            }
            break;
          }

          case 'keystroke': {
            // Forward keystroke from remote (Smartphone) to all host tabs (Laptop + Any other tab)
            if (currentRoomId) {
              const room = rooms.get(currentRoomId);
              if (room) {
                for (const host of room.hosts) {
                  if (host.readyState === WebSocket.OPEN) {
                    host.send(JSON.stringify({
                      type: 'remote_keystroke',
                      key: message.key,
                      isShifted: message.isShifted,
                      modifiers: message.modifiers || {},
                      timestamp: Date.now(),
                    }));
                  }
                }
              }
            }
            break;
          }

          case 'update_device_info': {
            // Forward updated device name or details from smartphone to laptop tabs
            if (currentRoomId) {
              const room = rooms.get(currentRoomId);
              if (room) {
                for (const host of room.hosts) {
                  if (host.readyState === WebSocket.OPEN) {
                    host.send(JSON.stringify({
                      type: 'remote_connected',
                      roomId: currentRoomId,
                      deviceInfo: message.deviceInfo,
                      totalRemotes: room.remotes.size,
                    }));
                  }
                }
              }
            }
            break;
          }

          case 'sync_text': {
            // Can sync text state if requested
            if (currentRoomId) {
              const room = rooms.get(currentRoomId);
              if (room) {
                if (clientRole === 'host') {
                  for (const remote of room.remotes) {
                    if (remote.readyState === WebSocket.OPEN) {
                      remote.send(JSON.stringify({
                        type: 'text_synced',
                        textLength: message.textLength,
                        preview: message.preview,
                      }));
                    }
                  }
                }
              }
            }
            break;
          }

          case 'ping': {
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      if (currentRoomId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          if (clientRole === 'host') {
            room.hosts.delete(ws);
            // Notify remotes if all host tabs are closed
            if (room.hosts.size === 0) {
              for (const remote of room.remotes) {
                if (remote.readyState === WebSocket.OPEN) {
                  remote.send(JSON.stringify({ type: 'host_offline' }));
                }
              }
            }
          } else if (clientRole === 'remote') {
            room.remotes.delete(ws);
            // Notify all host tabs that a remote left
            for (const host of room.hosts) {
              if (host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify({
                  type: 'remote_disconnected',
                  totalRemotes: room.remotes.size,
                }));
              }
            }
          }

          // Clean up empty old rooms
          if (room.hosts.size === 0 && room.remotes.size === 0) {
            rooms.delete(currentRoomId);
          }
        }
      }
    });
  });

  // Vite middleware in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`KeyVibe server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
