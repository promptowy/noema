import { app } from "electron";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ControlProfile, ProfileDraft, ProfileStatus, ProfileUpdate } from "./types";

const PROFILE_STORE_VERSION = 1;
const PROFILE_STORE_FILE = "noema-profiles.json";
const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 120;
const MAX_TAGS = 12;

type PersistedProfileStore = {
  version: 1;
  profiles: ControlProfile[];
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
    runtime: "1h 24m"
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
    runtime: "42m"
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
    runtime: "2h 08m"
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
    runtime: "58m"
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
    runtime: "19m"
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
    runtime: "1h 01m"
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
    runtime: "3h 12m"
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
    runtime: "11m"
  }
];

function profileStorePath() {
  return path.join(app.getPath("userData"), PROFILE_STORE_FILE);
}

function defaultProfileStore(): PersistedProfileStore {
  return {
    version: PROFILE_STORE_VERSION,
    profiles: demoProfiles
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
  const target = profileStorePath();

  try {
    const raw = await readFile(target, "utf8");
    const parsed = JSON.parse(raw) as Partial<PersistedProfileStore>;
    const normalized = normalizeProfileStore(parsed);
    if (!Array.isArray(parsed.profiles)) {
      await saveProfileStore(normalized);
    }
    return normalized.profiles;
  } catch (error) {
    if (isMissingFileError(error)) {
      const fallback = defaultProfileStore();
      await saveProfileStore(fallback);
      return fallback.profiles;
    }

    try {
      const raw = await readFile(target, "utf8");
      await backupMalformedStore(raw);
    } catch {
      // If backup also fails, continue with a fresh default store.
    }

    const fallback = defaultProfileStore();
    await saveProfileStore(fallback);
    return fallback.profiles;
  }
}

export async function createProfile(draft: ProfileDraft): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
  const profile: ControlProfile = {
    id: randomUUID(),
    name: draft.name,
    workspace: draft.workspace,
    status: draft.status,
    proxy: "None",
    tags: draft.tags,
    notes: draft.notes,
    lastActivity: "Just now",
    created: formatCreatedDate(),
    runtime: "0m"
  };
  const nextProfiles = [profile, ...profiles];
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles });
  return nextProfiles;
}

export async function updateProfile(update: ProfileUpdate): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
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
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles });
  return nextProfiles;
}

export async function deleteProfile(id: string): Promise<ControlProfile[]> {
  const profiles = await loadProfiles();
  const nextProfiles = profiles.filter((profile) => profile.id !== id);
  await saveProfileStore({ version: PROFILE_STORE_VERSION, profiles: nextProfiles });
  return nextProfiles;
}

export async function resetDemoProfiles(): Promise<ControlProfile[]> {
  const fallback = defaultProfileStore();
  await saveProfileStore(fallback);
  return fallback.profiles;
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
    ? store.profiles.filter(isControlProfile)
    : defaultProfileStore().profiles;
  return {
    version: PROFILE_STORE_VERSION,
    profiles
  };
}

function isControlProfile(value: unknown): value is ControlProfile {
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
