import {
  ArrowUpDown,
  BarChart3,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Copy,
  Download,
  FileText,
  Filter,
  Folder,
  FolderPlus,
  Globe2,
  GripVertical,
  Languages,
  MoveRight,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Workflow,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button, IconButton } from "@browser/ui";
import type { ControlProfile, ProfileDraft, ProfileStatus } from "../../electron/types";

type ProfileFormState = {
  name: string;
  workspace: string;
  status: ProfileStatus;
  tags: string;
  notes: string;
};

const ALL_WORKSPACES = "All profiles";
const statusFilters: Array<"All" | ProfileStatus> = [
  "All",
  "Ready",
  "Running",
  "Review",
  "Paused"
];

const navigation = [
  { label: "Profiles", icon: <Globe2 size={17} /> },
  { label: "Workspaces", icon: <Briefcase size={17} /> },
  { label: "Sessions", icon: <Clock3 size={17} /> },
  { label: "Automation", icon: <Workflow size={17} /> },
  { label: "Insights", icon: <BarChart3 size={17} /> },
  { label: "Settings", icon: <Settings size={17} /> }
];

const workspaces = [
  { label: "Research", tone: "bg-[#e7c989]" },
  { label: "Clients", tone: "bg-[#d7b27c]" },
  { label: "Content", tone: "bg-[#b98f5e]" },
  { label: "Market Watch", tone: "bg-[#8e7553]" },
  { label: "Social", tone: "bg-[#a06458]" },
  { label: "Archive", tone: "bg-[#6f6659]" }
];

const segments = ["Profiles", "Proxies", "Tags", "Statuses", "Notes", "Activity"];

type ControlCenterProps = {
  onStartProfile: (profile: ControlProfile) => void;
};

