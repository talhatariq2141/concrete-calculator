import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Module from "node:module";

describe("ClientTOCWidget", () => {
  it("disables SSR and provides a loading fallback", async () => {
    const modulePrototype = Module as any;
    const originalLoad = modulePrototype._load;

    let capturedOptions: { ssr?: boolean; loading?: (props: never) => any } | undefined;
    const dynamicStub = (loader: () => Promise<unknown>, options?: typeof capturedOptions) => {
      capturedOptions = options;
      return () => null;
    };

    modulePrototype._load = function (request: string, parent: any, isMain: any) {
      if (request === "next/dynamic") {
        return dynamicStub;
      }
      return originalLoad.apply(this, [request, parent, isMain]);
    };

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
