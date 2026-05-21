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
    <div className="flex h-full overflow-y-auto px-8 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-8">
        <section className="max-w-3xl">
          <Badge>New tab</Badge>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight text-white">
            Search, open, and ask the page what matters.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/[0.58]">
            A calm command surface for web research, task extraction, and focused browsing.
          </p>
        </section>

        <form
          className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/[0.12] bg-white/[0.08] px-5 shadow-panel backdrop-blur-xl focus-within:border-aurora-cyan/[0.45]"
          onSubmit={handleSubmit}
        >
          <Search className="shrink-0 text-aurora-cyan" size={24} />
          <input
            autoFocus
            className="h-16 min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/[0.38]"
            placeholder="Search Google or enter a URL"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button className="h-11" tone="primary" type="submit">
            Open
          </Button>
        </form>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/[0.46]">
                Quick Links
              </h2>
              <Sparkles className="text-aurora-cyan" size={17} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <button
                  key={link.url}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:border-white/[0.18] hover:bg-white/[0.1]"
                  type="button"
                  onClick={() => onNavigate(link.url)}
                >
                  <span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${link.accent}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-white">{link.title}</span>
                    <span className="block truncate text-sm text-white/[0.42]">{link.url}</span>
                  </span>
                  <ExternalLink className="text-white/[0.35]" size={15} />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-aurora-cyan/[0.18] bg-aurora-cyan/[0.07] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/[0.54]">
                AI Assistant
              </h2>
              <Bot className="text-aurora-cyan" size={18} />
            </div>
            <p className="text-sm leading-6 text-white/[0.62]">
              Open the assistant beside any page to summarize, explain, or turn research into tasks.
            </p>
            <div className="mt-5 grid gap-2">
              <TeaserAction icon={<FileText size={15} />} label="Summarize the page" />
              <TeaserAction icon={<ListTodo size={15} />} label="Extract next actions" />
              <TeaserAction icon={<Zap size={15} />} label="Explain complex sections" />
            </div>
            <Button className="mt-5 w-full" tone="primary" onClick={onOpenAi}>
              Open assistant
            </Button>
          </section>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/[0.46]">
            Recent Pages
          </h2>
          {recent.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2">
              {recent.map((entry) => (
                <button
                  key={entry.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]"
                  type="button"
                  onClick={() => onNavigate(entry.url)}
                >
                  <span className="block truncate text-sm font-medium text-white">
                    {entry.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-white/[0.38]">
                    {formatVisit(entry)} · {entry.url}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.12] px-4 py-8 text-center text-sm text-white/[0.42]">
              Your recent research trail will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TeaserAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-sm text-white/[0.68]">
      <span className="text-aurora-cyan">{icon}</span>
      {label}
    </div>
  );
}
