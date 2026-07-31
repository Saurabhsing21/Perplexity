import { create } from "zustand";
import type { SourceItem } from "@/lib/sources";

type AppStore = {
  conversationId: string | null;
  model: string;
  searchMode: string;
  followUpQuestions: string[];
  creditsRemaining: number | null;
  creditLimit: number | null;
  creditsUsed: number | null;
  showUpgradeModal: boolean;
  upgradePayload: { creditsUsed: number; creditLimit: number; plan: string } | null;
  agentStatus: string | null;
  activeTool: string | null;
  streamSources: SourceItem[];
  setConversationId: (id: string | null) => void;
  setModel: (model: string) => void;
  setSearchMode: (mode: string) => void;
  setFollowUpQuestions: (items: string[]) => void;
  setCredits: (used: number, limit: number) => void;
  openUpgradeModal: (payload: { creditsUsed: number; creditLimit: number; plan: string }) => void;
  closeUpgradeModal: () => void;
  setAgentStatus: (status: string | null) => void;
  setActiveTool: (tool: string | null) => void;
  setStreamSources: (items: SourceItem[]) => void;
  clearAgentActivity: () => void;
  clearAgentStatus: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  conversationId: null,
  model: "best",
  searchMode: "search",
  followUpQuestions: [],
  creditsRemaining: null,
  creditLimit: null,
  creditsUsed: null,
  showUpgradeModal: false,
  upgradePayload: null,
  agentStatus: null,
  activeTool: null,
  streamSources: [],
  setConversationId: (id) => set({ conversationId: id }),
  setModel: (model) => set({ model }),
  setSearchMode: (mode) => set({ searchMode: mode }),
  setFollowUpQuestions: (items) => set({ followUpQuestions: items }),
  setCredits: (used, limit) =>
    set({
      creditsUsed: used,
      creditLimit: limit,
      creditsRemaining: Math.max(0, limit - used),
    }),
  openUpgradeModal: (payload) => set({ showUpgradeModal: true, upgradePayload: payload }),
  closeUpgradeModal: () => set({ showUpgradeModal: false }),
  setAgentStatus: (status) => set({ agentStatus: status }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStreamSources: (items) => set({ streamSources: items }),
  clearAgentActivity: () => set({ agentStatus: null, activeTool: null, streamSources: [] }),
  clearAgentStatus: () => set({ agentStatus: null, activeTool: null }),
}));
