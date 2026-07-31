import { Router } from "express";
import { requireAuth } from "../middleware/auth.ts";
import { prisma } from "../db/prisma.ts";

export const userRouter = Router();

userRouter.get("/", requireAuth, (req, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    creditsUsed: user.creditsUsed,
    creditLimit: user.creditLimit,
    creditsRemaining: Math.max(0, user.creditLimit - user.creditsUsed),
  });
});
