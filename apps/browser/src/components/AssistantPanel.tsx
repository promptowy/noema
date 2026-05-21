import { Bot, FileText, ListTodo, PanelRight, Sparkles, X, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button, IconButton } from "@browser/ui";
import type { BrowserTab } from "../../electron/types";
import { isInternalUrl, shortUrl } from "../lib/browser";

type AssistantPanelProps = {
  activeTab: BrowserTab | undefined;
  onClose: () => void;
};

export function AssistantPanel({ activeTab, onClose }: AssistantPanelProps) {
  const pageUrl = activeTab && !isInternalUrl(activeTab.url) ? activeTab.url : "No page selected";

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-white/[0.08] bg-ink-950/[0.82] backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aurora-cyan text-ink-950 shadow-glow">
            <Bot size={18} />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Noema</div>
            <div className="text-xs text-white/40">A calm layer of context</div>
          </div>
        </div>
        <IconButton label="Close Noema" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.42]">
            <PanelRight size={14} />
            Current Page
          </div>
          <div className="break-all text-sm text-white">{shortUrl(pageUrl)}</div>
          <div className="mt-2 break-all text-xs leading-5 text-white/[0.42]">{pageUrl}</div>
        </div>

        <div className="mt-4 grid gap-3">
          <AssistantAction icon={<FileText size={17} />} title="Clarify" />
          <AssistantAction icon={<ListTodo size={17} />} title="Trace the thread" />
          <AssistantAction icon={<Zap size={17} />} title="Surface insights" />
        </div>

        <div className="mt-5 rounded-2xl border border-aurora-cyan/[0.18] bg-aurora-cyan/[0.07] p-4">
          <Sparkles className="mb-4 text-aurora-cyan" size={20} />
          <p className="text-sm leading-6 text-white/[0.64]">
            This panel is reserved for page-aware intelligence: a place to clarify, compare and
            continue without losing the thread.
          </p>
        </div>
      </div>
    </aside>
  );
}

function AssistantAction({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Button className="h-12 justify-start" tone="secondary">
      <span className="text-aurora-cyan">{icon}</span>
      {title}
    </Button>
  );
}
