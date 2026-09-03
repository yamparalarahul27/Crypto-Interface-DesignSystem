"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  applyCidsTheme,
  CIDS_THEMES,
  getServerCidsTheme,
  getStoredCidsTheme,
  setStoredCidsTheme,
  subscribeCidsTheme,
  type CidsTheme,
} from "./theme";

/**
 * Theme switch across all [data-theme] value-sets. Stamps
 * <html data-theme> and persists.
 *
 * Each theme is a color circle, never its name: the circle is scoped with
 * data-theme={t}, so the CSS variables inside it resolve to THAT theme's
 * values regardless of the page theme: the swatches are the token system
 * previewing itself, not a hardcoded palette (globals.css aliases
 * [data-theme="dark"] to :root for this).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeCidsTheme,
    getStoredCidsTheme,
    getServerCidsTheme,
  );

  useEffect(() => {
    applyCidsTheme(theme);
  }, [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("inline-flex items-center", className)}
    >
      {CIDS_THEMES.map((t: CidsTheme) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          aria-label={t}
          title={t}
          onClick={() => setStoredCidsTheme(t)}
          // The button carries the ≥40px hit area (CONVENTIONS.md); the
          // swatch inside stays small. Selection is a ring on the swatch
          // itself, not the button, so selected and unselected circles
          // are the same size: the ring sits outside the 14px disc.
          className="flex h-10 w-10 items-center justify-center rounded-full"
        >
          <span
            aria-hidden="true"
            data-theme={t}
            className={cn(
              "h-3.5 w-3.5 rounded-full border border-outline",
              theme === t &&
                "ring-2 ring-brand ring-offset-2 ring-offset-surface-page",
            )}
            style={{
              background:
                "linear-gradient(135deg, var(--surface-page) 50%, var(--brand) 50%)",
              transition: "box-shadow var(--motion-fast)",
            }}
          />
        </button>
      ))}
    </div>
  );
}
