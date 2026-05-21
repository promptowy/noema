import { app } from "electron";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  BrowserTab,
  ControlProfile,
  ProfileDraft,
  ProfileSessionState,
  ProfileStatus,
  ProfileUpdate,
  Workspace
} from "./types";

const PROFILE_STORE_VERSION = 1;
const PROFILE_STORE_FILE = "noema-profiles.json";
const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 120;
const MAX_TAGS = 12;
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

type PersistedProfileStore = {
  version: 1;
  profiles: ControlProfile[];
  workspaces: Workspace[];
};

export type ProfileStoreInfo = {
  path: string;
};

const demoProfiles: ControlProfile[] = [
  {
    id: "research-alpha",
    name: "Research Alpha",
    workspace: "Research",
    status: "Ready",
    proxy: "Workspace",
    tags: ["research", "priority"],
    notes: "Compare sources before synthesis.",
    lastActivity: "12 min ago",
    created: "May 18",
    runtime: "1h 24m",
    session: createProfileSession("research-alpha", 84 * MINUTE_MS)
  },
  {
    id: "market-desk",
    name: "Market Desk",
    workspace: "Market Watch",
    status: "Running",
    proxy: "Residential",
    tags: ["market", "daily"],
    notes: "Track product and pricing shifts.",
    lastActivity: "Active now",
    created: "May 17",
    runtime: "42m",
    session: createProfileSession("market-desk", 42 * MINUTE_MS)
  },
  {
    id: "content-studio",
    name: "Content Studio",
    workspace: "Content",
    status: "Ready",
    proxy: "None",
    tags: ["drafts", "editorial"],
    notes: "Gather references for launch copy.",
    lastActivity: "1h ago",
    created: "May 16",
    runtime: "2h 08m",
    session: createProfileSession("content-studio", 128 * MINUTE_MS)
  },
  {
    id: "client-review",
    name: "Client Review",
    workspace: "Clients",
    status: "Review",
    proxy: "Workspace",
    tags: ["client", "notes"],
    notes: "Keep findings concise and cited.",
    lastActivity: "3h ago",
    created: "May 15",
    runtime: "58m",
    session: createProfileSession("client-review", 58 * MINUTE_MS)
  },
  {
    id: "launch-notes",
    name: "Launch Notes",
    workspace: "Content",
    status: "Paused",
    proxy: "Pending",
    tags: ["launch"],
    notes: "Return after messaging review.",
    lastActivity: "Yesterday",
    created: "May 13",
    runtime: "19m",
    session: createProfileSession("launch-notes", 19 * MINUTE_MS)
  },
  {
    id: "trend-watch",
    name: "Trend Watch",
    workspace: "Social",
    status: "Ready",
    proxy: "None",
    tags: ["signals", "weekly"],
    notes: "Look for durable patterns.",
    lastActivity: "Yesterday",
    created: "May 12",
    runtime: "1h 01m",
    session: createProfileSession("trend-watch", 61 * MINUTE_MS)
  },
  {
    id: "design-lab",
    name: "Design Lab",
    workspace: "Research",
    status: "Review",
    proxy: "Workspace",
    tags: ["design", "inspo"],
    notes: "Save only high-signal references.",
    lastActivity: "May 19",
    created: "May 10",
    runtime: "3h 12m",
    session: createProfileSession("design-lab", 192 * MINUTE_MS)
  },
  {
    id: "archive-session",
    name: "Archive Session",
    workspace: "Archive",
    status: "Paused",
    proxy: "None",
    tags: ["archive"],
    notes: "Dormant context, kept locally.",
    lastActivity: "May 14",
    created: "May 08",
    runtime: "11m",
    session: createProfileSession("archive-session", 11 * MINUTE_MS)
  }
];

const demoWorkspaces: Workspace[] = [
  { id: "workspace-research", label: "Research", tone: "gold", createdAt: "May 01" },
  { id: "workspace-clients", label: "Clients", tone: "sand", createdAt: "May 01" },
  { id: "workspace-content", label: "Content", tone: "amber", createdAt: "May 01" },
  { id: "workspace-market-watch", label: "Market Watch", tone: "olive", createdAt: "May 01" },
  { id: "workspace-social", label: "Social", tone: "clay", createdAt: "May 01" },
  { id: "workspace-archive", label: "Archive", tone: "slate", createdAt: "May 01" }
];

function profileStorePath() {
  return path.join(app.getPath("userData"), PROFILE_STORE_FILE);
}

function defaultProfileStore(): PersistedProfileStore {
  return {
    version: PROFILE_STORE_VERSION,
    profiles: demoProfiles,
    workspaces: demoWorkspaces
  };
}

