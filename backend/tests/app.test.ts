import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { Server } from "node:http";
import { createApp } from "../app.ts";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 3000;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe("API integration", () => {
  it("GET /health returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("GET /me without token returns 401", async () => {
    const res = await fetch(`${baseUrl}/me`);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("GET /conversations without token returns 401", async () => {
    const res = await fetch(`${baseUrl}/conversations`);
    expect(res.status).toBe(401);
  });

  it("POST /ask without token returns 401", async () => {
    const res = await fetch(`${baseUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "test" }),
    });
    expect(res.status).toBe(401);
  });

  it("POST /ask with invalid token returns 401", async () => {
    const res = await fetch(`${baseUrl}/ask`, {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "test" }),
    });
    expect(res.status).toBe(401);
  });
});
