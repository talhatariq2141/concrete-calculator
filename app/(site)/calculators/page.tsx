// app/calculators/page.tsx  (SERVER COMPONENT - no "use client")
import type { Metadata } from "next";
import CalculatorsIndexClient from "./_components/CalculatorsIndexClient";

// Page-level SEO (allowed because this file is a Server Component)
export const metadata: Metadata = {
  title: "All Concrete Calculators — Concrete Calculator Max",
  description:
    "Browse free concrete calculators: slabs, columns, beams, walls, footings and more. Search and filter by category.",
  alternates: { canonical: "https://concretecalculatormax.com/calculators" },
};

export default function CalculatorsPage() {
  // Only render the client component here
  return <CalculatorsIndexClient />;
}
