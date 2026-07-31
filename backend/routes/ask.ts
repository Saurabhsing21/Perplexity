import { Router } from "express";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { requireAuth } from "../middleware/auth.ts";
import { requireCredits } from "../middleware/credits.ts";
import { client } from "../lib/openai.ts";
import { prisma } from "../lib/prisma.ts";
import { webSearch } from "../lib/search.ts";
import { SYSTEM_PROMPT } from "../prompt.ts";
import {
  createFinalPrompt,
  extractAnswerFromPartialJson,
  getSearchDepth,
  resolveModel,
  writeEvent,
} from "../lib/ask-utils.ts";
import { getOrCreateConversation } from "./conversations.ts";

export const askRouter = Router();

const QuestionResponseSchema = z.object({
  followUpQuestions: z.array(z.string()),
  answer: z.string(),
});

askRouter.post("/", requireAuth, requireCredits, async (req, res) => {
  try {
    const { query, model, conversationId, searchMode } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid query" });
    }

    const user = req.user!;
    const resolvedModel = resolveModel(model);
    const searchDepth = getSearchDepth(searchMode);

    const searchResults = await webSearch(query, searchDepth);
    const conversation = await getOrCreateConversation(user.id, conversationId, query);

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

    const stream = await client.responses.create({
      model: resolvedModel,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: createFinalPrompt(query, searchResults) },
      ],
      text: {
        format: zodTextFormat(QuestionResponseSchema, "question_response"),
      },
      temperature: 0.2,
      stream: true,
    });

    let accumulated = "";
    let sentAnswerLength = 0;

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        accumulated += event.delta;
        const currentAnswer = extractAnswerFromPartialJson(accumulated);
        if (currentAnswer.length > sentAnswerLength) {
          const delta = currentAnswer.slice(sentAnswerLength);
          sentAnswerLength = currentAnswer.length;
          writeEvent(res, { type: "delta", text: delta });
        }
      }
    }

    let parsed: z.infer<typeof QuestionResponseSchema>;
    try {
      parsed = QuestionResponseSchema.parse(JSON.parse(accumulated));
    } catch {
      parsed = {
        answer: accumulated,
        followUpQuestions: [],
      };
    }

    if (parsed.answer.length > sentAnswerLength) {
      writeEvent(res, { type: "delta", text: parsed.answer.slice(sentAnswerLength) });
    }

    writeEvent(res, {
      type: "sources",
      items: searchResults.map((r) => ({ title: r.title, url: r.url })),
    });

    if (parsed.followUpQuestions.length > 0) {
      writeEvent(res, { type: "followups", items: parsed.followUpQuestions });
    }

    await prisma.$transaction([
      prisma.message.create({
        data: {
          content: parsed.answer,
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
  }
});
