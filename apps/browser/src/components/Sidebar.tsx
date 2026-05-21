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
  sessionLabel: string;
  tabs: BrowserTab[];
  viewMode: ViewMode;
  onCreateTab: () => void;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

export function Sidebar({
  activeTabId,
  sessionLabel,
  tabs,
  viewMode,
  onCreateTab,
  onSwitchTab,
  onCloseTab,
  onViewModeChange
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[292px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#070604]/[0.82] backdrop-blur-2xl">
      <div className="flex h-[68px] items-center gap-3 border-b border-[#e7c989]/[0.10] px-4">
        <button
          className="flex h-11 flex-1 items-center gap-3 rounded-[14px] border border-[#e7c989]/[0.12] bg-[#15120d]/[0.70] px-3 text-left shadow-[inset_0_1px_0_rgba(255,248,232,0.05)] transition duration-200 hover:border-[#e7c989]/[0.22] hover:bg-[#1b1710]"
          type="button"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e7c989]/[0.25] bg-[#e7c989]/[0.12] text-[#e7c989]">
            <Sparkles size={16} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#f4ecdc]">
              {sessionLabel}
            </span>
            <span className="block truncate text-xs text-[#f4ecdc]/[0.42]">
              Browser session
            </span>
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4ecdc]/[0.36]">
          <Layers size={14} />
          Tabs
        </div>
        <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="New tab" onClick={onCreateTab}>
          <Plus size={17} />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`group relative flex w-full items-center gap-3 rounded-[14px] border px-3 py-2.5 text-left transition duration-200 ${
              tab.id === activeTabId && viewMode === "browser"
                ? "border-[#e7c989]/[0.24] bg-[#e7c989]/[0.09] text-[#f4ecdc] shadow-[inset_0_1px_0_rgba(255,248,232,0.06)]"
                : "border-transparent text-[#f4ecdc]/[0.58] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
            }`}
            type="button"
            onClick={() => onSwitchTab(tab.id)}
          >
            {tab.id === activeTabId && viewMode === "browser" ? (
              <span className="absolute left-0 top-1/2 h-7 w-px -translate-y-1/2 bg-[#e7c989]" />
            ) : null}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e7c989]/[0.10] bg-black/[0.20] text-[#e7c989]/[0.72]">
              {tab.isLoading ? <Sparkles size={14} /> : <Bot size={14} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{tab.title || "Untitled"}</span>
              <span className="block truncate text-xs text-[#f4ecdc]/[0.34]">{tab.url}</span>
            </span>
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#f4ecdc]/[0.32] opacity-0 transition hover:bg-[#f4ecdc]/[0.08] hover:text-[#f4ecdc] group-hover:opacity-100"
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

      <nav className="space-y-1 border-t border-[#e7c989]/[0.10] p-3">
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
          ? "border border-[#e7c989]/[0.16] bg-[#e7c989]/[0.09] text-[#f4ecdc]"
          : "border border-transparent text-[#f4ecdc]/[0.56] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
