import { describe, expect, it } from "vitest";
import { CreditsExhaustedError, formatSourcesMarkdown } from "./api";

describe("api", () => {
  it("formatSourcesMarkdown returns empty for no sources", () => {
    expect(formatSourcesMarkdown([])).toBe("");
  });

  it("formatSourcesMarkdown formats numbered links", () => {
    const result = formatSourcesMarkdown([
      { title: "Wiki", url: "https://wikipedia.org" },
      { title: "Docs", url: "https://docs.example.com" },
    ]);
    expect(result).toContain("1. [Wiki](https://wikipedia.org)");
    expect(result).toContain("2. [Docs](https://docs.example.com)");
  });

  it("CreditsExhaustedError carries credit info", () => {
    const err = new CreditsExhaustedError({
      creditsUsed: 10,
      creditLimit: 10,
      plan: "Free",
    });
    expect(err.name).toBe("CreditsExhaustedError");
    expect(err.creditLimit).toBe(10);
  });
});
