import { cn } from "@/lib/utils";

export type MarginHealthLevel = "healthy" | "caution" | "high" | "critical";

export function marginHealthLevel(value: number): MarginHealthLevel {
  if (value >= 90) return "critical";
  if (value >= 80) return "high";
  if (value >= 50) return "caution";
  return "healthy";
}

const LEVEL_COPY: Record<MarginHealthLevel, string> = {
  healthy: "Healthy",
  caution: "Caution",
  high: "High",
  critical: "Critical",
};

const LEVEL_TONE: Record<MarginHealthLevel, { text: string; bar: string }> = {
  healthy: { text: "text-buy", bar: "bg-buy" },
  caution: { text: "text-warning", bar: "bg-warning" },
  high: { text: "text-sell", bar: "bg-sell" },
  critical: { text: "text-error", bar: "bg-error" },
};

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function MarginHealth({
  value,
  label = "Margin ratio",
  precision = 2,
  className,
}: {
  /** Maintenance margin / margin balance, expressed as 0-100 percent. */
  value: number;
  label?: string;
  precision?: number;
  className?: string;
}) {
  const pct = clamp(value);
  const level = marginHealthLevel(pct);
  const tone = LEVEL_TONE[level];
  const width = pct === 0 ? 0 : Math.max(2, pct);

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Number(pct.toFixed(precision))}
      aria-valuetext={`${LEVEL_COPY[level]} ${pct.toFixed(precision)}%`}
      className={cn(
        "flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container px-3 py-2",
        className,
      )}
    >
      <span className="shrink-0 text-[10px] font-semibold text-fg-subtle">
        {label}
      </span>
      <span className="h-2 min-w-12 flex-1 overflow-hidden rounded-full bg-surface-bright">
        <span
          className={cn("block h-full rounded-full transition-[width] duration-300", tone.bar)}
          style={{ width: `${width}%` }}
        />
      </span>
      <span className={cn("shrink-0 text-xs font-semibold", tone.text)}>
        {LEVEL_COPY[level]}
      </span>
      <span className={cn("shrink-0 font-mono text-sm font-semibold tabular-nums", tone.text)}>
        {pct.toFixed(precision)}%
      </span>
    </div>
  );
}
