import { describe, expect, it } from "vitest";
import { useAppStore } from "../store/app-store";

describe("app-store", () => {
  it("tracks credits and upgrade modal state", () => {
    const store = useAppStore.getState();
    store.setCredits(7, 10);
    expect(useAppStore.getState().creditsRemaining).toBe(3);

    store.openUpgradeModal({ creditsUsed: 10, creditLimit: 10, plan: "Free" });
    expect(useAppStore.getState().showUpgradeModal).toBe(true);

    store.closeUpgradeModal();
    expect(useAppStore.getState().showUpgradeModal).toBe(false);
  });

  it("updates model and search mode", () => {
    const store = useAppStore.getState();
    store.setModel("claude");
    store.setSearchMode("research");
    expect(useAppStore.getState().model).toBe("claude");
    expect(useAppStore.getState().searchMode).toBe("research");
  });

  it("tracks agent activity", () => {
    const store = useAppStore.getState();
    store.setAgentStatus("Searching the web...");
    store.setActiveTool("web_search");
    store.setStreamSources([
      { index: 1, title: "Example", url: "https://example.com", domain: "example.com" },
    ]);
    expect(useAppStore.getState().agentStatus).toBe("Searching the web...");
    expect(useAppStore.getState().activeTool).toBe("web_search");
    expect(useAppStore.getState().streamSources).toHaveLength(1);
    store.clearAgentActivity();
    expect(useAppStore.getState().agentStatus).toBeNull();
    expect(useAppStore.getState().activeTool).toBeNull();
    expect(useAppStore.getState().streamSources).toEqual([]);
  });
});