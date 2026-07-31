"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/lib/utils";
import {
  Compass,
  Plus,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useAppStore } from "@/store/app-store";
import {
  createConversation,
  deleteConversation,
  getConversations,
  type ConversationSummary,
} from "@/lib/api";

interface CloneThreadShellProps {
  children: React.ReactNode;
  railClassName?: string;
  onNewThread: () => void;
  onRefreshConversations?: () => void;
}

export const CloneThreadShell: React.FC<CloneThreadShellProps> = ({
  children,
  railClassName,
  onNewThread,
}) => {
  const navigate = useNavigate();
  const { user, signOut, getAccessToken } = useAuth();
  const creditsRemaining = useAppStore((s) => s.creditsRemaining);
  const creditLimit = useAppStore((s) => s.creditLimit);
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  const loadConversations = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const items = await getConversations(token);
      setConversations(items);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingThreads(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  const handleNewThread = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const conversation = await createConversation(token);
      useAppStore.getState().setConversationId(conversation.id);
      navigate(`/thread/${conversation.id}`);
      onNewThread();
      await loadConversations();
    } catch (err) {
      console.error(err);
      onNewThread();
      navigate("/");
    }
  };

  const handleDeleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = await getAccessToken();
      if (!token) return;
      await deleteConversation(token, id);
      if (useAppStore.getState().conversationId === id) {
        useAppStore.getState().setConversationId(null);
        navigate("/");
      }
      await loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "User";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f2ec] text-[#1f1b17] antialiased dark:bg-[#171615] dark:text-[#f5f2ed]">
      <aside
        className={cn(
          "relative z-20 flex select-none flex-col justify-between border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          railClassName ?? "border-[#e3dbcf] bg-[#efeae1] dark:border-[#332f2a] dark:bg-[#1d1b19]",
        )}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center justify-between px-2 py-1">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-white font-semibold">
                  L
                </span>
                <span className="font-display text-lg font-semibold tracking-tight text-[#25211c] dark:text-[#f5f2ed]">
                  Lumina
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex size-8 items-center justify-center rounded-full text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#9d968d] dark:hover:bg-[#2b2825] dark:hover:text-[#f5f2ed]"
            >
              {collapsed ? <PanelLeftOpen className="size-4.5" /> : <PanelLeftClose className="size-4.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewThread}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full border border-accent-border bg-[#fcfbf8] px-3 py-2 text-sm font-medium text-[#25211c] shadow-xs transition-all hover:border-accent hover:bg-accent-muted hover:text-accent hover:shadow-sm dark:border-accent-border dark:bg-[#252220] dark:text-[#f5f2ed] dark:hover:bg-accent-muted dark:hover:text-accent",
              collapsed && "size-10 rounded-full p-0",
            )}
          >
            <Plus className="size-4 shrink-0 text-accent" />
            {!collapsed && <span>New Thread</span>}
          </button>

          <nav className="mt-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 rounded-xl bg-accent-muted px-3 py-2 text-sm font-medium text-accent"
            >
              <Compass className="size-4 shrink-0" />
              {!collapsed && <span>Home</span>}
            </button>
          </nav>

          {!collapsed && (
            <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#8a8176] dark:text-[#888177]">
              Recent Threads
            </div>
          )}

          <div className="flex max-h-[calc(100vh-360px)] flex-col gap-1 overflow-y-auto">
            {loadingThreads && !collapsed ? (
              <p className="px-3 text-xs text-[#8a8176]">Loading...</p>
            ) : null}
            {conversations.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => {
                  useAppStore.getState().setConversationId(thread.id);
                  navigate(`/thread/${thread.id}`);
                }}
                onContextMenu={(e) => handleDeleteThread(thread.id, e)}
                className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-[#554e45] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#b0a99f] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
              >
                <MessageSquare className="size-3.5 shrink-0 text-[#8a8176]" />
                {!collapsed && (
                  <span className="truncate">{thread.title ?? "Untitled thread"}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#e3dbcf] p-3 dark:border-[#332f2a]">
          {!collapsed && creditsRemaining !== null && creditLimit !== null ? (
            <div className="rounded-xl px-3 py-2 text-xs text-[#6f675d] dark:text-[#a39c93]">
              {creditsRemaining <= 2 ? (
                <span className="text-amber-700 dark:text-amber-400">
                  {creditsRemaining} of {creditLimit} queries left
                </span>
              ) : (
                <span>
                  {creditsRemaining} of {creditLimit} queries left
                  <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Free
                  </span>
                </span>
              )}
            </div>
          ) : null}

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#a39c93] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
          >
            {isDarkMode ? <Sun className="size-4 shrink-0 text-amber-400" /> : <Moon className="size-4 shrink-0" />}
            {!collapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#e2dacd] dark:hover:bg-[#282522]">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#3d362e] text-xs font-semibold text-[#f8f5f0] dark:bg-[#f5f2ed] dark:text-[#1b1713]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              {!collapsed && <span className="truncate text-xs font-medium">{displayName}</span>}
            </div>
            {!collapsed && (
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-full p-1 text-[#8a8176] hover:bg-[#d9d0c3] dark:hover:bg-[#3a342f]"
                title="Sign out"
              >
                <LogOut className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
};
