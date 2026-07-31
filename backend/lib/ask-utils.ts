import type { Response } from "express";
import { PROMPT_TEMPLATE } from "../prompt.ts";

export const ALLOWED_MODELS: Record<string, string> = {
  best: "openai/gpt-4.1-mini",
  sonar: "openai/gpt-4.1-mini",
  claude: "anthropic/claude-sonnet-4",
  "gpt-5": "openai/gpt-4o",
  gemini: "google/gemini-2.0-flash-001",
};

export function resolveModel(model?: string): string {
  return ALLOWED_MODELS[model ?? ""] ?? ALLOWED_MODELS.best!;
}

export function getSearchDepth(searchMode?: string): "basic" | "advanced" {
  return searchMode === "research" ? "advanced" : "basic";
}

export function writeEvent(res: Response, payload: Record<string, unknown>) {
  res.write(`${JSON.stringify(payload)}\n`);
}

export function extractAnswerFromPartialJson(partial: string): string {
  const keyIndex = partial.indexOf('"answer"');
  if (keyIndex === -1) return "";

  const colonIndex = partial.indexOf(":", keyIndex);
  if (colonIndex === -1) return "";

  let i = colonIndex + 1;
  while (i < partial.length && /\s/.test(partial[i]!)) i++;
  if (partial[i] !== '"') return "";

  i++;
  let result = "";
  while (i < partial.length) {
    const ch = partial[i]!;
    if (ch === "\\") {
      if (i + 1 < partial.length) {
        const next = partial[i + 1]!;
        if (next === "n") result += "\n";
        else if (next === "t") result += "\t";
        else if (next === '"') result += '"';
        else if (next === "\\") result += "\\";
        else result += next;
        i += 2;
        continue;
      }
      break;
    }
    if (ch === '"') break;
    result += ch;
    i++;
  }

  return result;
}

export function createFinalPrompt(userQuery: string, webSearchResults: unknown[]): string {
  return PROMPT_TEMPLATE.replace("{{USER_QUERY}}", userQuery).replace(
    "{{WEB_SEARCH_RESULTS}}",
    JSON.stringify(webSearchResults, null, 2),
  );
}
