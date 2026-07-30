"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Compass,
  Plus,
  SquareLibrary,
  Moon,
  Sun,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Sparkles,
  Settings
} from "lucide-react";

interface CloneThreadShellProps {
  children: React.ReactNode;
  railClassName?: string;
}

export const CloneThreadShell: React.FC<CloneThreadShellProps> = ({
  children,
  railClassName,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f2ec] text-[#1f1b17] antialiased dark:bg-[#171615] dark:text-[#f5f2ed]">
      {/* Sidebar Rail */}
      <aside
        className={cn(
          "relative flex flex-col justify-between border-r transition-all duration-300 ease-in-out z-20 select-none",
          collapsed ? "w-16" : "w-64",
          railClassName ?? "border-[#e3dbcf] bg-[#efeae1] dark:border-[#332f2a] dark:bg-[#1d1b19]"
        )}
      >
        {/* Top Navigation / Brand */}
        <div className="flex flex-col gap-3 p-3">
          {/* Logo & Toggle Sidebar */}
          <div className="flex items-center justify-between px-2 py-1">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#25211c] text-[#f8f5f0] font-semibold dark:bg-[#f5f2ed] dark:text-[#1b1713]">
                  P
                </span>
                <span className="font-display font-semibold tracking-tight text-lg text-[#25211c] dark:text-[#f5f2ed]">
                  Perplexity
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex size-8 items-center justify-center rounded-full text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#9d968d] dark:hover:bg-[#2b2825] dark:hover:text-[#f5f2ed]"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="size-4.5" /> : <PanelLeftClose className="size-4.5" />}
            </button>
          </div>

          {/* New Thread Action */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full border border-[#d7d0c5] bg-[#fcfbf8] py-2 px-3 text-sm font-medium text-[#25211c] shadow-xs transition-all hover:bg-[#f3ece2] hover:shadow-sm dark:border-[#3d3731] dark:bg-[#252220] dark:text-[#f5f2ed] dark:hover:bg-[#2f2b27]",
              collapsed && "size-10 p-0 rounded-full"
            )}
          >
            <Plus className="size-4 shrink-0 text-[#25211c] dark:text-[#f5f2ed]" />
            {!collapsed && <span>New Thread</span>}
          </button>

          {/* Navigation Links */}
          <nav className="mt-2 flex flex-col gap-1">
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#25211c] bg-[#e4ded4] dark:bg-[#282522] dark:text-[#f5f2ed]"
            >
              <Compass className="size-4 shrink-0 text-[#25211c] dark:text-[#f5f2ed]" />
              {!collapsed && <span>Home</span>}
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#a39c93] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
            >
              <Sparkles className="size-4 shrink-0" />
              {!collapsed && <span>Discover</span>}
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#a39c93] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
            >
              <SquareLibrary className="size-4 shrink-0" />
              {!collapsed && <span>Library</span>}
            </button>
          </nav>

          {/* Recent Threads Header */}
          {!collapsed && (
            <div className="mt-4 px-3 text-xs font-semibold text-[#8a8176] uppercase tracking-wider dark:text-[#888177]">
              Recent Threads
            </div>
          )}

          {/* Recent Threads List */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-320px)]">
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-[#554e45] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#b0a99f] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
            >
              <MessageSquare className="size-3.5 shrink-0 text-[#8a8176]" />
              {!collapsed && <span className="truncate">Perplexity UI Clone setup</span>}
            </button>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-[#554e45] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#b0a99f] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
            >
              <MessageSquare className="size-3.5 shrink-0 text-[#8a8176]" />
              {!collapsed && <span className="truncate">Vite + React assistant-ui integration</span>}
            </button>
          </div>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col gap-1 border-t border-[#e3dbcf] p-3 dark:border-[#332f2a]">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6f675d] transition-colors hover:bg-[#e2dacd] hover:text-[#1f1b17] dark:text-[#a39c93] dark:hover:bg-[#282522] dark:hover:text-[#f5f2ed]"
          >
            {isDarkMode ? <Sun className="size-4 shrink-0 text-amber-400" /> : <Moon className="size-4 shrink-0" />}
            {!collapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* User Profile */}
          <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-[#25211c] transition-colors hover:bg-[#e2dacd] dark:text-[#f5f2ed] dark:hover:bg-[#282522]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#3d362e] text-[#f8f5f0] text-xs font-semibold dark:bg-[#f5f2ed] dark:text-[#1b1713]">
                <User className="size-4" />
              </div>
              {!collapsed && <span className="truncate font-medium text-xs">User</span>}
            </div>
            {!collapsed && <Settings className="size-3.5 text-[#8a8176]" />}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
