import { Type } from "@earendil-works/pi-ai";
import { webSearch, type SearchResult } from "../search/search.ts";
import type { AgentTool, AgentToolResult } from "../agent/types.ts";

export type WebSearchDetails = {
  results: SearchResult[];
};

export type RegisteredSource = {
  index: number;
  title: string;
  url: string;
  domain: string;
};

const parameters = Type.Object({
  query: Type.String({ description: "The search query to look up on the web" }),
  searchDepth: Type.Optional(
    Type.Union([Type.Literal("basic"), Type.Literal("advanced")], {
      description: "basic for quick answers, advanced for deeper research",
    }),
  ),
});

export function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function createWebSearchTool(
  defaultDepth: "basic" | "advanced" = "basic",
  registerResult?: (result: SearchResult) => RegisteredSource,
): AgentTool<typeof parameters, WebSearchDetails> {
  return {
    name: "web_search",
    label: "Web Search",
    description:
      "Search the web for current information. Returns numbered results with title, url, and content snippets for citation.",
    parameters,
    async execute(_toolCallId, params): Promise<AgentToolResult<WebSearchDetails>> {
      const depth = params.searchDepth ?? defaultDepth;
      const results = await webSearch(params.query, depth);

      const numbered = results
        .map((r) => {
          const registered = registerResult?.(r);
          const index = registered?.index ?? 0;
          const title = registered?.title ?? r.title;
          const url = registered?.url ?? r.url;
          return `[${index}] ${title}\nURL: ${url}\n${r.content}`;
        })
        .join("\n\n");

      const text =
        results.length === 0
          ? "No search results found."
          : `Search results for "${params.query}":\n\n${numbered}`;

      return {
        content: [{ type: "text", text }],
        details: { results },
      };
    },
  };
}
