import { describe, expect, it } from "bun:test";
import { extractFollowUps, getSystemPrompt } from "../lib/prompt-loader.ts";
import { PROMPT_TEMPLATE } from "../prompt.ts";
import { createFinalPrompt } from "../lib/ask-utils.ts";

describe("prompt-loader", () => {
  it("builds static system prompt with date and tool instructions", () => {
    const prompt = getSystemPrompt();
    expect(prompt).not.toContain("{{CURRENT_DATE}}");
    expect(prompt).toContain("# Goal");
    expect(prompt).toContain("## Format Rules");
    expect(prompt).toContain("## Agent Instructions");
    expect(prompt).toContain("web_search");
    expect(prompt).toContain("FOLLOWUP_QUESTIONS");
    expect(prompt).not.toContain("## User Query");
    expect(prompt).not.toContain("## Search Results");
  });

  it("does not inject query into system prompt", () => {
    const prompt = getSystemPrompt();
    expect(prompt).not.toContain("What is AI?");
  });

  it("extractFollowUps strips block and returns questions", () => {
    const text = `Paris is the capital of France.

<FOLLOWUP_QUESTIONS>
- What is the population of Paris?
- Famous landmarks in Paris?
</FOLLOWUP_QUESTIONS>`;

    const { answer, followUps } = extractFollowUps(text);
    expect(answer).toContain("Paris is the capital");
    expect(answer).not.toContain("FOLLOWUP_QUESTIONS");
    expect(followUps).toEqual([
      "What is the population of Paris?",
      "Famous landmarks in Paris?",
    ]);
  });

  it("extractFollowUps handles missing block", () => {
    const { answer, followUps } = extractFollowUps("Just an answer.");
    expect(answer).toBe("Just an answer.");
    expect(followUps).toEqual([]);
  });
});

describe("prompt template compat", () => {
  it("PROMPT_TEMPLATE placeholders are replaced by createFinalPrompt", () => {
    expect(PROMPT_TEMPLATE).toContain("{{USER_QUERY}}");
    const result = createFinalPrompt("test query", []);
    expect(result).not.toContain("{{USER_QUERY}}");
  });
});
