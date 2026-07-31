import type { AssistantMessage, Message } from "@earendil-works/pi-ai";
import { agentLoop } from "./agent-loop.ts";
import { getSearchDepth } from "../ask/ask-utils.ts";
import { getAgentModel } from "./models.ts";
import { extractFollowUps, getSystemPrompt } from "./prompt-loader.ts";
import { getDefaultStreamFn } from "./stream-fn.ts";
import {
  createWebSearchTool,
  domainFromUrl,
  type RegisteredSource,
} from "../tools/web-search.ts";
import type {
  AgentContext,
  AgentLoopConfig,
  AgentMessage,
} from "./types.ts";
import type { SearchResult } from "../search/search.ts";

export type SourceItem = {
  index: number;
  title: string;
  url: string;
  domain: string;
};

export type NdjsonEvent =
  | { type: "delta"; text: string }
  | { type: "thinking"; text: string }
  | { type: "tool_start"; name: string; args?: unknown }
  | { type: "tool_end"; name: string }
  | { type: "status"; message: string }
  | { type: "sources"; items: SourceItem[] }
  | { type: "followups"; items: string[] }
  | { type: "error"; message: string };

export type AgentRunResult = {
  answer: string;
  followUps: string[];
  sources: SourceItem[];
};

/** Max prior messages sent to the LLM (≈10 turns). */
export const MAX_HISTORY_MESSAGES = 20;

function isLlmMessage(message: AgentMessage): message is Message {
  return (
    typeof message === "object" &&
    message !== null &&
    "role" in message &&
    (message.role === "user" || message.role === "assistant" || message.role === "toolResult")
  );
}

function getAssistantText(message: AssistantMessage): string {
  return message.content
    .filter((c): c is { type: "text"; text: string } => c.type === "text")
    .map((c) => c.text)
    .join("");
}

/**
 * Stream only answer text; suppress the FOLLOWUP_QUESTIONS block from deltas.
 */
function createAnswerDeltaStreamer(onDelta: (text: string) => void) {
  let buffer = "";
  let suppressed = false;
  const marker = "<FOLLOWUP_QUESTIONS>";

  return {
    push(delta: string) {
      if (suppressed) return;
      buffer += delta;

      const idx = buffer.toUpperCase().indexOf(marker);
      if (idx !== -1) {
        const safe = buffer.slice(0, idx);
        if (safe) onDelta(safe);
        suppressed = true;
        buffer = "";
        return;
      }

      // Hold back a trailing partial match of the marker
      const maxPartial = marker.length - 1;
      if (buffer.length > maxPartial) {
        const emit = buffer.slice(0, buffer.length - maxPartial);
        buffer = buffer.slice(buffer.length - maxPartial);
        if (emit) onDelta(emit);
      }
    },
    flush() {
      if (!suppressed && buffer) {
        onDelta(buffer);
        buffer = "";
      }
    },
  };
}

function createSourceRegistry() {
  const sourcesByUrl = new Map<string, SourceItem>();

  function registerResult(result: SearchResult): RegisteredSource {
    const existing = sourcesByUrl.get(result.url);
    if (existing) return existing;

    const item: SourceItem = {
      index: sourcesByUrl.size + 1,
      title: result.title ?? result.url,
      url: result.url,
      domain: domainFromUrl(result.url),
    };
    sourcesByUrl.set(result.url, item);
    return item;
  }

  return {
    registerResult,
    list: () => [...sourcesByUrl.values()].sort((a, b) => a.index - b.index),
  };
}

/**
 * Run the Lumina agent loop for a user query and map events to NDJSON.
 * The model decides whether to call web_search; the agent loop executes tools.
 */
