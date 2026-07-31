import type { Model } from "@earendil-works/pi-ai";
import { ALLOWED_MODELS } from "../ask/ask-utils.ts";
import { models } from "./stream-fn.ts";

/** Frontend picker id → OpenRouter model id */
export const AGENT_MODEL_MAP: Record<string, string> = {
  ...ALLOWED_MODELS,
  best: "openai/gpt-4.1-mini",
  sonar: "openai/gpt-4.1-mini",
  claude: "anthropic/claude-sonnet-4",
  "gpt-5": "openai/gpt-4o",
  gemini: "google/gemini-2.5-flash",
};

const DEFAULT_MODEL_ID = AGENT_MODEL_MAP.best!;

/**
 * Resolve a frontend model picker value to a pi-ai OpenRouter Model.
 */
export function getAgentModel(modelId?: string): Model<any> {
  const openRouterId = AGENT_MODEL_MAP[modelId ?? ""] ?? DEFAULT_MODEL_ID;
  const model = models.getModel("openrouter", openRouterId);
  if (model) return model;

  const fallback = models.getModel("openrouter", DEFAULT_MODEL_ID);
  if (fallback) return fallback;

  const available = models.getModels("openrouter");
  if (available.length === 0) {
    throw new Error("No OpenRouter models available");
  }
  return available[0]!;
}
