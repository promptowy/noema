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
import type {
  BrowserSettings,
  ControlProfile,
  ProfileDraft,
  ProfileStatus,
  SettingsPatch,
  Workspace
} from "../../electron/types";

type ProfileFormState = {
  name: string;
  workspace: string;
  status: ProfileStatus;
  tags: string;
  notes: string;
};

type NavKey = "Profiles" | "Workspaces" | "Sessions" | "Automation" | "Insights" | "Settings";
type SegmentKey = "Profiles" | "Connections" | "Tags" | "Statuses" | "Notes" | "Activity";
type SortKey = "name" | "lastActivity" | "created" | "runtime";
type FilterState = {
  status: "All" | ProfileStatus;
  workspace: string;
  tag: string;
};

const ALL_WORKSPACES = "All profiles";
const statusFilters: Array<"All" | ProfileStatus> = [
  "All",
  "Ready",
  "Running",
  "Review",
  "Paused"
];
const rowsPerPageOptions = [5, 10, 25, 50];

const navigation: Array<{ label: NavKey; icon: ReactNode; comingSoon?: boolean }> = [
  { label: "Profiles", icon: <Globe2 size={17} /> },
  { label: "Workspaces", icon: <Briefcase size={17} /> },
  { label: "Sessions", icon: <Clock3 size={17} /> },
  { label: "Automation", icon: <Workflow size={17} />, comingSoon: true },
  { label: "Insights", icon: <BarChart3 size={17} />, comingSoon: true },
  { label: "Settings", icon: <Settings size={17} /> }
];

const segments: SegmentKey[] = [
  "Profiles",
  "Connections",
  "Tags",
  "Statuses",
  "Notes",
  "Activity"
];

type ControlCenterProps = {
  onResetDemoData: () => Promise<void>;
  onSettingsChange: (patch: SettingsPatch) => Promise<void>;
  onStartProfile: (profile: ControlProfile) => void;
  settings: BrowserSettings;
};

