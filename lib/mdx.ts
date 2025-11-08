import type { PluggableList } from "unified";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { rehypeSanitize } from "./mdx-sanitize";

export const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath] as PluggableList,
  rehypePlugins: [
    rehypeSanitize,
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }] as const,
    rehypeKatex,
  ] as PluggableList,
};

export type MdxOptions = typeof mdxOptions;