async function saveProfileStore(store: PersistedProfileStore) {
  const target = profileStorePath();
  await mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.tmp`;
  await writeFile(temp, JSON.stringify(normalizeProfileStore(store), null, 2), "utf8");
  await rename(temp, target);
}

async function backupMalformedStore(raw: string) {
  const target = profileStorePath();
  await mkdir(path.dirname(target), { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `${target}.malformed-${timestamp}.bak`;
  await writeFile(backup, raw, "utf8");
}

export async function loadProfiles(): Promise<ControlProfile[]> {
  return (await loadProfileStore()).profiles;
}

export async function loadWorkspaces(): Promise<Workspace[]> {
  return (await loadProfileStore()).workspaces;
}

export function getProfileStoreInfo(): ProfileStoreInfo {
  return {
    path: profileStorePath()
  };
}

async function loadProfileStore(): Promise<PersistedProfileStore> {
  const target = profileStorePath();

  try {
    const raw = await readFile(target, "utf8");
    const parsed = JSON.parse(raw) as Partial<PersistedProfileStore>;
    const normalized = normalizeProfileStore(parsed);
    if (!Array.isArray(parsed.profiles) || !Array.isArray(parsed.workspaces)) {
      await saveProfileStore(normalized);
    }
    return normalized;
  } catch (error) {
    if (isMissingFileError(error)) {
      const fallback = defaultProfileStore();
      await saveProfileStore(fallback);
      return fallback;
    }

    try {
      const raw = await readFile(target, "utf8");
      await backupMalformedStore(raw);
    } catch {
      // If backup also fails, continue with a fresh default store.
    }

    const fallback = defaultProfileStore();
    await saveProfileStore(fallback);
    return fallback;
  }
}

export async function createProfile(draft: ProfileDraft): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  const id = randomUUID();
  const profile: ControlProfile = {
    id,
    name: draft.name,
    workspace: draft.workspace,
    status: draft.status,
    proxy: "None",
    tags: draft.tags,
    notes: draft.notes,
    lastActivity: "Just now",
    created: formatCreatedDate(),
    runtime: "0m",
    session: createProfileSession(id)
  };
  const nextProfiles = [profile, ...profiles];
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  return nextProfiles;
}

export async function updateProfile(update: ProfileUpdate): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  const nextProfiles = profiles.map((profile) =>
    profile.id === update.id
      ? {
          ...profile,
          ...update,
          id: profile.id,
          lastActivity: "Just now"
        }
      : profile
  );
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  return nextProfiles;
}

export async function deleteProfile(id: string): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  const nextProfiles = profiles.filter((profile) => profile.id !== id);
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  return nextProfiles;
}

export async function startProfileSession(id: string): Promise<ControlProfile | null> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  let startedProfile: ControlProfile | null = null;
  const now = new Date().toISOString();
  const nextProfiles = profiles.map((profile) => {
    if (profile.id !== id) {
      return profile;
    }

    const session = normalizeProfileSession(profile.id, profile.session, profile.runtime);
    const tabs = ensureTabs(session.tabs);
    const nextProfile: ControlProfile = {
      ...profile,
      status: "Running",
      lastActivity: "Active now",
      runtime: formatRuntime(session.runtimeMs),
      session: {
        ...session,
        tabs,
        activeTabId: tabs.some((tab) => tab.id === session.activeTabId)
          ? session.activeTabId
          : tabs[0]?.id ?? "",
        lastUrl: lastUrlFromTabs(tabs, session.activeTabId),
        lastStartedAt: now
      }
    };
    startedProfile = nextProfile;
    return nextProfile;
  });

  if (startedProfile) {
    await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  }

  return startedProfile;
}

export async function stopProfileSession(id: string): Promise<ControlProfile | null> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  let stoppedProfile: ControlProfile | null = null;
  const nextProfiles = profiles.map((profile) => {
    if (profile.id !== id) {
      return profile;
    }

    const session = withElapsedRuntime(profile.session);
    const nextProfile: ControlProfile = {
      ...profile,
      status: "Paused",
      lastActivity: "Just now",
      runtime: formatRuntime(session.runtimeMs),
      session: {
        ...session,
        lastStartedAt: null
      }
    };
    stoppedProfile = nextProfile;
    return nextProfile;
  });

  if (stoppedProfile) {
    await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  }

  return stoppedProfile;
}

export async function saveProfileSession(
  id: string,
  sessionPatch: Pick<ProfileSessionState, "activeTabId" | "lastUrl" | "tabs">
): Promise<ControlProfile | null> {
  const profiles = await loadProfiles();
  const workspaces = await loadWorkspaces();
  let savedProfile: ControlProfile | null = null;
  const nextProfiles = profiles.map((profile) => {
    if (profile.id !== id) {
      return profile;
    }

    const session = normalizeProfileSession(profile.id, profile.session, profile.runtime);
    const tabs = ensureTabs(sessionPatch.tabs);
    const activeTabId = tabs.some((tab) => tab.id === sessionPatch.activeTabId)
      ? sessionPatch.activeTabId
      : tabs[0]?.id ?? "";
    const nextProfile: ControlProfile = {
      ...profile,
      lastActivity: profile.status === "Running" ? "Active now" : profile.lastActivity,
      runtime: formatRuntime(withElapsedRuntime(session).runtimeMs),
      session: {
        ...session,
        tabs,
        activeTabId,
        lastUrl: sessionPatch.lastUrl || lastUrlFromTabs(tabs, activeTabId)
      }
    };
    savedProfile = nextProfile;
    return nextProfile;
  });

  if (savedProfile) {
    await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles, workspaces });
  }

  return savedProfile;
}

export async function resetDemoProfiles(): Promise<ControlProfile[]> {
  const fallback = defaultProfileStore();
  await saveProfileStore(fallback);
  return fallback.profiles;
}

export async function createWorkspace(rawLabel: unknown): Promise<Workspace[]> {
  const label = sanitizeString(rawLabel, MAX_NAME_LENGTH);
  if (!label) {
    throw new Error("Invalid workspace name.");
  }

  const store = await loadProfileStore();
  const exists = store.workspaces.some(
    (workspace) => workspace.label.toLowerCase() === label.toLowerCase()
  );
  if (exists) {
    throw new Error("Workspace already exists.");
  }

  const workspace: Workspace = {
    id: randomUUID(),
    label,
    tone: workspaceTone(store.workspaces.length),
    createdAt: formatCreatedDate()
  };
  const nextStore = {
    ...store,
    workspaces: [...store.workspaces, workspace]
  };
  await saveProfileStore(nextStore);
  return nextStore.workspaces;
}

export function sanitizeProfileDraft(value: unknown): ProfileDraft | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = sanitizeString(value.name, MAX_NAME_LENGTH);
  const workspace = sanitizeString(value.workspace, MAX_NAME_LENGTH);
  const notes = sanitizeString(value.notes, MAX_TEXT_LENGTH) ?? "";
  const tags = sanitizeTags(value.tags);
  if (!name || !workspace || !isProfileStatus(value.status) || !tags) {
    return null;
  }

  return {
    name,
    workspace,
    status: value.status,
    tags,
    notes
  };
}

export function sanitizeProfileUpdate(value: unknown): ProfileUpdate | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 128);
  if (!id) {
    return null;
  }

  const patch: ProfileUpdate = { id };
  if ("name" in value) {
    const name = sanitizeString(value.name, MAX_NAME_LENGTH);
    if (!name) {
      return null;
    }
    patch.name = name;
  }
  if ("workspace" in value) {
    const workspace = sanitizeString(value.workspace, MAX_NAME_LENGTH);
    if (!workspace) {
      return null;
    }
    patch.workspace = workspace;
  }
  if ("status" in value) {
    if (!isProfileStatus(value.status)) {
      return null;
    }
    patch.status = value.status;
  }
  if ("tags" in value) {
    const tags = sanitizeTags(value.tags);
    if (!tags) {
      return null;
    }
    patch.tags = tags;
  }
  if ("notes" in value) {
    const notes = sanitizeString(value.notes, MAX_TEXT_LENGTH);
    if (notes === null) {
      return null;
    }
    patch.notes = notes;
  }

  return patch;
}

function normalizeProfileStore(store: Partial<PersistedProfileStore>): PersistedProfileStore {
  const profiles = Array.isArray(store.profiles)
    ? store.profiles.filter(isControlProfileLike).map(normalizeControlProfile)
    : defaultProfileStore().profiles;
  const workspaces = Array.isArray(store.workspaces)
    ? mergeWorkspaceDefaults(store.workspaces.filter(isWorkspaceLike).map(normalizeWorkspace), profiles)
    : mergeWorkspaceDefaults(defaultProfileStore().workspaces, profiles);
  return {
    version: PROFILE_STORE_VERSION,
    profiles,
    workspaces
  };
}

function mergeWorkspaceDefaults(workspaces: Workspace[], profiles: ControlProfile[]) {
  const byLabel = new Map<string, Workspace>();
  for (const workspace of [...demoWorkspaces, ...workspaces]) {
    byLabel.set(workspace.label.toLowerCase(), workspace);
  }
  for (const profile of profiles) {
    if (!byLabel.has(profile.workspace.toLowerCase())) {
      byLabel.set(profile.workspace.toLowerCase(), {
        id: randomUUID(),
        label: profile.workspace,
        tone: workspaceTone(byLabel.size),
        createdAt: formatCreatedDate()
      });
    }
  }
  return Array.from(byLabel.values());
}

function isWorkspaceLike(value: unknown): value is Workspace {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.tone === "string" &&
    typeof value.createdAt === "string"
  );
}

function normalizeWorkspace(workspace: Workspace): Workspace {
  return {
    id: workspace.id,
    label: workspace.label,
    tone: workspace.tone,
    createdAt: workspace.createdAt
  };
}

function isControlProfileLike(value: unknown): value is Omit<ControlProfile, "session"> & {
  session?: unknown;
} {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.workspace === "string" &&
    isProfileStatus(value.status) &&
    isProfileProxy(value.proxy) &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === "string") &&
    typeof value.notes === "string" &&
    typeof value.lastActivity === "string" &&
    typeof value.created === "string" &&
    typeof value.runtime === "string"
  );
}

function normalizeControlProfile(
  profile: Omit<ControlProfile, "session"> & { session?: unknown }
): ControlProfile {
  return {
    ...profile,
    runtime: formatRuntime(parseRuntime(profile.runtime)),
    session: normalizeProfileSession(profile.id, profile.session, profile.runtime)
  };
}

function normalizeProfileSession(
  profileId: string,
  value: unknown,
  runtime = "0m"
): ProfileSessionState {
  if (!isRecord(value)) {
    return createProfileSession(profileId, parseRuntime(runtime));
  }

  const tabs = Array.isArray(value.tabs) ? value.tabs.filter(isBrowserTab) : [newTab()];
  const activeTabId =
    typeof value.activeTabId === "string" && tabs.some((tab) => tab.id === value.activeTabId)
      ? value.activeTabId
      : tabs[0]?.id ?? "";
  const runtimeMs =
    typeof value.runtimeMs === "number" && Number.isFinite(value.runtimeMs)
      ? Math.max(0, value.runtimeMs)
      : parseRuntime(runtime);

  return {
    partition:
      typeof value.partition === "string" && value.partition.startsWith("persist:")
        ? value.partition
        : profilePartition(profileId),
    tabs: ensureTabs(tabs),
    activeTabId,
    lastUrl:
      typeof value.lastUrl === "string"
        ? value.lastUrl
        : lastUrlFromTabs(tabs, activeTabId),
    runtimeMs,
    lastStartedAt: typeof value.lastStartedAt === "string" ? value.lastStartedAt : null
  };
}

function createProfileSession(profileId: string, runtimeMs = 0): ProfileSessionState {
  const tab = newTab();
  return {
    partition: profilePartition(profileId),
    tabs: [tab],
    activeTabId: tab.id,
    lastUrl: tab.url,
    runtimeMs,
    lastStartedAt: null
  };
}

function profilePartition(profileId: string) {
  const safeId = profileId.replace(/[^a-z0-9_-]/gi, "-");
  return `persist:noema-profile-${safeId}`;
}

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

function ensureTabs(tabs: BrowserTab[]) {
  return tabs.length > 0 ? tabs : [newTab()];
}

function isBrowserTab(value: unknown): value is BrowserTab {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.url === "string" &&
    typeof value.isLoading === "boolean" &&
    typeof value.canGoBack === "boolean" &&
    typeof value.canGoForward === "boolean"
  );
}

function lastUrlFromTabs(tabs: BrowserTab[], activeTabId: string) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  return activeTab?.url ?? "browser://newtab";
}

function withElapsedRuntime(session: ProfileSessionState): ProfileSessionState {
  if (!session.lastStartedAt) {
    return session;
  }

  const startedAt = Date.parse(session.lastStartedAt);
  if (!Number.isFinite(startedAt)) {
    return {
      ...session,
      lastStartedAt: null
    };
  }

  return {
    ...session,
    runtimeMs: session.runtimeMs + Math.max(0, Date.now() - startedAt),
    lastStartedAt: new Date().toISOString()
  };
}

function parseRuntime(runtime: string) {
  const hours = /(\d+)\s*h/.exec(runtime)?.[1];
  const minutes = /(\d+)\s*m/.exec(runtime)?.[1];
  return (hours ? Number(hours) * HOUR_MS : 0) + (minutes ? Number(minutes) * MINUTE_MS : 0);
}

function formatRuntime(runtimeMs: number) {
  const totalMinutes = Math.max(0, Math.floor(runtimeMs / MINUTE_MS));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function isProfileStatus(value: unknown): value is ProfileStatus {
  return value === "Ready" || value === "Review" || value === "Paused" || value === "Running";
}

function isProfileProxy(value: unknown): value is ControlProfile["proxy"] {
  return value === "None" || value === "Residential" || value === "Workspace" || value === "Pending";
}

function sanitizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const tags = value
    .map((tag) => sanitizeString(tag, 48))
    .filter((tag): tag is string => Boolean(tag));
  return Array.from(new Set(tags)).slice(0, MAX_TAGS);
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}

function formatCreatedDate() {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date());
}

function workspaceTone(index: number) {
  const tones = ["gold", "sand", "amber", "olive", "clay", "slate", "mint", "rose"];
  return tones[index % tones.length] ?? "gold";
}
