import { describe, expect, it } from "bun:test";
import { extractFollowUps } from "../lib/prompt-loader.ts";
import { historyFromDbMessages, MAX_HISTORY_MESSAGES } from "../lib/agent-runner.ts";
import { getAgentModel } from "../lib/models.ts";

describe("agent-runner helpers", () => {
  it("historyFromDbMessages maps User/Assistant roles", () => {
    const history = historyFromDbMessages([
      { role: "User", content: "Hello" },
      { role: "Assistant", content: "Hi there" },
    ]);
    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({ role: "user", content: "Hello" });
    expect(history[1]).toMatchObject({ role: "assistant" });
    if (history[1] && "role" in history[1] && history[1].role === "assistant") {
      const text = history[1].content.find((c) => c.type === "text");
      expect(text && "text" in text ? text.text : "").toBe("Hi there");
    }
  });

  it("historyFromDbMessages strips SOURCES markers", () => {
    const history = historyFromDbMessages([
      {
        role: "Assistant",
        content:
          'Answer text.\n\n<!--SOURCES:[{"index":1,"title":"A","url":"https://a.com","domain":"a.com"}]-->',
      },
    ]);
    expect(history).toHaveLength(1);
    if (history[0] && "role" in history[0] && history[0].role === "assistant") {
      const text = history[0].content.find((c) => c.type === "text");
      expect(text && "text" in text ? text.text : "").toBe("Answer text.");
      expect(text && "text" in text ? text.text : "").not.toContain("SOURCES");
    }
  });

  it("historyFromDbMessages caps to last MAX_HISTORY_MESSAGES", () => {
    const many = Array.from({ length: MAX_HISTORY_MESSAGES + 6 }, (_, i) => ({
      role: (i % 2 === 0 ? "User" : "Assistant") as "User" | "Assistant",
      content: `msg-${i}`,
    }));
    const history = historyFromDbMessages(many);
    expect(history).toHaveLength(MAX_HISTORY_MESSAGES);
    const first = history[0];
    expect(first && "role" in first && first.role === "user" ? first.content : "").toBe(
      `msg-6`,
    );
  });

  it("getAgentModel resolves picker ids", () => {
    const best = getAgentModel("best");
    expect(best.provider).toBe("openrouter");
    expect(best.id).toContain("gpt");

    const claude = getAgentModel("claude");
    expect(claude.id).toContain("claude");
  });

  it("follow-up extraction integrates with answer cleanup", () => {
    const { answer, followUps } = extractFollowUps(
      "Answer body.\n\n<FOLLOWUP_QUESTIONS>\n- Next?\n</FOLLOWUP_QUESTIONS>",
    );
    expect(answer).toBe("Answer body.");
    expect(followUps).toEqual(["Next?"]);
  });
});
