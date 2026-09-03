"use client";

import { useState } from "react";
import { DropdownMenu as RadixMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { Avatar } from "../Avatar";

const truncate = (addr: string) =>
  addr.length <= 10 ? addr : `${addr.slice(0, 4)}…${addr.slice(-4)}`;

/**
 * Connected-wallet account menu: WalletButton's companion. Trigger
 * shows the truncated address; the panel holds copy, optional explorer,
 * optional balance, and Disconnect. Disconnect lives HERE, never on
 * WalletButton (accidental disconnects are hostile).
 */
export function AccountMenu({
  address,
  balance,
  explorerHref,
  onDisconnect,
  disabled,
  className,
}: {
  address: string;
  /** Preformatted balance line (e.g. "12.4 SOL"). */
  balance?: string;
  /** Explorer URL for the account. */
  explorerHref?: string;
  onDisconnect?: () => void;
  disabled?: boolean;
  /** Merged onto the trigger. */
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

  return (
    <RadixMenu.Root>
      <RadixMenu.Trigger
        disabled={disabled}
        aria-label={`Wallet ${address}: open account`}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-control border border-outline-variant bg-surface-container px-2.5 text-sm text-fg",
          "transition-[background-color,border-color,transform] duration-150",
          "hover:bg-surface-container-high active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          "disabled:pointer-events-none disabled:opacity-40",
          className,
        )}
      >
        <Avatar name={address} seed={address} size="xs" you />
        <span className="font-mono">{truncate(address)}</span>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-buy" />
      </RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            "z-[var(--z-raised)] min-w-56 rounded-chip border border-outline-variant bg-surface-bright p-1 shadow-raised",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        >
          <div className="px-2.5 py-2">
            <p className="break-all font-mono text-xs text-fg">{address}</p>
            {balance && (
              <p className="data-sm mt-1 text-fg-muted">{balance}</p>
            )}
          </div>
          <RadixMenu.Separator className="mx-1 my-1 h-px bg-outline-variant" />
          <RadixMenu.Item
            onSelect={(e) => {
              e.preventDefault(); // keep menu open briefly for "Copied"
              copy();
            }}
            className={cn(
              "flex cursor-default select-none items-center rounded-control px-2.5 py-1.5 text-xs text-fg outline-none",
              "data-[highlighted]:bg-surface-container-high",
              copyState === "failed" && "text-sell",
            )}
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy address"}
          </RadixMenu.Item>
          {explorerHref && (
            <RadixMenu.Item
              onSelect={() => {
                window.open(explorerHref, "_blank", "noopener,noreferrer");
              }}
              className={cn(
                "flex cursor-default select-none items-center rounded-control px-2.5 py-1.5 text-xs text-fg outline-none",
                "data-[highlighted]:bg-surface-container-high",
              )}
            >
              View on explorer
            </RadixMenu.Item>
          )}
          {onDisconnect && (
            <>
              <RadixMenu.Separator className="mx-1 my-1 h-px bg-outline-variant" />
              <RadixMenu.Item
                onSelect={onDisconnect}
                className={cn(
                  "flex cursor-default select-none items-center rounded-control px-2.5 py-1.5 text-xs text-sell outline-none",
                  "data-[highlighted]:bg-surface-container-high",
                )}
              >
                Disconnect
              </RadixMenu.Item>
            </>
          )}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}
