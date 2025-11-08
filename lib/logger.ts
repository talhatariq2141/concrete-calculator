const PREFIX = "[content]";

function formatMessage(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return `${PREFIX} ${context}: ${message}`;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function logError(context: string, error: unknown) {
  if (isProduction()) {
    console.error(formatMessage(context, error));
  } else {
    console.error(formatMessage(context, error), error);
  }
}
