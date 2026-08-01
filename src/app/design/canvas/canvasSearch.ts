import { CANVAS_ITEMS, type CanvasItemDef } from "./items";

export type SearchableItem = Extract<CanvasItemDef, { kind: "demo" | "iframe" }>;

export function searchableItems(
  items: CanvasItemDef[] = CANVAS_ITEMS,
): SearchableItem[] {
  return items.filter((i): i is SearchableItem => i.kind === "demo" || i.kind === "iframe");
}

/** Filter canvas demos/iframes by title or id. Empty query → first N. */
export function filterCanvasItems(
  query: string,
  items: CanvasItemDef[] = CANVAS_ITEMS,
  limit = 12,
): SearchableItem[] {
  const all = searchableItems(items);
  const q = query.trim().toLowerCase();
  if (!q) return all.slice(0, limit);
  return all
    .filter(
      (i) =>
        i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
