import {
  app,
  BrowserWindow,
  ipcMain,
  session,
  WebContentsView
} from "electron";
import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  createProfile,
  createWorkspace,
  deleteWorkspace,
  deleteProfile,
  getProfileStoreInfo,
  loadProfiles,
  loadWorkspaces,
  resetDemoProfiles,
  sanitizeProfileDraft,
  sanitizeProfileUpdate,
  saveProfileSession,
  startProfileSession,
  stopProfileSession,
  updateProfile,
  updateWorkspace
} from "./profileStore";
import { loadStore, saveStore } from "./store";
import type {
  AppState,
  BrowserBounds,
  BrowserTab,
  ControlProfile,
  NavigatePayload,
  PersistedStore,
  SettingsPatch
} from "./types";

let mainWindow: BrowserWindow | null = null;
let state: AppState | null = null;
let activeView: WebContentsView | null = null;
let contentBounds: BrowserBounds = { x: 0, y: 0, width: 0, height: 0 };
let saveTimer: NodeJS.Timeout | null = null;
let profileSaveTimer: NodeJS.Timeout | null = null;
let startupLogPath: string | null = null;
let activeProfileId: string | null = null;
let activeProfilePartition: string | null = null;

const webViews = new Map<string, WebContentsView>();

const isDevelopment = Boolean(process.env.VITE_DEV_SERVER_URL);
const preloadPath = path.join(__dirname, "../preload/preload.cjs");
const rendererIndexPath = path.resolve(__dirname, "../../dist/renderer/index.html");
const MAX_ADDRESS_INPUT_LENGTH = 4096;
const MAX_VIEW_EDGE = 10000;

function initializeStartupLogging() {
  if (!app.isPackaged) {
    return;
  }

  const logDirectory = app.getPath("userData");
  mkdirSync(logDirectory, { recursive: true });
  startupLogPath = path.join(logDirectory, "noema-startup.log");
  logStartup("Packaged startup initialized", {
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath,
    rendererIndexPath,
    preloadPath
  });
}

function logStartup(message: string, details?: Record<string, unknown>) {
  const line = `[${new Date().toISOString()}] ${message}${
    details ? ` ${JSON.stringify(details)}` : ""
  }\n`;

  console.info(line.trim());

  if (!startupLogPath) {
    return;
  }

  try {
    appendFileSync(startupLogPath, line, "utf8");
  } catch (error) {
    console.error("Failed to write Noema startup log", error);
  }
}

