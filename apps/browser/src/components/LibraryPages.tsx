import { Bookmark, ExternalLink, History, Search, Settings, Shield } from "lucide-react";
import type { ReactNode } from "react";
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
    <Surface icon={<Bookmark size={20} />} title="Bookmarks" subtitle="Useful pages, kept close.">
      {bookmarks.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.04] p-4 text-left transition hover:border-[#e7c989]/[0.22] hover:bg-[#f4ecdc]/[0.065]"
              type="button"
              onClick={() => onNavigate(bookmark.url)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm font-semibold text-[#f4ecdc]">{bookmark.title}</div>
                <ExternalLink className="shrink-0 text-[#f4ecdc]/[0.32]" size={15} />
              </div>
              <div className="mt-2 truncate text-xs text-[#f4ecdc]/[0.42]">{bookmark.url}</div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState label="Bookmark pages from the address bar when something is worth returning to." />
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
    <Surface icon={<History size={20} />} title="History" subtitle="A local trail of the work.">
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <button
              key={entry.id}
              className="flex w-full items-center gap-4 rounded-2xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.035] p-4 text-left transition hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.06]"
              type="button"
              onClick={() => onNavigate(entry.url)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7c989]/[0.12] bg-[#e7c989]/[0.08] text-[#e7c989]">
                <Search size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[#f4ecdc]">{entry.title}</span>
                <span className="mt-1 block truncate text-xs text-[#f4ecdc]/[0.40]">{entry.url}</span>
              </span>
              <span className="shrink-0 text-xs text-[#f4ecdc]/[0.36]">{formatVisit(entry)}</span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState label="Visited pages will appear here as a private local trail." />
      )}
    </Surface>
  );
}

export function SettingsPage({ state, onSettingsChange }: LibraryProps) {
  return (
    <Surface
      icon={<Settings size={20} />}
      title="Settings"
      subtitle="Simple local preferences for this first build."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <SettingCard
          description="Google is used for queries that are not URLs."
          label="Default search engine"
        >
          <select
            className="mt-4 h-10 w-full rounded-lg border border-[#e7c989]/[0.12] bg-[#15120d] px-3 text-sm text-[#f4ecdc] outline-none transition focus:border-[#e7c989]/[0.36]"
            value={state.settings.searchEngine}
            onChange={() => onSettingsChange({ searchEngine: "google" })}
          >
            <option value="google">Google</option>
          </select>
        </SettingCard>

        <SettingCard description="The MVP ships with a premium dark theme." label="Theme">
          <select
            className="mt-4 h-10 w-full rounded-lg border border-[#e7c989]/[0.12] bg-[#15120d] px-3 text-sm text-[#f4ecdc] outline-none transition focus:border-[#e7c989]/[0.36]"
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
                ? "border-[#e7c989]/[0.40] bg-[#e7c989]/[0.10] text-[#f4ecdc]"
                : "border-[#e7c989]/[0.12] bg-[#f4ecdc]/[0.04] text-[#f4ecdc]/[0.62] hover:border-[#e7c989]/[0.22]"
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
    <div className="h-full overflow-y-auto px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#e7c989]">
          Noema
        </div>
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7c989]/[0.14] bg-[#e7c989]/[0.08] text-[#e7c989]">
            {icon}
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#f4ecdc]">{title}</h1>
            <p className="mt-1 text-sm text-[#f4ecdc]/[0.48]">{subtitle}</p>
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
    <section className="rounded-[22px] border border-[#e7c989]/[0.10] bg-[#100d09]/[0.58] p-5 shadow-[inset_0_1px_0_rgba(255,248,232,0.05)]">
      <div className="text-sm font-semibold text-[#f4ecdc]">{label}</div>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[#f4ecdc]/[0.46]">{description}</p>
      {children}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#e7c989]/[0.14] bg-[#f4ecdc]/[0.025] px-6 py-14 text-center text-sm text-[#f4ecdc]/[0.42]">
      {label}
    </div>
  );
}
