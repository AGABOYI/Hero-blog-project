import { WebSocketServer } from "ws";

let wss; // WebSocket server instance

/**
 * Initializes the WebSocket server and attaches it to the provided HTTP server.
 * This allows both HTTP and WebSocket connections to share the same port.
 * @param {import('http').Server} server HTTP server
 */
export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected via WebSocket");

    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });

  console.log("WebSocket server initialized");
}

/**
 * Broadcasts a new article to all connected WebSocket clients.
 * @param {Object} article Article object to broadcast
 */
export function broadcastNewArticle(article) {
  if (!wss) {
    console.warn("WebSocket server not initialized yet. Cannot broadcast article.");
    return;
  }

  const message = JSON.stringify({
    type: "new_article",
    data: article,
  });

  wss.clients.forEach((client) => {
    // 1 means the WebSocket connection is OPEN
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}
