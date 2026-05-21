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
  MoreHorizontal,
  MoveRight,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Workflow
} from "lucide-react";
import type { ReactNode } from "react";
import { Button, IconButton } from "@browser/ui";

export type ControlProfile = {
  id: string;
  name: string;
  workspace: string;
  status: "Ready" | "Review" | "Paused" | "Running";
  proxy: "None" | "Residential" | "Workspace" | "Pending";
  tags: string[];
  notes: string;
  lastActivity: string;
  created: string;
  runtime: string;
};

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

const profiles: ControlProfile[] = [
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

const segments = ["Profiles", "Proxies", "Tags", "Statuses", "Notes", "Activity"];

type ControlCenterProps = {
  onStartProfile: (profile: ControlProfile) => void;
};

export function ControlCenter({ onStartProfile }: ControlCenterProps) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_28%_-14%,rgba(231,201,137,0.12),transparent_34%),linear-gradient(135deg,#050403_0%,#0b0907_46%,#050504_100%)] text-[#f4ecdc]">
      <PrimarySidebar />
      <WorkspaceSidebar />

      <main className="flex min-w-0 flex-1 flex-col bg-[#080706]/[0.55]">
        <ControlTopBar />

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
                  8 profiles
                  <span className="h-1 w-1 rounded-full bg-[#f4ecdc]/[0.24]" />
                  Local mock data
                </div>
              </div>

              <div className="mt-4 flex gap-1.5 overflow-x-auto pb-3">
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
            </div>

            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-0 text-left">
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
                  <col className="w-[118px]" />
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
                  {profiles.map((profile) => (
                    <ProfileRow
                      key={profile.id}
                      profile={profile}
                      onStart={() => onStartProfile(profile)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <BottomActionBar />
          </section>
        </div>
      </main>
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

function WorkspaceSidebar() {
  return (
    <aside className="hidden w-[196px] shrink-0 flex-col border-r border-[#e7c989]/[0.10] bg-[#0b0907]/[0.72] p-3.5 2xl:flex">
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
      >
        <FolderPlus size={16} />
        Add workspace
      </Button>

      <div className="mt-4 space-y-1">
        {workspaces.map((workspace) => (
          <button
            key={workspace.label}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
              workspace.label === "Research"
                ? "border-[#e7c989]/[0.26] bg-[#e7c989]/[0.10] text-[#f4ecdc] shadow-[inset_2px_0_0_rgba(231,201,137,0.70)]"
                : "border-transparent text-[#f4ecdc]/[0.58] hover:border-[#e7c989]/[0.10] hover:bg-[#f4ecdc]/[0.05] hover:text-[#f4ecdc]"
            }`}
            type="button"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className={`h-3 w-3 rounded ${workspace.tone}`} />
              <Folder className="shrink-0 text-[#e7c989]/[0.72]" size={16} />
              <span className="truncate">{workspace.label}</span>
            </span>
            {workspace.label === "Research" ? <Check size={14} /> : null}
          </button>
        ))}
      </div>

      <div className="mt-auto rounded-[18px] border border-[#e7c989]/[0.10] bg-black/[0.16] p-3.5">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c989]">
          Status
        </div>
        <p className="mt-2 text-xs leading-5 text-[#f4ecdc]/[0.45]">
          Proxy and runtime fields are neutral placeholders in this mock dashboard.
        </p>
      </div>
    </aside>
  );
}

function ControlTopBar() {
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
        />
      </form>
      <Button className="hidden h-9 border-[#e7c989]/[0.12] px-3 text-[#f4ecdc]/[0.64] hover:bg-[#f4ecdc]/[0.06] md:inline-flex" tone="ghost">
        <ArrowUpDown size={15} />
        By name
      </Button>
      <IconButton className="h-9 w-9 hover:bg-[#f4ecdc]/[0.08]" label="Refresh">
        <RefreshCw size={16} />
      </IconButton>
      <Button className="hidden h-9 border-[#e7c989]/[0.12] px-3 text-[#f4ecdc]/[0.64] hover:bg-[#f4ecdc]/[0.06] md:inline-flex" tone="ghost">
        <Filter size={15} />
        Filters
      </Button>
      <Button className="h-9 border-[#e7c989]/[0.50] bg-[linear-gradient(180deg,#ead29a,#c8a864)] px-3.5 text-[#120f0a] shadow-[0_14px_36px_rgba(231,201,137,0.14)] hover:bg-[linear-gradient(180deg,#f4ecdc,#d6b978)]" tone="primary">
        <Plus size={16} />
        Create profile
      </Button>
    </div>
  );
}

function ProfileRow({
  onStart,
  profile
}: {
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
          <span className="truncate">{profile.notes}</span>
        </div>
      </BodyCell>
      <BodyCell>{profile.lastActivity}</BodyCell>
      <BodyCell>{profile.created}</BodyCell>
      <BodyCell>{profile.runtime}</BodyCell>
      <BodyCell>
        <div className="flex justify-end gap-2">
          <Button
            className="h-8 rounded-lg border-[#e7c989]/[0.42] bg-[#e7c989]/[0.16] px-3 text-xs text-[#f4ecdc] shadow-[inset_0_1px_0_rgba(255,248,232,0.08)] hover:border-[#e7c989]/[0.60] hover:bg-[#e7c989]/[0.24]"
            tone="primary"
            onClick={onStart}
          >
            <Play size={13} />
            Start
          </Button>
          <IconButton className="h-8 w-8 hover:bg-[#f4ecdc]/[0.08]" label={`More actions for ${profile.name}`}>
            <MoreHorizontal size={16} />
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

function StatusPill({ status }: { status: ControlProfile["status"] }) {
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

function BottomActionBar() {
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
        1-8 of 8
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
