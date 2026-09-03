import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCross } from "../icons";

export type TxState = "idle" | "signing" | "pending" | "confirmed" | "failed";

// The transaction lifecycle, visible at every step (ethereum.org
// heuristic #1): the component no reference library ships.
const COPY: Record<TxState, string> = {
  idle: "Ready",
  signing: "Waiting for wallet…",
  pending: "Pending confirmation…",
  confirmed: "Confirmed",
  failed: "Failed",
};

const DOT: Record<TxState, string> = {
  idle: "bg-fg-subtle",
  signing: "bg-warning animate-pulse",
  pending: "bg-info animate-pulse",
  confirmed: "bg-buy",
  failed: "bg-sell",
};

const TEXT: Record<TxState, string> = {
  idle: "text-fg-muted",
  signing: "text-warning",
  pending: "text-info",
  confirmed: "text-buy",
  failed: "text-sell",
};

export function TxStatus({
  state,
  detail,
  detailHref,
  action,
  className,
}: {
  state: TxState;
  /** Optional line under the label (signature, error hint…). */
  detail?: string;
  /** When set, `detail` renders as an explorer link. */
  detailHref?: string;
  /** Right-side affordance (e.g. Retry on failed). */
  action?: ReactNode;
  className?: string;
}) {
  return (
    // Live region: state changes are announced without stealing focus,
    // the user acts in the wallet while the UI reports (heuristic #2).
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-start gap-3", className)}
    >
      <span className="inline-flex min-w-0 items-start gap-2">
        <span
          aria-hidden="true"
          className={cn("mt-1 h-2 w-2 flex-none rounded-full", DOT[state])}
        />
        <span className="min-w-0">
          <span className={cn("flex items-center gap-1.5 text-sm font-medium", TEXT[state])}>
            {state === "confirmed" ? (
              <IconCheck size={13} weight="bold" aria-hidden="true" />
            ) : state === "failed" ? (
              <IconCross size={13} weight="bold" aria-hidden="true" />
            ) : null}
            {COPY[state]}
          </span>
          {detail &&
            (detailHref ? (
              <a
                href={detailHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block truncate font-mono text-xs text-fg-subtle underline-offset-2 hover:text-fg hover:underline"
              >
                {detail}
              </a>
            ) : (
              <span className="mt-0.5 block truncate font-mono text-xs text-fg-subtle">
                {detail}
              </span>
            ))}
        </span>
      </span>
      {action ? <span className="flex-none self-center">{action}</span> : null}
    </div>
  );
}
