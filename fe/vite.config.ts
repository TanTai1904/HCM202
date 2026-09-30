// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

function buzzerWebSocketPlugin() {
  return {
    name: "buzzer-ws-server",
    configureServer(server) {
      if (!server.httpServer) return;
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
