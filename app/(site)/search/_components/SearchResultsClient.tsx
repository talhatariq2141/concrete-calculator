// app/search/_components/SearchResultsClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorsIndexClient from "@/app/(site)/calculators/_components/CalculatorsIndexClient";

function buildSearchUrl(query: string, paramsString: string) {
  const params = new URLSearchParams(paramsString);
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    params.delete("q");
  } else {
    params.set("q", trimmed);
  }

  const search = params.toString();
  return `/search${search ? `?${search}` : ""}`;
}

export default function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const queryFromParams = searchParams.get("q") ?? initialQuery;

  const handleQueryChange = React.useCallback(
    (value: string) => {
      const url = buildSearchUrl(value, paramsString);
      router.replace(url);
    },
    [paramsString, router]
  );

  return (
    <CalculatorsIndexClient
      initialQuery={queryFromParams}
      onQueryChange={handleQueryChange}
      showBreadcrumbs={false}
    />
  );
}
