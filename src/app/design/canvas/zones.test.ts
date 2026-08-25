import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { categorize, UNCATEGORIZED_ID } from "./zones";

const DS = join(process.cwd(), "src/design-system");
const componentNames = readdirSync(DS).filter((n) =>
  existsSync(join(DS, n, `${n}.doc.md`)),
);

describe("categorize", () => {
  it("covers every design-system component exactly once", () => {
    const listed = categorize(componentNames).flatMap((c) => c.components);
    expect([...listed].sort()).toEqual([...componentNames].sort());
  });

  it("leaves nothing uncategorized — a new component needs a canvas zone", () => {
    const other = categorize(componentNames).find(
      (c) => c.id === UNCATEGORIZED_ID,
    );
    expect(other?.components ?? []).toEqual([]);
  });

  it("drops canvas demos that aren't design-system components", () => {
    // Foundations (surfaces/hues/motion), patterns, and the non-portable
    // tier are framed on the canvas but don't ship as components.
    const listed = categorize(componentNames).flatMap((c) => c.components);
    for (const id of ["surfaces", "hues", "motion", "PatternStates", "PriceChart"]) {
      expect(listed).not.toContain(id);
    }
  });

  it("folds the crypto rounds into one category", () => {
    const crypto = categorize(componentNames).find((c) => c.id === "crypto");
    expect(crypto?.components).toEqual(
      expect.arrayContaining(["PegBadge", "GasFee", "TokenSelect"]),
    );
  });

  it("omits empty categories", () => {
    const cats = categorize(["Button"]);
    expect(cats).toEqual([
      { id: "primitives", title: "Primitives", components: ["Button"] },
    ]);
  });
});
