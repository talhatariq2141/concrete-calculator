import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import { logError } from "./logger";

export async function walkMdxFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string) {
    let entries: Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      logError(`failed to read directory ${dir}`, error);
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(abs);
      }
    }
  }

  await walk(root);
  return files;
}

export async function readMdxFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    logError(`failed to read MDX file ${filePath}`, error);
    return null;
  }
}

export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    logError(`failed to read file ${filePath}`, error);
    return null;
  }
}
