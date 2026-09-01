"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type SlippageLevel = "low" | "normal" | "elevated" | "high";

/** Default presets in basis points: 0.1% · 0.5% · 1.0%. */
export const DEFAULT_SLIPPAGE_PRESETS = [10, 50, 100] as const;

const LEVEL: Record<SlippageLevel, { word: string; text: string }> = {
  low: { word: "low", text: "text-success" },
  normal: { word: "normal", text: "text-fg-muted" },
  elevated: { word: "elevated", text: "text-warning" },
  high: { word: "high", text: "text-error" },
};

/** Risk band from bps: word + tint (mono-safe). Exported for tests. */
export function slippageLevel(bps: number): SlippageLevel {
  const m = Math.abs(bps);
  if (m <= 50) return "low";
  if (m <= 100) return "normal";
  if (m <= 200) return "elevated";
  return "high";
}

function formatPct(bps: number): string {
  const pct = bps / 100;
  // Trim trailing zeros: 0.10 → 0.1, 1.00 → 1
  return `${parseFloat(pct.toFixed(2))}%`;
}

/**
 * Slippage tolerance control: presets + custom bps. Lives above the
 * confirm button next to GasFee. Value is basis points (50 = 0.5%);
 * display is percent. Tone bands warn when tolerance is loose.
 */
export function SlippageControl({
  value,
  onValueChange,
  presets = [...DEFAULT_SLIPPAGE_PRESETS],
  maxBps = 5000,
  label = "Slippage",
  disabled,
  className,
}: {
  /** Tolerance in basis points (50 = 0.5%). */
  value: number;
  onValueChange: (bps: number) => void;
  /** Preset chips in bps. */
  presets?: number[];
  /** Cap for the custom input (default 50%). */
  maxBps?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const isPreset = presets.includes(value);
  const [customOpen, setCustomOpen] = useState(!isPreset);
  const [draft, setDraft] = useState(() => formatPct(value).replace("%", ""));

  const level = slippageLevel(value);
  const showCustom = customOpen || !isPreset;

  const applyCustom = (raw: string) => {
    setDraft(raw);
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const [head, ...rest] = cleaned.split(".");
    const normalized = rest.length ? `${head}.${rest.join("")}` : cleaned;
    if (normalized === "" || normalized === ".") return;
    const pct = Number(normalized);
    if (!Number.isFinite(pct)) return;
    const bps = Math.round(pct * 100);
    onValueChange(Math.min(Math.max(bps, 0), maxBps));
  };

  const pickPreset = (bps: number) => {
    setCustomOpen(false);
    setDraft(formatPct(bps).replace("%", ""));
    onValueChange(bps);
  };

  const openCustom = () => {
    setCustomOpen(true);
    setDraft(formatPct(value).replace("%", ""));
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="flex items-baseline gap-2">
          <span className="data-sm text-fg">{formatPct(value)}</span>
          <span
            className={cn(
              "font-medium text-[10px]",
              LEVEL[level].text,
            )}
          >
            {LEVEL[level].word}
          </span>
        </span>
      </div>

      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap items-center gap-1.5"
      >
        {presets.map((bps) => {
          const active = !showCustom && value === bps;
          return (
            <button
              key={bps}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => pickPreset(bps)}
              className={cn(
                "inline-flex h-10 min-w-12 items-center justify-center rounded-control px-2.5 text-xs font-medium",
                "transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                "disabled:pointer-events-none disabled:opacity-40",
                active
                  ? "bg-brand text-on-brand"
                  : "border border-outline-variant bg-surface-container text-fg-muted hover:bg-surface-container-high hover:text-fg",
              )}
            >
              {formatPct(bps)}
            </button>
          );
        })}
        <button
          type="button"
          disabled={disabled}
          aria-pressed={showCustom}
          onClick={openCustom}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-control px-2.5 text-xs font-medium",
            "transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            "disabled:pointer-events-none disabled:opacity-40",
            showCustom
              ? "bg-brand text-on-brand"
              : "border border-outline-variant bg-surface-container text-fg-muted hover:bg-surface-container-high hover:text-fg",
          )}
        >
          Custom
        </button>
        {showCustom && (
          <label className="flex h-10 items-center gap-1 rounded-control border border-outline-variant bg-surface-container px-2">
            <input
              value={draft}
              disabled={disabled}
              inputMode="decimal"
              aria-label="Custom slippage percent"
              onChange={(e) => applyCustom(e.target.value)}
              className="data-sm w-14 bg-transparent text-fg placeholder:text-fg-subtle focus:outline-none disabled:opacity-40"
              placeholder="0.5"
            />
            <span className="text-xs text-fg-subtle">%</span>
          </label>
        )}
      </div>
    </div>
  );
}
