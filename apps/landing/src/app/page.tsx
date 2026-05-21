import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronRight,
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
  ShieldCheck,
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

const whatItIs = [
  {
    icon: SquareStack,
    title: "Profiles for focused contexts",
    copy: "Give each research track, client review or content task its own named browser context."
  },
  {
    icon: Folder,
    title: "Workspaces for projects",
    copy: "Group profiles by the work they belong to so sessions start from a clean dashboard."
  },
  {
    icon: NotebookText,
    title: "Notes beside sessions",
    copy: "Keep lightweight notes attached to profiles while the deeper session system evolves."
  },
  {
    icon: Play,
    title: "Start sessions from a dashboard",
    copy: "Launch a browser session directly from the profile table and return to Control Center."
  },
  {
    icon: ShieldCheck,
    title: "Local-first MVP data",
    copy: "Profile data is stored locally through the Electron main process JSON store."
  },
  {
    icon: PanelRight,
    title: "Assistant panel ready for future AI",
    copy: "The interface is in place today; real AI actions are intentionally not wired yet."
  }
];

const worksToday = [
  "Create, edit and delete profiles",
  "Store profiles locally",
  "Open a browser session from a profile",
  "Search and filter profiles",
  "Use a context side panel",
  "Package runs on Windows"
];

const roadmap = [
  "Isolated browser sessions per profile",
  "Saved tabs per profile",
  "Real assistant integration",
  "Import/export",
  "Signed installer",
  "Hosted landing and updates"
];

const walkthrough = [
  {
    step: "01",
    title: "Create a profile",
    copy: "Name the context, choose a workspace, add tags and capture the note that explains what this session is for."
  },
  {
    step: "02",
    title: "Start a session",
    copy: "Use the Start action in the Control Center to open the browser shell with that profile visible."
  },
  {
    step: "03",
    title: "Keep context attached",
    copy: "Return to the dashboard when the session is done and keep the profile ready for the next pass."
  }
];

const comparison = [
  ["tabs everywhere", "profile dashboard"],
  ["context lost", "workspaces"],
  ["no project memory", "session notes"],
  ["hard to separate work", "local profile store"],
  ["unclear start and stop", "clear start/stop flow"]
];

