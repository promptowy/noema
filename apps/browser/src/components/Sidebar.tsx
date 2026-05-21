import {
  Bookmark,
  Bot,
  History,
  Layers,
  Plus,
  Settings,
  Sparkles
} from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "@browser/ui";
import type { BrowserTab } from "../../electron/types";

type ViewMode = "browser" | "bookmarks" | "history" | "settings";

type SidebarProps = {
  activeTabId: string;
  tabs: BrowserTab[];
  viewMode: ViewMode;
  onCreateTab: () => void;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

export function Sidebar({
  activeTabId,
  tabs,
  viewMode,
  onCreateTab,
  onSwitchTab,
  onCloseTab,
  onViewModeChange
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[282px] shrink-0 flex-col border-r border-white/[0.08] bg-ink-950/[0.74] backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.07] px-4">
        <button
          className="flex h-10 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-left transition hover:bg-white/[0.1]"
          type="button"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-aurora-cyan text-ink-950">
            <Sparkles size={16} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">Noema Space</span>
            <span className="block truncate text-xs text-white/[0.45]">Thoughtful workspace</span>
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.36]">
          <Layers size={14} />
          Tabs
        </div>
        <IconButton label="New tab" onClick={onCreateTab}>
          <Plus size={17} />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              tab.id === activeTabId && viewMode === "browser"
                ? "border-aurora-cyan/[0.26] bg-aurora-cyan/10 text-white"
                : "border-transparent text-white/[0.62] hover:bg-white/[0.06] hover:text-white"
            }`}
            type="button"
            onClick={() => onSwitchTab(tab.id)}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white/[0.66]">
              {tab.isLoading ? <Sparkles size={14} /> : <Bot size={14} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{tab.title || "Untitled"}</span>
              <span className="block truncate text-xs text-white/[0.38]">{tab.url}</span>
            </span>
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/[0.35] opacity-0 transition hover:bg-white/[0.08] hover:text-white group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                onCloseTab(tab.id);
              }}
            >
              <Plus className="rotate-45" size={15} />
            </span>
          </button>
        ))}
      </div>

      <nav className="space-y-1 border-t border-white/[0.07] p-3">
        <SidebarAction
          icon={<Bookmark size={17} />}
          label="Bookmarks"
          selected={viewMode === "bookmarks"}
          onClick={() => onViewModeChange("bookmarks")}
        />
        <SidebarAction
          icon={<History size={17} />}
          label="History"
          selected={viewMode === "history"}
          onClick={() => onViewModeChange("history")}
        />
        <SidebarAction
          icon={<Settings size={17} />}
          label="Settings"
          selected={viewMode === "settings"}
          onClick={() => onViewModeChange("settings")}
        />
      </nav>
    </aside>
  );
}

function SidebarAction({
  icon,
  label,
  selected,
  onClick
}: {
  icon: ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
        selected
          ? "bg-white/[0.1] text-white"
          : "text-white/[0.58] hover:bg-white/[0.06] hover:text-white"
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
