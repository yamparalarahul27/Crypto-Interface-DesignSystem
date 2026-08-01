"use client";

import { cn } from "@/lib/utils";

/** True for tokens that resolve to a paint (fill/ink), not motion/space/z. */
export function isColorToken(name: string): boolean {
  return /^(surface|fg|brand|buy|sell|warning|info|success|error|outline|on-|id-|glow)/.test(
    name,
  );
}

/**
 * Live token swatches — resolves `var(--name)` in the active theme so
 * flipping ThemeToggle recolors the panel. Non-color tokens render as
 * mono chips (name only).
 */
export function TokenSwatches({ tokens }: { tokens: string[] }) {
  if (tokens.length === 0) return null;
  return (
    <section id="token-swatches" className="mb-6 scroll-mt-6">
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
        Tokens · live
      </h3>
      <p className="mt-1 text-[11px] text-fg-subtle">
        Resolves in the active theme — flip the toggle above to verify.
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tokens.map((name) => {
          const color = isColorToken(name);
          return (
            <li
              key={name}
              className="flex items-center gap-2 rounded-control border border-outline-variant bg-surface-container px-2 py-1.5"
            >
              {color ? (
                <span
                  aria-hidden="true"
                  className="h-5 w-5 flex-none rounded-[3px] border border-outline-variant"
                  style={{ background: `var(--${name})` }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 flex-none items-center justify-center rounded-[3px] border border-outline-variant bg-surface-dim font-mono text-[8px] text-fg-subtle"
                >
                  ·
                </span>
              )}
              <code className="min-w-0 truncate font-mono text-[10px] text-fg-muted">
                --{name}
              </code>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Doc-derived state names as a readable chip row (always available). */
export function StatesFromDoc({ states }: { states: string[] }) {
  if (states.length === 0) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {states.map((s) => (
        <span
          key={s}
          className={cn(
            "rounded-chip border border-outline-variant bg-surface-dim px-2 py-0.5",
            "font-mono text-[10px] text-fg-muted",
          )}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
