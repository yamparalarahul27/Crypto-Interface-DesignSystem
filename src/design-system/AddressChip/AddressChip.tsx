"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy, IconExternal } from "../icons";

const truncate = (addr: string) =>
  addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

/**
 * Wallet/mint address: truncated mono display, one-tap copy with
 * confirmation, optional explorer link. The full address is always the
 * accessible name: truncation is visual only.
 */
export function AddressChip({
  address,
  href,
  className,
}: {
  address: string;
  /** Explorer URL: renders an IconExternal link when present. */
  href?: string;
  className?: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = () => {
    const write = navigator.clipboard?.writeText?.(address);
    if (!write) {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 1500);
      return;
    }
    write
      .then(() => {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 1500);
      })
      .catch(() => {
        setCopyState("failed");
        setTimeout(() => setCopyState("idle"), 1500);
      });
  };

  const copyLabel =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy failed"
        : `Copy address ${address}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-chip border border-outline-variant bg-surface-container py-0.5 pl-2 pr-0.5",
        className,
      )}
    >
      <span className="font-mono text-xs text-fg" aria-label={address}>
        {truncate(address)}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copyLabel}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-control text-xs transition-colors duration-150",
          copyState === "copied"
            ? "text-buy"
            : copyState === "failed"
              ? "text-sell"
              : "text-fg-muted hover:text-fg",
        )}
      >
        {copyState === "copied" ? (
          <IconCheck size={13} weight="bold" aria-hidden="true" />
        ) : (
          <IconCopy size={13} aria-hidden="true" />
        )}
      </button>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on explorer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-control text-xs text-fg-muted transition-colors duration-150 hover:text-fg"
        >
          <IconExternal size={13} aria-hidden="true" />
        </a>
      )}
    </span>
  );
}
