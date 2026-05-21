import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  ChevronRight,
  EyeOff,
  Layers,
  Lock,
  PanelLeft,
  Search,
  Sparkles,
  Star,
  Zap
} from "lucide-react";
import { Badge, Button, SectionEyebrow } from "@browser/ui";

const features = [
  {
    icon: Bot,
    title: "AI sidebar",
    copy: "A contextual assistant sits beside the page, ready to summarize, explain, and extract next steps."
  },
  {
    icon: PanelLeft,
    title: "Vertical workspaces",
    copy: "Tabs, bookmarks, history, and settings live in a calm left rail built for deep research sessions."
  },
  {
    icon: EyeOff,
    title: "Focus mode",
    copy: "Quiet chrome and dense navigation surfaces keep the active page at the center of attention."
  },
  {
    icon: Layers,
    title: "Smart tabs",
    copy: "Each tab tracks title, URL, loading state, navigation controls, and local session persistence."
  },
  {
    icon: Lock,
    title: "Privacy-first design",
    copy: "Remote web content runs without Node.js integration, with a narrow typed bridge for app controls."
  }
];

const comparisons = [
  ["Context-aware AI", "Built into the browsing surface", "Bolted on or extension-only"],
  ["Workspace model", "Vertical, persistent, research-oriented", "Tab strip first"],
  ["Task extraction", "Designed as a first-class action", "Manual copy and paste"],
  ["Security posture", "Typed bridge, isolated remote content", "Varies by extension"],
  ["Desktop feel", "Custom title bar and native shell", "Standard browser frame"]
];

