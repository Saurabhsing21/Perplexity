const API_URL = import.meta.env.VITE_API_URL

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  plan: string;
  creditsUsed: number;
  creditLimit: number;
  creditsRemaining: number;
};

export type ConversationSummary = {
  id: string;
  title: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  messages: { content: string }[];
};

export type { SourceItem } from "./sources";
export {
  domainFromUrl,
  encodeSourcesMarker,
  extractSourcesFromContent,
  normalizeSourceItem,
  preprocessCitationLinks,
} from "./sources";

import type { SourceItem } from "./sources";
import { encodeSourcesMarker, normalizeSourceItem } from "./sources";

export type AskStreamEvent =
  | { type: "delta"; text: string }
  | { type: "thinking"; text: string }
  | { type: "tool_start"; name: string; args?: unknown }
  | { type: "tool_end"; name: string }
  | { type: "status"; message: string }
  | { type: "sources"; items: SourceItem[] }
  | { type: "followups"; items: string[] }
  | { type: "done"; conversationId: string; creditsUsed: number; creditLimit: number }
  | { type: "error"; message: string };

export class CreditsExhaustedError extends Error {
  creditsUsed: number;
  creditLimit: number;
  plan: string;

  constructor(payload: { creditsUsed: number; creditLimit: number; plan: string }) {
    super("credits_exhausted");
    this.name = "CreditsExhaustedError";
    this.creditsUsed = payload.creditsUsed;
    this.creditLimit = payload.creditLimit;
    this.plan = payload.plan;
  }
}

async function authFetch(path: string, token: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export async function getMe(token: string): Promise<UserProfile> {
  const res = await authFetch("/me", token);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function getConversations(token: string): Promise<ConversationSummary[]> {
  const res = await authFetch("/conversations", token);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  const data = await res.json();
  return data.conversations;
}

export async function createConversation(token: string, title = "New thread") {
  const res = await authFetch("/conversations", token, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  const data = await res.json();
  return data.conversation as ConversationSummary;
}

export async function getConversation(token: string, id: string) {
  const res = await authFetch(`/conversations/${id}`, token);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  const data = await res.json();
  return data.conversation as {
    id: string;
    title: string | null;
    messages: { id: number; content: string; role: "User" | "Assistant"; createdAt: string }[];
  };
}

export async function deleteConversation(token: string, id: string) {
  const res = await authFetch(`/conversations/${id}`, token, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete conversation");
}

export async function* askStream(
  token: string,
  params: {
    query: string;
    model?: string;
    searchMode?: string;
    conversationId?: string;
    signal?: AbortSignal;
  },
): AsyncGenerator<AskStreamEvent> {
  const res = await authFetch("/ask", token, {
    method: "POST",
    body: JSON.stringify({
      query: params.query,
      model: params.model,
      searchMode: params.searchMode,
      conversationId: params.conversationId,
    }),
    signal: params.signal,
  });

  if (res.status === 402) {
    const payload = await res.json();
    throw new CreditsExhaustedError(payload);
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.message ?? "Request failed");
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as AskStreamEvent;
      if (event.type === "sources") {
        yield {
          ...event,
          items: event.items.map((s, i) => normalizeSourceItem(s, i + 1)),
        };
      } else {
        yield event;
      }
    }
  }

  if (buffer.trim()) {
    const event = JSON.parse(buffer) as AskStreamEvent;
    if (event.type === "sources") {
      yield {
        ...event,
        items: event.items.map((s, i) => normalizeSourceItem(s, i + 1)),
      };
    } else {
      yield event;
    }
  }
}

/** @deprecated Prefer encodeSourcesMarker + SourcePanel; kept for tests/compat */
export function formatSourcesMarkdown(sources: SourceItem[]): string {
  return encodeSourcesMarker(sources);
}
