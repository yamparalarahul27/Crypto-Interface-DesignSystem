"use client";

// Motion tap-to-replay panel for /design/<Component> (roadmap §6).
// Remounts a preview chip to re-fire CSS animations: the only honest
// way to "replay" tokenized motion without a timeline scrubber.

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconPlay } from "@/design-system";

const PREVIEWS = [
  {
    token: "--motion-fast",
    label: "fast",
    use: "state / hover",
    // Targeted color flash: matches 150ms ease-out.
    replayClass: "motion-replay-fast",
  },
  {
    token: "--motion-settle",
    label: "settle",
    use: "enter / morph",
    replayClass: "motion-replay-settle",
  },
  {
    token: "--motion-spring",
    label: "spring",
    use: "human feedback",
    replayClass: "animate-pop",
  },
] as const;

/** Pull `--motion-*` mentions out of the component's .doc.md. */
export function extractMotionTokens(doc: string): string[] {
  const lines = doc.split("\n");
  let inMotion = false;
  const blob: string[] = [];
  for (const l of lines) {
    if (l.startsWith("## ")) {
      inMotion = l.slice(3).trim().toLowerCase() === "motion";
      continue;
    }
    if (inMotion) blob.push(l);
  }
  const text = blob.join("\n");
  if (/^none\b/im.test(text.trim()) || text.toLowerCase().includes("none.")) {
    return [];
  }
  const found = [...text.matchAll(/--motion-([a-z]+)/g)].map((m) => `--motion-${m[1]}`);
  return [...new Set(found)];
}

export function extractMotionNote(doc: string): string | null {
  const lines = doc.split("\n");
  let inMotion = false;
  const paras: string[] = [];
  for (const l of lines) {
    if (l.startsWith("## ")) {
      inMotion = l.slice(3).trim().toLowerCase() === "motion";
      continue;
    }
    if (!inMotion) continue;
    const t = l.replace(/^[-*]\s+/, "").trim();
    if (!t || t.startsWith("```") || t.startsWith("|")) continue;
    paras.push(t);
  }
  return paras.length ? paras.join(" ") : null;
}

function ReplayChip({
  label,
  replayClass,
  active,
}: {
  label: string;
  replayClass: string;
  active: boolean;
}) {
  // key remount restarts CSS animation
  const [tick, setTick] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setTick((n) => n + 1)}
      aria-label={`Replay ${label} motion`}
      className={cn(
        "flex flex-col items-center gap-2 rounded-control border border-outline-variant bg-surface-dim p-3",
        "transition-[border-color,background-color] duration-150 hover:bg-surface-container-high",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        active && "border-brand/40",
      )}
    >
      <span
        key={tick}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-control bg-brand text-on-brand",
          replayClass,
        )}
      >
        <IconPlay size={12} weight="fill" aria-hidden="true" />
      </span>
      <span className="font-mono text-[0.6875rem] text-fg-muted">{label}</span>
    </button>
  );
}

export function MotionReplay({ doc }: { doc: string }) {
  const mentioned = extractMotionTokens(doc);
  const note = extractMotionNote(doc);
  const none = note != null && /^none\b/i.test(note.trim());

  return (
    <section id="motion-replay" className="mb-6 scroll-mt-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[0.6875rem] font-semibold text-fg-subtle">
          Motion · tap to replay
        </h3>
        <span className="font-mono text-[0.6875rem] text-fg-subtle">Honors reduced-motion</span>
      </div>
      {note && (
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-fg-muted">{note}</p>
      )}
      {none ? (
        <p className="mt-3 text-sm text-fg-subtle">This component declares no motion.</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {PREVIEWS.map((p) => (
            <ReplayChip
              key={p.token}
              label={p.label}
              replayClass={p.replayClass}
              active={mentioned.length === 0 || mentioned.includes(p.token)}
            />
          ))}
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        Brand chip remounts on tap · highlighted tokens are named in this
        component&apos;s doc · spring is budgeted to human feedback only.
      </p>
    </section>
  );
}
