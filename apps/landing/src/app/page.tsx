import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Circle,
  FileText,
  Folder,
  Gauge,
  LayoutDashboard,
  MonitorDown,
  NotebookText,
  PanelRight,
  Play,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  SquareStack,
  TimerReset,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  ["Product", "#product"],
  ["Features", "#features"],
  ["MVP status", "#status"],
  ["Roadmap", "#roadmap"],
  ["Download", "#download"]
];

const productCards = [
  {
    icon: SquareStack,
    title: "Profiles for focused contexts",
    copy: "Create separate local profiles for a client review, market scan, research sprint or content workflow."
  },
  {
    icon: Folder,
    title: "Workspaces for projects",
    copy: "Group related profiles into calm project areas instead of mixing every task into one browser window."
  },
  {
    icon: NotebookText,
    title: "Notes and tags beside sessions",
    copy: "Keep the reason for a profile visible, then return with the right note, tags and workspace already attached."
  },
  {
    icon: Play,
    title: "Start sessions from a dashboard",
    copy: "Open a profile-scoped session from the Control Center, then return when the work is done."
  },
  {
    icon: ShieldCheck,
    title: "Local-first MVP data",
    copy: "Profiles, workspaces and session metadata are stored locally by the desktop app. No account is required."
  },
  {
    icon: PanelRight,
    title: "Assistant panel ready for future AI",
    copy: "The side panel is present as product scaffolding. Real AI behavior is intentionally not enabled yet."
  }
];

const worksToday = [
  "Local profiles with notes, tags and status",
  "Workspace create, edit, delete and filters",
  "Profile-scoped browser sessions",
  "Saved tabs and last URL per profile",
  "Per-profile bookmarks and history",
  "Dark and light theme settings",
  "Packaged Windows MVP build"
];

const limitations = [
  "Unsigned Windows build",
  "Assistant actions are placeholders",
  "No real AI integration yet",
  "No proxy routing",
  "No automation",
  "MVP-level profile isolation"
];

const roadmap = [
  "Stronger profile/session isolation",
  "Real assistant integration",
  "Signed Windows installer",
  "Profile import",
  "Hosted updates",
  "Deeper session history"
];

const walkthrough = [
  {
    step: "01",
    title: "Create a profile",
    copy: "Name the context, assign it to a workspace, add tags and leave the note that explains what this session is for."
  },
  {
    step: "02",
    title: "Start a session",
    copy: "Use the Start button in the Control Center to open a focused browser session tied to that profile."
  },
  {
    step: "03",
    title: "Keep context attached",
    copy: "Tabs and profile state remain associated with the profile, so the next pass starts from the right place."
  }
];

const comparison = [
  ["tabs everywhere", "profile dashboard"],
  ["context lost", "workspaces"],
  ["no project memory", "session notes"],
  ["hard to separate work", "profile-scoped sessions"],
  ["unclear start and stop", "clear start/stop flow"]
];

const faqs = [
  {
    question: "Is Noema a full browser today?",
    answer:
      "Noema is a usable desktop browser workspace MVP. It has a Control Center, local profiles, profile-scoped sessions and a browser view, but it is still early."
  },
  {
    question: "Does Noema have real AI yet?",
    answer:
      "No. The assistant panel is a placeholder for future AI behavior. The current action buttons show a coming-soon response."
  },
  {
    question: "Are profiles isolated?",
    answer:
      "Profiles use scoped browser session state in the MVP, including per-profile tabs. This is not yet production-grade hardened profile isolation."
  },
  {
    question: "Is the Windows build signed?",
    answer:
      "No. The MVP package is unsigned, so Windows may show a warning before launch. A signed installer is planned later."
  },
  {
    question: "Can I use it for real work?",
    answer:
      "Yes, for local organization, focused sessions and research workflows. Do not treat it as a hardened enterprise browser yet."
  },
  {
    question: "What comes next?",
    answer:
      "The next priorities are stronger session isolation, a real assistant integration, profile import, hosted updates and a signed installer."
  }
];

