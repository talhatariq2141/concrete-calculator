// app/search/page.tsx
import type { Metadata } from "next";
import SearchResultsClient from "./_components/SearchResultsClient";

const TITLE = "Search Concrete Calculators";
const DESCRIPTION = "Search the Concrete Calculator Max library for mix, volume, and reinforcement tools.";

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const metadata: Metadata = {
  title: `${TITLE}`,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.concretecalculatormax.com/search" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery ?? "";
  const decodedQuery = safeDecode(query);
  const displayQuery = decodedQuery.trim();

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Search</h1>
          <p className="mt-2 text-base text-slate-300">
            {displayQuery
              ? `Showing concrete calculators that match "${displayQuery}".`
              : "Search across all of our concrete, mix, and reinforcement calculators."}
          </p>
        </header>
        <SearchResultsClient initialQuery={decodedQuery} />
      </div>
    </main>
  );
}
