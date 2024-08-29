import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import api from "./routes/api";

const app = new Hono().use(logger());

app.get("/test", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", api).use(cors());

app.use("*", serveStatic({ root: "./frontend/dist" }));

app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
