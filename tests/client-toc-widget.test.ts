import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Module from "node:module";

type LoadFunction = (
  request: string,
  parent: NodeModule | null | undefined,
  isMain?: boolean
) => unknown;

type ModuleLoader = {
  _load: LoadFunction;
};

describe("ClientTOCWidget", () => {
  it("disables SSR and provides a loading fallback", async () => {
    const modulePrototype = Module as unknown as ModuleLoader;
    const originalLoad = modulePrototype._load;

    let capturedOptions:
      | { ssr?: boolean; loading?: (props: never) => unknown }
      | undefined;
    const dynamicStub = (
      loader: () => Promise<unknown>,
      options?: typeof capturedOptions
    ) => {
      capturedOptions = options;
      return () => null;
    };

    modulePrototype._load = ((request, parent, isMain) => {
      if (request === "next/dynamic") {
        return dynamicStub;
      }
      return originalLoad(request, parent, isMain);
    }) as LoadFunction;

    try {
      const widgetModule = await import("../components/blog/ClientTOCWidget");
      assert.equal(typeof widgetModule.ClientTOCWidget, "function");
      assert.ok(capturedOptions, "expected dynamic options");
      assert.equal(capturedOptions?.ssr, false);

      const fallback = capturedOptions?.loading?.({} as never);
      assert.ok(fallback, "expected loading fallback element");
      assert.equal(
        (fallback as { props: { children: string } }).props.children,
        "Loading table of contents…"
      );
    } finally {
      modulePrototype._load = originalLoad;
    }
  });
});
