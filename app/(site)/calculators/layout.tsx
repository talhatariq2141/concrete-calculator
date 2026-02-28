// app/calculators/layout.tsx

import SidebarQuickLinks from "@/components/app/QuickLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.concretecalculatormax.com"),
  title: {
    default: "Concrete Calculator Max",
    template: "%s — Concrete Calculator Max",
  },
  description:
    "Fast, accurate concrete volume, mix, weight, cost, and reinforcement calculators.",
  openGraph: {
    type: "website",
    siteName: "Concrete Calculator Max",
    url: "https://www.concretecalculatormax.com",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Concretecalcmax",
    creator: "@Concretecalcmax",
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1">
      <main className="flex-1 overflow-auto p-6 bg-background">
        <div className="min-h-screen bg-background">{children}</div>
      </main>

      {/* Sidebar: keep subtle, avoid drawing attention away from primary content */}
      <aside
        className="hidden lg:block w-80 bg-background border border-border dark:border-slate-800"
        style={{ position: "sticky", top: 0, height: "calc(100vh)" }}
        aria-label="Right Sidebar"
      >
        <div className="h-full w-full p-5">
          <SidebarQuickLinks />
        </div>
      </aside>
    </div>
  );
}
