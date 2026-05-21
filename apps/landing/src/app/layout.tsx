import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BROWSER - AI-first desktop browser",
  description:
    "A premium AI-first desktop browser with vertical workspaces, smart tabs, and a context-aware assistant."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
