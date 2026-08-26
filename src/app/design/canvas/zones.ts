import { CANVAS_ITEMS, type CanvasItemDef } from "./items";

/**
 * The public component taxonomy, derived from the canvas zone labels in
 * items.ts: one source for "what lives where", so the map on `/` cannot
 * drift from the map on `/design/canvas`.
 *
 * Zone titles carry authoring history ("Crypto: round 2", "Learn
 * imports"); CATEGORIES folds them onto the names a reader needs and
 * fixes the display order. Foundations, patterns, and the non-portable
 * tier (PriceChart, QRCode) have canvas demos but no design-system
 * folder, so they fall out when demo ids meet the real folder list.
 */

type CategoryDef = { id: string; title: string; zones: string[] };

const CATEGORIES: CategoryDef[] = [
  { id: "primitives", title: "Primitives", zones: ["Primitives: core atoms"] },
  {
    id: "containment",
    title: "Containment & forms",
    zones: ["Primitives: containment & forms"],
  },
  {
    id: "navigation",
    title: "Navigation & overlays",
    zones: ["Navigation & overlays"],
  },
  { id: "data", title: "Data", zones: ["Data: terminal grade"] },
  {
    id: "crypto",
    title: "Crypto",
    zones: [
      "Crypto: the vertical",
      "Crypto: round 2",
      "Crypto: round 3",
    ],
  },
  {
    id: "trading",
    title: "Trading",
    zones: ["Trading interface: Learn imports"],
  },
  { id: "social", title: "Social", zones: ["Components"] },
  {
    id: "interactions",
    title: "Interactions",
    zones: ["Interior-inspired interactions"],
  },
];

/** Bucket for components no zone claims: zones.test.ts asserts it stays empty. */
export const UNCATEGORIZED_ID = "other";

export type Category = { id: string; title: string; components: string[] };

/**
 * Group real design-system components by canvas zone, in display order.
 * `names` is the authoritative folder list (read from disk by the caller,
 * so the page counts what actually ships). A component the zones don't
 * cover still renders, under "Other", rather than silently vanishing.
 */
export function categorize(
  names: string[],
  items: CanvasItemDef[] = CANVAS_ITEMS,
): Category[] {
  const real = new Set(names);
  const categoryOfZone = new Map<string, string>();
  for (const c of CATEGORIES) for (const z of c.zones) categoryOfZone.set(z, c.id);

  const buckets = new Map<string, string[]>();
  const seen = new Set<string>(); // a component framed twice is listed once
  let zone: string | null = null;

  for (const item of items) {
    if (item.kind === "label") {
      zone = item.title;
      continue;
    }
    if (item.kind !== "demo" || !real.has(item.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    const id = (zone && categoryOfZone.get(zone)) ?? UNCATEGORIZED_ID;
    buckets.set(id, [...(buckets.get(id) ?? []), item.id]);
  }

  const out = CATEGORIES.map((c) => ({
    id: c.id,
    title: c.title,
    components: buckets.get(c.id) ?? [],
  })).filter((c) => c.components.length > 0);

  const uncovered = names.filter((n) => !seen.has(n));
  if (uncovered.length) {
    out.push({ id: UNCATEGORIZED_ID, title: "Other", components: uncovered });
  }
  return out;
}
