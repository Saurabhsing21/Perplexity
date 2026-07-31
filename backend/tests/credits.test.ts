import { describe, expect, it } from "bun:test";
import type { Request, Response } from "express";
import { requireCredits } from "../middleware/credits.ts";

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

describe("requireCredits", () => {
  it("returns 401 when user is missing", () => {
    const req = {} as Request;
    const res = createMockRes();
    let nextCalled = false;

    requireCredits(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it("returns 402 when credits exhausted", () => {
    const req = {
      user: { creditsUsed: 10, creditLimit: 10, plan: "Free" },
    } as Request;
    const res = createMockRes();
    let nextCalled = false;

    requireCredits(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(402);
    expect(res.body).toEqual({
      error: "credits_exhausted",
      creditsUsed: 10,
      creditLimit: 10,
      plan: "Free",
    });
    expect(nextCalled).toBe(false);
  });

  it("calls next when credits remain", () => {
    const req = {
      user: { creditsUsed: 3, creditLimit: 10, plan: "Free" },
    } as Request;
    const res = createMockRes();
    let nextCalled = false;

    requireCredits(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });
});