export async function runAgentQuery(options: {
  query: string;
  model?: string;
  searchMode?: string;
  history?: AgentMessage[];
  signal?: AbortSignal;
  onEvent: (event: NdjsonEvent) => void;
}): Promise<AgentRunResult> {
  const searchDepth = getSearchDepth(options.searchMode);
  const model = getAgentModel(options.model);
  const registry = createSourceRegistry();
  const webSearchTool = createWebSearchTool(searchDepth, registry.registerResult);

  const context: AgentContext = {
    systemPrompt: getSystemPrompt(),
    messages: [...(options.history ?? [])],
    tools: [webSearchTool],
  };

  const userMessage: AgentMessage = {
    role: "user",
    content: options.query,
    timestamp: Date.now(),
  };

  const config: AgentLoopConfig = {
    model,
    apiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0.2,
    convertToLlm: (messages) => messages.filter(isLlmMessage),
    shouldStopAfterTurn: ({ message }) =>
      message.stopReason === "stop" || message.stopReason === "length",
  };

  let finalAnswerText = "";
  let deltaStreamer = createAnswerDeltaStreamer((text) => {
    options.onEvent({ type: "delta", text });
  });

  const stream = agentLoop(
    [userMessage],
    context,
    config,
    options.signal,
    getDefaultStreamFn(),
  );

  for await (const event of stream) {
    switch (event.type) {
      case "turn_start": {
        // Reset delta streamer for each assistant turn so tool-call turns don't leak text
        deltaStreamer.flush();
        deltaStreamer = createAnswerDeltaStreamer((text) => {
          options.onEvent({ type: "delta", text });
        });
        break;
      }
      case "message_update": {
        const ame = event.assistantMessageEvent;
        if (ame.type === "text_delta") {
          deltaStreamer.push(ame.delta);
        } else if (ame.type === "thinking_delta") {
          options.onEvent({ type: "thinking", text: ame.delta });
        }
        break;
      }
      case "message_end": {
        deltaStreamer.flush();
        if (event.message.role === "assistant") {
          const text = getAssistantText(event.message);
          if (text.trim() && event.message.stopReason !== "toolUse") {
            finalAnswerText = text;
          } else if (text.trim() && !finalAnswerText) {
            finalAnswerText = text;
          }
        }
        break;
      }
      case "tool_execution_start": {
        options.onEvent({
          type: "tool_start",
          name: event.toolName,
          args: event.args,
        });
        if (event.toolName === "web_search") {
          options.onEvent({ type: "status", message: "Searching the web..." });
        }
        break;
      }
      case "tool_execution_end": {
        options.onEvent({ type: "tool_end", name: event.toolName });
        if (event.toolName === "web_search" && !event.isError) {
          const sources = registry.list();
          if (sources.length > 0) {
            options.onEvent({ type: "sources", items: sources });
          }
        }
        break;
      }
      case "agent_end": {
        for (let i = event.messages.length - 1; i >= 0; i--) {
          const msg = event.messages[i];
          if (msg && typeof msg === "object" && "role" in msg && msg.role === "assistant") {
            const assistant = msg as AssistantMessage;
            if (assistant.stopReason === "toolUse") continue;
            const text = getAssistantText(assistant);
            if (text.trim()) {
              finalAnswerText = text;
              break;
            }
          }
        }
        break;
      }
      default:
        break;
    }
  }

  const { answer, followUps } = extractFollowUps(finalAnswerText || "");
  const sources = registry.list();

  if (sources.length > 0) {
    options.onEvent({ type: "sources", items: sources });
  }
  if (followUps.length > 0) {
    options.onEvent({ type: "followups", items: followUps });
  }

  return { answer, followUps, sources };
}

/**
 * Convert stored DB messages into AgentMessage history (last MAX_HISTORY_MESSAGES).
 */
export function historyFromDbMessages(
  messages: { role: "User" | "Assistant"; content: string }[],
): AgentMessage[] {
  const recent = messages.slice(-MAX_HISTORY_MESSAGES);

  return recent.map((m) => {
    // Strip persisted sources markers so the model doesn't see them
    const content = m.content.replace(/\n*\n?<!--SOURCES:[\s\S]*?-->\s*$/, "").trimEnd();

    if (m.role === "User") {
      return {
        role: "user" as const,
        content,
        timestamp: Date.now(),
      };
    }
    return {
      role: "assistant" as const,
      content: [{ type: "text" as const, text: content }],
      api: "openai-completions" as const,
      provider: "openrouter",
      model: "history",
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: "stop" as const,
      timestamp: Date.now(),
    };
  });
}
