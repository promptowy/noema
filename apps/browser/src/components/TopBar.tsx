import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Command,
  RotateCw,
  Search,
  Shield,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button, IconButton } from "@browser/ui";
import type { Bookmark, BrowserTab } from "../../electron/types";
import { isInternalUrl } from "../lib/browser";

type TopBarProps = {
  activeTab: BrowserTab | undefined;
  bookmarks: Bookmark[];
  aiOpen: boolean;
  onSubmit: (input: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onBookmark: () => void;
  onToggleAi: () => void;
};

export function TopBar({
  activeTab,
  bookmarks,
  aiOpen,
  onSubmit,
  onBack,
  onForward,
  onReload,
  onBookmark,
  onToggleAi
}: TopBarProps) {
  const [value, setValue] = useState("");
  const isBookmarked = Boolean(
    activeTab && bookmarks.some((bookmark) => bookmark.url === activeTab.url)
  );

  useEffect(() => {
    setValue(activeTab && !isInternalUrl(activeTab.url) ? activeTab.url : "");
  }, [activeTab]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.07] bg-ink-900/[0.76] px-4 backdrop-blur-xl">
      <div className="flex items-center gap-1">
        <IconButton
          disabled={!activeTab?.canGoBack}
          label="Back"
          onClick={onBack}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          disabled={!activeTab?.canGoForward}
          label="Forward"
          onClick={onForward}
        >
          <ChevronRight size={18} />
        </IconButton>
        <IconButton label="Reload" onClick={onReload}>
          <RotateCw className={activeTab?.isLoading ? "animate-spin" : ""} size={16} />
        </IconButton>
      </div>

      <form
        className="group flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 shadow-inner shadow-black/20 transition focus-within:border-aurora-cyan/[0.45] focus-within:bg-white/[0.1]"
        onSubmit={handleSubmit}
      >
        <Search className="shrink-0 text-white/[0.38]" size={18} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/[0.35]"
          placeholder="Search Google or enter a URL"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="hidden items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px] text-white/[0.35] md:flex">
          <Command size={12} />
          Enter
        </div>
      </form>

      <div className="flex items-center gap-1">
        <IconButton
          disabled={!activeTab || isInternalUrl(activeTab.url)}
          label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          selected={isBookmarked}
          onClick={onBookmark}
        >
          <Star fill={isBookmarked ? "currentColor" : "none"} size={17} />
        </IconButton>
        <Button className="h-9 px-3" tone="ghost">
          <Shield size={15} />
          Secure
        </Button>
        <IconButton label="Noema assistant" selected={aiOpen} onClick={onToggleAi}>
          <Bot size={18} />
        </IconButton>
      </div>
    </div>
  );
}