const faqs = [
  {
    question: "Is Noema a full browser today?",
    answer:
      "It is a usable MVP desktop browser workspace. The Control Center, local profile management and session browser are working, but the product is still early."
  },
  {
    question: "Does Noema have real AI yet?",
    answer:
      "No. The assistant panel is a placeholder interface for future AI features. It does not summarize, automate or process pages yet."
  },
  {
    question: "Are profiles isolated?",
    answer:
      "Not at a production-grade level yet. Profiles are locally stored records associated with sessions in the UI. Fully isolated browser sessions are on the roadmap."
  },
  {
    question: "Is the Windows build signed?",
    answer:
      "No. The MVP build is unsigned, so Windows may warn you before opening it. A signed installer is planned after the product shape is stable."
  },
  {
    question: "Can I use it for real work?",
    answer:
      "Yes, for lightweight local organization and browser sessions. Do not treat it as a hardened production browser or automation platform yet."
  },
  {
    question: "What comes next?",
    answer:
      "The next priorities are isolated profile sessions, saved tabs per profile, import/export and a real assistant integration."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070604] text-[#f5efe3]">
      <Navigation />
      <Hero />
      <WhatItIs />
      <Status />
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
    <header className="sticky top-0 z-50 border-b border-[#ead7ad]/[0.08] bg-[#070604]/[0.88] backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-4 sm:px-6">
        <a className="flex items-center gap-3 text-sm font-semibold tracking-[0.08em] text-[#fff8eb]" href="#">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[#d8b56d]/[0.28] bg-[#d8b56d]/[0.10] text-xs text-[#d8b56d]">
            N
          </span>
          Noema
        </a>
        <div className="hidden items-center gap-6 text-xs font-medium text-[#d8cbb3]/[0.62] lg:flex">
          {navItems.map(([label, href]) => (
            <a className="transition hover:text-[#fff8eb]" href={href} key={label}>
              {label}
            </a>
          ))}
        </div>
        <a
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8b56d]/[0.38] bg-[#d8b56d]/[0.12] px-3 text-xs font-semibold text-[#fff2d2] transition hover:-translate-y-px hover:border-[#d8b56d]/[0.62] hover:bg-[#d8b56d]/[0.18]"
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
    <section className="relative border-b border-[#ead7ad]/[0.08] bg-[radial-gradient(circle_at_70%_0%,rgba(216,181,109,0.12),transparent_34%),linear-gradient(180deg,#090704_0%,#070604_68%,#0b0906_100%)] px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[0.52fr_1fr] xl:items-center">
        <div className="max-w-2xl">
          <Badge>Windows MVP available</Badge>
          <h1 className="mt-5 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#fff8eb] sm:text-5xl lg:text-6xl">
            Run focused browser sessions from one clean control center.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#d8cbb3]/[0.72] sm:text-lg">
            Noema helps you organize browser profiles, workspaces, notes and research sessions
            without drowning in tabs.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href="#download">
              Download Windows MVP
              <ArrowDownToLine size={16} />
            </PrimaryLink>
            <SecondaryLink href="#status">
              View what works
              <ChevronRight size={16} />
            </SecondaryLink>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 text-xs text-[#d8cbb3]/[0.56]">
            <Metric value="Local" label="profile store" />
            <Metric value="Windows" label="MVP build" />
            <Metric value="Early" label="unsigned release" />
          </div>
        </div>
        <ControlCenterMockup />
      </div>
    </section>
  );
}

function ControlCenterMockup() {
  const rows: Array<[string, string, string, string, string]> = [
    ["Research Alpha", "Ready", "Research", "market, ai", "Start"],
    ["Market Desk", "Running", "Market Watch", "signals", "Open"],
    ["Content Studio", "Review", "Content", "drafts", "Start"],
    ["Client Review", "Paused", "Clients", "notes", "Start"],
    ["Launch Notes", "Ready", "Research", "mvp", "Start"]
  ];

  return (
    <div
      className="relative rounded-[26px] border border-[#ead7ad]/[0.14] bg-[#0b0907] p-2 shadow-[0_34px_120px_rgba(0,0,0,0.58)]"
      id="product"
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#f0ce7a]/[0.55] to-transparent" />
      <div className="overflow-hidden rounded-[21px] border border-[#ead7ad]/[0.10] bg-[#100d09]">
        <div className="flex h-12 items-center justify-between border-b border-[#ead7ad]/[0.09] bg-[#15110d] px-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#6d3b30]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b7924b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6f765c]" />
            </div>
            <span className="text-xs font-medium text-[#d8cbb3]/[0.55]">Noema Control Center</span>
          </div>
          <span className="hidden rounded-full border border-[#d8b56d]/[0.18] bg-[#d8b56d]/[0.08] px-3 py-1 text-[11px] text-[#ead7ad]/[0.70] sm:block">
            Main-process local store
          </span>
        </div>
        <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[184px_176px_1fr]">
          <aside className="hidden border-r border-[#ead7ad]/[0.09] bg-[#080706] p-3 lg:block">
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#d8b56d]/[0.18] bg-[#d8b56d]/[0.08] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d8b56d]/[0.14] text-[#d8b56d]">
                <LayoutDashboard size={16} />
              </span>
              <div>
                <div className="text-sm font-semibold text-[#fff8eb]">Noema</div>
                <div className="text-[11px] text-[#d8cbb3]/[0.42]">Control Center</div>
              </div>
            </div>
            {["Profiles", "Workspaces", "Sessions", "Automation", "Insights", "Settings"].map(
              (item) => (
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
              )
            )}
            <div className="mt-10 rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-3">
              <div className="text-xs font-medium text-[#fff8eb]">Personal workspace</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#fff8eb]/[0.08]">
                <div className="h-full w-[64%] rounded-full bg-[#d8b56d]" />
              </div>
              <div className="mt-2 text-[11px] text-[#d8cbb3]/[0.38]">Local MVP</div>
            </div>
          </aside>
          <aside className="hidden border-r border-[#ead7ad]/[0.09] bg-[#0b0907] p-3 lg:block">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8cbb3]/[0.38]">
                Workspaces
              </span>
              <span className="rounded-md border border-[#ead7ad]/[0.10] px-2 py-1 text-[11px] text-[#d8cbb3]/[0.45]">
                +
              </span>
            </div>
            {["Research", "Clients", "Content", "Market Watch", "Social", "Archive"].map(
              (workspace) => (
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
              )
            )}
          </aside>
          <section className="min-w-0 bg-[#100d09] p-3 sm:p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#ead7ad]/[0.12] bg-[#17130e] px-3 text-xs text-[#d8cbb3]/[0.42]">
                <Search size={15} className="text-[#d8b56d]" />
                Search profiles, tags, notes...
              </div>
              <button className="h-10 rounded-xl border border-[#d8b56d]/[0.36] bg-[#d8b56d] px-4 text-xs font-semibold text-[#090704] shadow-[0_12px_28px_rgba(216,181,109,0.14)]">
                Create profile
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {["Profiles", "Proxies", "Tags", "Statuses", "Notes", "Activity"].map((segment) => (
                <span
                  className={`rounded-full border px-3 py-1.5 text-[11px] ${
                    segment === "Profiles"
                      ? "border-[#d8b56d]/[0.28] bg-[#d8b56d]/[0.10] text-[#fff8eb]"
                      : "border-[#ead7ad]/[0.10] text-[#d8cbb3]/[0.44]"
                  }`}
                  key={segment}
                >
                  {segment}
                </span>
              ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#ead7ad]/[0.10] bg-[#0b0907]">
              <div className="grid grid-cols-[1.3fr_0.7fr_1fr_1fr_0.8fr] gap-2 border-b border-[#ead7ad]/[0.10] bg-[#15110d] px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-[#d8cbb3]/[0.38]">
                <span>Profile</span>
                <span>Status</span>
                <span>Workspace</span>
                <span className="hidden sm:block">Tags</span>
                <span className="text-right">Action</span>
              </div>
              {rows.map(([name, status, workspace, tags, action]) => (
                <div
                  className="grid grid-cols-[1.3fr_0.7fr_1fr_1fr_0.8fr] items-center gap-2 border-b border-[#ead7ad]/[0.06] px-4 py-3 text-xs text-[#d8cbb3]/[0.60] last:border-b-0 hover:bg-[#d8b56d]/[0.045]"
                  key={name}
                >
                  <span className="min-w-0 truncate font-medium text-[#fff8eb]">{name}</span>
                  <span>
                    <StatusPill status={status} />
                  </span>
                  <span className="truncate">{workspace}</span>
                  <span className="hidden truncate sm:block">{tags}</span>
                  <span className="text-right">
                    <button className="rounded-lg border border-[#d8b56d]/[0.34] bg-[#d8b56d]/[0.12] px-3 py-1.5 text-[11px] font-medium text-[#fff2d2]">
                      {action}
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_260px]">
              <div className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#fff8eb]">
                  <FileText size={15} className="text-[#d8b56d]" />
                  Notes attached to the selected profile
                </div>
                <p className="text-sm leading-6 text-[#d8cbb3]/[0.56]">
                  Track sources, decisions and the next thing to check before opening another tab.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#15110d] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#fff8eb]">
                  <PanelRight size={15} className="text-[#d8b56d]" />
                  Session preview
                </div>
                <div className="h-20 rounded-xl border border-[#ead7ad]/[0.10] bg-[#080706] p-3 text-[11px] text-[#d8cbb3]/[0.46]">
                  Browser shell with address bar and assistant panel placeholder.
                </div>
              </div>
            </div>
          </section>
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
          copy="Noema is for people who need to separate research, client work, content planning and project browsing without rebuilding context every time."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {whatItIs.map((item) => (
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
      <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader
          eyebrow="MVP status"
          title="What works today."
          copy="This is the honest current product surface. The MVP is useful, local and early."
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

function Roadmap() {
  return (
    <section className="border-b border-[#ead7ad]/[0.08] px-4 py-20 sm:px-6 lg:py-24" id="roadmap">
      <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader
          eyebrow="Roadmap"
          title="What is coming next."
          copy="Noema is not claiming more than it has. These are the next product foundations."
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
          title="A simple control flow for browser work."
          copy="The current MVP centers on one loop: create the context, start the session, return with the context still visible."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {walkthrough.map((item) => (
            <article
              className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-6 transition hover:border-[#d8b56d]/[0.22] hover:bg-[#fff8eb]/[0.035]"
              key={item.step}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8b56d]/[0.22] bg-[#d8b56d]/[0.10] text-xs font-semibold text-[#d8b56d]">
                {item.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-[#fff8eb]">
                {item.title}
              </h3>
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
          copy="Noema starts from the idea that the browser should have a project surface, not just a row of tabs."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#ead7ad]/[0.10] bg-[#0b0907]">
          <div className="grid grid-cols-2 border-b border-[#ead7ad]/[0.10] bg-[#15110d] text-sm font-semibold text-[#fff8eb]">
            <div className="border-r border-[#ead7ad]/[0.10] p-4">Normal browser</div>
            <div className="p-4">Noema</div>
          </div>
          {comparison.map(([normal, noema]) => (
            <div className="grid grid-cols-2 border-b border-[#ead7ad]/[0.07] last:border-b-0" key={normal}>
              <div className="flex items-center gap-2 border-r border-[#ead7ad]/[0.10] p-4 text-sm text-[#d8cbb3]/[0.52]">
                <X size={15} className="text-[#8b5546]" />
                {normal}
              </div>
              <div className="flex items-center gap-2 p-4 text-sm text-[#fff8eb]">
                <Check size={15} className="text-[#d8b56d]" />
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
      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-[#d8b56d]/[0.22] bg-[linear-gradient(135deg,rgba(216,181,109,0.12),rgba(255,248,235,0.025)_42%,rgba(135,178,150,0.08))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Badge>Early access build</Badge>
            <h2 className="mt-5 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#fff8eb] md:text-5xl">
              Try the Noema Windows MVP.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d8cbb3]/[0.68]">
              This is an early unsigned Windows build. Unzip the folder and run Noema.exe.
            </p>
            <p className="mt-4 max-w-2xl rounded-2xl border border-[#d8b56d]/[0.18] bg-[#070604]/[0.54] p-4 text-sm leading-6 text-[#fff2d2]/[0.78]">
              Do not move Noema.exe out of its folder. The app needs the bundled files beside it.
            </p>
          </div>
          <div className="rounded-2xl border border-[#ead7ad]/[0.12] bg-[#070604]/[0.70] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <PrimaryLink href="#download">
                Download Windows MVP
                <MonitorDown size={16} />
              </PrimaryLink>
              <SecondaryLink href="#setup-notes">
                Read setup notes
                <ArrowRight size={16} />
              </SecondaryLink>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[#d8cbb3]/[0.58]" id="setup-notes">
              <SetupNote label="1" text="Unzip Noema-Windows-MVP.zip." />
              <SetupNote label="2" text="Open the extracted folder." />
              <SetupNote label="3" text="Run Noema.exe from inside that folder." />
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
          title="Clear answers for an early build."
          copy="Noema is useful today, but it is still an MVP. These answers avoid pretending otherwise."
        />
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              className="group rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-5 transition hover:border-[#d8b56d]/[0.22]"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#fff8eb]">
                {faq.question}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#d8b56d]/[0.22] text-[#d8b56d] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-[#d8cbb3]/[0.62]">{faq.answer}</p>
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
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 border-t border-[#ead7ad]/[0.08] pt-8 text-sm text-[#d8cbb3]/[0.50] md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold tracking-[0.06em] text-[#fff8eb]">
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
          {["Product", "MVP status", "Roadmap", "Download"].map((item) => (
            <a className="transition hover:text-[#fff8eb]" href="#" key={item}>
              {item}
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
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#fff8eb] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#d8cbb3]/[0.64]">{copy}</p>
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
    <article className="rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,248,235,0.035)] transition hover:-translate-y-0.5 hover:border-[#d8b56d]/[0.24] hover:bg-[#fff8eb]/[0.035]">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#d8b56d]/[0.20] bg-[#d8b56d]/[0.10] text-[#d8b56d]">
        <Icon size={18} />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[#fff8eb]">{title}</h3>
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
  tone: "ready" | "next";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-4">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
          tone === "ready"
            ? "border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.10] text-[#d8b56d]"
            : "border-[#87b296]/[0.22] bg-[#87b296]/[0.08] text-[#a6c8ad]"
        }`}
      >
        <Icon size={15} />
      </span>
      <span className="text-sm font-medium text-[#fff8eb]/[0.88]">{children}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Running"
      ? "border-[#87b296]/[0.25] bg-[#87b296]/[0.10] text-[#b9d2be]"
      : status === "Review"
        ? "border-[#d8b56d]/[0.28] bg-[#d8b56d]/[0.10] text-[#fff2d2]"
        : status === "Paused"
          ? "border-[#ead7ad]/[0.12] bg-[#fff8eb]/[0.04] text-[#d8cbb3]/[0.50]"
          : "border-[#ead7ad]/[0.12] bg-[#fff8eb]/[0.04] text-[#d8cbb3]/[0.70]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] ${className}`}>
      <Circle fill="currentColor" size={6} />
      {status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ead7ad]/[0.10] bg-[#fff8eb]/[0.025] p-3">
      <div className="text-sm font-semibold text-[#fff8eb]">{value}</div>
      <div className="mt-1 text-[11px] text-[#d8cbb3]/[0.44]">{label}</div>
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b56d]/[0.24] bg-[#d8b56d]/[0.08] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff2d2]">
      <Gauge size={13} />
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8b56d]">
      {children}
    </div>
  );
}

function PrimaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d8b56d]/[0.36] bg-[#d8b56d] px-4 text-sm font-semibold text-[#090704] shadow-[0_14px_34px_rgba(216,181,109,0.18)] transition hover:-translate-y-px hover:bg-[#efcd82]"
      href={href}
    >
      {children}
    </a>
  );
}

function SecondaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#ead7ad]/[0.14] bg-[#fff8eb]/[0.025] px-4 text-sm font-semibold text-[#fff8eb] transition hover:-translate-y-px hover:border-[#d8b56d]/[0.34] hover:bg-[#fff8eb]/[0.05]"
      href={href}
    >
      {children}
    </a>
  );
}
