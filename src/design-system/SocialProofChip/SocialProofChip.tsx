import { cn } from "@/lib/utils";
import { IconWatching } from "../icons";

export function SocialProofChip({
  count,
  label = "watching",
  compact = false,
  className,
}: {
  count: number;
  label?: string;
  /** On dense cards, drop the label and show just the count. */
  compact?: boolean;
  className?: string;
}) {
  return (
    // Accessible name comes from real text (aria-label is prohibited on a
    // generic span: axe aria-prohibited-attr). Compact mode keeps the
    // label for screen readers via sr-only.
    <span
      className={cn("inline-flex items-center gap-1 text-xs text-fg-muted", className)}
    >
      <span className="inline-flex text-brand/60" aria-hidden="true">
        <IconWatching size={13} />
      </span>
      <span className="data-sm">{count}</span>
      {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </span>
  );
}
