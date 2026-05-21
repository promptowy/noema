import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noema - Browse with a mind beside you",
  description:
    "Noema is an AI-native browser that turns scattered tabs, pages and searches into context you can understand, organize and act on."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
