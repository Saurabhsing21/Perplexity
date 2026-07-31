import { create } from "zustand";

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
  setConversationId: (id: string | null) => void;
  setModel: (model: string) => void;
  setSearchMode: (mode: string) => void;
  setFollowUpQuestions: (items: string[]) => void;
  setCredits: (used: number, limit: number) => void;
  openUpgradeModal: (payload: { creditsUsed: number; creditLimit: number; plan: string }) => void;
  closeUpgradeModal: () => void;
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
}));
