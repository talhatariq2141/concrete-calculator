import fs from "node:fs/promises";
import ts from "typescript";

const COMPILER_OPTIONS = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2020,
  jsx: ts.JsxEmit.Preserve,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  esModuleInterop: true,
  allowImportingTsExtensions: true,
  resolveJsonModule: true,
  isolatedModules: true,
};

export async function load(url, context, defaultLoad) {
  if (url.endsWith(".ts") || url.endsWith(".tsx")) {
    const source = await fs.readFile(new URL(url), "utf8");
    const transformed = ts.transpileModule(source, {
      compilerOptions: COMPILER_OPTIONS,
      fileName: url,
      reportDiagnostics: false,
    });

    return {
      format: "module",
      source: transformed.outputText,
      shortCircuit: true,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}
