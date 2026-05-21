import type { BrowserTab, HistoryEntry } from "../../electron/types";

export const quickLinks = [
  { title: "ChatGPT", url: "https://chatgpt.com", accent: "from-aurora-cyan to-aurora-blue" },
  { title: "OpenAI", url: "https://openai.com", accent: "from-aurora-blue to-aurora-violet" },
  { title: "GitHub", url: "https://github.com", accent: "from-white to-white/40" },
  { title: "Vercel", url: "https://vercel.com", accent: "from-aurora-rose to-aurora-amber" }
];

export function isInternalUrl(url: string) {
  return url.startsWith("browser://");
}

export function isNewTab(tab?: BrowserTab) {
  return !tab || tab.url === "browser://newtab";
}

export function displayUrl(url: string) {
  if (url === "browser://newtab") {
    return "";
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "") + parsed.pathname;
  } catch {
    return url;
  }
}

export function shortUrl(url: string) {
  if (url === "browser://newtab") {
    return "New tab";
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatVisit(entry: HistoryEntry) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(entry.visitedAt));
}
