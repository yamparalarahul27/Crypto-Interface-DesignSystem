import { cn } from "@/lib/utils";
import {
  blocksFor,
  hueFor,
  hueGradient,
  shardsFor,
  type IdHue,
} from "../identity";

// Shared size scale (CONVENTIONS → Component API contract): string
// unions, never raw numbers. Diameters per DESIGN.md avatar spec:
// xs 20px · sm 28px · md 40px · lg 64px; glyph scales with the disc.
export type AvatarSize = "xs" | "sm" | "md" | "lg";

/**
 * Art style. `initial` is the original v1 figure and stays the default, so
 * every existing call site renders exactly as before. The generative
 * styles are what a wallet needs: `initial` gives one of 8 hues, and a
 * group of five collides ~79% of the time, which is fine for a named
 * person in a feed and useless for telling two addresses apart.
 *
 * This is a user setting in most wallets: persist the choice per person,
 * don't vary it per view, or the same account reads as two identities.
 */
export type AvatarVariant = "initial" | "shards" | "blocks";

export type AvatarConnection = "active" | "inactive" | "offline";

const SIZE: Record<AvatarSize, string> = {
  xs: "w-5 h-5 text-[9px]",
  sm: "w-7 h-7 text-xs",
  md: "w-10 h-10 text-[17px]",
  lg: "w-16 h-16 text-[26px]",
};

/** Corner markers are suppressed where they'd collapse into a smudge. */
const BADGE: Record<AvatarSize, string> = {
  xs: "hidden",
  sm: "hidden",
  md: "w-4 h-4 text-[7px] -right-0.5 -bottom-0.5",
  lg: "w-6 h-6 text-[10px] -right-1 -bottom-1",
};

const DOT: Record<AvatarSize, string> = {
  xs: "hidden",
  sm: "w-2.5 h-2.5 right-0 bottom-0",
  md: "w-3 h-3 right-0 bottom-0",
  lg: "w-4 h-4 right-0.5 bottom-0.5",
};

const CONNECTION: Record<
  AvatarConnection,
  { className: string; label: string }
> = {
  // Each state differs by shape as well as colour (a filled dot, a ring,
  // a muted fill), so status never depends on hue alone.
  active: { className: "bg-success border-success", label: "connected, active" },
  inactive: { className: "bg-surface-page border-success", label: "connected, inactive" },
  offline: { className: "bg-fg-subtle border-fg-subtle", label: "no connection" },
};

export function Avatar({
  name,
  seed,
  hue,
  size = "md",
  variant = "initial",
  you = false,
  chain,
  connection,
  className,
}: {
  /** Handle or display name; its first character becomes the glyph. */
  name: string;
  /** Value hashed to pick a hue. Defaults to `name`; pass the wallet address for stable per-person color. */
  seed?: string;
  /** Explicit hue override; skips hashing. */
  hue?: IdHue;
  /** xs 20px · sm 28px · md 40px · lg 64px; glyph scales with the disc. */
  size?: AvatarSize;
  /** Figure style. `initial` (default) is the v1 hue disc + glyph. */
  variant?: AvatarVariant;
  /** Signed-in user: forces the reserved --id-tide hue. */
  you?: boolean;
  /** Network marker in the corner. `iconSrc` falls back to the initial. */
  chain?: { name: string; iconSrc?: string };
  /** Connection status dot. Ignored when `chain` is set: one corner, one marker. */
  connection?: AvatarConnection;
  className?: string;
}) {
  const resolved: IdHue = you ? "tide" : (hue ?? hueFor(seed ?? name));
  const glyph = (name.trim()[0] ?? "?").toUpperCase();
  const figureSeed = seed ?? name;
  // One corner, one marker: a network badge and a status dot in the same
  // notch read as a single confused glyph, so chain wins when both are set.
  const dot = chain ? undefined : connection;

  const hasMarker = Boolean(chain || dot);

  const figure = { variant, name, resolved, glyph, seed: figureSeed };

  if (!hasMarker) {
    return (
      <Disc {...figure} cls={cn("flex-none", SIZE[size], className)} labelled />
    );
  }

  const markerLabel = chain ? `on ${chain.name}` : CONNECTION[dot!].label;

  return (
    <span
      role="img"
      aria-label={`${name}, ${markerLabel}`}
      className={cn("relative inline-flex flex-none", SIZE[size], className)}
    >
      <Disc {...figure} cls="h-full w-full" labelled={false} />

      {chain && (
        <span
          aria-hidden="true"
          // Ringed in the page surface so the badge reads as sitting on top
          // of the disc rather than punched into it.
          className={cn(
            "absolute inline-flex items-center justify-center overflow-hidden rounded-md bg-surface-container font-mono font-semibold text-fg ring-2 ring-surface-page",
            BADGE[size],
          )}
          title={chain.name}
        >
          {chain.iconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- portable DS: no next/image
            <img src={chain.iconSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            chain.name.trim()[0]?.toUpperCase()
          )}
        </span>
      )}

      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute rounded-full border-2 ring-2 ring-surface-page",
            CONNECTION[dot].className,
            DOT[size],
          )}
          title={CONNECTION[dot].label}
        />
      )}
    </span>
  );
}

/**
 * The figure. `cls` is applied by the caller so the no-marker case stays a
 * single element: v1's DOM exactly, which AvatarGroup's ring/overlap
 * classes and the existing tests target. Module-scope so it isn't
 * redefined (and remounted) on every Avatar render.
 */
function Disc({
  variant,
  name,
  resolved,
  glyph,
  seed,
  cls,
  labelled,
}: {
  variant: AvatarVariant;
  name: string;
  resolved: IdHue;
  glyph: string;
  seed: string;
  cls: string;
  labelled: boolean;
}) {
  if (variant === "initial") {
    return (
      <span
        role={labelled ? "img" : undefined}
        aria-label={labelled ? name : undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-mono font-semibold text-id-glyph antialiased",
          cls,
        )}
        style={{ backgroundImage: hueGradient(resolved) }}
      >
        {glyph}
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      role={labelled ? "img" : undefined}
      aria-label={labelled ? name : undefined}
      className={cn("rounded-full", cls)}
    >
      {variant === "blocks" ? <BlocksFill seed={seed} /> : <ShardsFill seed={seed} />}
    </svg>
  );
}

function ShardsFill({ seed }: { seed: string }) {
  const { shards, base, baseMix } = shardsFor(seed);
  return (
    <>
      <circle
        cx="50"
        cy="50"
        r="50"
        fill={`color-mix(in srgb, var(--id-${base}) ${baseMix}%, black)`}
      />
      {shards.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill={`color-mix(in srgb, var(--id-${s.hue}) ${s.mix}%, black)`}
        />
      ))}
    </>
  );
}

function BlocksFill({ seed }: { seed: string }) {
  const n = 5;
  const { cells, hue } = blocksFor(seed, n);
  const step = 100 / n;
  return (
    <>
      <circle
        cx="50"
        cy="50"
        r="50"
        fill={`color-mix(in srgb, var(--id-${hue}) 22%, black)`}
      />
      {cells.map((c, i) =>
        c ? (
          <rect
            key={i}
            x={(i % n) * step}
            y={Math.floor(i / n) * step}
            width={step}
            height={step}
            fill={`var(--id-${c})`}
          />
        ) : null,
      )}
    </>
  );
}
