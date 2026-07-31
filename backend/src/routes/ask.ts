import { Router } from "express";
import { requireAuth } from "../middleware/auth.ts";
import { requireCredits } from "../middleware/credits.ts";
import { prisma } from "../db/prisma.ts";
import { writeEvent } from "../ask/ask-utils.ts";
import {
  historyFromDbMessages,
  runAgentQuery,
  type NdjsonEvent,
} from "../agent/agent-runner.ts";
import { getOrCreateConversation } from "./conversations.ts";

export const askRouter = Router();

askRouter.post("/", requireAuth, requireCredits, async (req, res) => {
  const abortController = new AbortController();
  const onClose = () => abortController.abort();
  req.on("close", onClose);

  try {
    const { query, model, conversationId, searchMode } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid query" });
    }

    const user = req.user!;
    const conversation = await getOrCreateConversation(user.id, conversationId, query);

    const priorMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    await prisma.message.create({
      data: {
        content: query,
        role: "User",
        conversationId: conversation.id,
      },
    });

    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const result = await runAgentQuery({
      query,
      model,
      searchMode,
      history: historyFromDbMessages(priorMessages),
      signal: abortController.signal,
      onEvent: (event: NdjsonEvent) => {
        if (!res.writableEnded) {
          writeEvent(res, event);
        }
      },
    });

    const sourcesMarker =
      result.sources.length > 0
        ? `\n\n<!--SOURCES:${JSON.stringify(result.sources)}-->`
        : "";

    await prisma.$transaction([
      prisma.message.create({
        data: {
          content: `${result.answer}${sourcesMarker}`,
          role: "Assistant",
          conversationId: conversation.id,
        },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          title: conversation.title || query.slice(0, 80),
          updatedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { creditsUsed: { increment: 1 } },
      }),
      prisma.creditUsage.create({
        data: { userId: user.id, action: "ask" },
      }),
    ]);

    writeEvent(res, {
      type: "done",
      conversationId: conversation.id,
      creditsUsed: user.creditsUsed + 1,
      creditLimit: user.creditLimit,
    });

    res.end();
  } catch (error) {
    console.error("[/ask] Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
    writeEvent(res, {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    res.end();
  } finally {
    req.off("close", onClose);
  }
});
