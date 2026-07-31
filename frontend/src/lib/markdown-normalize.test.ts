import { describe, expect, it } from "vitest";
import { normalizeAnswerMarkdown } from "./markdown-normalize";

describe("normalizeAnswerMarkdown", () => {
  it("adds blank lines before ## headings", () => {
    const input = "Intro paragraph.\n## How It Works\nBody text.";
    const out = normalizeAnswerMarkdown(input);
    expect(out).toContain("Intro paragraph.\n\n## How It Works\n\nBody text.");
  });

  it("converts standalone **Title** lines to ## Title", () => {
    const input = "Intro.\n\n**How Attention Works**\n\nBody.";
    const out = normalizeAnswerMarkdown(input);
    expect(out).toContain("## How Attention Works");
    expect(out).not.toContain("**How Attention Works**");
  });

  it("collapses excessive newlines", () => {
    const out = normalizeAnswerMarkdown("A\n\n\n\nB");
    expect(out).toBe("A\n\nB");
  });

  it("leaves inline bold alone", () => {
    const out = normalizeAnswerMarkdown("This has **inline** bold.");
    expect(out).toContain("**inline**");
  });
});