export function ControlCenter({
  onResetDemoData,
  onSettingsChange,
  onStartProfile,
  settings
}: ControlCenterProps) {
  const [profiles, setProfiles] = useState<ControlProfile[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState(ALL_WORKSPACES);
  const [activeNav, setActiveNav] = useState<NavKey>("Profiles");
  const [activeSegment, setActiveSegment] = useState<SegmentKey>("Profiles");
  const [filters, setFilters] = useState<FilterState>({
    status: "All",
    workspace: ALL_WORKSPACES,
    tag: ""
  });
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ControlProfile | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [storePath, setStorePath] = useState("Electron app userData/noema-profiles.json");

  useEffect(() => {
    void reloadDashboard();
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [activeWorkspace, activeSegment, filters, query, rowsPerPage, sortKey]);

  const editingProfile = useMemo(
    () => profiles.find((profile) => profile.id === editingProfileId) ?? null,
    [editingProfileId, profiles]
  );

  const workspaceLabels = useMemo(() => workspaces.map((workspace) => workspace.label), [workspaces]);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeWorkspaceFilter =
      filters.workspace !== ALL_WORKSPACES ? filters.workspace : activeWorkspace;

    return profiles
      .filter((profile) =>
        activeWorkspaceFilter === ALL_WORKSPACES ? true : profile.workspace === activeWorkspaceFilter
      )
      .filter((profile) => (filters.status === "All" ? true : profile.status === filters.status))
      .filter((profile) =>
        filters.tag ? profile.tags.some((tag) => tag.toLowerCase() === filters.tag.toLowerCase()) : true
      )
      .filter((profile) => {
        if (!normalizedQuery) {
          return true;
        }
        const haystack = [profile.name, profile.workspace, profile.notes, profile.status, ...profile.tags]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((first, second) => compareProfiles(first, second, sortKey));
  }, [activeWorkspace, filters, profiles, query, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filteredProfiles.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const pageProfiles = filteredProfiles.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const selectedProfiles = profiles.filter((profile) => selectedIds.has(profile.id));
  const visibleSelectedCount = pageProfiles.filter((profile) => selectedIds.has(profile.id)).length;
  const allVisibleSelected = pageProfiles.length > 0 && visibleSelectedCount === pageProfiles.length;

  async function reloadDashboard() {
    setIsLoadingProfiles(true);
    try {
      const [nextProfiles, nextWorkspaces, info] = await Promise.all([
        window.browserAPI.profiles.list(),
        window.browserAPI.workspaces.list(),
        window.browserAPI.profiles.storeInfo()
      ]);
      setProfiles(nextProfiles);
      setWorkspaces(nextWorkspaces);
      setStorePath(info.path);
      setProfileError(null);
    } catch {
      setProfileError("Local profile data could not be loaded.");
    } finally {
      setIsLoadingProfiles(false);
    }
  }

  function openCreateModal(workspace = activeWorkspace) {
    const initialWorkspace = workspace === ALL_WORKSPACES ? workspaces[0]?.label ?? "Research" : workspace;
    setEditingProfileId(null);
    setForm(emptyProfileForm(initialWorkspace));
    setFormError(null);
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
    setFormError(null);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingProfileId(null);
    setForm(emptyProfileForm(workspaces[0]?.label ?? "Research"));
    setFormError(null);
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError("Profile name is required.");
      return;
    }

    const duplicate = profiles.find(
      (profile) =>
        profile.name.toLowerCase() === name.toLowerCase() && profile.id !== editingProfileId
    );
    if (duplicate) {
      setFormError("A profile with this name already exists. Choose a distinct name for MVP 1.0.");
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
      setNotice(modalMode === "edit" ? "Profile updated." : "Profile created.");
      closeModal();
    } catch {
      setFormError("Profile changes could not be saved.");
    }
  }

  async function confirmDeleteProfile() {
    if (!deleteTarget) {
      return;
    }

    try {
      const nextProfiles = await window.browserAPI.profiles.delete(deleteTarget.id);
      setProfiles(nextProfiles);
      setSelectedIds((previous) => withoutIds(previous, [deleteTarget.id]));
      setProfileError(null);
      setNotice("Profile deleted.");
      setDeleteTarget(null);
    } catch {
      setProfileError("Profile could not be deleted.");
    }
  }

  async function confirmBulkDelete() {
    const ids = selectedProfiles.map((profile) => profile.id);
    try {
      let nextProfiles = profiles;
      for (const id of ids) {
        nextProfiles = await window.browserAPI.profiles.delete(id);
      }
      setProfiles(nextProfiles);
      setSelectedIds(new Set());
      setNotice(`${ids.length} profile${ids.length === 1 ? "" : "s"} deleted.`);
      setBulkDeleteOpen(false);
    } catch {
      setProfileError("Selected profiles could not be deleted.");
    }
  }

  async function duplicateSelected() {
    if (selectedProfiles.length === 0) {
      setNotice("Select at least one profile to duplicate.");
      return;
    }

    try {
      let nextProfiles = profiles;
      for (const profile of selectedProfiles) {
        nextProfiles = await window.browserAPI.profiles.create({
          name: uniqueProfileName(`${profile.name} Copy`, nextProfiles),
          workspace: profile.workspace,
          status: "Ready",
          tags: profile.tags,
          notes: profile.notes
        });
      }
      setProfiles(nextProfiles);
      setSelectedIds(new Set());
      setNotice(`${selectedProfiles.length} profile${selectedProfiles.length === 1 ? "" : "s"} duplicated.`);
    } catch {
      setProfileError("Selected profiles could not be duplicated.");
    }
  }

  async function createWorkspace(event: FormEvent) {
    event.preventDefault();
    const label = workspaceName.trim();
    if (!label) {
      setProfileError("Workspace name is required.");
      return;
    }

    try {
      const nextWorkspaces = await window.browserAPI.workspaces.create(label);
      setWorkspaces(nextWorkspaces);
      setActiveWorkspace(label);
      setWorkspaceName("");
      setWorkspaceModalOpen(false);
      setNotice("Workspace created.");
    } catch {
      setProfileError("Workspace could not be created. It may already exist.");
    }
  }

  async function resetDemoData() {
    if (!window.confirm("Reset local Noema profiles and workspaces to demo data?")) {
      return;
    }
    await onResetDemoData();
    await reloadDashboard();
    setSelectedIds(new Set());
    setActiveWorkspace(ALL_WORKSPACES);
    setNotice("Demo data restored.");
  }

  function toggleSelected(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        for (const profile of pageProfiles) {
          next.delete(profile.id);
        }
      } else {
        for (const profile of pageProfiles) {
          next.add(profile.id);
        }
      }
      return next;
    });
  }

  function startSelected() {
    const [profile] = selectedProfiles;
    if (selectedProfiles.length !== 1 || !profile) {
      setNotice("Select exactly one profile to start from the action bar.");
      return;
    }
    onStartProfile(profile);
  }

  function exportSelected() {
    const exportProfiles = selectedProfiles.length > 0 ? selectedProfiles : filteredProfiles;
    if (exportProfiles.length === 0) {
      setNotice("There are no profiles to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(exportProfiles, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "noema-profiles-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Profile export created.");
  }

  function markComingSoon(label: string) {
    setNotice(`${label} is coming soon in a later Noema build.`);
  }

  return (
    <div className="app-shell flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_28%_-14%,rgba(231,201,137,0.12),transparent_34%),linear-gradient(135deg,#050403_0%,#0b0907_46%,#050504_100%)] text-[#f4ecdc]">
      <PrimarySidebar
        activeNav={activeNav}
        settings={settings}
        onNavChange={setActiveNav}
        onSettingsChange={onSettingsChange}
      />
      <WorkspaceSidebar
        activeWorkspace={activeWorkspace}
        profiles={profiles}
        workspaces={workspaces}
        onCreateWorkspace={() => setWorkspaceModalOpen(true)}
        onWorkspaceChange={(workspace) => {
          setActiveWorkspace(workspace);
          setFilters((current) => ({ ...current, workspace: ALL_WORKSPACES }));
          setActiveNav("Profiles");
        }}
      />

      <main className="flex min-w-0 flex-1 flex-col bg-[#080706]/[0.55]">
        <ControlTopBar
          filterOpen={filterOpen}
          query={query}
          sortKey={sortKey}
          onCreateProfile={() => openCreateModal()}
          onFilterOpen={() => setFilterOpen(true)}
          onQueryChange={setQuery}
          onRefresh={() => void reloadDashboard()}
          onSortChange={setSortKey}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-4">
          <section className="flex min-h-full flex-col overflow-hidden rounded-[22px] border border-[#e7c989]/[0.10] bg-[#0f0c08]/[0.72] shadow-[0_28px_100px_rgba(0,0,0,0.38)]">
            <DashboardHeader
              activeNav={activeNav}
              activeSegment={activeSegment}
              filteredCount={filteredProfiles.length}
              isLoading={isLoadingProfiles}
              notice={notice}
              profileError={profileError}
              profilesCount={profiles.length}
              selectedCount={selectedIds.size}
              onClearNotice={() => setNotice(null)}
              onSegmentChange={setActiveSegment}
              onStatusChange={(status) => setFilters((current) => ({ ...current, status }))}
              status={filters.status}
            />

            {activeNav === "Profiles" ? (
              <ProfileContent
                activeSegment={activeSegment}
                allVisibleSelected={allVisibleSelected}
                filteredProfiles={filteredProfiles}
                isLoading={isLoadingProfiles}
                pageProfiles={pageProfiles}
                profiles={profiles}
                selectedIds={selectedIds}
                workspaces={workspaces}
                onCreateProfile={() => openCreateModal()}
                onDelete={(profile) => setDeleteTarget(profile)}
                onEdit={openEditModal}
                onSelect={toggleSelected}
                onSelectAll={toggleSelectAllVisible}
                onStart={onStartProfile}
                onTagClick={(tag) => {
                  setFilters((current) => ({ ...current, tag }));
                  setActiveSegment("Profiles");
                }}
              />
            ) : null}

            {activeNav === "Workspaces" ? (
              <WorkspacesPage
                profiles={profiles}
                workspaces={workspaces}
                onCreateWorkspace={() => setWorkspaceModalOpen(true)}
                onOpenWorkspace={(workspace) => {
                  setActiveWorkspace(workspace);
                  setActiveNav("Profiles");
                }}
              />
            ) : null}

            {activeNav === "Sessions" ? (
              <SessionsPage profiles={profiles} onStart={onStartProfile} />
            ) : null}

            {(activeNav === "Automation" || activeNav === "Insights") ? (
              <ComingSoonPage
                title={activeNav}
                copy={
                  activeNav === "Automation"
                    ? "Automation is outside Noema MVP 1.0 and is intentionally disabled."
                    : "Insights are planned after the local workspace manager is stable."
                }
              />
            ) : null}

            {activeNav === "Settings" ? (
              <ControlSettingsPage
                settings={settings}
                storePath={storePath}
                onResetDemoData={() => void resetDemoData()}
                onSettingsChange={onSettingsChange}
              />
            ) : null}

            {activeNav === "Profiles" && activeSegment === "Profiles" ? (
              <BottomActionBar
                page={safePage}
                pageCount={pageCount}
                rowsPerPage={rowsPerPage}
                selectedCount={selectedIds.size}
                totalCount={filteredProfiles.length}
                visibleCount={pageProfiles.length}
                onBulkDelete={() => setBulkDeleteOpen(true)}
                onComingSoon={markComingSoon}
                onDuplicate={() => void duplicateSelected()}
                onExport={exportSelected}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onStart={startSelected}
              />
            ) : null}
          </section>
        </div>
      </main>

      {filterOpen ? (
        <FilterPanel
          filters={filters}
          tagOptions={allTags(profiles)}
          workspaces={workspaces}
          onChange={setFilters}
          onClear={() => setFilters({ status: "All", workspace: ALL_WORKSPACES, tag: "" })}
          onClose={() => setFilterOpen(false)}
        />
      ) : null}

      {workspaceModalOpen ? (
        <WorkspaceModal
          value={workspaceName}
          onCancel={() => {
            setWorkspaceModalOpen(false);
            setWorkspaceName("");
          }}
          onChange={setWorkspaceName}
          onSubmit={createWorkspace}
        />
      ) : null}

      {modalMode ? (
        <ProfileModal
          error={formError}
          form={form}
          mode={modalMode}
          workspaces={workspaceLabels}
          onCancel={closeModal}
          onChange={setForm}
          onSubmit={saveProfile}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmation
          label={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteProfile}
        />
      ) : null}

      {bulkDeleteOpen ? (
        <DeleteConfirmation
          label={`${selectedProfiles.length} selected profile${selectedProfiles.length === 1 ? "" : "s"}`}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={confirmBulkDelete}
        />
      ) : null}
    </div>
  );
}

function PrimarySidebar({
  activeNav,
  onNavChange,
  onSettingsChange,
  settings
}: {
  activeNav: NavKey;
  onNavChange: (nav: NavKey) => void;
  onSettingsChange: (patch: SettingsPatch) => Promise<void>;
  settings: BrowserSettings;
}) {
  return (
    <aside className="hidden w-[208px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#070604]/[0.84] p-3 backdrop-blur-2xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7c989]/[0.24] bg-[#e7c989]/[0.10] text-sm font-semibold text-[#e7c989]">
          N
        </div>
        <div>
          <div className="text-sm font-semibold text-[#f4ecdc]">Noema</div>
          <div className="text-xs text-[#f4ecdc]/[0.40]">Control Center</div>
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
              item.label === activeNav
                ? "border-[#e7c989]/[0.18] bg-[#e7c989]/[0.10] text-[#f4ecdc]"
                : "border-transparent text-[#f4ecdc]/[0.55] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
            }`}
            type="button"
            onClick={() => onNavChange(item.label)}
          >
            <span className="flex items-center gap-3">
              <span className="text-[#e7c989]/[0.82]">{item.icon}</span>
              {item.label}
            </span>
            {item.comingSoon ? (
              <span className="rounded-full border border-[#e7c989]/[0.14] px-1.5 py-0.5 text-[10px] text-[#f4ecdc]/[0.42]">
                Soon
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-[18px] border border-[#e7c989]/[0.12] bg-[#15120d]/[0.68] p-3">
          <div className="text-sm font-medium text-[#f4ecdc]">Personal workspace</div>
          <p className="mt-2 text-xs leading-5 text-[#f4ecdc]/[0.46]">
            Local profiles, notes and sessions for focused work.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f4ecdc]/[0.08]">
            <div className="h-full w-[72%] rounded-full bg-[#e7c989]" />
          </div>
          <div className="mt-2 text-xs text-[#f4ecdc]/[0.38]">MVP workspace manager</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniSetting
            icon={<Sparkles size={14} />}
            label={settings.theme === "light" ? "Light" : "Dark"}
            onClick={() =>
              onSettingsChange({ theme: settings.theme === "light" ? "dark" : "light" })
            }
          />
          <MiniSetting disabled icon={<Languages size={14} />} label="EN soon" />
        </div>
      </div>
    </aside>
  );
}

function WorkspaceSidebar({
  activeWorkspace,
  onCreateWorkspace,
  onWorkspaceChange,
  profiles,
  workspaces
}: {
  activeWorkspace: string;
  onCreateWorkspace: () => void;
  onWorkspaceChange: (workspace: string) => void;
  profiles: ControlProfile[];
  workspaces: Workspace[];
}) {
  return (
    <aside className="hidden w-[184px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#0b0907]/[0.72] p-3 min-[1380px]:flex">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-[#f4ecdc]/[0.36]">Workspaces</div>
          <div className="mt-1 text-sm text-[#f4ecdc]/[0.54]">Organized contexts</div>
        </div>
      </div>

      <Button
        className="mt-4 h-9 justify-start rounded-xl border-[#e7c989]/[0.16] bg-[#e7c989]/[0.10] text-[#f4ecdc] hover:border-[#e7c989]/[0.28] hover:bg-[#e7c989]/[0.14]"
        tone="secondary"
        onClick={onCreateWorkspace}
      >
        <FolderPlus size={16} />
        Add workspace
      </Button>

      <div className="mt-4 space-y-1">
        <WorkspaceButton
          active={activeWorkspace === ALL_WORKSPACES}
          count={profiles.length}
          label={ALL_WORKSPACES}
          tone="bg-[#f4ecdc]"
          onClick={() => onWorkspaceChange(ALL_WORKSPACES)}
        />
        {workspaces.map((workspace) => (
          <WorkspaceButton
            key={workspace.id}
            active={activeWorkspace === workspace.label}
            count={profiles.filter((profile) => profile.workspace === workspace.label).length}
            label={workspace.label}
            tone={workspaceToneClass(workspace.tone)}
            onClick={() => onWorkspaceChange(workspace.label)}
          />
        ))}
      </div>

      <div className="mt-auto rounded-[18px] border border-[#e7c989]/[0.10] bg-black/[0.16] p-3">
        <div className="text-xs font-semibold uppercase text-[#e7c989]">MVP scope</div>
        <p className="mt-2 text-xs leading-5 text-[#f4ecdc]/[0.45]">
          Workspace edit and delete controls are hidden until they are real.
        </p>
      </div>
    </aside>
  );
}

function WorkspaceButton({
  active,
  count,
  label,
  onClick,
  tone
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  tone: string;
}) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left text-sm transition ${
        active
          ? "border-[#e7c989]/[0.26] bg-[#e7c989]/[0.10] text-[#f4ecdc] shadow-[inset_2px_0_0_rgba(231,201,137,0.70)]"
          : "border-transparent text-[#f4ecdc]/[0.58] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
      }`}
      type="button"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded ${tone}`} />
        <Folder className="shrink-0 text-[#e7c989]/[0.72]" size={15} />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-xs text-[#f4ecdc]/[0.38]">{count}</span>
    </button>
  );
}

function ControlTopBar({
  filterOpen,
  onCreateProfile,
  onFilterOpen,
  onQueryChange,
  onRefresh,
  onSortChange,
  query,
  sortKey
}: {
  filterOpen: boolean;
  onCreateProfile: () => void;
  onFilterOpen: () => void;
  onQueryChange: (query: string) => void;
  onRefresh: () => void;
  onSortChange: (sort: SortKey) => void;
  query: string;
  sortKey: SortKey;
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
          value={sortKey}
          onChange={(event) => onSortChange(event.currentTarget.value as SortKey)}
        >
          <option value="name">By name</option>
          <option value="lastActivity">Last activity</option>
          <option value="created">Created</option>
          <option value="runtime">Runtime</option>
        </select>
      </label>
      <IconButton className="h-9 w-9 hover:bg-[#f4ecdc]/[0.08]" label="Refresh profiles" onClick={onRefresh}>
        <RefreshCw size={16} />
      </IconButton>
      <Button
        className={`hidden h-9 border-[#e7c989]/[0.12] px-3 text-[#f4ecdc]/[0.64] hover:bg-[#f4ecdc]/[0.06] md:inline-flex ${
          filterOpen ? "bg-[#e7c989]/[0.10] text-[#f4ecdc]" : ""
        }`}
        tone="ghost"
        onClick={onFilterOpen}
      >
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

function DashboardHeader({
  activeNav,
  activeSegment,
  filteredCount,
  isLoading,
  notice,
  onClearNotice,
  onSegmentChange,
  onStatusChange,
  profileError,
  profilesCount,
  selectedCount,
  status
}: {
  activeNav: NavKey;
  activeSegment: SegmentKey;
  filteredCount: number;
  isLoading: boolean;
  notice: string | null;
  onClearNotice: () => void;
  onSegmentChange: (segment: SegmentKey) => void;
  onStatusChange: (status: "All" | ProfileStatus) => void;
  profileError: string | null;
  profilesCount: number;
  selectedCount: number;
  status: "All" | ProfileStatus;
}) {
  return (
    <div className="border-b border-[#e7c989]/[0.10] px-4 pt-3.5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase text-[#e7c989]">Control Center</div>
          <h1 className="mt-1.5 text-[22px] font-semibold text-[#f4ecdc]">{activeNav}</h1>
          <p className="mt-0.5 text-sm text-[#f4ecdc]/[0.48]">
            {activeNav === "Profiles"
              ? "Manage focused browser contexts before opening a session."
              : "Noema MVP controls, kept honest and local."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#f4ecdc]/[0.44]">
          <span className="h-2 w-2 rounded-full bg-[#e7c989]" />
          {isLoading ? "Loading profiles" : `${filteredCount} of ${profilesCount} profiles`}
          {selectedCount > 0 ? (
            <>
              <span className="h-1 w-1 rounded-full bg-[#f4ecdc]/[0.24]" />
              {selectedCount} selected
            </>
          ) : null}
          <span className="h-1 w-1 rounded-full bg-[#f4ecdc]/[0.24]" />
          Main-process store
        </div>
      </div>

      {profileError ? (
        <div className="mt-3 rounded-xl border border-[#6b332b]/[0.26] bg-[#6b332b]/[0.14] px-3 py-2 text-xs text-[#ffe8df]/[0.82]">
          {profileError}
        </div>
      ) : null}
      {notice ? (
        <button
          className="mt-3 w-full rounded-xl border border-[#e7c989]/[0.18] bg-[#e7c989]/[0.08] px-3 py-2 text-left text-xs text-[#f4ecdc]/[0.78]"
          type="button"
          onClick={onClearNotice}
        >
          {notice}
        </button>
      ) : null}

      {activeNav === "Profiles" ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pb-3">
          <div className="flex gap-1.5 overflow-x-auto">
            {segments.map((segment) => (
              <button
                key={segment}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
                  segment === activeSegment
                    ? "border-[#e7c989]/[0.28] bg-[#e7c989]/[0.12] text-[#f4ecdc]"
                    : "border-[#e7c989]/[0.10] text-[#f4ecdc]/[0.54] hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
                }`}
                type="button"
                onClick={() => onSegmentChange(segment)}
              >
                {segment}
                {segment === "Connections" ? (
                  <span className="ml-2 text-[10px] text-[#f4ecdc]/[0.36]">Soon</span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {statusFilters.map((nextStatus) => (
              <button
                key={nextStatus}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs transition ${
                  nextStatus === status
                    ? "border-[#e7c989]/[0.28] bg-[#e7c989]/[0.12] text-[#f4ecdc]"
                    : "border-[#e7c989]/[0.10] text-[#f4ecdc]/[0.46] hover:border-[#e7c989]/[0.20] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
                }`}
                type="button"
                onClick={() => onStatusChange(nextStatus)}
              >
                {nextStatus}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileContent({
  activeSegment,
  allVisibleSelected,
  filteredProfiles,
  isLoading,
  onCreateProfile,
  onDelete,
  onEdit,
  onSelect,
  onSelectAll,
  onStart,
  onTagClick,
  pageProfiles,
  profiles,
  selectedIds,
  workspaces
}: {
  activeSegment: SegmentKey;
  allVisibleSelected: boolean;
  filteredProfiles: ControlProfile[];
  isLoading: boolean;
  onCreateProfile: () => void;
  onDelete: (profile: ControlProfile) => void;
  onEdit: (profile: ControlProfile) => void;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onStart: (profile: ControlProfile) => void;
  onTagClick: (tag: string) => void;
  pageProfiles: ControlProfile[];
  profiles: ControlProfile[];
  selectedIds: Set<string>;
  workspaces: Workspace[];
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (activeSegment === "Connections") {
    return (
      <ComingSoonPage
        compact
        title="Connections"
        copy="Proxy routing is outside Noema MVP 1.0. The neutral proxy column remains informational only."
      />
    );
  }

  if (activeSegment === "Tags") {
    return <TagsOverview profiles={profiles} onTagClick={onTagClick} />;
  }

  if (activeSegment === "Statuses") {
    return <StatusOverview profiles={profiles} />;
  }

  if (activeSegment === "Notes") {
    return <NotesOverview profiles={filteredProfiles} />;
  }

  if (activeSegment === "Activity") {
    return <ActivityOverview profiles={filteredProfiles} />;
  }

  if (filteredProfiles.length === 0) {
    return <EmptyState hasProfiles={profiles.length > 0} onCreateProfile={onCreateProfile} />;
  }

  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
      <table className="w-full min-w-[1060px] table-fixed border-separate border-spacing-0 text-left">
        <colgroup>
          <col className="w-[36px]" />
          <col className="w-[168px]" />
          <col className="w-[92px]" />
          <col className="w-[102px]" />
          <col className="w-[128px]" />
          <col className="w-[172px]" />
          <col className="w-[96px]" />
          <col className="w-[74px]" />
          <col className="w-[74px]" />
          <col className="w-[154px]" />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-[#110e0a]/[0.96] text-[11px] uppercase text-[#f4ecdc]/[0.48]">
          <tr>
            <HeaderCell>
              <input
                aria-label="Select all visible profiles"
                checked={allVisibleSelected}
                className="h-3.5 w-3.5 accent-[#e7c989]"
                type="checkbox"
                onChange={onSelectAll}
              />
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
          {pageProfiles.map((profile) => (
            <ProfileRow
              key={profile.id}
              profile={profile}
              selected={selectedIds.has(profile.id)}
              workspaces={workspaces}
              onDelete={() => onDelete(profile)}
              onEdit={() => onEdit(profile)}
              onSelect={() => onSelect(profile.id)}
              onStart={() => onStart(profile)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileRow({
  onDelete,
  onEdit,
  onSelect,
  onStart,
  profile,
  selected
}: {
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
  onStart: () => void;
  profile: ControlProfile;
  selected: boolean;
  workspaces: Workspace[];
}) {
  return (
    <tr className="group text-[13px] text-[#f4ecdc]/[0.72] transition hover:bg-[#e7c989]/[0.055]">
      <BodyCell>
        <input
          aria-label={`Select ${profile.name}`}
          checked={selected}
          className="h-3.5 w-3.5 accent-[#e7c989]"
          type="checkbox"
          onChange={onSelect}
        />
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
          {profile.tags.length > 0 ? (
            profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.04] px-1.5 py-0.5 text-[11px] text-[#f4ecdc]/[0.54]"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#f4ecdc]/[0.34]">No tags</span>
          )}
        </div>
      </BodyCell>
      <BodyCell>
        <div className="flex max-w-[168px] items-center gap-2 rounded-lg border border-[#e7c989]/[0.08] bg-black/[0.14] px-2.5 py-1.5 text-xs text-[#f4ecdc]/[0.48]">
          <FileText className="shrink-0 text-[#e7c989]/[0.64]" size={14} />
          <span className="truncate">{profile.notes || "No notes yet"}</span>
        </div>
      </BodyCell>
      <BodyCell>{profile.lastActivity}</BodyCell>
      <BodyCell>{profile.created}</BodyCell>
      <BodyCell>{profile.runtime}</BodyCell>
      <BodyCell>
        <div className="flex justify-end gap-1">
          <Button
            aria-label={`Start ${profile.name}`}
            className="h-8 rounded-lg border-[#e7c989]/[0.42] bg-[#e7c989]/[0.16] px-2.5 text-xs text-[#f4ecdc] hover:border-[#e7c989]/[0.60] hover:bg-[#e7c989]/[0.24]"
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

function BottomActionBar({
  onBulkDelete,
  onComingSoon,
  onDuplicate,
  onExport,
  onPageChange,
  onRowsPerPageChange,
  onStart,
  page,
  pageCount,
  rowsPerPage,
  selectedCount,
  totalCount,
  visibleCount
}: {
  onBulkDelete: () => void;
  onComingSoon: (label: string) => void;
  onDuplicate: () => void;
  onExport: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onStart: () => void;
  page: number;
  pageCount: number;
  rowsPerPage: number;
  selectedCount: number;
  totalCount: number;
  visibleCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7c989]/[0.10] bg-[#0b0907]/[0.84] px-4 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <DisabledAction icon={<Tag size={15} />} label="Tag" onClick={() => onComingSoon("Bulk tagging")} />
        <DisabledAction icon={<MoveRight size={15} />} label="Move" onClick={() => onComingSoon("Bulk move")} />
        <ActionButton icon={<Copy size={15} />} label="Duplicate" onClick={onDuplicate} />
        <ActionButton icon={<Download size={15} />} label="Export" onClick={onExport} />
        <ActionButton icon={<Play size={15} />} label="Start" onClick={onStart} />
        <DisabledAction icon={<Pause size={15} />} label="Pause" onClick={() => onComingSoon("Bulk pause")} />
        <ActionButton disabled={selectedCount === 0} icon={<Trash2 size={15} />} label="Delete" onClick={onBulkDelete} />
      </div>

      <div className="flex items-center gap-2 text-xs text-[#f4ecdc]/[0.42]">
        <GripVertical size={14} />
        <label className="flex items-center gap-1">
          Rows
          <select
            className="rounded-md border border-[#e7c989]/[0.12] bg-[#15120d] px-2 py-1 text-[#f4ecdc]"
            value={rowsPerPage}
            onChange={(event) => onRowsPerPageChange(Number(event.currentTarget.value))}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <span className="mx-1 h-1 w-1 rounded-full bg-[#f4ecdc]/[0.22]" />
        {visibleCount === 0 ? "0" : `${(page - 1) * rowsPerPage + 1}-${(page - 1) * rowsPerPage + visibleCount}`} of {totalCount}
        <IconButton
          className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]"
          disabled={page <= 1}
          label="Previous page"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft size={15} />
        </IconButton>
        <span>
          {page}/{pageCount}
        </span>
        <IconButton
          className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]"
          disabled={page >= pageCount}
          label="Next page"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          <ChevronRight size={15} />
        </IconButton>
      </div>
    </div>
  );
}

function ActionButton({
  disabled,
  icon,
  label,
  onClick
}: {
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex h-8 items-center gap-2 rounded-lg border border-transparent px-2.5 text-xs text-[#f4ecdc]/[0.58] transition hover:border-[#e7c989]/[0.12] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc] disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function DisabledAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#e7c989]/[0.08] px-2.5 text-xs text-[#f4ecdc]/[0.34] transition hover:bg-[#f4ecdc]/[0.04]"
      title={`${label} is coming soon`}
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
      <span className="text-[10px]">Soon</span>
    </button>
  );
}

function FilterPanel({
  filters,
  onChange,
  onClear,
  onClose,
  tagOptions,
  workspaces
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
  tagOptions: string[];
  workspaces: Workspace[];
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.56] p-4 backdrop-blur-md">
      <section className="w-full max-w-lg rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] shadow-[0_34px_120px_rgba(0,0,0,0.62)]">
        <div className="flex items-center justify-between border-b border-[#e7c989]/[0.10] p-5">
          <div>
            <div className="text-xs font-semibold uppercase text-[#e7c989]">Filters</div>
            <h2 className="mt-2 text-xl font-semibold text-[#f4ecdc]">Refine profiles</h2>
          </div>
          <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Close filters" onClick={onClose}>
            <X size={16} />
          </IconButton>
        </div>
        <div className="grid gap-4 p-5">
          <Field label="Status">
            <select
              className="field-input"
              value={filters.status}
              onChange={(event) =>
                onChange({ ...filters, status: event.currentTarget.value as FilterState["status"] })
              }
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Workspace">
            <select
              className="field-input"
              value={filters.workspace}
              onChange={(event) => onChange({ ...filters, workspace: event.currentTarget.value })}
            >
              <option value={ALL_WORKSPACES}>{ALL_WORKSPACES}</option>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.label}>
                  {workspace.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tag">
            <select
              className="field-input"
              value={filters.tag}
              onChange={(event) => onChange({ ...filters, tag: event.currentTarget.value })}
            >
              <option value="">Any tag</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#e7c989]/[0.10] p-5">
          <Button className="border-[#e7c989]/[0.12] text-[#f4ecdc]/[0.66] hover:bg-[#f4ecdc]/[0.06]" tone="ghost" onClick={onClear}>
            Clear filters
          </Button>
          <Button className="border-[#e7c989]/[0.50] bg-[#e7c989] text-[#120f0a] hover:bg-[#f4ecdc]" tone="primary" onClick={onClose}>
            Apply
          </Button>
        </div>
      </section>
    </div>
  );
}

function WorkspacesPage({
  onCreateWorkspace,
  onOpenWorkspace,
  profiles,
  workspaces
}: {
  onCreateWorkspace: () => void;
  onOpenWorkspace: (workspace: string) => void;
  profiles: ControlProfile[];
  workspaces: Workspace[];
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#f4ecdc]/[0.52]">
          Workspaces are persisted locally and filter the profile table.
        </p>
        <Button className="border-[#e7c989]/[0.35] bg-[#e7c989]/[0.14] text-[#f4ecdc]" tone="secondary" onClick={onCreateWorkspace}>
          <FolderPlus size={16} />
          Add workspace
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            className="rounded-[20px] border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-5 text-left transition hover:border-[#e7c989]/[0.24] hover:bg-[#f4ecdc]/[0.045]"
            type="button"
            onClick={() => onOpenWorkspace(workspace.label)}
          >
            <span className={`mb-5 block h-3 w-10 rounded-full ${workspaceToneClass(workspace.tone)}`} />
            <span className="block text-lg font-semibold text-[#f4ecdc]">{workspace.label}</span>
            <span className="mt-2 block text-sm text-[#f4ecdc]/[0.46]">
              {profiles.filter((profile) => profile.workspace === workspace.label).length} profiles
            </span>
            <span className="mt-5 inline-flex rounded-full border border-[#e7c989]/[0.12] px-2.5 py-1 text-xs text-[#f4ecdc]/[0.42]">
              Edit/delete coming soon
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SessionsPage({
  onStart,
  profiles
}: {
  onStart: (profile: ControlProfile) => void;
  profiles: ControlProfile[];
}) {
  const sessionProfiles = profiles.filter((profile) => profile.session.tabs.length > 0);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="grid gap-3 lg:grid-cols-2">
        {sessionProfiles.map((profile) => (
          <article key={profile.id} className="rounded-[20px] border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#f4ecdc]">{profile.name}</h2>
                <p className="mt-1 text-sm text-[#f4ecdc]/[0.46]">
                  {profile.workspace} · {profile.session.tabs.length} tab{profile.session.tabs.length === 1 ? "" : "s"} · {profile.runtime}
                </p>
              </div>
              <StatusPill status={profile.status} />
            </div>
            <div className="mt-4 truncate rounded-xl border border-[#e7c989]/[0.08] bg-black/[0.14] px-3 py-2 text-sm text-[#f4ecdc]/[0.52]">
              Last URL: {profile.session.lastUrl}
            </div>
            <Button className="mt-4 border-[#e7c989]/[0.35] bg-[#e7c989]/[0.14] text-[#f4ecdc]" tone="secondary" onClick={() => onStart(profile)}>
              <Play size={15} />
              Start session
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function ControlSettingsPage({
  onResetDemoData,
  onSettingsChange,
  settings,
  storePath
}: {
  onResetDemoData: () => void;
  onSettingsChange: (patch: SettingsPatch) => Promise<void>;
  settings: BrowserSettings;
  storePath: string;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <SettingCard description="Switch between Noema dark and light themes. System follows the OS preference when possible." label="Theme">
          <select
            className="field-input mt-4"
            value={settings.theme}
            onChange={(event) =>
              onSettingsChange({ theme: event.currentTarget.value as BrowserSettings["theme"] })
            }
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </SettingCard>
        <SettingCard description="English is available in MVP 1.0. Polish localization is coming soon and is disabled until complete." label="Language">
          <button
            className="mt-4 flex h-10 w-full items-center justify-between rounded-lg border border-[#e7c989]/[0.12] bg-[#f4ecdc]/[0.04] px-3 text-sm text-[#f4ecdc]/[0.48]"
            disabled
            type="button"
          >
            English
            <span className="rounded-full border border-[#e7c989]/[0.12] px-2 py-0.5 text-[10px]">
              PL coming soon
            </span>
          </button>
        </SettingCard>
        <SettingCard description="Remote web content runs with Node.js integration disabled and context isolation enabled." label="Privacy">
          <button
            className={`mt-4 flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm transition ${
              settings.privacyMode
                ? "border-[#e7c989]/[0.40] bg-[#e7c989]/[0.10] text-[#f4ecdc]"
                : "border-[#e7c989]/[0.12] bg-[#f4ecdc]/[0.04] text-[#f4ecdc]/[0.62]"
            }`}
            type="button"
            onClick={() => onSettingsChange({ privacyMode: !settings.privacyMode })}
          >
            Strict privacy note
            <Check size={15} />
          </button>
        </SettingCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SettingCard description="Profiles and workspaces are stored in a local JSON file managed by the Electron main process." label="Data">
          <code className="mt-4 block break-all rounded-xl border border-[#e7c989]/[0.10] bg-black/[0.18] p-3 text-xs text-[#f4ecdc]/[0.58]">
            {storePath}
          </code>
          <Button className="mt-4 border-[#6b332b]/[0.30] bg-[#6b332b]/[0.18] text-[#ffe8df]" tone="danger" onClick={onResetDemoData}>
            <RefreshCw size={15} />
            Reset demo data
          </Button>
        </SettingCard>
        <SettingCard description="This package is an unsigned Windows MVP build prepared for local testing." label="About">
          <div className="mt-4 rounded-xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.035] p-3 text-sm text-[#f4ecdc]/[0.62]">
            Noema MVP 1.0
            <br />
            Build: local release
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function TagsOverview({
  onTagClick,
  profiles
}: {
  onTagClick: (tag: string) => void;
  profiles: ControlProfile[];
}) {
  const tags = allTags(profiles);
  return (
    <OverviewShell emptyLabel="No tags yet. Add tags while creating or editing profiles.">
      {tags.map((tag) => (
        <button
          key={tag}
          className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-4 text-left transition hover:border-[#e7c989]/[0.24]"
          type="button"
          onClick={() => onTagClick(tag)}
        >
          <span className="text-sm font-semibold text-[#f4ecdc]">#{tag}</span>
          <span className="mt-2 block text-xs text-[#f4ecdc]/[0.44]">
            {profiles.filter((profile) => profile.tags.includes(tag)).length} profiles
          </span>
        </button>
      ))}
    </OverviewShell>
  );
}

function StatusOverview({ profiles }: { profiles: ControlProfile[] }) {
  return (
    <OverviewShell emptyLabel="No profiles yet.">
      {statusFilters
        .filter((status): status is ProfileStatus => status !== "All")
        .map((status) => (
          <div key={status} className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-4">
            <StatusPill status={status} />
            <div className="mt-4 text-2xl font-semibold text-[#f4ecdc]">
              {profiles.filter((profile) => profile.status === status).length}
            </div>
            <div className="mt-1 text-xs text-[#f4ecdc]/[0.44]">profiles</div>
          </div>
        ))}
    </OverviewShell>
  );
}

function NotesOverview({ profiles }: { profiles: ControlProfile[] }) {
  return (
    <OverviewShell emptyLabel="No notes match this view.">
      {profiles.map((profile) => (
        <article key={profile.id} className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-4">
          <div className="text-sm font-semibold text-[#f4ecdc]">{profile.name}</div>
          <p className="mt-2 text-sm leading-6 text-[#f4ecdc]/[0.54]">
            {profile.notes || "No notes yet."}
          </p>
        </article>
      ))}
    </OverviewShell>
  );
}

function ActivityOverview({ profiles }: { profiles: ControlProfile[] }) {
  return (
    <OverviewShell emptyLabel="No activity yet.">
      {profiles.map((profile) => (
        <article key={profile.id} className="rounded-2xl border border-[#e7c989]/[0.10] bg-[#15120d]/[0.58] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-[#f4ecdc]">{profile.name}</div>
            <StatusPill status={profile.status} />
          </div>
          <p className="mt-2 text-sm text-[#f4ecdc]/[0.48]">
            Last activity: {profile.lastActivity} · Runtime: {profile.runtime}
          </p>
        </article>
      ))}
    </OverviewShell>
  );
}

function OverviewShell({ children, emptyLabel }: { children: ReactNode[]; emptyLabel: string }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [];
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      {items.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items}</div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#e7c989]/[0.14] bg-[#f4ecdc]/[0.025] px-6 py-14 text-center text-sm text-[#f4ecdc]/[0.42]">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function ComingSoonPage({
  compact,
  copy,
  title
}: {
  compact?: boolean;
  copy: string;
  title: string;
}) {
  return (
    <div className={`grid flex-1 place-items-center p-6 ${compact ? "min-h-[320px]" : "min-h-0"}`}>
      <div className="max-w-md rounded-[24px] border border-[#e7c989]/[0.14] bg-[#15120d]/[0.68] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7c989]/[0.18] bg-[#e7c989]/[0.10] text-[#e7c989]">
          <Sparkles size={22} />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-[#f4ecdc]">{title} is coming soon.</h2>
        <p className="mt-3 text-sm leading-6 text-[#f4ecdc]/[0.52]">{copy}</p>
      </div>
    </div>
  );
}

function ProfileModal({
  error,
  form,
  mode,
  onCancel,
  onChange,
  onSubmit,
  workspaces
}: {
  error: string | null;
  form: ProfileFormState;
  mode: "create" | "edit";
  onCancel: () => void;
  onChange: (form: ProfileFormState) => void;
  onSubmit: (event: FormEvent) => void;
  workspaces: string[];
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.62] p-4 backdrop-blur-md">
      <form
        className="w-full max-w-xl rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] shadow-[0_34px_120px_rgba(0,0,0,0.62)]"
        onSubmit={onSubmit}
      >
        <div className="flex items-start justify-between border-b border-[#e7c989]/[0.10] p-5">
          <div>
            <div className="text-xs font-semibold uppercase text-[#e7c989]">
              {mode === "create" ? "Create profile" : "Edit profile"}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-[#f4ecdc]">
              {mode === "create" ? "New Noema profile" : "Profile details"}
            </h2>
          </div>
          <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label="Close profile modal" onClick={onCancel}>
            <X size={16} />
          </IconButton>
        </div>

        <div className="grid gap-4 p-5">
          {error ? (
            <div className="rounded-xl border border-[#6b332b]/[0.26] bg-[#6b332b]/[0.14] px-3 py-2 text-xs text-[#ffe8df]/[0.82]">
              {error}
            </div>
          ) : null}
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
                  <option key={workspace} value={workspace}>
                    {workspace}
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
          <p className="text-xs leading-5 text-[#f4ecdc]/[0.42]">
            Profile names must be unique in MVP 1.0 so Start, Edit and Delete actions remain clear.
          </p>
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

function WorkspaceModal({
  onCancel,
  onChange,
  onSubmit,
  value
}: {
  onCancel: () => void;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  value: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.62] p-4 backdrop-blur-md">
      <form
        className="w-full max-w-md rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.62)]"
        onSubmit={onSubmit}
      >
        <h2 className="text-xl font-semibold text-[#f4ecdc]">Add workspace</h2>
        <p className="mt-2 text-sm text-[#f4ecdc]/[0.52]">
          Workspaces are local project filters for Noema profiles.
        </p>
        <Field label="Workspace name">
          <input
            autoFocus
            className="field-input mt-4"
            placeholder="New project"
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button className="border-[#e7c989]/[0.12] text-[#f4ecdc]/[0.66]" tone="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="border-[#e7c989]/[0.50] bg-[#e7c989] text-[#120f0a]" disabled={!value.trim()} tone="primary" type="submit">
            Create workspace
          </Button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmation({
  label,
  onCancel,
  onConfirm
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.62] p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[24px] border border-[#e7c989]/[0.16] bg-[#0f0c08] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.62)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#6b332b]/[0.28] bg-[#6b332b]/[0.18] text-[#ffe8df]">
            <Trash2 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#f4ecdc]">Delete {label}?</h2>
            <p className="mt-2 text-sm leading-6 text-[#f4ecdc]/[0.52]">
              This removes local Noema profile metadata and saved profile session state.
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
        <h2 className="mt-5 text-xl font-semibold text-[#f4ecdc]">
          {hasProfiles ? "No profiles match this view." : "Create your first Noema profile."}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#f4ecdc]/[0.50]">
          {hasProfiles
            ? "Adjust search, workspace or status filters to return to your profile list."
            : "Profiles keep the name, workspace, tags and notes that frame a browser session."}
        </p>
        {!hasProfiles ? (
          <Button className="mt-6 border-[#e7c989]/[0.50] bg-[#e7c989] text-[#120f0a]" tone="primary" onClick={onCreateProfile}>
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
        <p className="mt-2 text-sm text-[#f4ecdc]/[0.46]">Reading your local Noema profile store.</p>
      </div>
    </div>
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
    <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs ${className}`}>
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

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase text-[#f4ecdc]/[0.42]">{label}</span>
      {children}
    </label>
  );
}

function MiniSetting({
  disabled,
  icon,
  label,
  onClick
}: {
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e7c989]/[0.10] bg-[#f4ecdc]/[0.04] text-xs text-[#f4ecdc]/[0.56] transition hover:bg-[#f4ecdc]/[0.07] hover:text-[#f4ecdc] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      type="button"
      onClick={onClick}
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

function withoutIds(previous: Set<string>, ids: string[]) {
  const next = new Set(previous);
  for (const id of ids) {
    next.delete(id);
  }
  return next;
}

function uniqueProfileName(base: string, profiles: ControlProfile[]) {
  const names = new Set(profiles.map((profile) => profile.name.toLowerCase()));
  if (!names.has(base.toLowerCase())) {
    return base;
  }
  let index = 2;
  while (names.has(`${base} ${index}`.toLowerCase())) {
    index += 1;
  }
  return `${base} ${index}`;
}

function compareProfiles(first: ControlProfile, second: ControlProfile, sortKey: SortKey) {
  if (sortKey === "runtime") {
    return parseRuntime(second.runtime) - parseRuntime(first.runtime);
  }
  if (sortKey === "created") {
    return first.created.localeCompare(second.created);
  }
  if (sortKey === "lastActivity") {
    return activityRank(first.lastActivity) - activityRank(second.lastActivity);
  }
  return first.name.localeCompare(second.name);
}

function parseRuntime(runtime: string) {
  const hours = /(\d+)\s*h/.exec(runtime)?.[1];
  const minutes = /(\d+)\s*m/.exec(runtime)?.[1];
  return (hours ? Number(hours) * 60 : 0) + (minutes ? Number(minutes) : 0);
}

function activityRank(value: string) {
  if (value === "Active now") {
    return 0;
  }
  if (value === "Just now") {
    return 1;
  }
  if (value.includes("min")) {
    return 2;
  }
  if (value.includes("h")) {
    return 3;
  }
  if (value === "Yesterday") {
    return 4;
  }
  return 5;
}

function allTags(profiles: ControlProfile[]) {
  return Array.from(new Set(profiles.flatMap((profile) => profile.tags))).sort((a, b) =>
    a.localeCompare(b)
  );
}

function workspaceToneClass(tone: string) {
  const tones: Record<string, string> = {
    amber: "bg-[#b98f5e]",
    clay: "bg-[#a06458]",
    gold: "bg-[#e7c989]",
    mint: "bg-[#87b296]",
    olive: "bg-[#8e7553]",
    rose: "bg-[#b77a70]",
    sand: "bg-[#d7b27c]",
    slate: "bg-[#6f6659]"
  };
  return tones[tone] ?? "bg-[#e7c989]";
}