function startupErrorHtml(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const escapedPath = escapeHtml(rendererIndexPath);
  const escapedMessage = escapeHtml(message);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Noema startup error</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #050403;
        color: #f4ecdc;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        max-width: 720px;
        border: 1px solid rgba(231, 201, 137, 0.2);
        border-radius: 24px;
        background: rgba(21, 18, 13, 0.86);
        padding: 32px;
        box-shadow: 0 28px 100px rgba(0, 0, 0, 0.5);
      }
      h1 { margin: 0 0 12px; font-size: 24px; }
      p { color: rgba(244, 236, 220, 0.68); line-height: 1.6; }
      code {
        display: block;
        margin-top: 12px;
        white-space: pre-wrap;
        word-break: break-word;
        color: #e7c989;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Noema could not load its interface.</h1>
      <p>The packaged renderer failed to load. This is a startup issue, not a missing internet connection.</p>
      <code>Renderer path: ${escapedPath}</code>
      <code>Error: ${escapedMessage}</code>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertState(): AppState {
  if (!state) {
    throw new Error("Browser state has not been initialized.");
  }
  return state;
}

function isInternalUrl(url: string) {
  return url.startsWith("browser://");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeString(value: unknown, maxLength = MAX_ADDRESS_INPUT_LENGTH) {
  return typeof value === "string" ? value.slice(0, maxLength) : null;
}

function sanitizeBounds(value: unknown): BrowserBounds | null {
  if (!isRecord(value)) {
    return null;
  }

  const { height, width, x, y } = value;
  if (
    typeof height !== "number" ||
    typeof width !== "number" ||
    typeof x !== "number" ||
    typeof y !== "number" ||
    !Number.isFinite(height) ||
    !Number.isFinite(width) ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return null;
  }

  return {
    x: Math.max(0, Math.min(MAX_VIEW_EDGE, Math.round(x))),
    y: Math.max(0, Math.min(MAX_VIEW_EDGE, Math.round(y))),
    width: Math.max(0, Math.min(MAX_VIEW_EDGE, Math.round(width))),
    height: Math.max(0, Math.min(MAX_VIEW_EDGE, Math.round(height)))
  };
}

function sanitizeNavigatePayload(value: unknown): NavigatePayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const input = sanitizeString(value.input);
  const tabId = sanitizeString(value.tabId, 128);
  if (input === null) {
    return null;
  }

  return tabId ? { input, tabId } : { input };
}

function sanitizeSettingsPatch(value: unknown): SettingsPatch {
  if (!isRecord(value)) {
    return {};
  }

  const patch: SettingsPatch = {};
  if (value.searchEngine === "google") {
    patch.searchEngine = "google";
  }
  if (value.theme === "dark" || value.theme === "light" || value.theme === "system") {
    patch.theme = value.theme;
  }
  if (value.language === "en") {
    patch.language = value.language;
  }
  if (typeof value.privacyMode === "boolean") {
    patch.privacyMode = value.privacyMode;
  }
  return patch;
}

function isSafeExternalUrl(url: string) {
  try {
    const protocol = new URL(url).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function looksLikeDomain(input: string) {
  return /^[^\s]+\.[^\s]{2,}(\/.*)?$/.test(input);
}

function looksLikeLocal(input: string) {
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[[0-9a-f:]+\])(:\d+)?(\/.*)?$/i.test(
    input
  );
}

function normalizeAddressInput(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    return "browser://newtab";
  }

  if (trimmed === "browser://newtab") {
    return trimmed;
  }

  const hasProtocol = /^[a-z][a-z\d+\-.]*:/i.test(trimmed);
  if (hasProtocol) {
    return isSafeExternalUrl(trimmed) ? trimmed : googleSearch(trimmed);
  }

  if (looksLikeLocal(trimmed)) {
    return `http://${trimmed}`;
  }

  if (looksLikeDomain(trimmed)) {
    return `https://${trimmed}`;
  }

  return googleSearch(trimmed);
}

function googleSearch(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function createBlankTab(url = "browser://newtab"): BrowserTab {
  return {
    id: randomUUID(),
    title: url === "browser://newtab" ? "New Tab" : "Loading...",
    url,
    isLoading: false,
    canGoBack: false,
    canGoForward: false
  };
}

function activeTab() {
  const current = assertState();
  return current.tabs.find((tab) => tab.id === current.activeTabId);
}

function patchTab(tabId: string, patch: Partial<BrowserTab>, shouldBroadcast = true) {
  const current = assertState();
  current.tabs = current.tabs.map((tab) =>
    tab.id === tabId ? { ...tab, ...patch } : tab
  );
  if (shouldBroadcast) {
    broadcastState();
  }
}

function addHistory(tab: BrowserTab) {
  if (!isSafeExternalUrl(tab.url)) {
    return;
  }

  const current = assertState();
  const existing = current.history.filter((entry) => entry.url !== tab.url);
  current.history = [
    {
      id: randomUUID(),
      title: tab.title || tab.url,
      url: tab.url,
      visitedAt: new Date().toISOString()
    },
    ...existing
  ].slice(0, 100);
}

function persistableState(): PersistedStore {
  const current = assertState();
  return {
    version: 1,
    ...current,
    activeTabId: activeProfileId ? "" : current.activeTabId,
    tabs: activeProfileId ? [] : current.tabs
  };
}

function activeProfileLastUrl() {
  const tab = activeTab();
  return tab?.url ?? "browser://newtab";
}

function scheduleSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    saveStore(persistableState()).catch((error) => {
      console.error("Failed to save browser store", error);
    });
  }, 250);
}

