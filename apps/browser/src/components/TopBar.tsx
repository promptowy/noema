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
  sessionLabel: string;
  sessionWorkspace: string;
  onSubmit: (input: string) => void;
  onBack: () => void;
  onBackToControl: () => void;
  onForward: () => void;
  onReload: () => void;
  onBookmark: () => void;
  onToggleAi: () => void;
};

export function TopBar({
  activeTab,
  bookmarks,
  aiOpen,
  sessionLabel,
  sessionWorkspace,
  onSubmit,
  onBack,
  onBackToControl,
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
    <div className="flex h-[68px] shrink-0 items-center gap-3 border-b border-[#e7c989]/[0.10] bg-[#0b0907]/[0.78] px-4 backdrop-blur-2xl">
      <Button
        className="hidden h-10 shrink-0 border-[#e7c989]/[0.12] px-3 text-xs text-[#f4ecdc]/[0.62] hover:bg-[#f4ecdc]/[0.06] hover:text-[#f4ecdc] lg:inline-flex"
        tone="ghost"
        onClick={onBackToControl}
      >
        <ChevronLeft size={15} />
        Control Center
      </Button>
      <IconButton
        className="h-10 w-10 hover:bg-[#f4ecdc]/[0.08] lg:hidden"
        label="Back to Control Center"
        onClick={onBackToControl}
      >
        <ChevronLeft size={17} />
      </IconButton>
      <div className="hidden min-w-[128px] max-w-[190px] shrink-0 lg:block">
        <div className="truncate text-sm font-medium text-[#f4ecdc]">{sessionLabel}</div>
        <div className="truncate text-xs text-[#f4ecdc]/[0.38]">{sessionWorkspace}</div>
      </div>
      <div className="flex items-center gap-1 rounded-xl border border-[#e7c989]/[0.10] bg-black/[0.15] p-1">
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          disabled={!activeTab?.canGoBack}
          label="Back"
          onClick={onBack}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          disabled={!activeTab?.canGoForward}
          label="Forward"
          onClick={onForward}
        >
          <ChevronRight size={18} />
        </IconButton>
        <IconButton className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]" label="Reload" onClick={onReload}>
          <RotateCw className={activeTab?.isLoading ? "animate-spin" : ""} size={16} />
        </IconButton>
      </div>

      <form
        className="group flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-[#e7c989]/[0.13] bg-[#15120d]/[0.72] px-3.5 shadow-[inset_0_1px_0_rgba(255,248,232,0.06),0_18px_60px_rgba(0,0,0,0.25)] transition duration-200 hover:border-[#e7c989]/[0.22] hover:bg-[#19150f]/[0.80] focus-within:border-[#e7c989]/[0.45] focus-within:bg-[#1b1710]"
        onSubmit={handleSubmit}
      >
        <Search className="shrink-0 text-[#e7c989]/[0.70] transition group-focus-within:text-[#e7c989]" size={18} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#f4ecdc] outline-none placeholder:text-[#f4ecdc]/[0.36]"
          placeholder="Search, open, or ask Noema"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="hidden items-center gap-1 rounded-md border border-[#e7c989]/[0.12] bg-black/[0.15] px-2 py-1 text-[11px] text-[#f4ecdc]/[0.38] md:flex">
          <Command size={12} />
          Enter
        </div>
      </form>

      <div className="flex items-center gap-1 rounded-xl border border-[#e7c989]/[0.10] bg-black/[0.15] p-1">
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          disabled={!activeTab || isInternalUrl(activeTab.url)}
          label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          selected={isBookmarked}
          onClick={onBookmark}
        >
          <Star fill={isBookmarked ? "currentColor" : "none"} size={17} />
        </IconButton>
        <Button
          className="h-8 border-[#e7c989]/[0.10] px-3 text-xs text-[#f4ecdc]/[0.58]"
          disabled
          title="Remote web content runs without Node.js integration."
          tone="ghost"
        >
          <Shield size={15} />
          Secure
        </Button>
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          label="Noema assistant"
          selected={aiOpen}
          onClick={onToggleAi}
        >
          <Bot size={18} />
        </IconButton>
      </div>
    </div>
  );
}
