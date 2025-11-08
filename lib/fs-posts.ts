// lib/fs-posts.ts  (new helper, or merge into blog-data.ts)

import path from "node:path";
import { walkMdxFiles } from "./mdx";

export type WalkEntry = { absPath: string; relPath: string; filename: string };

export async function walkMdx(root: string): Promise<WalkEntry[]> {
  const files = await walkMdxFiles(root);
  return files.map((absPath) => ({
    absPath,
    relPath: path.relative(root, absPath),
    filename: path.basename(absPath),
  }));
}
