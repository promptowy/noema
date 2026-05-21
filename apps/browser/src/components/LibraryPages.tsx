import { Bookmark, ExternalLink, History, Search, Settings, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { SectionEyebrow } from "@browser/ui";
import type {
  AppState,
  Bookmark as BookmarkType,
  HistoryEntry,
  SettingsPatch
} from "../../electron/types";
import { formatVisit } from "../lib/browser";

type LibraryProps = {
  state: AppState;
  onNavigate: (url: string) => void;
  onSettingsChange: (patch: SettingsPatch) => Promise<void>;
};

export function BookmarksPage({
  bookmarks,
  onNavigate
}: {
  bookmarks: BookmarkType[];
  onNavigate: (url: string) => void;
}) {
  return (
    <Surface icon={<Bookmark size={20} />} title="Bookmarks" subtitle="Pinned pages live here.">
      {bookmarks.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:border-white/[0.18] hover:bg-white/[0.08]"
              type="button"
              onClick={() => onNavigate(bookmark.url)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm font-semibold text-white">{bookmark.title}</div>
                <ExternalLink className="shrink-0 text-white/[0.32]" size={15} />
              </div>
              <div className="mt-2 truncate text-xs text-white/[0.42]">{bookmark.url}</div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState label="Bookmark useful pages from the address bar." />
      )}
    </Surface>
  );
}

export function HistoryPage({
  history,
  onNavigate
}: {
  history: HistoryEntry[];
  onNavigate: (url: string) => void;
}) {
  return (
    <Surface icon={<History size={20} />} title="History" subtitle="A lightweight local trail.">
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <button
              key={entry.id}
              className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]"
              type="button"
              onClick={() => onNavigate(entry.url)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-aurora-cyan">
                <Search size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{entry.title}</span>
                <span className="mt-1 block truncate text-xs text-white/40">{entry.url}</span>
              </span>
              <span className="shrink-0 text-xs text-white/[0.36]">{formatVisit(entry)}</span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState label="Pages you visit will be kept locally." />
      )}
    </Surface>
  );
}

export function SettingsPage({ state, onSettingsChange }: LibraryProps) {
  return (
    <Surface
      icon={<Settings size={20} />}
      title="Settings"
      subtitle="Product placeholders with local persistence."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <SettingCard
          description="Google is used for queries that are not URLs."
          label="Default search engine"
        >
          <select
            className="mt-4 h-10 w-full rounded-lg border border-white/10 bg-ink-800 px-3 text-sm text-white outline-none"
            value={state.settings.searchEngine}
            onChange={() => onSettingsChange({ searchEngine: "google" })}
          >
            <option value="google">Google</option>
          </select>
        </SettingCard>

        <SettingCard description="The MVP ships with a premium dark theme." label="Theme">
          <select
            className="mt-4 h-10 w-full rounded-lg border border-white/10 bg-ink-800 px-3 text-sm text-white outline-none"
            value={state.settings.theme}
            onChange={(event) =>
              onSettingsChange({ theme: event.currentTarget.value as "dark" | "system" })
            }
          >
            <option value="dark">Dark</option>
            <option value="system">System placeholder</option>
          </select>
        </SettingCard>

        <SettingCard
          description="Remote pages run without Node.js integration."
          label="Privacy"
        >
          <button
            className={`mt-4 flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition ${
              state.settings.privacyMode
                ? "border-aurora-cyan/40 bg-aurora-cyan/10 text-white"
                : "border-white/10 bg-white/[0.05] text-white/[0.62]"
            }`}
            type="button"
            onClick={() => onSettingsChange({ privacyMode: !state.settings.privacyMode })}
          >
            <span>Strict mode placeholder</span>
            <Shield size={15} />
          </button>
        </SettingCard>
      </div>
    </Surface>
  );
}

function Surface({
  children,
  icon,
  subtitle,
  title
}: {
  children: ReactNode;
  icon: ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>BROWSER</SectionEyebrow>
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-aurora-cyan">
            {icon}
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-1 text-sm text-white/[0.48]">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function SettingCard({
  children,
  description,
  label
}: {
  children: ReactNode;
  description: string;
  label: string;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="text-sm font-semibold text-white">{label}</div>
      <p className="mt-2 min-h-12 text-sm leading-6 text-white/[0.46]">{description}</p>
      {children}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.12] px-6 py-14 text-center text-sm text-white/[0.42]">
      {label}
    </div>
  );
}