function scheduleProfileSessionSave() {
  if (!activeProfileId) {
    return;
  }

  if (profileSaveTimer) {
    clearTimeout(profileSaveTimer);
  }

  profileSaveTimer = setTimeout(() => {
    const current = assertState();
    if (!activeProfileId) {
      return;
    }

    saveProfileSession(activeProfileId, {
      tabs: current.tabs,
      activeTabId: current.activeTabId,
      bookmarks: current.bookmarks,
      history: current.history,
      lastUrl: activeProfileLastUrl()
    }).catch((error) => {
      console.error("Failed to save profile session", error);
    });
  }, 250);
}

async function flushProfileSessionSave() {
  if (profileSaveTimer) {
    clearTimeout(profileSaveTimer);
    profileSaveTimer = null;
  }

  if (!activeProfileId) {
    return;
  }

  const current = assertState();
  await saveProfileSession(activeProfileId, {
    tabs: current.tabs,
    activeTabId: current.activeTabId,
    bookmarks: current.bookmarks,
    history: current.history,
    lastUrl: activeProfileLastUrl()
  });
}

function broadcastState() {
  const current = assertState();
  mainWindow?.webContents.send("browser:state", current);
  scheduleSave();
  scheduleProfileSessionSave();
}

function detachActiveView() {
  if (!mainWindow || !activeView) {
    return;
  }

  try {
    mainWindow.contentView.removeChildView(activeView);
  } catch {
    // Electron throws if the view has already been detached.
  } finally {
    activeView = null;
  }
}

function attachActiveView() {
  if (!mainWindow) {
    return;
  }

  detachActiveView();

  const tab = activeTab();
  if (!tab || isInternalUrl(tab.url) || contentBounds.width < 10 || contentBounds.height < 10) {
    return;
  }

  const view = ensureWebView(tab);
  mainWindow.contentView.addChildView(view);
  view.setBounds(contentBounds);
  activeView = view;
}

