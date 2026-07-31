import express from "express";
import cors from "cors";
import { askRouter } from "./routes/ask.ts";
import { conversationsRouter } from "./routes/conversations.ts";
import { userRouter } from "./routes/user.ts";

export function createApp() {
  const app = express();
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

  app.use(
    cors({
      origin: frontendUrl,
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
