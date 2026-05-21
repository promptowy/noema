import {
  ArrowRight,
  Brain,
  ChevronRight,
  Command,
  EyeOff,
  Layers,
  PanelRight,
  Search,
  Shield,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  ["Product", "#product"],
  ["Intelligence", "#intelligence"],
  ["Privacy", "#privacy"],
  ["Waitlist", "#waitlist"]
];

const features = [
  {
    icon: PanelRight,
    title: "AI beside the page",
    copy: "Ask from the edge of the page without breaking your reading flow."
  },
  {
    icon: Layers,
    title: "Workspaces that remember",
    copy: "Keep tabs, sources and decisions together around the work they belong to."
  },
  {
    icon: Brain,
    title: "Tabs with context",
    copy: "Noema treats each tab as part of a thread, not an isolated rectangle."
  },
  {
    icon: Command,
    title: "Command-first navigation",
    copy: "Open, search and move with a single quiet command surface."
  },
  {
    icon: Shield,
    title: "Calm privacy defaults",
    copy: "The assistant is designed around deliberate context, not silent surveillance."
  },
  {
    icon: EyeOff,
    title: "Designed for deep work",
    copy: "A restrained interface that lets the web recede and the work come forward."
  }
];

const workflow = [
  {
    step: "01",
    title: "Open anything",
    copy: "Start with a page, a search, a document, or a question."
  },
  {
    step: "02",
    title: "Ask with context",
    copy: "Noema keeps the relevant page and workspace in view while you ask."
  },
  {
    step: "03",
    title: "Save the thread of thought",
    copy: "Carry forward the reasoning, comparisons and decisions behind the tabs."
  }
];

const comparison = [
  ["Tabs", "tabs become workspaces"],
  ["Pages", "pages become context"],
  ["Search", "search becomes synthesis"],
  ["History", "history becomes memory"]
];

const faqs = [
  {
    question: "Is Noema a Chrome replacement?",
    answer:
      "Noema is being built as a focused desktop browser for research-heavy work. It can become your primary browser for that work, but the first beta is intentionally narrower."
  },
  {
    question: "Does the AI read every page?",
    answer:
      "No. The product direction is deliberate context: the assistant should work from the page or workspace you choose, with clear controls around what is used."
  },
  {
    question: "Will it support extensions?",
    answer:
      "Extension support is planned for later exploration. The first priority is a secure, calm browser core and a useful context layer."
  },
  {
    question: "Is Noema private?",
    answer:
      "Privacy is a foundation of the product. Remote pages run in an isolated browser view, and assistant access is intended to be explicit and understandable."
  },
  {
    question: "When is beta access available?",
    answer:
      "Noema is preparing for a private beta with builders, researchers and teams. Waitlist members will receive early access invitations first."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070604] text-[#f5efe3]">
      <Navigation />
      <Hero />
      <Philosophy />
      <FeatureGrid />
      <Workflow />
      <Comparison />
      <Waitlist />
      <FAQ />
      <Footer />
    </main>
  );
}

