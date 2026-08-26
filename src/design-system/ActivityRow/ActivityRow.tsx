import { cn } from "@/lib/utils";
import { IconTokenFallback } from "../icons";
import { TokenIcon } from "../TokenIcon";

export type ActivityStatus = "pending" | "confirmed" | "failed";

const STATUS: Record<ActivityStatus, { word: string; text: string }> = {
  pending: { word: "pending", text: "text-info" },
  confirmed: { word: "confirmed", text: "text-buy" },
  failed: { word: "failed", text: "text-sell" },
};

/**
 * Transaction / activity list row: the history atom every wallet and
 * exchange rebuilds. Icon · title · time · status word · amount. Status
 * is word + tint (mono-safe); amount is a preformatted string so the
 * caller keeps sign/fiat discipline upstream.
 */
export function ActivityRow({
  title,
  time,
  status,
  amount,
  tokenSymbol,
  tokenIconSrc,
  onClick,
  className,
}: {
  /** What happened ("Swapped SOL → USDC", "Received SOL"). */
  title: string;
  /** Preformatted relative/absolute time ("2m ago"). */
  time: string;
  status: ActivityStatus;
  /** Preformatted amount with sign ("+12.40 USDC", "−0.5 SOL"). */
  amount: string;
  /** Optional token glyph on the left. */
  tokenSymbol?: string;
  tokenIconSrc?: string;
  /** Makes the row a button (navigate to detail). */
  onClick?: () => void;
  className?: string;
}) {
  const s = STATUS[status];
  const body = (
    <>
      {tokenSymbol ? (
        <TokenIcon src={tokenIconSrc} symbol={tokenSymbol} size="md" />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-surface-bright text-fg-muted"
        >
          <IconTokenFallback size={11} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg">{title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[11px]">
          <span className="text-fg-subtle">{time}</span>
          <span className={cn("font-medium", s.text)}>
            {s.word}
          </span>
        </span>
      </span>
      <span className="data-sm flex-none text-fg">{amount}</span>
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-3 rounded-control px-2 py-2 text-left",
    "transition-[background-color,transform] duration-150",
    onClick &&
      "hover:bg-surface-container-high active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {body}
      </button>
    );
  }

  return <div className={rowClass}>{body}</div>;
}
