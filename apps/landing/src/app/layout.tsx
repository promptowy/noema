import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noema - Focused Browser Workspaces",
  description:
    "Noema is a Windows MVP desktop browser workspace for focused profiles, workspaces, sessions, notes, bookmarks and research contexts.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
