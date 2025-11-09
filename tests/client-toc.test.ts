import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { collectHeadings } from "../components/blog/ClientTOC";

describe("collectHeadings", () => {
  it("returns h2 and h3 nodes in order", () => {
    const nodes = [
      { id: "intro", textContent: " Intro ", tagName: "H2" },
      { id: "details", textContent: "Details", tagName: "H3" },
      { id: "next", textContent: "Next", tagName: "H2" },
    ] as unknown as HTMLElement[];

    const headings = collectHeadings(nodes);

    assert.deepStrictEqual(
      headings.map((h) => ({ id: h.id, text: h.text, level: h.level })),
      [
        { id: "intro", text: "Intro", level: 2 },
        { id: "details", text: "Details", level: 3 },
        { id: "next", text: "Next", level: 2 },
      ]
    );
  });

  it("omits nodes without ids", () => {
    const nodes = [
      { id: "", textContent: "Missing", tagName: "H2" },
      { id: "valid", textContent: "Valid", tagName: "H2" },
    ] as unknown as HTMLElement[];

    const headings = collectHeadings(nodes);

    assert.deepStrictEqual(headings, [{ id: "valid", text: "Valid", level: 2 }]);
  });
});
