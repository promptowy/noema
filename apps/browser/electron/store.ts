import { app } from "electron";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BrowserSettings, BrowserTab, PersistedStore } from "./types";

const STORE_VERSION = 1;
const STORE_FILE = "browser-store.json";

const defaultSettings: BrowserSettings = {
  searchEngine: "google",
  theme: "dark",
  privacyMode: false
};

function newTab(): BrowserTab {
  return {
    id: randomUUID(),
    title: "New Tab",
    url: "browser://newtab",
    isLoading: false,
    canGoBack: false,
    canGoForward: false
  };
}

export function createDefaultStore(): PersistedStore {
  return {
    version: STORE_VERSION,
    activeTabId: "",
    tabs: [],
    bookmarks: [
      {
        id: randomUUID(),
        title: "OpenAI",
        url: "https://openai.com",
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        title: "GitHub",
        url: "https://github.com",
        createdAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        title: "Vercel",
        url: "https://vercel.com",
        createdAt: new Date().toISOString()
      }
    ],
    history: [],
    settings: defaultSettings
  };
}

function normalizeStore(store: Partial<PersistedStore>): PersistedStore {
  const fallback = createDefaultStore();
  const tabs = Array.isArray(store.tabs) && store.tabs.length > 0 ? store.tabs : [newTab()];
  const activeTabId =
    typeof store.activeTabId === "string" &&
    tabs.some((tab) => tab.id === store.activeTabId)
      ? store.activeTabId
      : tabs[0]?.id ?? newTab().id;

  return {
    version: STORE_VERSION,
    tabs,
    activeTabId,
    bookmarks: Array.isArray(store.bookmarks) ? store.bookmarks : fallback.bookmarks,
    history: Array.isArray(store.history) ? store.history.slice(0, 100) : [],
    settings: {
      ...defaultSettings,
      ...(store.settings ?? {})
    }
  };
}

function storePath() {
  return path.join(app.getPath("userData"), STORE_FILE);
}

export async function loadStore(): Promise<PersistedStore> {
  try {
    const raw = await readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    return normalizeStore(parsed);
  } catch {
    return normalizeStore(createDefaultStore());
  }
}

export async function saveStore(store: PersistedStore) {
  const target = storePath();
  await mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.tmp`;
  await writeFile(temp, JSON.stringify(normalizeStore(store), null, 2), "utf8");
  await rename(temp, target);
}
