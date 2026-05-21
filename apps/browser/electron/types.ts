export type BrowserBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BrowserTab = {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

export type HistoryEntry = {
  id: string;
  title: string;
  url: string;
  visitedAt: string;
};

export type BrowserSettings = {
  searchEngine: "google";
  theme: "dark" | "system";
  privacyMode: boolean;
};

export type AppState = {
  tabs: BrowserTab[];
  activeTabId: string;
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  settings: BrowserSettings;
};

export type PersistedStore = AppState & {
  version: 1;
};

export type NavigatePayload = {
  input: string;
  tabId?: string;
};

export type SettingsPatch = Partial<BrowserSettings>;
