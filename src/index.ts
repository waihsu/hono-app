import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import api from "./routes/api";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const { websocket, upgradeWebSocket } = createBunWebSocket();

interface OnlineUser {
  userId: string;
}

let userSocketMap: string[] = [];

const app = new Hono().use(logger());
const admin = "admin";
app.get(
  "/app",
  upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      const userId = ws.url?.searchParams.get("userId");
      if (userId !== "undefined" && !userSocketMap.includes(userId as string)) {
        userSocketMap.push(userId as string);
      }
      console.log(userSocketMap);
      rawWs.subscribe("public");

      // rawWs.publish(admin, "hello");
    },
    onMessage(evt, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      console.log("inmessage", userSocketMap);
      rawWs.subscribe(admin);
      const data = { type: "onlineusers", payload: userSocketMap };
      rawWs.publish(admin, JSON.stringify(data));
      // rawWs.publish(admin, JSON.stringify(userSocketMap));
    },
    onClose(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      const userId = ws.url?.searchParams.get("userId");
      if (userId !== "undefined" && userSocketMap.includes(userId as string)) {
        userSocketMap = userSocketMap.filter((item) => item !== userId);
      }
      // rawWs.publish(admin, JSON.stringify(userSocketMap));
      rawWs.unsubscribe(admin);
    },
  }))
);
app.get(
  "/api/matches",
  upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.subscribe("public");
    },
    onMessage(evt, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      const type = ws.url?.searchParams.get("type");
      console.log(evt.data);

      if (type) {
        rawWs.publish("public", JSON.stringify({ type, payload: evt.data }));
      }
    },
    onClose(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.unsubscribe("public");
      console.log(`WebSocket server closed and unsubscribed from matches `);
    },
  }))
);
app.get(
  "/admin",
  upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.subscribe(admin);
    },
    onMessage(evt, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      console.log(evt.data);
      const NewMessage = evt.data;
      const data = { type: "newmessage", payload: NewMessage };
      rawWs.publish(admin, JSON.stringify(data));
    },
    onClose(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.unsubscribe(admin);
      console.log(
        `WebSocket server closed and unsubscribed from topic '${"topic"}'`
      );
    },
  }))
);

app.get("/test", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", api).use(cors());

app.use("*", serveStatic({ root: "./frontend/dist" }));

app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

const server = Bun.serve({
  port: process.env.NODE_ENV,
  fetch: app.fetch,
  websocket,
});

console.log(`Listening on ${server.hostname}:${server.port}`);
