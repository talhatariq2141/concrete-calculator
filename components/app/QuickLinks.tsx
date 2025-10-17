"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type QuickLinksProps = {
  className?: string;
  title?: string; // default: "Quick links"
  links?: { label: string; href: string }[];
};

export default function SidebarQuickLinks({
  className,
  title = "Quick links",
  links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
}: QuickLinksProps) {
  return (
    <aside
      className={[
        "rounded-lg bg-[#17191e] border border-slate-800 p-4",
        "shadow-sm",
        className,
      ].filter(Boolean).join(" ")}
    >
      <h3 className="text-sm font-semibold text-primary tracking-wide mb-3">
        {title}
      </h3>

      <nav className="space-y-1">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-md px-2 py-2 text-sm
                       text-slate-300 hover:text-teal-300 hover:bg-slate-800/60
                       border border-transparent hover:border-teal-500/40 transition-colors"
          >
            <span className="truncate">{item.label}</span>
            <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
