import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function webSearch(
  query: string,
  searchDepth: "basic" | "advanced" = "advanced",
): Promise<SearchResult[]> {
  const result = await client.search(query, { searchDepth });
  return (result.results ?? []).map((r) => ({
    title: r.title ?? r.url,
    url: r.url,
    content: r.content ?? "",
  }));
}