export function ControlCenter({ onStartProfile }: ControlCenterProps) {
  const [profiles, setProfiles] = useState<ControlProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState(ALL_WORKSPACES);
  const [activeStatus, setActiveStatus] = useState<"All" | ProfileStatus>("All");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ControlProfile | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm());

  useEffect(() => {
    let disposed = false;
    window.browserAPI.profiles
      .list()
      .then((nextProfiles) => {
        if (!disposed) {
          setProfiles(nextProfiles);
          setProfileError(null);
        }
      })
      .catch(() => {
        if (!disposed) {
          setProfileError("Profiles could not be loaded.");
        }
      })
      .finally(() => {
        if (!disposed) {
          setIsLoadingProfiles(false);
        }
      });

    return () => {
      disposed = true;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles
      .filter((profile) =>
        activeWorkspace === ALL_WORKSPACES ? true : profile.workspace === activeWorkspace
      )
      .filter((profile) => (activeStatus === "All" ? true : profile.status === activeStatus))
      .filter((profile) => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = [
          profile.name,
          profile.workspace,
          profile.notes,
          profile.status,
          ...profile.tags
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [activeStatus, activeWorkspace, profiles, query]);

  const editingProfile = useMemo(
    () => profiles.find((profile) => profile.id === editingProfileId) ?? null,
    [editingProfileId, profiles]
  );

  function openCreateModal(workspace = activeWorkspace) {
    setEditingProfileId(null);
    setForm(emptyProfileForm(workspace === ALL_WORKSPACES ? "Research" : workspace));
    setModalMode("create");
  }

  function openEditModal(profile: ControlProfile) {
    setEditingProfileId(profile.id);
    setForm({
      name: profile.name,
      workspace: profile.workspace,
      status: profile.status,
      tags: profile.tags.join(", "),
      notes: profile.notes
    });
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingProfileId(null);
    setForm(emptyProfileForm());
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      return;
    }

    const nextProfileFields: ProfileDraft = {
      name,
      workspace: form.workspace,
      status: form.status,
      tags: parseTags(form.tags),
      notes: form.notes.trim()
    };

    try {
      const nextProfiles =
        modalMode === "edit" && editingProfile
          ? await window.browserAPI.profiles.update({
              id: editingProfile.id,
              ...nextProfileFields
            })
          : await window.browserAPI.profiles.create(nextProfileFields);
      setProfiles(nextProfiles);
      setProfileError(null);
      closeModal();
    } catch {
      setProfileError("Profile changes could not be saved.");
    }
  }

  async function confirmDeleteProfile() {
    if (!deleteTarget) {
      return;
    }

    try {
      const nextProfiles = await window.browserAPI.profiles.delete(deleteTarget.id);
      setProfiles(nextProfiles);
      setProfileError(null);
      setDeleteTarget(null);
    } catch {
      setProfileError("Profile could not be deleted.");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_28%_-14%,rgba(231,201,137,0.12),transparent_34%),linear-gradient(135deg,#050403_0%,#0b0907_46%,#050504_100%)] text-[#f4ecdc]">
      <PrimarySidebar />
      <WorkspaceSidebar
        activeWorkspace={activeWorkspace}
        onCreateProfile={openCreateModal}
        onWorkspaceChange={setActiveWorkspace}
      />

      <main className="flex min-w-0 flex-1 flex-col bg-[#080706]/[0.55]">
        <ControlTopBar
          query={query}
          onCreateProfile={() => openCreateModal()}
          onQueryChange={setQuery}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-4">
          <section className="flex min-h-full flex-col overflow-hidden rounded-[22px] border border-[#e7c989]/[0.10] bg-[#0f0c08]/[0.72] shadow-[0_28px_100px_rgba(0,0,0,0.38)]">
            <div className="border-b border-[#e7c989]/[0.10] px-4 pt-3.5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7c989]">
                    Control Center
                  </div>
                  <h1 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-[#f4ecdc]">
                    Profiles
                  </h1>
                  <p className="mt-0.5 text-sm text-[#f4ecdc]/[0.48]">
                    Manage focused browser contexts before opening a session.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#f4ecdc]/[0.44]">
                  <span className="h-2 w-2 rounded-full bg-[#e7c989]" />
                  {isLoadingProfiles
                    ? "Loading profiles"
                    : `${filteredProfiles.length} of ${profiles.length} profiles`}
                  <span className="h-1 w-1 rounded-full bg-[#f4ecdc]/[0.24]" />
                  Main-process store
                </div>
              </div>

              {profileError ? (
                <div className="mt-3 rounded-xl border border-[#6b332b]/[0.26] bg-[#6b332b]/[0.14] px-3 py-2 text-xs text-[#ffe8df]/[0.82]">
                  {profileError}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pb-3">
                <div className="flex gap-1.5 overflow-x-auto">
                  {segments.map((segment) => (
                    <button
                      key={segment}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
                        segment === "Profiles"
                          ? "border-[#e7c989]/[0.28] bg-[#e7c989]/[0.12] text-[#f4ecdc]"
                          : "border-[#e7c989]/[0.10] text-[#f4ecdc]/[0.54] hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
                      }`}
                      type="button"
                    >
                      {segment}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5 overflow-x-auto">
                  {statusFilters.map((status) => (
                    <button
                      key={status}
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs transition ${
                        status === activeStatus
                          ? "border-[#e7c989]/[0.28] bg-[#e7c989]/[0.12] text-[#f4ecdc]"
                          : "border-[#e7c989]/[0.10] text-[#f4ecdc]/[0.46] hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
                      }`}
                      type="button"
                      onClick={() => setActiveStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoadingProfiles ? (
              <LoadingState />
            ) : filteredProfiles.length > 0 ? (
              <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full min-w-[1090px] table-fixed border-separate border-spacing-0 text-left">
                  <colgroup>
                    <col className="w-[38px]" />
                    <col className="w-[170px]" />
                    <col className="w-[96px]" />
                    <col className="w-[104px]" />
                    <col className="w-[130px]" />
                    <col className="w-[180px]" />
                    <col className="w-[98px]" />
                    <col className="w-[72px]" />
                    <col className="w-[76px]" />
                    <col className="w-[168px]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-[#110e0a]/[0.96] text-[11px] uppercase tracking-[0.13em] text-[#f4ecdc]/[0.48]">
                    <tr>
                      <HeaderCell>
                        <input className="h-3.5 w-3.5 accent-[#e7c989]" type="checkbox" />
                      </HeaderCell>
                      <HeaderCell>Profile</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Proxy</HeaderCell>
                      <HeaderCell>Tags</HeaderCell>
                      <HeaderCell>Notes</HeaderCell>
                      <HeaderCell>Last activity</HeaderCell>
                      <HeaderCell>Created</HeaderCell>
                      <HeaderCell>Runtime</HeaderCell>
                      <HeaderCell className="text-right">Actions</HeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <ProfileRow
                        key={profile.id}
                        profile={profile}
                        onDelete={() => setDeleteTarget(profile)}
                        onEdit={() => openEditModal(profile)}
                        onStart={() => onStartProfile(profile)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                hasProfiles={profiles.length > 0}
                onCreateProfile={() => openCreateModal()}
              />
            )}

            <BottomActionBar visibleCount={filteredProfiles.length} totalCount={profiles.length} />
          </section>
        </div>
      </main>

      {modalMode ? (
        <ProfileModal
          form={form}
          mode={modalMode}
          onCancel={closeModal}
          onChange={setForm}
          onSubmit={saveProfile}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmation
          profile={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteProfile}
        />
      ) : null}
    </div>
  );
}

function PrimarySidebar() {
  return (
    <aside className="hidden w-[216px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#070604]/[0.84] p-3.5 backdrop-blur-2xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7c989]/[0.24] bg-[#e7c989]/[0.10] text-sm font-semibold text-[#e7c989]">
          N
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[0.03em] text-[#f4ecdc]">Noema</div>
          <div className="text-xs text-[#f4ecdc]/[0.40]">Control Center</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
              item.label === "Profiles"
                ? "border-[#e7c989]/[0.18] bg-[#e7c989]/[0.10] text-[#f4ecdc]"
                : "border-transparent text-[#f4ecdc]/[0.55] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
            }`}
            type="button"
          >
            <span className="text-[#e7c989]/[0.82]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-[18px] border border-[#e7c989]/[0.12] bg-[#15120d]/[0.68] p-3.5">
          <div className="text-sm font-medium text-[#f4ecdc]">Personal workspace</div>
          <p className="mt-2 text-xs leading-5 text-[#f4ecdc]/[0.46]">
            Local profiles, notes and sessions for focused work.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f4ecdc]/[0.08]">
            <div className="h-full w-[62%] rounded-full bg-[#e7c989]" />
          </div>
          <div className="mt-2 text-xs text-[#f4ecdc]/[0.38]">Usage placeholder</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniSetting icon={<Sparkles size={14} />} label="Dark" />
          <MiniSetting icon={<Languages size={14} />} label="EN" />
        </div>
      </div>
    </aside>
  );
}

function WorkspaceSidebar({
  activeWorkspace,
  onCreateProfile,
  onWorkspaceChange
}: {
  activeWorkspace: string;
  onCreateProfile: (workspace?: string) => void;
  onWorkspaceChange: (workspace: string) => void;
}) {
  return (
    <aside className="hidden w-[196px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#0b0907]/[0.72] p-3.5 min-[1600px]:flex">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4ecdc]/[0.36]">
            Workspaces
          </div>
          <div className="mt-1 text-sm text-[#f4ecdc]/[0.54]">Organized contexts</div>
        </div>
        <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Workspace settings">
          <Settings size={15} />
        </IconButton>
      </div>

      <Button
        className="mt-4 h-9 justify-start rounded-xl border-[#e7c989]/[0.16] bg-[#e7c989]/[0.10] text-[#f4ecdc] hover:border-[#e7c989]/[0.28] hover:bg-[#e7c989]/[0.14]"
        tone="secondary"
        onClick={() => onCreateProfile(activeWorkspace)}
      >
        <FolderPlus size={16} />
        Add workspace
      </Button>

      <div className="mt-4 space-y-1">
        <WorkspaceButton
          active={activeWorkspace === ALL_WORKSPACES}
          label={ALL_WORKSPACES}
          tone="bg-[#f4ecdc]"
          onClick={() => onWorkspaceChange(ALL_WORKSPACES)}
        />
        {workspaces.map((workspace) => (
          <WorkspaceButton
            key={workspace.label}
            active={activeWorkspace === workspace.label}
            label={workspace.label}
            tone={workspace.tone}
            onClick={() => onWorkspaceChange(workspace.label)}
          />
        ))}
      </div>

      <div className="mt-auto rounded-[18px] border border-[#e7c989]/[0.10] bg-black/[0.16] p-3.5">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c989]">
          Status
        </div>
        <p className="mt-2 text-xs leading-5 text-[#f4ecdc]/[0.45]">
          Proxy and runtime fields are neutral placeholders in this dashboard.
        </p>
      </div>
    </aside>
  );
}

function WorkspaceButton({
  active,
  label,
  onClick,
  tone
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  tone: string;
}) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
        active
          ? "border-[#e7c989]/[0.26] bg-[#e7c989]/[0.10] text-[#f4ecdc] shadow-[inset_2px_0_0_rgba(231,201,137,0.70)]"
          : "border-transparent text-[#f4ecdc]/[0.58] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
      }`}
      type="button"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className={`h-3 w-3 rounded ${tone}`} />
        <Folder className="shrink-0 text-[#e7c989]/[0.72]" size={16} />
        <span className="truncate">{label}</span>
      </span>
      {active ? <Check size={14} /> : null}
    </button>
  );
}

function ControlTopBar({
  onCreateProfile,
  onQueryChange,
  query
}: {
  onCreateProfile: () => void;
  onQueryChange: (query: string) => void;
  query: string;
}) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-[#e7c989]/[0.10] bg-[#0b0907]/[0.78] px-4 backdrop-blur-2xl">
      <form
        className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-[#e7c989]/[0.13] bg-[#15120d]/[0.72] px-3.5 transition hover:border-[#e7c989]/[0.22] focus-within:border-[#e7c989]/[0.42]"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search className="shrink-0 text-[#e7c989]/[0.72]" size={18} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#f4ecdc] outline-none placeholder:text-[#f4ecdc]/[0.36]"
          placeholder="Search profiles, tags, notes..."
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
      </form>
      <label className="hidden h-9 items-center gap-2 rounded-lg border border-[#e7c989]/[0.12] px-3 text-sm text-[#f4ecdc]/[0.64] md:flex">
        <ArrowUpDown size={15} />
        <select
          aria-label="Sort profiles"
          className="bg-transparent text-sm outline-none"
          value="name"
          onChange={() => undefined}
        >
          <option value="name">By name</option>
        </select>
      </label>
      <IconButton className="h-9 w-9 hover:bg-[#f4ecdc]/[0.08]" label="Refresh">
        <RefreshCw size={16} />
      </IconButton>
      <Button className="hidden h-9 border-[#e7c989]/[0.12] px-3 text-[#f4ecdc]/[0.64] hover:bg-[#f4ecdc]/[0.06] md:inline-flex" tone="ghost">
        <Filter size={15} />
        Filters
      </Button>
      <Button
        className="h-9 border-[#e7c989]/[0.50] bg-[linear-gradient(180deg,#ead29a,#c8a864)] px-3.5 text-[#120f0a] shadow-[0_14px_36px_rgba(231,201,137,0.14)] hover:bg-[linear-gradient(180deg,#f4ecdc,#d6b978)]"
        tone="primary"
        onClick={onCreateProfile}
      >
        <Plus size={16} />
        Create profile
      </Button>
    </div>
  );
}

function ProfileRow({
  onDelete,
  onEdit,
  onStart,
  profile
}: {
  onDelete: () => void;
  onEdit: () => void;
  onStart: () => void;
  profile: ControlProfile;
}) {
  return (
    <tr className="group border-b border-[#e7c989]/[0.08] text-[13px] text-[#f4ecdc]/[0.72] transition hover:bg-[#e7c989]/[0.055]">
      <BodyCell>
        <input className="h-3.5 w-3.5 accent-[#e7c989]" type="checkbox" />
      </BodyCell>
      <BodyCell>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e7c989]/[0.12] bg-[#e7c989]/[0.08] text-[#e7c989]">
            <Globe2 size={16} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium text-[#f4ecdc]">{profile.name}</span>
            <span className="block truncate text-xs text-[#f4ecdc]/[0.38]">{profile.workspace}</span>
          </span>
        </div>
      </BodyCell>
      <BodyCell>
        <StatusPill status={profile.status} />
      </BodyCell>
      <BodyCell>
        <ProxyPill proxy={profile.proxy} />
      </BodyCell>
      <BodyCell>
        <div className="flex max-w-[128px] flex-wrap gap-1">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.04] px-1.5 py-0.5 text-[11px] text-[#f4ecdc]/[0.54]"
            >
              {tag}
            </span>
          ))}
        </div>
      </BodyCell>
      <BodyCell>
        <div className="flex max-w-[176px] items-center gap-2 rounded-lg border border-[#e7c989]/[0.08] bg-black/[0.14] px-2.5 py-1.5 text-xs text-[#f4ecdc]/[0.48]">
          <FileText className="shrink-0 text-[#e7c989]/[0.64]" size={14} />
          <span className="truncate">{profile.notes || "No notes yet"}</span>
        </div>
      </BodyCell>
      <BodyCell>{profile.lastActivity}</BodyCell>
      <BodyCell>{profile.created}</BodyCell>
      <BodyCell>{profile.runtime}</BodyCell>
      <BodyCell>
        <div className="flex justify-end gap-1.5">
          <Button
            aria-label={`Start ${profile.name}`}
            className="h-8 rounded-lg border-[#e7c989]/[0.42] bg-[#e7c989]/[0.16] px-3 text-xs text-[#f4ecdc] shadow-[inset_0_1px_0_rgba(255,248,232,0.08)] hover:border-[#e7c989]/[0.60] hover:bg-[#e7c989]/[0.24]"
            tone="primary"
            onClick={onStart}
          >
            <Play size={13} />
            Start
          </Button>
          <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label={`Edit ${profile.name}`} onClick={onEdit}>
            <Pencil size={14} />
          </IconButton>
          <IconButton
            className="h-8 w-8 hover:bg-[#6b332b]/[0.24] hover:text-[#ffe8df]"
            label={`Delete ${profile.name}`}
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </IconButton>
        </div>
      </BodyCell>
    </tr>
  );
}

function HeaderCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`border-b border-[#e7c989]/[0.10] px-2.5 py-2.5 font-semibold ${className}`}>{children}</th>;
}

function BodyCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#e7c989]/[0.07] px-2.5 py-2 align-middle">{children}</td>;
}

function StatusPill({ status }: { status: ProfileStatus }) {
  const className =
    status === "Running"
      ? "border-[#e7c989]/[0.32] bg-[#e7c989]/[0.13] text-[#f4ecdc]"
      : status === "Ready"
        ? "border-[#f4ecdc]/[0.14] bg-[#f4ecdc]/[0.06] text-[#f4ecdc]/[0.72]"
        : status === "Review"
          ? "border-[#c7a96a]/[0.20] bg-[#c7a96a]/[0.08] text-[#ead8ad]"
          : "border-[#f4ecdc]/[0.10] bg-black/[0.16] text-[#f4ecdc]/[0.46]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs ${className}`}>
      <Circle fill="currentColor" size={7} />
      {status}
    </span>
  );
}

function ProxyPill({ proxy }: { proxy: ControlProfile["proxy"] }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.035] px-2.5 py-1 text-xs text-[#f4ecdc]/[0.52]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#e7c989]/[0.70]" />
      {proxy}
    </span>
  );
}

