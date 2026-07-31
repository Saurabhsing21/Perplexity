import { describe, expect, it } from "vitest";
import { CreditsExhaustedError, formatSourcesMarkdown, type AskStreamEvent } from "./api";
import {
  encodeSourcesMarker,
  extractSourcesFromContent,
  preprocessCitationLinks,
} from "./sources";

describe("api", () => {
  it("formatSourcesMarkdown / encodeSourcesMarker returns empty for no sources", () => {
    expect(formatSourcesMarkdown([])).toBe("");
    expect(encodeSourcesMarker([])).toBe("");
  });

  it("encodeSourcesMarker embeds JSON sources", () => {
    const result = encodeSourcesMarker([
      { index: 1, title: "Wiki", url: "https://wikipedia.org", domain: "wikipedia.org" },
      { index: 2, title: "Docs", url: "https://docs.example.com", domain: "docs.example.com" },
    ]);
    expect(result).toContain("<!--SOURCES:");
    expect(result).toContain("wikipedia.org");
  });

  it("extractSourcesFromContent parses JSON marker", () => {
    const content =
      "Answer text." +
      encodeSourcesMarker([
        { index: 1, title: "Wiki", url: "https://wikipedia.org", domain: "wikipedia.org" },
      ]);
    const { text, sources } = extractSourcesFromContent(content);
    expect(text).toBe("Answer text.");
    expect(sources).toHaveLength(1);
    expect(sources[0]?.domain).toBe("wikipedia.org");
  });

  it("extractSourcesFromContent parses legacy markdown sources", () => {
    const content = "Answer.\n\n### Sources\n1. [Wiki](https://wikipedia.org)";
    const { text, sources } = extractSourcesFromContent(content);
    expect(text).toBe("Answer.");
    expect(sources[0]?.title).toBe("Wiki");
  });

  it("preprocessCitationLinks converts indices to citation links", () => {
    expect(preprocessCitationLinks("Ice melts[1][2].")).toBe(
      "Ice melts[1](citation:1)[2](citation:2).",
    );
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

  it("supports new agent stream event shapes", () => {
    const events: AskStreamEvent[] = [
      { type: "thinking", text: "planning" },
      { type: "tool_start", name: "web_search", args: { query: "ai" } },
      { type: "status", message: "Searching the web..." },
      { type: "tool_end", name: "web_search" },
      {
        type: "sources",
        items: [{ index: 1, title: "A", url: "https://a.com", domain: "a.com" }],
      },
      { type: "delta", text: "Answer" },
    ];
    expect(events.map((e) => e.type)).toEqual([
      "thinking",
      "tool_start",
      "status",
      "tool_end",
      "sources",
      "delta",
    ]);
  });
});