const faqs = [
  {
    question: "Is BROWSER a real Electron app?",
    answer:
      "Yes. The desktop app uses Electron, React, Vite, Tailwind CSS, and WebContentsView for embedded web pages."
  },
  {
    question: "Does the MVP include a live AI model?",
    answer:
      "The UI includes a ready assistant surface with mock actions. The next step is wiring it to the model provider of your choice."
  },
  {
    question: "Where is browser data stored?",
    answer:
      "Tabs, bookmarks, history, and basic settings are saved locally in a simple JSON store under Electron user data."
  },
  {
    question: "Can the landing page be deployed separately?",
    answer:
      "Yes. It is a standalone Next.js App Router app in the same pnpm workspace."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink-950 text-white">
      <Nav />
      <Hero />
      <MockupSection />
      <FeatureSection />
      <ComparisonSection />
      <WaitlistSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a className="flex items-center gap-3" href="#">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aurora-cyan text-sm font-black text-ink-950 shadow-glow">
            B
          </span>
          <span className="font-semibold tracking-wide">BROWSER</span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-white/[0.58] md:flex">
          <a className="transition hover:text-white" href="#features">
            Features
          </a>
          <a className="transition hover:text-white" href="#compare">
            Compare
          </a>
          <a className="transition hover:text-white" href="#pricing">
            Pricing
          </a>
          <a className="transition hover:text-white" href="#faq">
            FAQ
          </a>
        </div>
        <Button className="h-9 px-3" tone="primary">
          Join waitlist
        </Button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[82svh] border-b border-white/10">
      <HeroScene />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-5 pb-20 pt-20 sm:pt-28">
        <Badge className="mb-6 w-fit">Premium desktop browser for AI-native work</Badge>
        <h1 className="max-w-4xl text-6xl font-semibold leading-none text-white sm:text-7xl lg:text-8xl">
          BROWSER
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.68] sm:text-xl">
          An AI-first desktop browser with vertical workspaces, smart tabs, and a page-aware
          assistant designed for deep research.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button className="h-12 px-5" tone="primary">
            Join the waitlist
            <ArrowRight size={17} />
          </Button>
          <Button className="h-12 px-5" tone="secondary">
            View the app shell
            <ChevronRight size={17} />
          </Button>
        </div>
        <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {["WebContentsView browser core", "Typed secure preload bridge", "Local session persistence"].map(
            (item) => (
              <div
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/[0.62]"
                key={item}
              >
                <Check className="text-aurora-cyan" size={15} />
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      <div className="absolute inset-x-0 top-10 mx-auto h-[520px] max-w-6xl rounded-[32px] border border-white/10 bg-ink-900/70 shadow-panel backdrop-blur-xl" />
      <div className="absolute left-1/2 top-24 h-[420px] w-[900px] -translate-x-1/2 rounded-3xl border border-white/10 bg-ink-850/[0.92] shadow-glow">
        <div className="flex h-full overflow-hidden rounded-3xl">
          <div className="w-24 border-r border-white/10 bg-ink-950/[0.82] p-4">
            <div className="mb-8 h-10 w-10 rounded-xl bg-aurora-cyan" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.06]"
                  key={index}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-aurora-rose" />
                <span className="h-3 w-3 rounded-full bg-aurora-amber" />
                <span className="h-3 w-3 rounded-full bg-aurora-cyan" />
              </div>
              <div className="flex h-10 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white/40">
                <Search size={16} />
                Search Google or enter a URL
              </div>
            </div>
            <div className="grid flex-1 grid-cols-[1fr_260px]">
              <div className="p-6">
                <div className="mb-5 h-24 rounded-2xl border border-white/10 bg-white/[0.06]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 rounded-2xl border border-white/10 bg-aurora-cyan/[0.09]" />
                  <div className="h-28 rounded-2xl border border-white/10 bg-aurora-violet/[0.09]" />
                  <div className="h-28 rounded-2xl border border-white/10 bg-white/[0.05]" />
                  <div className="h-28 rounded-2xl border border-white/10 bg-aurora-rose/[0.08]" />
                </div>
              </div>
              <div className="border-l border-white/10 bg-ink-950/[0.76] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aurora-cyan text-ink-950">
                    <Bot size={18} />
                  </span>
                  <span className="text-sm font-semibold">Assistant</span>
                </div>
                <div className="space-y-3">
                  {["Summarize", "Extract tasks", "Explain page"].map((item) => (
                    <div
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-white/[0.68]"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/30 to-ink-950" />
    </div>
  );
}

function MockupSection() {
  return (
    <section className="border-b border-white/10 bg-ink-900 px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow>Product Preview</SectionEyebrow>
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold text-white">
              A desktop browser shell built around the assistant.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/[0.58]">
              The MVP combines a native Electron window, a custom command bar, persistent tabs,
              and a responsive AI panel.
            </p>
          </div>
          <Button tone="secondary">
            Explore features
            <ArrowRight size={16} />
          </Button>
        </div>
        <BrowserMockup />
      </div>
    </section>
  );
}

function BrowserMockup() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.12] bg-ink-950 shadow-panel">
      <div className="flex h-14 items-center gap-3 border-b border-white/10 bg-white/[0.04] px-5">
        <span className="h-3 w-3 rounded-full bg-aurora-rose" />
        <span className="h-3 w-3 rounded-full bg-aurora-amber" />
        <span className="h-3 w-3 rounded-full bg-aurora-cyan" />
        <div className="ml-3 flex h-9 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm text-white/[0.45]">
          <Search size={15} />
          browser://workspace/research
        </div>
      </div>
      <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[260px_1fr_320px]">
        <aside className="border-b border-white/10 bg-ink-950/80 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <Sparkles className="text-aurora-cyan" size={18} />
            <div>
              <div className="text-sm font-semibold">Research Space</div>
              <div className="text-xs text-white/40">5 active tabs</div>
            </div>
          </div>
          <div className="space-y-2">
            {["AI browser architecture", "Electron security notes", "Design inspiration"].map(
              (item, index) => (
                <div
                  className={`rounded-xl border p-3 text-sm ${
                    index === 0
                      ? "border-aurora-cyan/30 bg-aurora-cyan/10 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/[0.56]"
                  }`}
                  key={item}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </aside>
        <section className="bg-ink-900 p-5">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <Badge>Start page</Badge>
            <h3 className="mt-5 max-w-xl text-4xl font-semibold leading-tight">
              Search, open, and ask the page what matters.
            </h3>
            <div className="mt-8 flex h-14 items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.08] px-4 text-white/[0.42]">
              <Search className="text-aurora-cyan" size={20} />
              Search Google or enter a URL
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["ChatGPT", "OpenAI", "GitHub", "Vercel"].map((item) => (
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                  key={item}
                >
                  <div className="mb-4 h-10 w-10 rounded-xl bg-aurora-cyan/70" />
                  <div className="font-medium">{item}</div>
                  <div className="mt-1 text-sm text-white/40">Quick link</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="border-t border-white/10 bg-ink-950/[0.78] p-5 lg:border-l lg:border-t-0">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-cyan text-ink-950">
              <Brain size={18} />
            </span>
            <div>
              <div className="text-sm font-semibold">Assistant</div>
              <div className="text-xs text-white/40">Current page context</div>
            </div>
          </div>
          <div className="space-y-3">
            {["Summarize", "Extract tasks", "Explain page"].map((item) => (
              <div
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function FeatureSection() {
  return (
    <section className="border-b border-white/10 bg-ink-950 px-5 py-20" id="features">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow>Features</SectionEyebrow>
        <h2 className="max-w-3xl text-4xl font-semibold text-white">
          Built for people who research, decide, and ship from the web.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <article
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              key={feature.title}
            >
              <feature.icon className="mb-6 text-aurora-cyan" size={24} />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/[0.56]">{feature.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="border-b border-white/10 bg-ink-900 px-5 py-20" id="compare">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow>Comparison</SectionEyebrow>
        <h2 className="max-w-3xl text-4xl font-semibold">
          Normal browsers browse. BROWSER helps you think through the page.
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-3 bg-white/[0.08] px-5 py-4 text-sm font-semibold text-white">
            <div>Capability</div>
            <div>BROWSER</div>
            <div>Normal browsers</div>
          </div>
          {comparisons.map(([capability, browser, normal]) => (
            <div
              className="grid grid-cols-3 border-t border-white/10 px-5 py-4 text-sm text-white/60"
              key={capability}
            >
              <div className="font-medium text-white">{capability}</div>
              <div>{browser}</div>
              <div>{normal}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistSection() {
  return (
    <section className="border-b border-white/10 bg-ink-950 px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionEyebrow>Waitlist</SectionEyebrow>
          <h2 className="max-w-xl text-4xl font-semibold">Get early access to the AI browser.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/[0.58]">
            Join the list for preview builds, implementation notes, and release milestones.
          </p>
        </div>
        <form className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="h-12 rounded-xl border border-white/10 bg-ink-950 px-4 text-sm text-white outline-none placeholder:text-white/[0.35] focus:border-aurora-cyan/[0.45]"
              placeholder="you@company.com"
              type="email"
            />
            <Button className="h-12 px-5" tone="primary" type="submit">
              Request access
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/[0.38]">
            No spam. Product updates only.
          </p>
        </form>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="border-b border-white/10 bg-ink-900 px-5 py-20" id="pricing">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Personal", "For solo researchers", "$12"],
            ["Team", "For shared workspaces", "$29"],
            ["Enterprise", "For managed deployment", "Custom"]
          ].map(([name, description, price], index) => (
            <article
              className={`rounded-2xl border p-6 ${
                index === 1
                  ? "border-aurora-cyan/[0.35] bg-aurora-cyan/[0.08]"
                  : "border-white/10 bg-white/[0.05]"
              }`}
              key={name}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{name}</h3>
                {index === 1 ? <Star className="text-aurora-cyan" size={18} /> : null}
              </div>
              <p className="text-sm text-white/[0.52]">{description}</p>
              <div className="mt-8 text-4xl font-semibold">{price}</div>
              <p className="mt-2 text-sm text-white/[0.42]">Pricing placeholder</p>
              <Button className="mt-8 w-full" tone={index === 1 ? "primary" : "secondary"}>
                Join waitlist
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-b border-white/10 bg-ink-950 px-5 py-20" id="faq">
      <div className="mx-auto max-w-4xl">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <h2 className="text-4xl font-semibold">Questions before the first build?</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {faq.question}
                <Zap className="text-aurora-cyan transition group-open:rotate-45" size={18} />
              </summary>
              <p className="mt-4 text-sm leading-6 text-white/[0.56]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink-950 px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-white/[0.45] md:flex-row md:items-center">
        <div className="flex items-center gap-3 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-cyan text-xs font-black text-ink-950">
            B
          </span>
          BROWSER
        </div>
        <div>AI-first browsing for focused work.</div>
        <div>© 2026 BROWSER</div>
      </div>
    </footer>
  );
}
