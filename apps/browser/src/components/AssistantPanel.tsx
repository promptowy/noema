import { Bot, FileText, ListTodo, PanelRight, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
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
  const assistantPlaceholder = "Assistant actions are coming in the next private build.";
  const [message, setMessage] = useState(assistantPlaceholder);

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-[#e7c989]/[0.10] bg-[#070604]/[0.86] backdrop-blur-2xl">
      <div className="flex h-[68px] items-center justify-between border-b border-[#e7c989]/[0.10] px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7c989]/[0.25] bg-[#e7c989]/[0.12] text-[#e7c989] shadow-[0_18px_48px_rgba(231,201,137,0.10)]">
            <Bot size={18} />
          </span>
          <div>
            <div className="text-sm font-semibold text-[#f4ecdc]">Noema</div>
            <div className="text-xs text-[#f4ecdc]/[0.40]">A calm layer of context</div>
          </div>
        </div>
        <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Close Noema" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="rounded-[22px] border border-[#e7c989]/[0.12] bg-[#15120d]/[0.68] p-4 shadow-[inset_0_1px_0_rgba(255,248,232,0.06)]">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4ecdc]/[0.42]">
            <PanelRight size={14} />
            Page Context
          </div>
          <div className="break-all text-sm font-medium text-[#f4ecdc]">{shortUrl(pageUrl)}</div>
          <div className="mt-2 break-all text-xs leading-5 text-[#f4ecdc]/[0.42]">{pageUrl}</div>
        </div>

        <div className="mt-4 grid gap-3">
          <AssistantAction
            icon={<FileText size={17} />}
            title="Understand this page"
            onClick={() => setMessage(assistantPlaceholder)}
          />
          <AssistantAction
            icon={<ListTodo size={17} />}
            title="Summarize the thread"
            onClick={() => setMessage(assistantPlaceholder)}
          />
          <AssistantAction
            icon={<Sparkles size={17} />}
            title="Extract decisions"
            onClick={() => setMessage(assistantPlaceholder)}
          />
          <AssistantAction
            icon={<Zap size={17} />}
            title="Find next steps"
            onClick={() => setMessage(assistantPlaceholder)}
          />
        </div>

        <div className="mt-5 rounded-[22px] border border-[#e7c989]/[0.16] bg-[linear-gradient(145deg,rgba(231,201,137,0.10),rgba(244,236,220,0.035)_48%,rgba(0,0,0,0.12))] p-4">
          <Sparkles className="mb-4 text-[#e7c989]" size={20} />
          <p className="text-sm leading-6 text-[#f4ecdc]/[0.64]">
            {message}
          </p>
        </div>
      </div>
    </aside>
  );
}

function AssistantAction({
  icon,
  onClick,
  title
}: {
  icon: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <Button
      className="h-12 justify-start rounded-2xl border-[#e7c989]/[0.12] bg-[#f4ecdc]/[0.045] text-[#f4ecdc]/[0.74] hover:border-[#e7c989]/[0.22] hover:bg-[#f4ecdc]/[0.075] hover:text-[#f4ecdc]"
      tone="secondary"
      onClick={onClick}
    >
      <span className="text-[#e7c989]">{icon}</span>
      {title}
      <span className="ml-auto rounded-full border border-[#e7c989]/[0.12] px-2 py-0.5 text-[10px] text-[#f4ecdc]/[0.42]">
        Soon
      </span>
    </Button>
  );
}
