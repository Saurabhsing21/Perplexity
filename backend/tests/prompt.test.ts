import { describe, expect, it } from "bun:test";
import { SYSTEM_PROMPT, PROMPT_TEMPLATE } from "../prompt.ts";
import { createFinalPrompt } from "../lib/ask-utils.ts";

describe("prompt", () => {
  it("SYSTEM_PROMPT mentions JSON answer format", () => {
    expect(SYSTEM_PROMPT).toContain("answer");
    expect(SYSTEM_PROMPT).toContain("followUpQuestions");
  });

  it("PROMPT_TEMPLATE has placeholders replaced by createFinalPrompt", () => {
    expect(PROMPT_TEMPLATE).toContain("{{USER_QUERY}}");
    expect(PROMPT_TEMPLATE).toContain("{{WEB_SEARCH_RESULTS}}");
    const result = createFinalPrompt("test query", []);
    expect(result).not.toContain("{{USER_QUERY}}");
    expect(result).not.toContain("{{WEB_SEARCH_RESULTS}}");
  });
});
