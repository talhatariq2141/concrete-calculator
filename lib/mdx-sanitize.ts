import type {
  Content,
  Element,
  ElementContent,
  Properties,
  Root,
  Text,
} from "hast";

type HastParent = Root | Element;

const ALLOWED_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "div",
  "em",
  "figure",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "thead",
  "tfoot",
  "td",
  "th",
  "tr",
  "ul",
  "del",
  "ins",
  "u",
  "math",
  "menclose",
  "mfrac",
  "mi",
  "mn",
  "mo",
  "mover",
  "mrow",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtr",
  "munder",
  "munderover",
  "semantics",
  "annotation",
]);

const VOID_ELEMENTS = new Set(["br", "hr", "img"]);

const GLOBAL_ATTRS = new Set([
  "class",
  "classname",
  "id",
  "style",
  "title",
  "tabindex",
  "role",
  "dir",
]);

const TAG_SPECIFIC_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "rel", "target", "title"]),
  img: new Set([
    "src",
    "alt",
    "title",
    "width",
    "height",
    "loading",
    "decoding",
    "srcset",
    "sizes",
  ]),
  code: new Set(["class", "classname"]),
};

const SAFE_HREF_PROTOCOLS = new Set([
  "http",
  "https",
  "mailto",
  "tel",
  "sms",
]);

const SAFE_SRC_PROTOCOLS = new Set(["http", "https", "data"]);

const dataAttrRegex = /^data[-\w]*$/i;
const ariaAttrRegex = /^aria[-\w]*$/i;

function isAllowedAttr(tagName: string, key: string): boolean {
  const lower = key.toLowerCase();
  if (dataAttrRegex.test(lower) || ariaAttrRegex.test(lower)) {
    return true;
  }
  if (GLOBAL_ATTRS.has(lower)) {
    return true;
  }
  const specific = TAG_SPECIFIC_ATTRS[tagName];
  return specific?.has(lower) ?? false;
}

function sanitizeClassName(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
  }
  return undefined;
}

function isSafeHref(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) {
    return true;
  }
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex === -1) {
    return true;
  }
  const protocol = trimmed.slice(0, colonIndex).toLowerCase();
  return SAFE_HREF_PROTOCOLS.has(protocol);
}

function isSafeSrc(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) {
    return true;
  }
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex === -1) {
    return true;
  }
  const protocol = trimmed.slice(0, colonIndex).toLowerCase();
  return SAFE_SRC_PROTOCOLS.has(protocol);
}

function sanitizeProperties(tagName: string, properties?: Properties): Properties {
  if (!properties) return {};
  const sanitized: Properties = {};
  for (const [key, rawValue] of Object.entries(properties)) {
    if (rawValue === null || rawValue === undefined) continue;
    const lowerKey = key.toLowerCase();
    if (lowerKey.startsWith("on")) continue;

    if (lowerKey === "classname" || lowerKey === "class") {
      const clean = sanitizeClassName(rawValue);
      if (clean) sanitized[key] = clean;
      continue;
    }

    if (lowerKey === "style") {
      if (typeof rawValue === "string" || typeof rawValue === "object") {
        sanitized[key] = rawValue;
      }
      continue;
    }

    if (lowerKey === "href") {
      if (typeof rawValue === "string" && isSafeHref(rawValue)) {
        sanitized[key] = rawValue;
      }
      continue;
    }

    if (lowerKey === "src") {
      if (typeof rawValue === "string" && isSafeSrc(rawValue)) {
        sanitized[key] = rawValue;
      }
      continue;
    }

    if (!isAllowedAttr(tagName, lowerKey)) {
      continue;
    }

    sanitized[key] = rawValue;
  }
  return sanitized;
}

type RawNode = { type: "raw"; value?: unknown };
type HastChild = ElementContent | Content | RawNode;

function isRaw(node: HastChild | undefined): node is RawNode {
  return !!node && node.type === "raw";
}

function sanitizeChildren(parent: HastParent): void {
  if (!("children" in parent) || !parent.children) return;
  const children = parent.children as HastChild[];
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];

    if (isRaw(child)) {
      const textNode: Text = { type: "text", value: String(child.value ?? "") };
      children.splice(index, 1, textNode);
      continue;
    }

    if (!child || child.type !== "element") {
      continue;
    }

    const tagName = child.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      children.splice(index, 1);
      continue;
    }

    child.properties = sanitizeProperties(tagName, child.properties);

    sanitizeChildren(child);

    if (!child.children || child.children.length === 0) {
      if (!VOID_ELEMENTS.has(tagName)) {
        child.children = [];
      }
    }
  }
}

export function rehypeSanitize(): (tree: Root) => void {
  return function sanitize(tree: Root) {
    sanitizeChildren(tree);
  };
}
