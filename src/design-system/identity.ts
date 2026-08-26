// Identity-hue assignment for the tide social layer.
// Maps a person (wallet address / handle) to one of the 8 --id-* hues
// defined in globals.css. Deterministic and stable: no user picker in v1.
// Consumed by Avatar / AvatarGroup only; never for data or state.

export const ID_HUES = [
  "tide",
  "coral",
  "sand",
  "lilac",
  "sky",
  "moss",
  "rose",
  "slate",
] as const;

export type IdHue = (typeof ID_HUES)[number];

/** Deterministic hash(seed) % 8 → hue. djb2; stable across sessions. */
export function hueFor(seed: string): IdHue {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  return ID_HUES[h % ID_HUES.length];
}

/**
 * Avatar radial-gradient fill for a hue. References the --id-* token and
 * derives the dark end via color-mix: never a hardcoded hex. Mirrors
 * DESIGN.md → Identity hues.
 */
export function hueGradient(hue: IdHue): string {
  // Built from --id-<hue>-fill, not --id-<hue>: the plain hue is the text
  // accent and is far too light to carry a glyph. The dark end is a gentle
  // 78%: the fill is already deep, so the old 60% collapsed to near-black.
  const v = `var(--id-${hue}-fill)`;
  return `radial-gradient(120% 120% at 30% 20%, ${v}, color-mix(in srgb, ${v} 78%, black))`;
}


// ── generative identity figures ──────────────────────────────────
// Seeded art for wallet-style avatars. Lives here beside hueFor so
// every identity figure derives from one hash family and one palette.

/** djb2: same hash family as identity.hueFor, widened for a PRNG seed. */
function hashOf(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** mulberry32: tiny deterministic PRNG so one address always draws once. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * `mix` is the hue's share in a color-mix toward black: the identity
 * hues are deliberately muted ("muted to sit on near-black", DESIGN.md),
 * so hue alone barely separates one shard from the next. Varying value
 * per shard is what makes the disc read as faceted, and it reuses the
 * exact trick hueGradient already uses for Avatar's dark end.
 */
type Shard = { d: string; hue: IdHue; mix: number };

/**
 * Cut the disc into 4–6 sectors from an off-centre pivot. Curved outer
 * edges (SVG arcs) are what make it read as a disc that was shattered
 * rather than a pie chart.
 */
export function shardsFor(seed: string): {
  shards: Shard[];
  base: IdHue;
  baseMix: number;
} {
  const rand = prng(hashOf(seed));
  const R = 50;
  const C = 50;

  // Pivot wanders off-centre, which is what varies the sector shapes.
  const pivotA = rand() * Math.PI * 2;
  const pivotR = rand() * 26;
  const px = C + Math.cos(pivotA) * pivotR;
  const py = C + Math.sin(pivotA) * pivotR;

  const count = 4 + Math.floor(rand() * 3); // 4–6
  const angles = Array.from({ length: count }, () => rand() * Math.PI * 2).sort(
    (a, b) => a - b,
  );

  // Seeded rotation of the palette, so two wallets rarely open on the
  // same colour even when their sector counts match.
  const offset = Math.floor(rand() * ID_HUES.length);
  const base = ID_HUES[offset];

  const at = (ang: number) =>
    `${(C + Math.cos(ang) * R).toFixed(2)} ${(C + Math.sin(ang) * R).toFixed(2)}`;

  const shards = angles.map((ang, i) => {
    const next = angles[(i + 1) % angles.length];
    // Sectors are laid out clockwise; anything past a half-turn needs the
    // large-arc flag or SVG draws the short way round and leaves a gap.
    const sweep = (next - ang + Math.PI * 2) % (Math.PI * 2);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      d: `M ${px.toFixed(2)} ${py.toFixed(2)} L ${at(ang)} A ${R} ${R} 0 ${large} 1 ${at(next)} Z`,
      hue: ID_HUES[(offset + i + 1) % ID_HUES.length],
      // 45–100% hue: deep facets next to full-strength ones.
      mix: 45 + Math.floor(rand() * 56),
    };
  });

  return { shards, base, baseMix: 30 + Math.floor(rand() * 30) };
}

/**
 * The other open identicon idiom: an N×N grid mirrored down the middle.
 * Symmetry is what makes these read as a "face" rather than noise, and
 * it's why blockies stay recognisable at 20px where shards blur.
 */
export function blocksFor(seed: string, n = 5): { cells: (IdHue | null)[]; hue: IdHue; spot: IdHue } {
  const rand = prng(hashOf(seed) ^ 0x9e3779b9);
  const offset = Math.floor(rand() * ID_HUES.length);
  const hue = ID_HUES[offset];
  const spot = ID_HUES[(offset + 3) % ID_HUES.length];

  const half = Math.ceil(n / 2);
  const cells: (IdHue | null)[] = new Array(n * n).fill(null);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < half; x++) {
      const r = rand();
      const v = r > 0.66 ? spot : r > 0.33 ? hue : null;
      cells[y * n + x] = v;
      cells[y * n + (n - 1 - x)] = v; // mirror
    }
  }
  return { cells, hue, spot };
}
