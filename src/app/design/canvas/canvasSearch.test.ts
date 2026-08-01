import { describe, expect, it } from "vitest";
import { filterCanvasItems, searchableItems } from "./canvasSearch";
import { CANVAS_ITEMS } from "./items";

describe("filterCanvasItems", () => {
  it("returns demos and iframes only", () => {
    const all = searchableItems();
    expect(all.every((i) => i.kind === "demo" || i.kind === "iframe")).toBe(true);
    expect(all.length).toBeGreaterThan(10);
    expect(all.some((i) => i.id === "Button")).toBe(true);
  });

  it("empty query returns a short head list", () => {
    expect(filterCanvasItems("", CANVAS_ITEMS, 5)).toHaveLength(5);
  });

  it("filters by title and id", () => {
    const byTitle = filterCanvasItems("order book", CANVAS_ITEMS, 20);
    expect(byTitle.some((i) => /order/i.test(i.title))).toBe(true);
    const byId = filterCanvasItems("Button", CANVAS_ITEMS, 20);
    expect(byId.some((i) => i.id === "Button")).toBe(true);
  });

  it("no matches → empty", () => {
    expect(filterCanvasItems("zzzz-not-a-component")).toEqual([]);
  });
});
