import test from "node:test";
import assert from "node:assert/strict";
import type { Root, Element } from "hast";

import { rehypeSanitize } from "../lib/mdx-sanitize";

function createRoot(children: Root["children"]): Root {
  return { type: "root", children };
}

function findElement(node: Root | Element, tagName: string): Element | null {
  if (node.type === "element" && node.tagName.toLowerCase() === tagName) {
    return node;
  }

  const children = "children" in node && node.children ? node.children : [];
  for (const child of children) {
    if (child.type === "element") {
      const found = findElement(child, tagName);
      if (found) return found;
    }
  }

  return null;
}

test("retains safe markup", () => {
  const tree = createRoot([
    {
      type: "element",
      tagName: "p",
      properties: {},
      children: [
        { type: "text", value: "Hello " },
        {
          type: "element",
          tagName: "a",
          properties: { href: "https://example.com", className: "btn" },
          children: [{ type: "text", value: "link" }],
        },
      ],
    },
  ]);

  const transform = rehypeSanitize();
  transform(tree);

  const anchor = findElement(tree, "a");
  assert.ok(anchor, "expected anchor element");
  assert.equal(anchor!.properties?.href, "https://example.com");
  assert.equal(anchor!.properties?.className, "btn");
});

test("removes script elements entirely", () => {
  const tree = createRoot([
    {
      type: "element",
      tagName: "div",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "script",
          properties: {},
          children: [{ type: "text", value: "alert('xss')" }],
        },
      ],
    },
  ]);

  const transform = rehypeSanitize();
  transform(tree);

  const script = findElement(tree, "script");
  assert.equal(script, null);
});

test("strips event handler attributes", () => {
  const tree = createRoot([
    {
      type: "element",
      tagName: "img",
      properties: { src: "/image.png", onerror: "alert(1)" },
      children: [],
    },
  ]);

  const transform = rehypeSanitize();
  transform(tree);

  const img = findElement(tree, "img");
  assert.ok(img, "expected image element");
  assert.equal(img!.properties?.onerror, undefined);
  assert.equal(img!.properties?.src, "/image.png");
});

test("drops javascript href protocols", () => {
  const tree = createRoot([
    {
      type: "element",
      tagName: "a",
      properties: { href: "javascript:alert(1)" },
      children: [{ type: "text", value: "click" }],
    },
  ]);

  const transform = rehypeSanitize();
  transform(tree);

  const anchor = findElement(tree, "a");
  assert.ok(anchor, "expected anchor element");
  assert.equal("href" in (anchor!.properties ?? {}), false);
});