const mockRows = [
  {
    name: "Research Alpha",
    workspace: "Research",
    status: "Ready",
    tags: "market, notes",
    activity: "12 min ago"
  },
  {
    name: "Market Desk",
    workspace: "Market Watch",
    status: "Active",
    tags: "signals",
    activity: "Now"
  },
  {
    name: "Content Studio",
    workspace: "Content",
    status: "Ready",
    tags: "outline",
    activity: "Today"
  },
  {
    name: "Client Review",
    workspace: "Clients",
    status: "Paused",
    tags: "feedback",
    activity: "Yesterday"
  },
  {
    name: "Launch Notes",
    workspace: "Research",
    status: "Ready",
    tags: "mvp",
    activity: "Mon"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070604] text-[#f7efe1]">
      <Navigation />
      <Hero />
      <WhatItIs />
      <Status />
      <Limitations />
      <Roadmap />
      <Walkthrough />
      <Comparison />
      <Download />
      <FAQ />
      <Footer />
    </main>
  );
}

function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ead7ad]/[0.09] bg-[#070604]/[0.90] backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[1540px] items-center justify-between px-4 sm:px-6">
        <a className="flex items-center gap-3 text-sm font-semibold text-[#fff8eb]" href="#">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-[#d8b56d]/[0.30] bg-[#d8b56d]/[0.10] text-[11px] text-[#d8b56d]">
            N
          </span>
          <span>Noema</span>
        </a>
        <div className="hidden items-center gap-6 text-xs font-medium text-[#d8cbb3]/[0.62] lg:flex">
          {navItems.map(([label, href]) => (
            <a className="transition hover:text-[#fff8eb]" href={href} key={label}>
              {label}
            </a>
          ))}
        </div>
        <a
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8b56d]/[0.36] bg-[#d8b56d]/[0.13] px-3 text-xs font-semibold text-[#fff2d2] transition hover:border-[#d8b56d]/[0.62] hover:bg-[#d8b56d]/[0.20]"
          href="#download"
        >
          Download MVP
          <ArrowDownToLine size={14} />
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-[#ead7ad]/[0.08] bg-[radial-gradient(circle_at_78%_8%,rgba(216,181,109,0.13),transparent_31%),linear-gradient(180deg,#0b0805_0%,#070604_62%,#0b0906_100%)] px-4 pb-14 pt-7 sm:px-6 lg:pb-16 lg:pt-10">
      <div className="mx-auto grid max-w-[1540px] gap-8 xl:grid-cols-[0.43fr_1fr] xl:items-center">
        <div className="max-w-2xl">
          <Badge>Windows MVP available</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.03] text-[#fff8eb] sm:text-5xl lg:text-6xl">
            Run focused browser sessions from one clean control center.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#d8cbb3]/[0.72] sm:text-lg">
            Organize profiles, workspaces, notes, bookmarks and research sessions without drowning
            in tabs.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href="#download">
              Download Windows MVP
              <ArrowDownToLine size={16} />
            </PrimaryLink>
            <SecondaryLink href="#status">
              See what works
              <ArrowRight size={16} />
            </SecondaryLink>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-2">
            <Metric value="Local" label="profiles and workspaces" />
            <Metric value="Saved" label="tabs and bookmarks" />
            <Metric value="MVP" label="unsigned Windows build" />
          </div>
        </div>
        <ControlCenterMockup />
      </div>
    </section>
  );
}

function ControlCenterMockup() {
  return (
    <div
      className="relative rounded-[28px] border border-[#ead7ad]/[0.15] bg-[#0b0907] p-2 shadow-[0_34px_120px_rgba(0,0,0,0.62)]"
      id="product"
    >
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#f0ce7a]/[0.58] to-transparent" />
      <div className="overflow-hidden rounded-[23px] border border-[#ead7ad]/[0.11] bg-[#100d09]">
        <div className="flex h-12 items-center justify-between border-b border-[#ead7ad]/[0.09] bg-[#15110d] px-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#6d3b30]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b7924b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#718062]" />
            </div>
            <span className="text-xs font-medium text-[#d8cbb3]/[0.60]">Noema Control Center</span>
          </div>
          <span className="hidden rounded-full border border-[#d8b56d]/[0.18] bg-[#d8b56d]/[0.08] px-3 py-1 text-[11px] text-[#ead7ad]/[0.72] sm:block">
            Profile-scoped sessions
          </span>
        </div>

        <div className="grid min-h-[590px] grid-cols-1 lg:grid-cols-[170px_164px_1fr]">
          <ControlSidebar />
          <WorkspaceRail />
          <section className="min-w-0 bg-[#100d09] p-3 sm:p-4">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#ead7ad]/[0.12] bg-[#17130e] px-3 text-xs text-[#d8cbb3]/[0.46]">
                <Search size={15} className="text-[#d8b56d]" />
                Search profiles, tags, notes...
              </div>
              <div className="flex gap-2">
                <button className="hidden h-10 items-center gap-2 rounded-xl border border-[#ead7ad]/[0.11] bg-[#fff8eb]/[0.025] px-3 text-xs text-[#d8cbb3]/[0.62] sm:inline-flex">
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
                <button className="h-10 rounded-xl border border-[#d8b56d]/[0.38] bg-[#d8b56d] px-4 text-xs font-semibold text-[#090704] shadow-[0_12px_28px_rgba(216,181,109,0.14)]">
                  Create profile
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {["Profiles", "Connections", "Tags", "Statuses", "Notes", "Activity"].map((segment) => (
                <span
                  className={`rounded-full border px-3 py-1.5 text-[11px] ${
                    segment === "Profiles"
                      ? "border-[#d8b56d]/[0.28] bg-[#d8b56d]/[0.10] text-[#fff8eb]"
                      : "border-[#ead7ad]/[0.10] text-[#d8cbb3]/[0.44]"
                  }`}
                  key={segment}
                >
                  {segment}
                  {segment === "Connections" ? <span className="ml-1 text-[#d8cbb3]/[0.36]">Soon</span> : null}
                </span>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#ead7ad]/[0.10] bg-[#0b0907]">
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-[1.35fr_0.74fr_1fr_0.92fr_0.88fr_0.72fr] gap-3 border-b border-[#ead7ad]/[0.10] bg-[#15110d] px-4 py-3 text-[10px] uppercase text-[#d8cbb3]/[0.42]">
                    <span>Profile</span>
                    <span>Status</span>
                    <span>Workspace</span>
                    <span>Tags</span>
                    <span>Last activity</span>
                    <span className="text-right">Action</span>
                  </div>
                  {mockRows.map((row) => (
                    <div
                      className="grid grid-cols-[1.35fr_0.74fr_1fr_0.92fr_0.88fr_0.72fr] items-center gap-3 border-b border-[#ead7ad]/[0.06] px-4 py-3 text-xs text-[#d8cbb3]/[0.60] last:border-b-0 hover:bg-[#d8b56d]/[0.045]"
                      key={row.name}
                    >
                      <span className="min-w-0 truncate font-medium text-[#fff8eb]">{row.name}</span>
                      <StatusPill status={row.status} />
                      <span className="truncate">{row.workspace}</span>
                      <span className="truncate">{row.tags}</span>
                      <span className="truncate">{row.activity}</span>
                      <span className="text-right">
                        <button className="rounded-lg border border-[#d8b56d]/[0.34] bg-[#d8b56d]/[0.12] px-3 py-1.5 text-[11px] font-semibold text-[#fff2d2]">
                          Start
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_280px]">
              <div className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#fff8eb]">
                  <FileText size={15} className="text-[#d8b56d]" />
                  Session note
                </div>
                <p className="text-sm leading-6 text-[#d8cbb3]/[0.58]">
                  Compare onboarding pages, keep pricing references open and summarize next
                  review points before switching contexts.
                </p>
              </div>
              <SessionPreview />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ControlSidebar() {
  return (
    <aside className="hidden border-r border-[#ead7ad]/[0.09] bg-[#080706] p-3 lg:block">
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#d8b56d]/[0.18] bg-[#d8b56d]/[0.08] p-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d8b56d]/[0.14] text-[#d8b56d]">
          <LayoutDashboard size={16} />
        </span>
        <div>
          <div className="text-sm font-semibold text-[#fff8eb]">Noema</div>
          <div className="text-[11px] text-[#d8cbb3]/[0.44]">Control Center</div>
        </div>
      </div>
      {["Profiles", "Workspaces", "Sessions", "Automation", "Insights", "Settings"].map((item) => (
        <div
          className={`mb-1 rounded-lg border px-3 py-2 text-xs ${
            item === "Profiles"
              ? "border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.10] text-[#fff8eb]"
              : "border-transparent text-[#d8cbb3]/[0.50]"
          }`}
          key={item}
        >
          {item}
        </div>
      ))}
      <div className="mt-9 rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-[#fff8eb]">Personal</div>
          <Settings2 size={13} className="text-[#d8cbb3]/[0.38]" />
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#fff8eb]/[0.08]">
          <div className="h-full w-[64%] rounded-full bg-[#d8b56d]" />
        </div>
        <div className="mt-2 text-[11px] text-[#d8cbb3]/[0.40]">Local MVP data</div>
      </div>
    </aside>
  );
}

function WorkspaceRail() {
  return (
    <aside className="hidden border-r border-[#ead7ad]/[0.09] bg-[#0b0907] p-3 lg:block">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase text-[#d8cbb3]/[0.40]">
          Workspaces
        </span>
        <span className="rounded-md border border-[#ead7ad]/[0.10] px-2 py-1 text-[11px] text-[#d8cbb3]/[0.45]">
          +
        </span>
      </div>
      {["Research", "Clients", "Content", "Market Watch", "Social", "Archive"].map((workspace) => (
        <div
          className={`mb-1 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs ${
            workspace === "Research"
              ? "border-[#d8b56d]/[0.26] bg-[#d8b56d]/[0.10] text-[#fff8eb]"
              : "border-transparent text-[#d8cbb3]/[0.48]"
          }`}
          key={workspace}
        >
          <span className="h-2.5 w-2.5 rounded bg-[#d8b56d]/[0.85]" />
          {workspace}
        </div>
      ))}
    </aside>
  );
}

function SessionPreview() {
  return (
    <div className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#fff8eb]">
        <PanelRight size={15} className="text-[#d8b56d]" />
        Browser session preview
      </div>
      <div className="overflow-hidden rounded-xl border border-[#ead7ad]/[0.10] bg-[#080706]">
        <div className="border-b border-[#ead7ad]/[0.08] p-2">
          <div className="h-5 rounded-md bg-[#fff8eb]/[0.07]" />
        </div>
        <div className="grid h-28 grid-cols-[1fr_64px]">
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 rounded bg-[#d8b56d]/[0.28]" />
            <div className="h-2 w-full rounded bg-[#fff8eb]/[0.07]" />
            <div className="h-2 w-4/5 rounded bg-[#fff8eb]/[0.07]" />
            <div className="h-8 rounded-lg border border-[#ead7ad]/[0.08] bg-[#fff8eb]/[0.03]" />
          </div>
          <div className="border-l border-[#ead7ad]/[0.08] bg-[#d8b56d]/[0.05] p-2">
            <div className="mb-2 h-2 rounded bg-[#d8b56d]/[0.35]" />
            <div className="h-12 rounded-md bg-[#fff8eb]/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatItIs() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-20 sm:px-6 lg:py-24" id="features">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="What it is"
          title="A browser workspace, not another tab pile."
          copy="Noema gives browser work a home base: profiles, workspaces, notes and sessions arranged like a serious desktop tool."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {productCards.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Status() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] bg-[#0a0806] px-4 py-20 sm:px-6 lg:py-24" id="status">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeader
          eyebrow="MVP status"
          title="What works today."
          copy="The current build is intentionally practical and honest. These are the working product surfaces in the Windows MVP."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {worksToday.map((item) => (
            <StatusItem icon={Check} key={item} tone="ready">
              {item}
            </StatusItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function Limitations() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeader
          eyebrow="Honest limitations"
          title="Still an MVP, clearly marked."
          copy="Noema is useful as a local workspace manager today, but the release keeps unfinished systems visible as coming soon instead of pretending they work."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {limitations.map((item) => (
            <StatusItem icon={X} key={item} tone="limit">
              {item}
            </StatusItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-20 sm:px-6 lg:py-24" id="roadmap">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeader
          eyebrow="Roadmap"
          title="What is coming next."
          copy="Noema is not presenting future work as finished. These are the next foundations before a broader release."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmap.map((item) => (
            <StatusItem icon={TimerReset} key={item} tone="next">
              {item}
            </StatusItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function Walkthrough() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] bg-[#0a0806] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="Product walkthrough"
          title="Three steps, one working rhythm."
          copy="The MVP centers on a practical loop for research, content and client work."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {walkthrough.map((item) => (
            <article
              className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-6 transition hover:border-[#d8b56d]/[0.24] hover:bg-[#fff8eb]/[0.04]"
              key={item.step}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8b56d]/[0.22] bg-[#d8b56d]/[0.10] text-xs font-semibold text-[#d8b56d]">
                {item.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#fff8eb]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#d8cbb3]/[0.62]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeader
          eyebrow="Comparison"
          title="Normal browser vs Noema."
          copy="Noema starts from the dashboard instead of the tab strip, so each session begins with a clear context."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#ead7ad]/[0.10] bg-[#0b0907]">
          <div className="grid grid-cols-2 border-b border-[#ead7ad]/[0.10] bg-[#15110d] text-sm font-semibold text-[#fff8eb]">
            <div className="border-r border-[#ead7ad]/[0.10] p-4">Normal browser</div>
            <div className="p-4">Noema</div>
          </div>
          {comparison.map(([normal, noema]) => (
            <div className="grid grid-cols-2 border-b border-[#ead7ad]/[0.07] last:border-b-0" key={normal}>
              <div className="flex items-center gap-2 border-r border-[#ead7ad]/[0.10] p-4 text-sm text-[#d8cbb3]/[0.54]">
                <X size={15} className="shrink-0 text-[#8b5546]" />
                {normal}
              </div>
              <div className="flex items-center gap-2 p-4 text-sm text-[#fff8eb]">
                <Check size={15} className="shrink-0 text-[#d8b56d]" />
                {noema}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Download() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] bg-[#0a0806] px-4 py-20 sm:px-6 lg:py-24" id="download">
      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-[#d8b56d]/[0.24] bg-[linear-gradient(135deg,rgba(216,181,109,0.13),rgba(255,248,235,0.025)_42%,rgba(135,178,150,0.08))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Badge>Early unsigned build</Badge>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-[#fff8eb] md:text-5xl">
              Try the Noema Windows MVP.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d8cbb3]/[0.70]">
              This is an early unsigned Windows build. Unzip the package, open the extracted
              folder and run Noema.exe.
            </p>
            <p className="mt-4 max-w-2xl rounded-2xl border border-[#d8b56d]/[0.18] bg-[#070604]/[0.56] p-4 text-sm leading-6 text-[#fff2d2]/[0.80]">
              Do not move Noema.exe out of its folder. The app needs the bundled files beside it.
            </p>
          </div>
          <div className="rounded-2xl border border-[#ead7ad]/[0.12] bg-[#070604]/[0.72] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <PrimaryLink href="#setup-notes">
                Download Windows MVP
                <MonitorDown size={16} />
              </PrimaryLink>
              <SecondaryLink href="#setup-notes">
                Read setup notes
                <ArrowRight size={16} />
              </SecondaryLink>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[#d8cbb3]/[0.60]" id="setup-notes">
              <SetupNote label="1" text="Unzip Noema-Windows-MVP.zip." />
              <SetupNote label="2" text="Open the extracted folder." />
              <SetupNote label="3" text="Double-click Noema.exe from inside that folder." />
              <SetupNote label="4" text="If Windows warns you, choose More info, then Run anyway." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[900px]">
        <SectionHeader
          eyebrow="FAQ"
          title="Honest answers for an early build."
          copy="Noema is useful today, but it is still an MVP. The landing page should make that clear."
        />
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              className="group rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-5 transition hover:border-[#d8b56d]/[0.24]"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#fff8eb]">
                {faq.question}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#d8b56d]/[0.22] text-[#d8b56d] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-[#d8cbb3]/[0.64]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 border-t border-[#ead7ad]/[0.08] pt-8 text-sm text-[#d8cbb3]/[0.52] md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold text-[#fff8eb]">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#d8b56d]/[0.28] bg-[#d8b56d]/[0.10] text-xs text-[#d8b56d]">
              N
            </span>
            Noema
          </div>
          <div className="mt-3 max-w-md">
            Focused browser workspaces for research, content and client work.
          </div>
        </div>
        <div className="flex flex-wrap gap-5">
          {navItems.map(([label, href]) => (
            <a className="transition hover:text-[#fff8eb]" href={href} key={label}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({
  copy,
  eyebrow,
  title
}: {
  copy: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#fff8eb] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#d8cbb3]/[0.66]">{copy}</p>
    </div>
  );
}

function FeatureCard({
  copy,
  icon: Icon,
  title
}: {
  copy: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <article className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,248,235,0.035)] transition hover:border-[#d8b56d]/[0.24] hover:bg-[#fff8eb]/[0.04]">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#d8b56d]/[0.20] bg-[#d8b56d]/[0.10] text-[#d8b56d]">
        <Icon size={18} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[#fff8eb]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#d8cbb3]/[0.62]">{copy}</p>
    </article>
  );
}

function StatusItem({
  children,
  icon: Icon,
  tone
}: {
  children: ReactNode;
  icon: LucideIcon;
  tone: "ready" | "next" | "limit";
}) {
  const toneClass =
    tone === "ready"
      ? "border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.10] text-[#d8b56d]"
      : tone === "limit"
        ? "border-[#8b5546]/[0.24] bg-[#8b5546]/[0.10] text-[#d7a092]"
        : "border-[#87b296]/[0.22] bg-[#87b296]/[0.08] text-[#a6c8ad]";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-4">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${toneClass}`}>
        <Icon size={15} />
      </span>
      <span className="text-sm font-medium text-[#fff8eb]/[0.88]">{children}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Active"
      ? "border-[#87b296]/[0.25] bg-[#87b296]/[0.10] text-[#b9d2be]"
      : status === "Paused"
        ? "border-[#ead7ad]/[0.12] bg-[#fff8eb]/[0.04] text-[#d8cbb3]/[0.54]"
        : "border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.08] text-[#fff2d2]";

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] ${className}`}>
      <Circle fill="currentColor" size={6} />
      {status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-3">
      <div className="text-sm font-semibold text-[#fff8eb]">{value}</div>
      <div className="mt-1 text-[11px] text-[#d8cbb3]/[0.46]">{label}</div>
    </div>
  );
}

function SetupNote({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#ead7ad]/[0.09] bg-[#fff8eb]/[0.025] p-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#d8b56d]/[0.12] text-xs font-semibold text-[#d8b56d]">
        {label}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.08] px-3 py-1.5 text-xs font-semibold uppercase text-[#fff2d2]">
      <Gauge size={13} />
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-xs font-semibold uppercase text-[#d8b56d]">{children}</div>;
}

function PrimaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d8b56d]/[0.36] bg-[#d8b56d] px-4 text-sm font-semibold text-[#090704] shadow-[0_14px_34px_rgba(216,181,109,0.18)] transition hover:bg-[#efcd82]"
      href={href}
    >
      {children}
    </a>
  );
}

function SecondaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#ead7ad]/[0.14] bg-[#fff8eb]/[0.025] px-4 text-sm font-semibold text-[#fff8eb] transition hover:border-[#d8b56d]/[0.34] hover:bg-[#fff8eb]/[0.05]"
      href={href}
    >
      {children}
    </a>
  );
}
