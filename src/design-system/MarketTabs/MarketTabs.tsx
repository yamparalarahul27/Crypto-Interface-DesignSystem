"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TokenIcon } from "../TokenIcon";

export type MarketTabItem = {
  symbol: string;
  label?: string;
  price?: string;
  changePct?: number;
  iconSrc?: string;
  disabled?: boolean;
};

export function MarketTabs({
  markets,
  activeSymbol,
  onActiveChange,
  onClose,
  onAdd,
  addDisabled = false,
  addLabel = "Add market",
  "aria-label": ariaLabel = "Open markets",
  className,
}: {
  markets: MarketTabItem[];
  activeSymbol: string;
  onActiveChange: (symbol: string) => void;
  onClose?: (symbol: string) => void;
  onAdd?: () => void;
  addDisabled?: boolean;
  addLabel?: string;
  "aria-label"?: string;
  className?: string;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [activeSymbol, markets.length]);

  return (
    <div
      className={cn(
        "flex h-10 min-w-0 overflow-hidden rounded-card border border-outline-variant bg-surface-page",
        className,
      )}
    >
      <div
        role="list"
        aria-label={ariaLabel}
        className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto"
      >
        {markets.map((market) => {
          const active = market.symbol === activeSymbol;
          const disabled = market.disabled;
          return (
            <div
              key={market.symbol}
              role="listitem"
              className={cn(
                "group relative flex min-w-[9.5rem] max-w-[13rem] flex-1 items-stretch border-r border-outline-variant",
                active && "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-brand",
              )}
            >
              <button
                ref={active ? activeRef : undefined}
                type="button"
                aria-current={active ? "page" : undefined}
                disabled={disabled}
                onClick={() => onActiveChange(market.symbol)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 px-3 text-left transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset",
                  active ? "text-fg" : "text-fg-muted hover:bg-surface-container hover:text-fg",
                  disabled && "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-fg-muted",
                )}
              >
                <TokenIcon src={market.iconSrc} symbol={market.symbol} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">
                    {market.label ?? market.symbol}
                  </span>
                  {market.price && (
                    <span className="block truncate font-mono text-[10px] tabular-nums text-fg-subtle">
                      {market.price}
                    </span>
                  )}
                </span>
                {market.changePct !== undefined && (
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      market.changePct >= 0 ? "text-buy" : "text-sell",
                    )}
                  >
                    {market.changePct >= 0 ? "+" : ""}
                    {market.changePct.toFixed(2)}%
                  </span>
                )}
              </button>
              {onClose && markets.length > 1 && (
                <button
                  type="button"
                  aria-label={`Close ${market.symbol}`}
                  onClick={() => onClose(market.symbol)}
                  className="my-auto mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fg-subtle opacity-70 transition-[background-color,color,opacity] duration-150 hover:bg-surface-container-high hover:text-fg group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span aria-hidden="true">x</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {onAdd && (
        <button
          type="button"
          aria-label={addLabel}
          disabled={addDisabled}
          onClick={onAdd}
          className="flex h-full w-11 shrink-0 items-center justify-center border-l border-outline-variant text-lg text-fg-muted transition-colors duration-150 hover:bg-surface-container hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-muted"
        >
          <span aria-hidden="true">+</span>
        </button>
      )}
    </div>
  );
}
