// components/blog/ClientTOCWidget.tsx
import dynamic from "next/dynamic";

export const ClientTOCWidget = dynamic(
  () => import("./ClientTOC").then((mod) => mod.ClientTOC),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-slate-500" aria-live="polite">
        Loading table of contents…
      </p>
    ),
  }
);
