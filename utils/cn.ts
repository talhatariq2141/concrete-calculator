// Lightweight, typed classnames helper used across the project.
// Accepts strings, numbers, arrays, and objects with boolean flags.
// Returns a single string suitable for React `className`.

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;
interface ClassDictionary {
  [id: string]: any;
}
interface ClassArray extends Array<ClassValue> {}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      continue;
    }

    if (Array.isArray(input)) {
      const inner = cn(...input as ClassValue[]);
      if (inner) classes.push(inner);
      continue;
    }

    if (typeof input === "object") {
      for (const key in input as ClassDictionary) {
        if (Object.prototype.hasOwnProperty.call(input, key) && (input as ClassDictionary)[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

export default cn;