function ensureWebView(tab: BrowserTab) {
  const existing = webViews.get(tab.id);
  if (existing) {
    return existing;
  }

  const view = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      ...(activeProfilePartition ? { partition: activeProfilePartition } : {})
    }
  });

  view.setBackgroundColor("#05060a");
  view.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      view.webContents.loadURL(url).catch(console.error);
    }
    return { action: "deny" };
  });

  view.webContents.on("will-navigate", (event, url) => {
    if (!isSafeExternalUrl(url)) {
      event.preventDefault();
    }
  });

  view.webContents.on("did-start-loading", () => {
    patchTab(tab.id, { isLoading: true });
  });

  view.webContents.on("did-stop-loading", () => {
    updateTabFromWebContents(tab.id, view, true);
  });

  view.webContents.on("page-title-updated", (_event, title) => {
    patchTab(tab.id, { title: title || "Untitled" });
  });

  view.webContents.on("did-navigate", () => {
    updateTabFromWebContents(tab.id, view, true);
  });

  view.webContents.on("did-navigate-in-page", () => {
    updateTabFromWebContents(tab.id, view, true);
  });

  view.webContents.on("did-fail-load", (_event, _code, description, url, isMainFrame) => {
    if (!isMainFrame) {
      return;
    }
    patchTab(tab.id, {
      title: "Page failed to load",
      url,
      isLoading: false,
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
    console.warn(`Failed to load ${url}: ${description}`);
  });

  webViews.set(tab.id, view);

  if (isSafeExternalUrl(tab.url)) {
    view.webContents.loadURL(tab.url).catch(console.error);
  }

  return view;
}

function updateTabFromWebContents(
  tabId: string,
  view: WebContentsView,
  includeHistory = false
) {
  const url = view.webContents.getURL();
  const title = view.webContents.getTitle() || url || "Untitled";
  patchTab(
    tabId,
    {
      title,
      url,
      isLoading: view.webContents.isLoading(),
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    },
    false
  );

  const tab = assertState().tabs.find((candidate) => candidate.id === tabId);
  if (includeHistory && tab) {
    addHistory(tab);
  }
  broadcastState();
}

function destroyWebView(tabId: string) {
  const view = webViews.get(tabId);
  if (!view) {
    return;
  }

  if (activeView === view) {
    detachActiveView();
  }

  view.webContents.close();
  webViews.delete(tabId);
}

function destroyAllWebViews() {
  detachActiveView();
  for (const view of webViews.values()) {
    view.webContents.close();
  }
  webViews.clear();
}

function setActiveTab(tabId: string) {
  const current = assertState();
  if (!current.tabs.some((tab) => tab.id === tabId)) {
    return;
  }
  current.activeTabId = tabId;
  attachActiveView();
  broadcastState();
}

function applyProfileSession(profile: ControlProfile) {
  const current = assertState();
  destroyAllWebViews();
  activeProfileId = profile.id;
  activeProfilePartition = profile.session.partition;

  const tabs = profile.session.tabs.length > 0 ? profile.session.tabs : [createBlankTab()];
  current.tabs = tabs.map((tab) => ({
    ...tab,
    isLoading: false,
    canGoBack: false,
    canGoForward: false
  }));
  current.activeTabId = current.tabs.some((tab) => tab.id === profile.session.activeTabId)
    ? profile.session.activeTabId
    : current.tabs[0]?.id ?? "";
  current.bookmarks = profile.session.bookmarks;
  current.history = profile.session.history;

  for (const tab of current.tabs) {
    if (!isInternalUrl(tab.url)) {
      ensureWebView(tab);
    }
  }

  attachActiveView();
  broadcastState();
}

function navigate(payload: NavigatePayload) {
  const current = assertState();
  const targetTabId = payload.tabId ?? current.activeTabId;
  const targetUrl = normalizeAddressInput(payload.input);
  const tab = current.tabs.find((candidate) => candidate.id === targetTabId);
  if (!tab) {
    return;
  }

  if (isInternalUrl(targetUrl)) {
    destroyWebView(tab.id);
    patchTab(tab.id, {
      title: "New Tab",
      url: targetUrl,
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    });
    attachActiveView();
    return;
  }

  tab.title = "Loading...";
  tab.url = targetUrl;
  tab.isLoading = true;
  tab.canGoBack = false;
  tab.canGoForward = false;

  const view = ensureWebView(tab);
  if (view.webContents.getURL() !== targetUrl) {
    view.webContents.loadURL(targetUrl).catch(console.error);
  }
  attachActiveView();
  broadcastState();
}

function createTab(input?: string) {
  const current = assertState();
  const url = input ? normalizeAddressInput(input) : "browser://newtab";
  const tab = createBlankTab(url);
  current.tabs = [...current.tabs, tab];
  current.activeTabId = tab.id;

  if (!isInternalUrl(url)) {
    ensureWebView(tab);
  }

  attachActiveView();
  broadcastState();
  return tab.id;
}

function closeTab(tabId: string) {
  const current = assertState();
  const tabIndex = current.tabs.findIndex((tab) => tab.id === tabId);
  if (tabIndex < 0) {
    return;
  }

  destroyWebView(tabId);

  const remaining = current.tabs.filter((tab) => tab.id !== tabId);
  if (remaining.length === 0) {
    const tab = createBlankTab();
    current.tabs = [tab];
    current.activeTabId = tab.id;
  } else {
    current.tabs = remaining;
    if (current.activeTabId === tabId) {
      const nextIndex = Math.max(0, tabIndex - 1);
      const nextTab = remaining[nextIndex] ?? remaining[0];
      if (nextTab) {
        current.activeTabId = nextTab.id;
      }
    }
  }

  attachActiveView();
  broadcastState();
}

async function createWindow() {
  initializeStartupLogging();
  state = await loadStore();
  if (state.tabs.length === 0) {
    const tab = createBlankTab();
    state.tabs = [tab];
    state.activeTabId = tab.id;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#05060a",
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  for (const tab of state.tabs) {
    if (!isInternalUrl(tab.url)) {
      ensureWebView(tab);
    }
  }

  if (isDevelopment && process.env.VITE_DEV_SERVER_URL) {
    logStartup("Loading development renderer", {
      url: process.env.VITE_DEV_SERVER_URL
    });
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    logStartup("Loading packaged renderer", {
      rendererIndexPath,
      exists: existsSync(rendererIndexPath)
    });

    try {
      await mainWindow.loadFile(rendererIndexPath);
      logStartup("Packaged renderer loaded");
    } catch (error) {
      logStartup("Packaged renderer failed to load", {
        rendererIndexPath,
        error: error instanceof Error ? error.message : String(error)
      });
      await mainWindow.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(startupErrorHtml(error))}`
      );
    }
  }

  attachActiveView();
  broadcastState();
}

function registerIpcHandlers() {
  ipcMain.handle("browser:get-state", () => assertState());
  ipcMain.handle("profiles:list", () => loadProfiles());
  ipcMain.handle("profiles:store-info", () => getProfileStoreInfo());
  ipcMain.handle("workspaces:list", () => loadWorkspaces());
  ipcMain.handle("workspaces:create", (_event, rawLabel: unknown) => createWorkspace(rawLabel));
  ipcMain.handle("workspaces:update", (_event, rawUpdate: unknown) => {
    if (!isRecord(rawUpdate)) {
      throw new Error("Invalid workspace update.");
    }
    return updateWorkspace({
      id: sanitizeString(rawUpdate.id, 128) ?? "",
      label: sanitizeString(rawUpdate.label, 120) ?? ""
    });
  });
  ipcMain.handle("workspaces:delete", (_event, rawRequest: unknown) => {
    if (!isRecord(rawRequest)) {
      throw new Error("Invalid workspace delete request.");
    }
    return deleteWorkspace({
      id: sanitizeString(rawRequest.id, 128) ?? "",
      moveProfilesToArchive: rawRequest.moveProfilesToArchive === true
    });
  });
  ipcMain.handle("profiles:start-session", async (_event, rawId: unknown) => {
    const id = sanitizeString(rawId, 128);
    if (!id) {
      throw new Error("Invalid profile id.");
    }

    await flushProfileSessionSave();
    const profile = await startProfileSession(id);
    if (!profile) {
      throw new Error("Profile not found.");
    }
    applyProfileSession(profile);
    return {
      profile,
      state: assertState()
    };
  });
  ipcMain.handle("profiles:end-session", async () => {
    await flushProfileSessionSave();
    const endingProfileId = activeProfileId;
    if (endingProfileId) {
      await stopProfileSession(endingProfileId);
    }
    activeProfileId = null;
    activeProfilePartition = null;
    detachActiveView();
    return loadProfiles();
  });
  ipcMain.handle("profiles:create", (_event, rawDraft: unknown) => {
    const draft = sanitizeProfileDraft(rawDraft);
    if (!draft) {
      throw new Error("Invalid profile payload.");
    }
    return createProfile(draft);
  });
  ipcMain.handle("profiles:update", (_event, rawUpdate: unknown) => {
    const update = sanitizeProfileUpdate(rawUpdate);
    if (!update) {
      throw new Error("Invalid profile update.");
    }
    return updateProfile(update);
  });
  ipcMain.handle("profiles:delete", async (_event, rawId: unknown) => {
    const id = sanitizeString(rawId, 128);
    if (!id) {
      throw new Error("Invalid profile id.");
    }
    const profiles = await loadProfiles();
    const profile = profiles.find((candidate) => candidate.id === id);
    const nextProfiles = await deleteProfile(id);
    if (profile) {
      session.fromPartition(profile.session.partition).clearStorageData().catch((error) => {
        console.error("Failed to clear deleted profile session data", error);
      });
    }
    if (activeProfileId === id) {
      activeProfileId = null;
      activeProfilePartition = null;
      destroyAllWebViews();
    }
    return nextProfiles;
  });
  ipcMain.handle("profiles:resetDemoData", () => resetDemoProfiles());
  ipcMain.handle("browser:set-bounds", (_event, rawBounds: unknown) => {
    const bounds = sanitizeBounds(rawBounds);
    if (!bounds) {
      return;
    }

    contentBounds = bounds;
    if (activeView && bounds.width >= 10 && bounds.height >= 10) {
      activeView.setBounds(bounds);
    } else {
      attachActiveView();
    }
  });
  ipcMain.handle("browser:navigate", (_event, rawPayload: unknown) => {
    const payload = sanitizeNavigatePayload(rawPayload);
    if (!payload) {
      return;
    }

    navigate(payload);
  });
  ipcMain.handle("browser:create-tab", (_event, rawInput?: unknown) =>
    createTab(sanitizeString(rawInput) ?? undefined)
  );
  ipcMain.handle("browser:close-tab", (_event, rawTabId: unknown) => {
    const tabId = sanitizeString(rawTabId, 128);
    if (!tabId) {
      return;
    }

    closeTab(tabId);
  });
  ipcMain.handle("browser:switch-tab", (_event, rawTabId: unknown) => {
    const tabId = sanitizeString(rawTabId, 128);
    if (!tabId) {
      return;
    }

    setActiveTab(tabId);
  });
  ipcMain.handle("browser:go-back", () => {
    activeView?.webContents.goBack();
  });
  ipcMain.handle("browser:go-forward", () => {
    activeView?.webContents.goForward();
  });
  ipcMain.handle("browser:reload", () => {
    const tab = activeTab();
    if (tab && isInternalUrl(tab.url)) {
      broadcastState();
      return;
    }
    activeView?.webContents.reload();
  });
  ipcMain.handle("browser:toggle-bookmark", (_event, rawTabId?: unknown) => {
    const current = assertState();
    const tabId = sanitizeString(rawTabId, 128) ?? undefined;
    const tab = tabId
      ? current.tabs.find((candidate) => candidate.id === tabId)
      : activeTab();
    if (!tab || !isSafeExternalUrl(tab.url)) {
      return;
    }

    const existing = current.bookmarks.find((bookmark) => bookmark.url === tab.url);
    current.bookmarks = existing
      ? current.bookmarks.filter((bookmark) => bookmark.id !== existing.id)
      : [
          {
            id: randomUUID(),
            title: tab.title || tab.url,
            url: tab.url,
            createdAt: new Date().toISOString()
          },
          ...current.bookmarks
        ];
    broadcastState();
  });
  ipcMain.handle("browser:update-settings", (_event, rawPatch: unknown) => {
    const current = assertState();
    current.settings = {
      ...current.settings,
      ...sanitizeSettingsPatch(rawPatch)
    };
    broadcastState();
  });
  ipcMain.handle("window:minimize", () => mainWindow?.minimize());
  ipcMain.handle("window:maximize", () => {
    if (!mainWindow) {
      return;
    }
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle("window:close", () => mainWindow?.close());
}

registerIpcHandlers();

app.whenReady().then(createWindow).catch((error) => {
  console.error(error);
  app.quit();
});

app.on("before-quit", () => {
  if (profileSaveTimer) {
    clearTimeout(profileSaveTimer);
  }
  if (!activeProfileId || !state) {
    return;
  }
  saveProfileSession(activeProfileId, {
    tabs: state.tabs,
    activeTabId: state.activeTabId,
    bookmarks: state.bookmarks,
    history: state.history,
    lastUrl: activeProfileLastUrl()
  }).catch(console.error);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch(console.error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
