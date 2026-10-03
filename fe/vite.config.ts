// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import os from "os";
import { WebSocketServer, WebSocket } from "ws";

function buzzerWebSocketPlugin() {
  return {
    name: "buzzer-ws-server",
    configureServer(server) {
      if (!server.httpServer) return;

      // Provide local LAN IP discovery for QR codes so phones on Wi-Fi connect seamlessly
      server.middlewares.use("/api/lan-info", (req, res) => {
        try {
          const interfaces = os.networkInterfaces();
          const ips = [];
          for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name] || []) {
              if (iface.family === "IPv4" && !iface.internal) {
                ips.push(iface.address);
              }
            }
          }
          const port = server.config.server.port || 5173;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(
            JSON.stringify({
              ip: ips[0] || "127.0.0.1",
              ips: ips,
              port,
              urls: ips.map((ip) => `http://${ip}:${port}`),
            })
          );
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });

      const wss = new WebSocketServer({ noServer: true });

      server.httpServer.on("upgrade", (request, socket, head) => {
        try {
          const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
          if (url.pathname === "/buzzer-ws" || url.pathname === "/livequiz-ws") {
            wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit("connection", ws, request);
            });
          }
        } catch {
          // ignore
        }
      });

      const rooms = new Map();

      wss.on("connection", (ws) => {
        let currentRoom = "";

        ws.on("message", (raw) => {
          try {
            const dataStr = raw.toString();
            const msg = JSON.parse(dataStr);
            const roomId = (msg.roomId || "").toUpperCase().trim();

            if (roomId && !rooms.has(roomId)) {
              rooms.set(roomId, new Set());
            }

            if (roomId && currentRoom !== roomId) {
              if (currentRoom && rooms.has(currentRoom)) {
                rooms.get(currentRoom).delete(ws);
              }
              currentRoom = roomId;
              rooms.get(roomId).add(ws);
            }

            if (currentRoom && rooms.has(currentRoom)) {
              const clients = rooms.get(currentRoom);
              for (const client of clients) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(dataStr);
                }
              }
            }
          } catch (err) {
            console.error("[BuzzerWS] Error processing message:", err);
          }
        });

        ws.on("close", () => {
          if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom).delete(ws);
            if (rooms.get(currentRoom).size === 0) {
              rooms.delete(currentRoom);
            }
          }
        });

        ws.on("error", (err) => {
          console.warn("[BuzzerWS] Socket error:", err);
        });
      });

      console.log("[BuzzerWS] Ultra-low-latency LAN WebSocket endpoint mounted at /buzzer-ws and /livequiz-ws");
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), buzzerWebSocketPlugin()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0) so phone can connect!
    port: 5173,
    cors: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
