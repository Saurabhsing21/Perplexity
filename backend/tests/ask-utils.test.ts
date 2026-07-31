import { describe, expect, it } from "bun:test";
import {
  createFinalPrompt,
  extractAnswerFromPartialJson,
  getSearchDepth,
  resolveModel,
} from "../lib/ask-utils.ts";

describe("ask-utils", () => {
  it("resolveModel returns mapped model or default", () => {
    expect(resolveModel("claude")).toBe("anthropic/claude-sonnet-4");
    expect(resolveModel("unknown")).toBe("openai/gpt-4.1-mini");
  });

  it("getSearchDepth uses advanced for research mode", () => {
    expect(getSearchDepth("research")).toBe("advanced");
    expect(getSearchDepth("search")).toBe("basic");
  });

  it("extractAnswerFromPartialJson parses streaming JSON answer", () => {
    const partial = '{"followUpQuestions":[],"answer":"Hello world';
    expect(extractAnswerFromPartialJson(partial)).toBe("Hello world");

    const escaped = '{"answer":"Line one\\nLine two"}';
    expect(extractAnswerFromPartialJson(escaped)).toBe("Line one\nLine two");
  });

  it("createFinalPrompt injects query and search results", () => {
    const prompt = createFinalPrompt("What is Paris?", [{ title: "Paris", url: "https://example.com" }]);
    expect(prompt).toContain("What is Paris?");
    expect(prompt).toContain("Paris");
    expect(prompt).toContain("https://example.com");
  });
});
