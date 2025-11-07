// lib/fs-posts.ts  (new helper, or merge into blog-data.ts)

import fs from "node:fs/promises";
import path from "node:path";

export type WalkEntry = { absPath: string; relPath: string; filename: string };

export async function walkMdx(root: string): Promise<WalkEntry[]> {
  const out: WalkEntry[] = [];
  async function walk(dir: string, base = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const abs = path.join(dir, e.name);
      const rel = path.join(base, e.name);
      if (e.isDirectory()) {
        await walk(abs, rel);
      } else if (e.isFile() && e.name.endsWith(".mdx")) {
        out.push({ absPath: abs, relPath: rel, filename: e.name });
      }
    }
  }
  await walk(root);
  return out;
}
