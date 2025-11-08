const fs = require("node:fs");
const path = require("node:path");
const Module = require("module");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "../..");

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2020,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  baseUrl: projectRoot,
  paths: {
    "@/*": ["./*"],
  },
};

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request && request.startsWith("@/")) {
    const candidate = path.join(projectRoot, request.slice(2));
    return originalResolve.call(this, candidate, parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

function registerExtension(ext) {
  const original = Module._extensions[ext];
  Module._extensions[ext] = function (module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions,
      fileName: filename,
      reportDiagnostics: false,
    });
    return module._compile(outputText, filename);
  };
  return original;
}

const restoreTs = registerExtension(".ts");
const restoreTsx = registerExtension(".tsx");

module.exports = function restore() {
  if (restoreTs) {
    Module._extensions[".ts"] = restoreTs;
  }
  if (restoreTsx) {
    Module._extensions[".tsx"] = restoreTsx;
  }
  Module._resolveFilename = originalResolve;
};
