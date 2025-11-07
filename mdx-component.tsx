// mdx-components.tsx (at repo root, sibling to /app)
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // Add/override components used in MDX (code blocks, callouts, etc.)
  return {
    ...components,
  };
}
