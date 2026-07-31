import { describe, expect, it } from "bun:test";

// Mirror frontend api helpers for unit testing without DOM
export class CreditsExhaustedError extends Error {
  creditsUsed: number;
  creditLimit: number;
  plan: string;

  constructor(payload: { creditsUsed: number; creditLimit: number; plan: string }) {
    super("credits_exhausted");
    this.name = "CreditsExhaustedError";
    this.creditsUsed = payload.creditsUsed;
    this.creditLimit = payload.creditLimit;
    this.plan = payload.plan;
  }
}

export function formatSourcesMarkdown(
  sources: { title: string; url: string }[],
): string {
  if (sources.length === 0) return "";
  const items = sources.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join("\n");
  return `\n\n### Sources\n${items}`;
}

export async function* parseNdjsonStream(text: string) {
  const lines = text.trim().split("\n");
  for (const line of lines) {
    if (line.trim()) yield JSON.parse(line);
  }
}

describe("frontend api helpers", () => {
  it("formatSourcesMarkdown builds markdown links", () => {
    const md = formatSourcesMarkdown([{ title: "Example", url: "https://example.com" }]);
    expect(md).toContain("### Sources");
    expect(md).toContain("[Example](https://example.com)");
  });

  it("CreditsExhaustedError stores payload", () => {
    const err = new CreditsExhaustedError({ creditsUsed: 10, creditLimit: 10, plan: "Free" });
    expect(err.creditsUsed).toBe(10);
    expect(err.message).toBe("credits_exhausted");
  });

  it("parseNdjsonStream parses stream events", async () => {
    const text = '{"type":"delta","text":"Hi"}\n{"type":"done","conversationId":"1"}';
    const events = [];
    for await (const event of parseNdjsonStream(text)) {
      events.push(event);
    }
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe("delta");
    expect(events[1].type).toBe("done");
  });
});
