import express from "express";
import cors from "cors";
import { askRouter } from "./routes/ask.ts";
import { conversationsRouter } from "./routes/conversations.ts";
import { userRouter } from "./routes/user.ts";

function getAllowedOrigins(): string[] {
  const configured = process.env.FRONTEND_URL ?? "http://localhost:5173";
  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string): boolean {
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;

  try {
    const hostname = new URL(origin).hostname;
    if (hostname.endsWith(".vercel.app")) return true;
  } catch {
    return false;
  }

  return false;
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/ask", askRouter);
  app.use("/conversations", conversationsRouter);
  app.use("/me", userRouter);

  return app;
}
