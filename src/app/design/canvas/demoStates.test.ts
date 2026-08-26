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
    // AvatarGroup stands in for "demo with no entry": it keeps the
    // zero-arg pose. (Avatar used to be the example here, until it
    // gained sizes/hues/you chips.)
    expect(defaultDemoState("AvatarGroup")).toBeUndefined();
  });
});
