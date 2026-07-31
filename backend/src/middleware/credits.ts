import type { NextFunction, Request, Response } from "express";

export function requireCredits(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (user.creditsUsed >= user.creditLimit) {
    return res.status(402).json({
      error: "credits_exhausted",
      creditsUsed: user.creditsUsed,
      creditLimit: user.creditLimit,
      plan: user.plan,
    });
  }

  next();
}
