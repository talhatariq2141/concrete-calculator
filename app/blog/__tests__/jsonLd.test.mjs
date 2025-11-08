import { test } from "node:test";
import assert from "node:assert/strict";

import { stringifyJsonLd } from "../../../.tests-dist/lib/jsonLd.js";

test("stringifyJsonLd escapes angle brackets", () => {
  const schema = {
    script: "<script>alert('xss')</script>",
    nested: { value: ">=10" },
  };

  const result = stringifyJsonLd(schema);

  assert.ok(result.includes("\\u003cscript\\u003e"));
  assert.ok(result.includes("\\u003e=10"));
  assert.ok(!result.includes("<"));
  assert.ok(!result.includes(">"));
});

test("stringifyJsonLd output parses back to original object", () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    description: "<b>Bold</b> text",
  };

  const result = stringifyJsonLd(schema);
  const parsed = JSON.parse(result);

  assert.deepEqual(parsed, schema);
});
