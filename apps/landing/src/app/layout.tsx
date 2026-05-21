import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noema - Focused Browser Workspaces",
  description:
    "Noema is a Windows MVP desktop browser workspace for focused profiles, profile-scoped sessions, notes and research contexts."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
