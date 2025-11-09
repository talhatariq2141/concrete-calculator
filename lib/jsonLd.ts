export function stringifyJsonLd(value: unknown): string {
  const serialized = JSON.stringify(value);

  if (typeof serialized !== "string") {
    return "";
  }

  return serialized.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
