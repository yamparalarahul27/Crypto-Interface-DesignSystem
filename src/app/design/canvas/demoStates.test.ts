import { describe, expect, it } from "vitest";
import { DEMO_STATE_OPTIONS, defaultDemoState } from "./demoStates";

describe("demoStates", () => {
  it("every entry has a non-empty chip list", () => {
    for (const [id, opts] of Object.entries(DEMO_STATE_OPTIONS)) {
      expect(opts.length, id).toBeGreaterThan(0);
    }
  });

  it("defaultDemoState is the first chip", () => {
    expect(defaultDemoState("TxStatus")).toBe("idle");
    expect(defaultDemoState("Avatar")).toBeUndefined();
  });
});
