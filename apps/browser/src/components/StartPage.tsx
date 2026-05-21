import { Bot, ExternalLink, FileText, ListTodo, Search, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Badge, Button } from "@browser/ui";
import type { HistoryEntry } from "../../electron/types";
import { formatVisit, quickLinks } from "../lib/browser";

type StartPageProps = {
  history: HistoryEntry[];
  onNavigate: (input: string) => void;
  onOpenAi: () => void;
};

export function StartPage({ history, onNavigate, onOpenAi }: StartPageProps) {
  const [query, setQuery] = useState("");
  const recent = useMemo(() => history.slice(0, 4), [history]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onNavigate(query);
  }

  return (
    <div className="flex h-full overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-7">
        <section className="max-w-3xl">
          <Badge className="border-[#e7c989]/[0.15] bg-[#e7c989]/[0.08] text-[#e7c989]">Noema</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#f4ecdc] md:text-5xl">
            Browse with a mind beside you.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#f4ecdc]/[0.58]">
            Open a page, gather the thread, and keep the next step close.
          </p>
        </section>

        <form
          className="flex min-h-16 items-center gap-4 rounded-[22px] border border-[#e7c989]/[0.14] bg-[#15120d]/[0.76] px-5 shadow-[inset_0_1px_0_rgba(255,248,232,0.07),0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl transition duration-200 hover:border-[#e7c989]/[0.24] focus-within:border-[#e7c989]/[0.48] focus-within:bg-[#1b1710]"
          onSubmit={handleSubmit}
        >
          <Search className="shrink-0 text-[#e7c989]" size={24} />
          <input
            autoFocus
            className="h-16 min-w-0 flex-1 bg-transparent text-lg text-[#f4ecdc] outline-none placeholder:text-[#f4ecdc]/[0.36]"
            placeholder="Search, open, or ask Noema"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            className="h-11 border-[#e7c989]/[0.40] bg-[#e7c989] px-5 text-[#120f0a] shadow-[0_16px_44px_rgba(231,201,137,0.16)] hover:border-[#f4ecdc]/[0.40] hover:bg-[#f4ecdc]"
            tone="primary"
            type="submit"
          >
            Open
          </Button>
        </form>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[22px] border border-[#e7c989]/[0.10] bg-[#100d09]/[0.62] p-5 shadow-[inset_0_1px_0_rgba(255,248,232,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4ecdc]/[0.42]">
                Quick Links
              </h2>
              <Sparkles className="text-[#e7c989]" size={17} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <button
                  key={link.url}
                  className="flex items-center gap-3 rounded-2xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.045] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#e7c989]/[0.22] hover:bg-[#f4ecdc]/[0.07]"
                  type="button"
                  onClick={() => onNavigate(link.url)}
                >
                  <span className={`h-10 w-10 rounded-xl border border-[#f4ecdc]/[0.10] bg-gradient-to-br ${link.accent}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-[#f4ecdc]">{link.title}</span>
                    <span className="block truncate text-sm text-[#f4ecdc]/[0.40]">{link.url}</span>
                  </span>
                  <ExternalLink className="text-[#f4ecdc]/[0.32]" size={15} />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#e7c989]/[0.16] bg-[linear-gradient(145deg,rgba(231,201,137,0.10),rgba(244,236,220,0.04)_45%,rgba(0,0,0,0.12))] p-5 shadow-[inset_0_1px_0_rgba(255,248,232,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4ecdc]/[0.54]">
                Assistant
              </h2>
              <Bot className="text-[#e7c989]" size={18} />
            </div>
            <p className="text-sm leading-6 text-[#f4ecdc]/[0.62]">
              A quiet layer beside the page for summaries, decisions and next steps.
            </p>
            <div className="mt-5 grid gap-2">
              <TeaserAction icon={<FileText size={15} />} label="Understand this page" />
              <TeaserAction icon={<ListTodo size={15} />} label="Summarize the thread" />
              <TeaserAction icon={<Zap size={15} />} label="Find next steps" />
            </div>
            <Button
              className="mt-5 w-full border-[#e7c989]/[0.35] bg-[#e7c989] text-[#120f0a] hover:bg-[#f4ecdc]"
              tone="primary"
              onClick={onOpenAi}
            >
              Open Noema
            </Button>
          </section>
        </div>

        <section className="rounded-[22px] border border-[#e7c989]/[0.10] bg-[#100d09]/[0.52] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#f4ecdc]/[0.42]">
            Continue where you left off
          </h2>
          {recent.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2">
              {recent.map((entry) => (
                <button
                  key={entry.id}
                  className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.035] p-4 text-left transition hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.06]"
                  type="button"
                  onClick={() => onNavigate(entry.url)}
                >
                  <span className="block truncate text-sm font-medium text-[#f4ecdc]">
                    {entry.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-[#f4ecdc]/[0.38]">
                    {formatVisit(entry)} · {entry.url}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e7c989]/[0.14] px-4 py-8 text-center text-sm text-[#f4ecdc]/[0.42]">
              The thread of your recent work will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TeaserAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e7c989]/[0.10] bg-black/[0.15] px-3 py-2 text-sm text-[#f4ecdc]/[0.68]">
      <span className="text-[#e7c989]">{icon}</span>
      {label}
    </div>
  );
}