function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8d9b5]/[0.08] bg-[#070604]/[0.88] backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a className="font-serif text-xl tracking-[0.03em] text-[#fff8eb]" href="#">
          Noema
        </a>
        <div className="hidden items-center gap-8 text-sm text-[#d8cbb3]/[0.62] md:flex">
          {navItems.map(([label, href]) => (
            <a className="transition duration-200 hover:text-[#fff8eb]" href={href} key={label}>
              {label}
            </a>
          ))}
        </div>
        <a
          className="rounded-full border border-[#d8b56d]/[0.30] bg-[#d8b56d]/[0.10] px-4 py-2 text-sm font-medium text-[#fff2d2] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 hover:-translate-y-px hover:border-[#d8b56d]/[0.55] hover:bg-[#d8b56d]/[0.16]"
          href="#waitlist"
        >
          Request access
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-[#e8d9b5]/[0.08] bg-[linear-gradient(180deg,#090704_0%,#070604_58%,#0a0806_100%)] px-5 py-14 sm:py-18 lg:min-h-[calc(100svh-64px)] lg:py-16">
      <div className="mx-auto grid min-h-full max-w-7xl gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
        <div className="pt-2 lg:pt-0">
          <Eyebrow>AI-native browser</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-5xl leading-[1.02] text-[#fff8eb] md:text-7xl">
            Browse with a mind beside you.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[#d8cbb3]/[0.74]">
            Noema turns scattered tabs, pages and searches into context you can understand,
            organize and act on.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href="#waitlist">
              Request early access
              <ArrowRight size={16} />
            </PrimaryLink>
            <SecondaryLink href="#product">
              See the interface
              <ChevronRight size={16} />
            </SecondaryLink>
          </div>
        </div>
        <div className="lg:translate-y-3">
          <NoemaMockup />
        </div>
      </div>
    </section>
  );
}

function NoemaMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-3xl rounded-[30px] border border-[#e8d9b5]/[0.16] bg-[#0b0907] p-2.5 shadow-[0_34px_120px_rgba(0,0,0,0.62)]"
      id="product"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f4d48a]/[0.45] to-transparent" />
      <div className="overflow-hidden rounded-[24px] border border-[#e8d9b5]/[0.10] bg-[#0f0d0a] shadow-[inset_0_1px_0_rgba(255,248,235,0.04)]">
        <div className="flex h-14 items-center gap-3 border-b border-[#e8d9b5]/[0.09] bg-[#15110d] px-4">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7a4635]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#b98c45]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7c765d]" />
          </div>
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#e8d9b5]/[0.12] bg-[#070604] px-4 text-sm text-[#d8cbb3]/[0.55] shadow-[inset_0_1px_0_rgba(255,248,235,0.035)]">
            <Search className="shrink-0 text-[#d8b56d]" size={15} />
            <span className="truncate">Search, open, or ask Noema</span>
          </div>
        </div>
        <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-[190px_1fr] lg:grid-cols-[190px_1fr_250px]">
          <aside className="border-b border-[#e8d9b5]/[0.10] bg-[#0a0806] p-4 md:border-b-0 md:border-r">
            <div className="mb-5 rounded-2xl border border-[#d8b56d]/[0.20] bg-[#d8b56d]/[0.08] p-3">
              <div className="text-xs uppercase tracking-[0.22em] text-[#d8b56d]">Workspace</div>
              <div className="mt-2 text-sm font-medium text-[#fff8eb]">Market landscape</div>
              <div className="mt-1 text-xs text-[#d8cbb3]/[0.45]">12 sources, 4 notes</div>
            </div>
            <div className="space-y-2">
              {[
                ["The changing search layer", "active"],
                ["Browser security notes", ""],
                ["Competitor brief", ""],
                ["Open questions", ""]
              ].map(([label, state]) => (
                <div
                  className={`rounded-xl border px-3 py-3 text-sm transition duration-200 ${
                    state === "active"
                      ? "border-[#d8b56d]/[0.30] bg-[#d8b56d]/[0.10] text-[#fff8eb] shadow-[inset_2px_0_0_rgba(216,181,109,0.7)]"
                      : "border-[#e8d9b5]/[0.08] bg-[#fff8eb]/[0.025] text-[#d8cbb3]/[0.55]"
                  }`}
                  key={label}
                >
                  {label}
                </div>
              ))}
            </div>
          </aside>
          <section className="bg-[#100d09] p-4">
            <div className="h-full rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#17130e] p-5 shadow-[inset_0_1px_0_rgba(255,248,235,0.035)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#d8b56d]">
                    Current page
                  </div>
                  <h2 className="mt-2 max-w-md text-balance font-serif text-2xl leading-snug text-[#fff8eb]">
                    Intelligence browsers and the new research layer
                  </h2>
                </div>
                <div className="hidden rounded-full border border-[#e8d9b5]/[0.10] px-3 py-1 text-xs text-[#d8cbb3]/[0.50] sm:block">
                  reading
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <Line width="w-[92%]" />
                <Line width="w-full" />
                <Line width="w-[76%]" />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <DetailCard label="Signal" value="Search is becoming synthesis." />
                <DetailCard label="Risk" value="Context drifts across tabs." />
              </div>
              <div className="mt-8 rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#0b0907] p-4 shadow-[inset_0_1px_0_rgba(255,248,235,0.035)]">
                <div className="mb-3 flex items-center gap-2 text-sm text-[#fff8eb]">
                  <Sparkles className="text-[#d8b56d]" size={15} />
                  Saved thread
                </div>
                <p className="text-sm leading-6 text-[#d8cbb3]/[0.58]">
                  Compare AI-native browsers by context retention, privacy posture and command
                  speed.
                </p>
              </div>
            </div>
          </section>
          <aside className="border-t border-[#e8d9b5]/[0.10] bg-[#0a0806] p-4 lg:border-l lg:border-t-0">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8b56d]/[0.30] bg-[#d8b56d]/[0.10] text-[#d8b56d]">
                <Brain size={17} />
              </span>
              <div>
                <div className="text-sm font-medium text-[#fff8eb]">Noema</div>
                <div className="text-xs text-[#d8cbb3]/[0.45]">beside this page</div>
              </div>
            </div>
            <div className="space-y-3">
              <AssistantNote title="Understands" copy="This page, the workspace and the thread." />
              <AssistantNote title="Suggests" copy="Three sources worth comparing next." />
              <AssistantNote title="Remembers" copy="Why this page mattered." />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Philosophy() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] bg-[#0a0806] px-5 py-24 md:py-28" id="intelligence">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Eyebrow>Philosophy</Eyebrow>
        <div>
          <h2 className="text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
            The web is not short of information. It is short of context.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-[#d8cbb3]/[0.70]">
            Noema helps people research, compare, understand and continue work without losing the
            thread. It is a browser for the moments when tabs become a question, pages become
            evidence and search becomes a chain of thought.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] px-5 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Product</Eyebrow>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
            A quieter way to think through the web.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] bg-[#0a0806] px-5 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Workflow</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
              Keep the thread intact from first page to final decision.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#d8cbb3]/[0.62]">
            Noema is built around continuation: the ability to leave, return and still understand
            what mattered.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {workflow.map((item) => (
            <article
              className="rounded-3xl border border-[#e8d9b5]/[0.10] bg-[#fff8eb]/[0.025] p-6 transition duration-200 hover:border-[#d8b56d]/[0.24] hover:bg-[#fff8eb]/[0.035]"
              key={item.step}
            >
              <div className="text-sm text-[#d8b56d]">{item.step}</div>
              <h3 className="mt-8 font-serif text-2xl text-[#fff8eb]">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#d8cbb3]/[0.62]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] px-5 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Comparison</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
          Normal browser vs Noema
        </h2>
        <div className="mt-12 overflow-hidden rounded-3xl border border-[#e8d9b5]/[0.10]">
          <div className="grid grid-cols-1 bg-[#15110d] text-sm text-[#d8cbb3]/[0.65] md:grid-cols-2">
            <div className="border-b border-[#e8d9b5]/[0.10] p-5 font-medium text-[#fff8eb] md:border-b-0 md:border-r">
              Normal browser
            </div>
            <div className="p-5 font-medium text-[#fff8eb]">Noema</div>
          </div>
          {comparison.map(([normal, noema]) => (
            <div className="grid grid-cols-1 border-t border-[#e8d9b5]/[0.10] md:grid-cols-2" key={normal}>
              <div className="border-b border-[#e8d9b5]/[0.10] p-5 text-[#d8cbb3]/[0.55] md:border-b-0 md:border-r">
                {normal}
              </div>
              <div className="p-5 text-[#fff8eb]">{noema}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] bg-[#0a0806] px-5 py-24 md:py-28" id="waitlist">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[36px] border border-[#d8b56d]/[0.20] bg-[linear-gradient(135deg,rgba(216,181,109,0.10),rgba(255,248,235,0.025)_42%,rgba(216,181,109,0.06))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:p-12">
        <div>
          <Eyebrow>Waitlist</Eyebrow>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
            Request early access.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#d8cbb3]/[0.68]">
            Private beta for builders, researchers and teams.
          </p>
        </div>
        <form className="self-end rounded-3xl border border-[#e8d9b5]/[0.12] bg-[#070604]/[0.78] p-3 shadow-[inset_0_1px_0_rgba(255,248,235,0.04)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="h-[52px] min-h-[52px] rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#0f0d0a] px-4 text-sm text-[#fff8eb] outline-none transition duration-200 placeholder:text-[#d8cbb3]/[0.38] focus:border-[#d8b56d]/[0.45] focus:bg-[#12100c]"
              placeholder="you@company.com"
              type="email"
            />
            <button
              className="inline-flex h-[52px] min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#d8b56d] px-5 text-sm font-medium text-[#0b0907] shadow-[0_10px_30px_rgba(216,181,109,0.16)] transition duration-200 hover:-translate-y-px hover:bg-[#f0d08a]"
              type="submit"
            >
              Request early access
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="border-b border-[#e8d9b5]/[0.08] px-5 py-24 md:py-28" id="privacy">
      <div className="mx-auto max-w-4xl">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 text-balance font-serif text-4xl leading-tight text-[#fff8eb] md:text-5xl">
          Questions before Noema opens.
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              className="group rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#fff8eb]/[0.025] p-5 transition duration-200 hover:border-[#d8b56d]/[0.22]"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-medium text-[#fff8eb]">
                {faq.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d8b56d]/[0.20] text-[#d8b56d] transition group-open:rotate-45">
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
    <footer className="px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-[#e8d9b5]/[0.08] pt-8 text-sm text-[#d8cbb3]/[0.50] md:flex-row md:items-center">
        <div>
          <div className="font-serif text-2xl text-[#fff8eb]">Noema</div>
          <div className="mt-2">Browse with a mind beside you.</div>
        </div>
        <div className="flex flex-wrap gap-5">
          {["Product", "Privacy", "Updates", "Contact"].map((item) => (
            <a className="transition duration-200 hover:text-[#fff8eb]" href="#" key={item}>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#d8b56d]">
      {children}
    </div>
  );
}

function PrimaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d8b56d] px-5 text-sm font-medium text-[#0b0907] shadow-[0_12px_34px_rgba(216,181,109,0.16)] transition duration-200 hover:-translate-y-px hover:bg-[#f0d08a]"
      href={href}
    >
      {children}
    </a>
  );
}

function SecondaryLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#e8d9b5]/[0.14] px-5 text-sm font-medium text-[#fff8eb] transition duration-200 hover:-translate-y-px hover:border-[#d8b56d]/[0.35] hover:bg-[#fff8eb]/[0.035]"
      href={href}
    >
      {children}
    </a>
  );
}

function Line({ width }: { width: string }) {
  return <div className={`h-2 rounded-full bg-[#d8cbb3]/[0.14] ${width}`} />;
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#fff8eb]/[0.025] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-[#d8b56d]">{label}</div>
      <div className="mt-3 text-sm leading-6 text-[#d8cbb3]/[0.68]">{value}</div>
    </div>
  );
}

function AssistantNote({ copy, title }: { copy: string; title: string }) {
  return (
    <div className="rounded-2xl border border-[#e8d9b5]/[0.10] bg-[#fff8eb]/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,248,235,0.025)]">
      <div className="text-sm font-medium text-[#fff8eb]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[#d8cbb3]/[0.55]">{copy}</p>
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
    <article className="rounded-3xl border border-[#e8d9b5]/[0.10] bg-[#fff8eb]/[0.025] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#d8b56d]/[0.25] hover:bg-[#fff8eb]/[0.035]">
      <Icon className="text-[#d8b56d]" size={22} />
      <h3 className="mt-8 font-serif text-2xl text-[#fff8eb]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#d8cbb3]/[0.62]">{copy}</p>
    </article>
  );
}
