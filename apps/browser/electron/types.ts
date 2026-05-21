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

export type ProfileStatus = "Ready" | "Review" | "Paused" | "Running";

export type ProfileProxy = "None" | "Residential" | "Workspace" | "Pending";

export type ProfileSessionState = {
  partition: string;
  tabs: BrowserTab[];
  activeTabId: string;
  lastUrl: string;
  runtimeMs: number;
  lastStartedAt: string | null;
};

export type ControlProfile = {
  id: string;
  name: string;
  workspace: string;
  status: ProfileStatus;
  proxy: ProfileProxy;
  tags: string[];
  notes: string;
  lastActivity: string;
  created: string;
  runtime: string;
  session: ProfileSessionState;
};

export type ProfileDraft = {
  name: string;
  workspace: string;
  status: ProfileStatus;
  tags: string[];
  notes: string;
};

export type ProfileUpdate = Partial<ProfileDraft> & {
  id: string;
};

export type ProfileSessionResult = {
  profile: ControlProfile;
  state: AppState;
};
