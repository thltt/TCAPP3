// src/server.js
import { Hono } from "hono";
import { cors } from "hono/cors";
import webRouter from "./routes/web.js"; // nhớ có .js

const app = new Hono();

// Middleware CORS cho tất cả route
app.use("*", cors());

// Mount router
app.route("/", webRouter);

// Middleware xử lý lỗi tập trung
app.onError((err, c) => {
  console.error("❌ Lỗi:", err);
  return c.json({ error: err.message }, 500);
});

// Chỉ export app, Cloudflare Workers sẽ tự dùng
export default app;
