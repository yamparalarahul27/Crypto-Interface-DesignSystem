"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OrderType =
  | "market"
  | "limit"
  | "stop_market"
  | "stop_limit"
  | "iceberg"
  | "twap"
  | "oco"
  | "trailing_stop";

export type OrderTypeOption = {
  value: OrderType;
  label: string;
  description?: string;
  group?: "basic" | "advanced";
  disabled?: boolean;
  icon?: ReactNode;
};

export const DEFAULT_ORDER_TYPE_OPTIONS: OrderTypeOption[] = [
  { value: "limit", label: "Limit", description: "Rest or cross at a chosen price.", group: "basic" },
  { value: "market", label: "Market", description: "Fill immediately at the best available price.", group: "basic" },
  { value: "stop_market", label: "Stop-Market", description: "Trigger a market order from a stop price.", group: "advanced" },
  { value: "stop_limit", label: "Stop-Limit", description: "Trigger a limit order from a stop price.", group: "advanced" },
  { value: "iceberg", label: "Iceberg", description: "Expose only part of a larger order.", group: "advanced" },
  { value: "twap", label: "TWAP", description: "Split size across time slices.", group: "advanced" },
  { value: "oco", label: "OCO", description: "One-cancels-the-other bracket.", group: "advanced" },
  { value: "trailing_stop", label: "Trailing-Stop", description: "Trail price by a configured offset.", group: "advanced" },
];

export function OrderTypeTabs({
  value,
  onValueChange,
  options = DEFAULT_ORDER_TYPE_OPTIONS,
  "aria-label": ariaLabel = "Order type",
  className,
}: {
  value: OrderType;
  onValueChange: (value: OrderType) => void;
  options?: OrderTypeOption[];
  "aria-label"?: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useEffect(() => {
    const el = scrollerRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [value]);

  const move = (delta: number) => {
    for (let i = 1; i <= options.length; i++) {
      const nextIndex = (activeIndex + delta * i + options.length) % options.length;
      const next = options[nextIndex];
      if (!next.disabled) {
        onValueChange(next.value);
        const buttons = scrollerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        buttons?.[nextIndex]?.focus();
        return;
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = options.find((option) => !option.disabled);
      if (first) onValueChange(first.value);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = [...options].reverse().find((option) => !option.disabled);
      if (last) onValueChange(last.value);
    }
  };

  return (
    <div
      ref={scrollerRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "no-scrollbar flex max-w-full snap-x snap-mandatory items-center gap-1 overflow-x-auto",
        "[mask-image:linear-gradient(to_right,transparent_0,#000_16px,#000_calc(100%-20px),transparent_100%)]",
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-describedby={option.description ? `${option.value}-order-type-desc` : undefined}
            tabIndex={active ? 0 : -1}
            disabled={option.disabled}
            data-active={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex h-10 shrink-0 snap-start items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
              active
                ? "border-outline-variant bg-surface-container-high text-fg"
                : "border-transparent text-fg-muted hover:bg-surface-container hover:text-fg",
              option.disabled && "cursor-not-allowed opacity-40 active:scale-100",
            )}
          >
            {option.icon && <span aria-hidden="true">{option.icon}</span>}
            <span>{option.label}</span>
            {option.group === "advanced" && (
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            )}
            {option.description && (
              <span id={`${option.value}-order-type-desc`} className="sr-only">
                {option.description}
              </span>
            )}
            {index === activeIndex && <span className="sr-only">selected</span>}
          </button>
        );
      })}
    </div>
  );
}
