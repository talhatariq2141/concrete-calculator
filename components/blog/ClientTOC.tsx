// components/blog/ClientTOC.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { containerSelector?: string };

export function ClientTOC({ containerSelector = "#post-content" }: Props) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Collect headings (h2/h3) from the rendered article (IDs provided by rehypeSlug)
  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll("h2")) as HTMLElement[];
    const list = nodes
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent?.trim() || "",
        level: el.tagName.toLowerCase() === "h3" ? 3 : 2,
      }));

    setHeadings(list);
  }, [containerSelector]);

  // Scroll spy: highlight the visible heading
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) setActiveId(visible.target.id);
      },
      {
        rootMargin: "0px 0px -70% 0px", // trigger before heading hits the top
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const items = useMemo(
    () =>
      headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
          <a
            href={`#${h.id}`}
            className={
              "block py-1 text-sm " +
              (activeId === h.id ? "text-teal-700 font-medium" : "text-slate-600 hover:text-slate-800")
            }
          >
            {h.text}
          </a>
        </li>
      )),
    [headings, activeId]
  );

  if (headings.length === 0) {
    return <p className="text-sm text-slate-500">No headings found.</p>;
  }

  return <ul>{items}</ul>;
}
