import { cn } from "@/lib/utils";

export type NetworkBadgeTone = "neutral" | "warning" | "error";

const TONE: Record<
  NetworkBadgeTone,
  { box: string; text: string; dot: string }
> = {
  neutral: {
    box: "bg-surface-container-high",
    text: "text-fg-muted",
    dot: "bg-fg-subtle",
  },
  warning: {
    box: "bg-warning-surface",
    text: "text-warning",
    dot: "bg-warning",
  },
  error: {
    box: "bg-error-surface",
    text: "text-error",
    dot: "bg-error",
  },
};

/**
 * Chain indicator; ethereum.org heuristic #3: always show the connected
 * network. Neutral by default (chains are facts); use `tone="warning"` /
 * `"error"` for wrong-network / unsupported-chain signals (word + tint).
 */
export function NetworkBadge({
  name,
  iconSrc,
  tone = "neutral",
  className,
}: {
  name: string;
  iconSrc?: string;
  /** `warning` / `error` for mismatch or unsupported chain. */
  tone?: NetworkBadgeTone;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip px-2 py-1 text-xs font-medium",
        t.box,
        t.text,
        className,
      )}
    >
      {iconSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={iconSrc} alt="" className="h-3 w-3 rounded-full" />
      ) : (
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
      )}
      {name}
    </span>
  );
}
