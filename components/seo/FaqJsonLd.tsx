import React from "react";
import type { FaqItem } from "@/lib/faqs";

type Props = {
  items: FaqItem[];
  // If/when you adopt a nonce-based CSP, you can pass a nonce here.
  nonce?: string;
};

export default function FaqJsonLd({ items, nonce }: Props) {
  // Ensure text only (strip tags if your answers contain HTML)
  const mainEntity = items.map((it) => ({
    "@type": "Question",
    "name": it.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": it.answer.replace(/<[^>]+>/g, "")
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity
  };

  return (
    <script
      type="application/ld+json"
      // nonce is optional; add when you migrate CSP to nonces
      {...(nonce ? { nonce } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
