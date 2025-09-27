import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Agent API proxy
  app.get(
    "/api/agent/system-prompts",
    require("./routes/agent").getSystemPrompts,
  );
  app.post("/api/agent/chat", require("./routes/agent").postChat);
  app.post("/api/agent/chat-stream", require("./routes/agent").postChatStream);
  app.post("/api/agent/analyze", require("./routes/agent").postAnalyze);

  return app;
}