function BottomActionBar({
  totalCount,
  visibleCount
}: {
  totalCount: number;
  visibleCount: number;
}) {
  const actions = [
    { label: "Tag", icon: <Tag size={15} /> },
    { label: "Move", icon: <MoveRight size={15} /> },
    { label: "Duplicate", icon: <Copy size={15} /> },
    { label: "Export", icon: <Download size={15} /> },
    { label: "Start", icon: <Play size={15} /> },
    { label: "Pause", icon: <Pause size={15} /> },
    { label: "Delete", icon: <Trash2 size={15} /> }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7c989]/[0.10] bg-[#0b0907]/[0.84] px-4 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <button
            key={action.label}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-transparent px-2.5 text-xs text-[#f4ecdc]/[0.52] transition hover:border-[#e7c989]/[0.12] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
            type="button"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-[#f4ecdc]/[0.42]">
        <GripVertical size={14} />
        Rows per page 25
        <span className="mx-1 h-1 w-1 rounded-full bg-[#f4ecdc]/[0.22]" />
        {visibleCount === 0 ? "0" : `1-${visibleCount}`} of {totalCount}
        <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Previous page">
          <ChevronLeft size={15} />
        </IconButton>
        <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Next page">
          <ChevronRight size={15} />
        </IconButton>
      </div>
    </div>
  );
}

function EmptyState({
  hasProfiles,
  onCreateProfile
}: {
  hasProfiles: boolean;
  onCreateProfile: () => void;
}) {
  return (
    <div className="grid min-h-[360px] flex-1 place-items-center px-6 py-12">
      <div className="max-w-md rounded-[24px] border border-[#e7c989]/[0.14] bg-[#15120d]/[0.68] p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7c989]/[0.18] bg-[#e7c989]/[0.10] text-[#e7c989]">
          <Globe2 size={22} />
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[#f4ecdc]">
          {hasProfiles ? "No profiles match this view." : "Create your first Noema profile."}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#f4ecdc]/[0.50]">
          {hasProfiles
            ? "Adjust search, workspace or status filters to return to your profile list."
            : "Profiles keep the name, workspace, tags and notes that frame a browser session."}
        </p>
        {!hasProfiles ? (
          <Button
            className="mt-6 border-[#e7c989]/[0.50] bg-[linear-gradient(180deg,#ead29a,#c8a864)] text-[#120f0a] hover:bg-[linear-gradient(180deg,#f4ecdc,#d6b978)]"
            tone="primary"
            onClick={onCreateProfile}
          >
            <Plus size={16} />
            Create profile
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-[360px] flex-1 place-items-center px-6 py-12">
      <div className="rounded-[24px] border border-[#e7c989]/[0.14] bg-[#15120d]/[0.68] p-7 text-center shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-2xl border border-[#e7c989]/[0.20] bg-[#e7c989]/[0.10]" />
        <div className="mt-5 text-sm font-medium text-[#f4ecdc]">Loading profiles</div>
        <p className="mt-2 text-sm text-[#f4ecdc]/[0.46]">
          Reading your local Noema profile store.
        </p>
      </div>
    </div>
  );
}

function ProfileModal({
  form,
  mode,
  onCancel,
  onChange,
  onSubmit
}: {
  form: ProfileFormState;
  mode: "create" | "edit";
  onCancel: () => void;
  onChange: (form: ProfileFormState) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.62] p-4 backdrop-blur-md">
      <form
        className="w-full max-w-xl rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] shadow-[0_34px_120px_rgba(0,0,0,0.62)]"
        onSubmit={onSubmit}
      >
        <div className="flex items-start justify-between border-b border-[#e7c989]/[0.10] p-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7c989]">
              {mode === "create" ? "Create profile" : "Edit profile"}
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[#f4ecdc]">
              {mode === "create" ? "New Noema profile" : "Profile details"}
            </h2>
          </div>
          <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Close profile modal" onClick={onCancel}>
            <X size={16} />
          </IconButton>
        </div>

        <div className="grid gap-4 p-5">
          <Field label="Profile name">
            <input
              autoFocus
              className="field-input"
              placeholder="Research Alpha"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.currentTarget.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workspace">
              <select
                className="field-input"
                value={form.workspace}
                onChange={(event) => onChange({ ...form, workspace: event.currentTarget.value })}
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.label} value={workspace.label}>
                    {workspace.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                className="field-input"
                value={form.status}
                onChange={(event) =>
                  onChange({ ...form, status: event.currentTarget.value as ProfileStatus })
                }
              >
                {statusFilters
                  .filter((status): status is ProfileStatus => status !== "All")
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </Field>
          </div>

          <Field label="Tags">
            <input
              className="field-input"
              placeholder="research, priority"
              value={form.tags}
              onChange={(event) => onChange({ ...form, tags: event.currentTarget.value })}
            />
          </Field>

          <Field label="Notes">
            <textarea
              className="field-input min-h-24 resize-none py-3"
              placeholder="What should this profile remember?"
              value={form.notes}
              onChange={(event) => onChange({ ...form, notes: event.currentTarget.value })}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#e7c989]/[0.10] p-5">
          <Button className="border-[#e7c989]/[0.12] text-[#f4ecdc]/[0.66] hover:bg-[#f4ecdc]/[0.06]" tone="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="border-[#e7c989]/[0.50] bg-[linear-gradient(180deg,#ead29a,#c8a864)] text-[#120f0a] hover:bg-[linear-gradient(180deg,#f4ecdc,#d6b978)]"
            disabled={!form.name.trim()}
            tone="primary"
            type="submit"
          >
            Save profile
          </Button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmation({
  onCancel,
  onConfirm,
  profile
}: {
  onCancel: () => void;
  onConfirm: () => void;
  profile: ControlProfile;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.62] p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.62)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#6b332b]/[0.28] bg-[#6b332b]/[0.18] text-[#ffe8df]">
            <Trash2 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#f4ecdc]">Delete {profile.name}?</h2>
            <p className="mt-2 text-sm leading-6 text-[#f4ecdc]/[0.52]">
              This removes the local profile row and its notes from Noema Control Center.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button className="border-[#e7c989]/[0.12] text-[#f4ecdc]/[0.66] hover:bg-[#f4ecdc]/[0.06]" tone="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="border-[#6b332b]/[0.30] bg-[#6b332b]/[0.24] text-[#ffe8df] hover:bg-[#6b332b]/[0.34]" tone="danger" onClick={onConfirm}>
            Delete profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f4ecdc]/[0.42]">
        {label}
      </span>
      {children}
    </label>
  );
}

function MiniSetting({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.04] text-xs text-[#f4ecdc]/[0.56] transition hover:bg-[#f4ecdc]/[0.07] hover:text-[#f4ecdc]"
      type="button"
    >
      <span className="text-[#e7c989]">{icon}</span>
      {label}
    </button>
  );
}

function emptyProfileForm(workspace = "Research"): ProfileFormState {
  return {
    name: "",
    workspace,
    status: "Ready",
    tags: "",
    notes: ""
  };
}

function parseTags(tags: string) {
  return Array.from(
    new Set(
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}
