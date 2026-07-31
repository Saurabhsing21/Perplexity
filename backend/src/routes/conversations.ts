import { Router } from "express";
import { requireAuth } from "../middleware/auth.ts";
import { prisma } from "../db/prisma.ts";
import { routeParam } from "../lib/route-param.ts";

export const conversationsRouter = Router();

import { slugify } from "../db/slug.ts";
conversationsRouter.get("/", requireAuth, async (req, res) => {
  const conversations = await prisma.conversation.findMany({
    where: { userId: req.user!.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true },
      },
    },
  });

  res.json({ conversations });
});

conversationsRouter.post("/", requireAuth, async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title : "New thread";
  const conversation = await prisma.conversation.create({
    data: {
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      userId: req.user!.id,
    },
  });

  res.status(201).json({ conversation });
});

conversationsRouter.get("/:id", requireAuth, async (req, res) => {
  const id = routeParam(req.params.id);
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: req.user!.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    return res.status(404).json({ error: "not_found" });
  }

  res.json({ conversation });
});

conversationsRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = routeParam(req.params.id);
  const existing = await prisma.conversation.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!existing) {
    return res.status(404).json({ error: "not_found" });
  }

  await prisma.conversation.delete({ where: { id: existing.id } });
  res.status(204).end();
});

export async function getOrCreateConversation(
  userId: string,
  conversationId: string | undefined,
  query: string,
) {
  if (conversationId) {
    const existing = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (existing) return existing;
  }

  const title = query.slice(0, 80);
  return prisma.conversation.create({
    data: {
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      userId,
    },
  });
}
