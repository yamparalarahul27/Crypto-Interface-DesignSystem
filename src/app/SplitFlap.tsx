"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { IconPause, IconPlay } from "@/design-system";

/**
 * The landing hero: a split-flap board that cycles the system's theses.
 * Fixed 15×3 grid so the layout never shifts between messages: shorter
 * lines just leave blank tiles, the way a real departure board does.
 *
 * Motion: one `flap` per tile (--motion-settle), staggered by index.
 * Under prefers-reduced-motion the flip is neutralized globally AND the
 * board stops cycling on its own: content that changes under you is
 * motion too, timer or not. The play/pause control works either way.
 */

const COLS = 15;
const ROWS = 3;
const HOLD_MS = 5600; // time a message stays up before the next flip
const STAGGER_MS = 22; // per-tile delay: 45 tiles ≈ 1s to fill the board

export const MESSAGES = [
  "CIDS IS AN OPEN DESIGN SYSTEM FOR CRYPTO UIS",
  "69 COMPONENTS EVERY ONE SHIPS ITS DOC",
  "TOKENS ARE THE CONTRACT THEMES SWAP VALUES",
  "A HUMAN AND AN AI AGENT BUILD THE SAME WAY",
] as const;

/**
 * The bottom-right flap is the play/pause control, not a letter: so no
 * message may reach it. SplitFlap.test.ts asserts every message leaves
 * this cell blank; if you add a longer one, that test is where it fails.
 */
export const CONTROL_CELL = COLS * ROWS - 1;

/**
 * Greedy word-wrap into ROWS lines of COLS characters, flattened to one
 * cell per tile. Always returns exactly COLS*ROWS cells: over-long
 * messages are clipped rather than allowed to resize the board.
 */
export function toCells(message: string, cols = COLS, rows = ROWS): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of message.split(/\s+/).filter(Boolean)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= cols) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  const cells: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (const ch of (lines[r] ?? "").slice(0, cols).padEnd(cols, " ")) {
      cells.push(ch);
    }
  }
  return cells;
}

// prefers-reduced-motion as an external store: the ThemeToggle pattern.
// Reading it in render (not an effect) keeps the first paint honest for
// people who set the preference.
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMotionSnapshot = () => window.matchMedia(REDUCED).matches;
const getMotionServerSnapshot = () => false;

// From the icon family, not typed: "❙❙" and "▶" render at wildly
// different weights and baselines across platforms, which is visible when
// they share a flap. Phosphor draws both on one optical grid. Sized as a
// share of the flap: the % class overrides the width/height the icon sets.
const GLYPH = "h-[22%] w-[22%] fill-current";

export function SplitFlap({
  messages = MESSAGES,
  className,
}: {
  messages?: readonly string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  // null = follow the motion preference; true/false = the user overrode it.
  const [override, setOverride] = useState<boolean | null>(null);

  const reduced = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  );
  const playing = override ?? !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % messages.length),
      HOLD_MS,
    );
    return () => clearTimeout(t);
  }, [playing, index, messages.length]);

  const cells = toCells(messages[index]);

  return (
    <div className={cn("w-full", className)}>
      {/* The board is decorative markup; the sentence is the content. */}
      <p className="sr-only" aria-live="polite">
        {messages[index]}
      </p>

      <div
        className="grid gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          perspective: "800px",
        }}
      >
        {cells.map((ch, i) =>
          i === CONTROL_CELL ? (
            <button
              key="control"
              type="button"
              onClick={() => setOverride(!playing)}
              aria-label={playing ? "Pause messages" : "Play messages"}
              title={playing ? "Pause" : "Play"}
              className="flex aspect-square items-center justify-center rounded-control bg-surface-container text-fg-subtle hover:bg-surface-container-high hover:text-fg"
              style={{
                transition:
                  "background-color var(--motion-fast), color var(--motion-fast)",
              }}
            >
              {playing ? (
                <IconPause weight="fill" className={GLYPH} aria-hidden="true" />
              ) : (
                <IconPlay weight="fill" className={GLYPH} aria-hidden="true" />
              )}
            </button>
          ) : (
          <span
            key={i}
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-control bg-surface-container"
          >
            {ch !== " " && (
              <span
                // Re-keying on the message remounts the letter, which
                // replays the flip: same trick as MotionReplay.
                key={`${index}-${i}`}
                // leading-none is load-bearing: at this font-size the
                // default line-height (~1.5) makes a lettered tile taller
                // than aspect-square, so tiles changed height as letters
                // came and went between messages. Line box = glyph box.
                className="animate-flap font-semibold leading-none text-fg"
                style={{
                  animationDelay: `${i * STAGGER_MS}ms`,
                  fontFamily: "var(--font-geist-mono), monospace",
                  // ≈70% of tile height at every width: the board reads
                  // as letters on flaps, not letters floating in boxes.
                  fontSize: "clamp(0.6rem, 4vw, 2.9rem)",
                }}
              >
                {ch}
              </span>
            )}
          </span>
          ),
        )}
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {messages.map((m, i) => (
          <button
            key={m}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 w-6 rounded-chip",
              i === index ? "bg-brand" : "bg-surface-container-high",
            )}
            style={{ transition: "background-color var(--motion-fast)" }}
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );
}
