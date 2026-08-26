"use client";

// Client body for /design/<component>: the per-component read surface
// (roadmap §6 "The component page"). Renders the SAME .doc.md + .tsx
// the canvas Inspector uses (passed from the server page, read from
// disk): pages cannot drift from source. The hero is the live canvas
// demo, so what you read is what runs.

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  IconCaretDown,
  IconCaretRight,
} from "@/design-system";
import { DEMOS } from "../canvas/demos";
import { DEMO_STATE_OPTIONS, defaultDemoState } from "../canvas/demoStates";
import { IconBack } from "@/design-system";
import { CopyButton, renderDoc } from "../docRenderer";
import { ThemeToggle } from "../ThemeToggle";
import { MotionReplay } from "./MotionReplay";
import { kebabCase, parseComponentDoc, splitDocSections } from "./parseComponentDoc";
import { StateMatrix } from "./StateMatrix";
import { TokenSwatches } from "./TokenSwatches";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      {/* The label used to be aria-only, so sighted users met a pair of
          unexplained words. Name the control. */}
      <span className="font-mono text-[11px] text-fg-subtle">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex gap-0.5 rounded-sm border border-outline-variant bg-surface-page p-0.5"
      >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            "inline-flex h-7 items-center rounded-sm px-2.5 font-mono text-[11px]",
            "transition-[background-color,color] duration-150",
            value === opt ? "bg-brand text-on-brand" : "text-fg-muted hover:text-fg",
          )}
        >
          {opt}
        </button>
      ))}
      </div>
    </div>
  );
}

export function ComponentPage({
  name,
  doc,
  source,
  status,
  version,
  prev,
  next,
}: {
  name: string;
  doc: string;
  source: string;
  status: string;
  version: string;
  prev: string;
  next: string;
}) {
  const Demo = DEMOS[name];
  const { body, purpose, bestFor, usageCode, tokens, states, sections } =
    parseComponentDoc(doc);
  const [showCode, setShowCode] = useState(false);
  const [showUsage, setShowUsage] = useState(true);
  // Variants come from the same table the canvas Inspector uses, so the
  // two surfaces can't offer different poses for the same component.
  const variants = DEMO_STATE_OPTIONS[name];
  const [variant, setVariant] = useState<string | undefined>(
    defaultDemoState(name),
  );

  // Usage already has its own block above; don't show it twice.
  const docSections = splitDocSections(body).filter((sec) => sec.id !== "usage");

  const registryName = kebabCase(name);
  const installCmd = `npx shadcn add @cids/${registryName}`;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-6xl bg-surface-page px-5 py-8 text-fg">
      {/* ── header ───────────────────────────────────────────── */}
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Icon-only, so it carries an aria-label + title (DESIGN.md →
              Icon-only controls) and a full 40x40 hit area. The negative
              margin pulls the box back so the glyph optically aligns with
              the title's left edge instead of sitting indented by padding. */}
          <Link
            href="/design"
            aria-label="Back to components"
            title="Back to components"
            className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-control text-fg-muted transition-colors duration-150 hover:bg-surface-container hover:text-fg"
          >
            <IconBack size={18} aria-hidden="true" />
          </Link>
          <h1 className="mt-1 text-wrap text-balance font-mono text-4xl font-bold">{name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span
              className={
                status === "stable"
                  ? "rounded-chip bg-buy-surface px-1.5 py-0.5 text-[11px] font-medium text-buy"
                  : "rounded-chip bg-warning-surface px-1.5 py-0.5 text-[11px] font-medium text-warning"
              }
            >
              {status}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-fg-subtle">
              v{version}
            </span>
          </div>
          {purpose && (
            <p className="mt-3 text-pretty text-base leading-relaxed text-fg-muted">{purpose}</p>
          )}
        </div>
        <ThemeToggle className="flex-none" />
      </header>


      {/* Body fills the page container, so it lines up with the header
          and footer above/below it rather than sitting 216px narrower. */}
      <div className="w-full">
      {/* ── install ──────────────────────────────────────────── */}
      <section
        aria-label="Install"
        className="mb-5 flex items-center gap-2 rounded-card border border-outline-variant bg-surface-dim px-3 py-2"
      >
        <span className="flex-none font-mono text-[11px] font-semibold text-fg-subtle">
          Install
        </span>
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-brand">
          {installCmd}
        </code>
        <CopyButton text={installCmd} />
      </section>

      {/* ── when to use ──────────────────────────────────────── */}
      {bestFor && (
        <aside className="mb-5 rounded-card border border-outline-variant bg-surface-container px-3.5 py-3">
          <p className="font-mono text-[11px] font-semibold text-fg-subtle">
            When to use
          </p>
          <p className="mt-2 text-pretty text-base leading-relaxed text-fg-muted">{bestFor}</p>
        </aside>
      )}

      {/* ── hero ─────────────────────────────────────────────── */}
      {Demo && (
        <section className="mb-6 overflow-hidden rounded-card border border-outline-variant bg-surface-container">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant px-3 py-2">
            <span className="font-mono text-[11px] font-semibold text-fg-subtle">
              Live demo
            </span>
            {variants && (
              <Segmented
                label="Variant"
                value={variant ?? variants[0]}
                options={variants}
                onChange={setVariant}
              />
            )}
          </div>
          <div className="p-5">
            <Demo state={variant} />
          </div>
        </section>
      )}

      {/* ── motion tap-to-replay ─────────────────────────────── */}
      <MotionReplay doc={doc} />

      {/* ── usage snippet ────────────────────────────────────── */}
      {usageCode && (
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowUsage((v) => !v)}
              aria-expanded={showUsage}
              className="font-mono text-[11px] font-semibold text-fg-subtle hover:text-fg"
            >
              <span className="inline-flex items-center gap-1">
                {showUsage ? (
                  <IconCaretDown size={10} weight="bold" aria-hidden="true" />
                ) : (
                  <IconCaretRight size={10} weight="bold" aria-hidden="true" />
                )}{" "}
                Usage
              </span>
            </button>
            <CopyButton text={usageCode} />
          </div>
          {showUsage && (
            <pre className="mt-2 overflow-x-auto rounded-sm border border-outline-variant bg-surface-dim p-3 font-mono text-xs leading-relaxed text-fg-muted">
              {usageCode}
            </pre>
          )}
        </section>
      )}

      {/* ── TOC ──────────────────────────────────────────────── */}
      {sections.length > 0 && (
        <nav aria-label="On this page" className="mb-4 hidden">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-sm text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            >
              {s.title}
            </a>
          ))}
        </nav>
      )}

      {/* ── doc from disk, one accordion per section ─────────── */}
      <Accordion
        type="multiple"
        items={[
          ...(tokens.length
            ? [
                {
                  value: "tokens",
                  title: "Tokens",
                  content: <TokenSwatches tokens={tokens} />,
                },
              ]
            : []),
          ...(states.length
            ? [
                {
                  value: "states",
                  title: "States",
                  content: <StateMatrix name={name} states={states} />,
                },
              ]
            : []),
          ...docSections.map((sec) => ({
            value: sec.id,
            title: sec.title,
            content: <div className="space-y-3 pb-2">{renderDoc(sec.md)}</div>,
          })),
        ]}
      />

      {/* ── source ───────────────────────────────────────────── */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            aria-expanded={showCode}
            className="font-mono text-[11px] font-semibold text-fg-subtle hover:text-fg"
          >
            <span className="inline-flex items-center gap-1">
                {showCode ? (
                  <IconCaretDown size={10} weight="bold" aria-hidden="true" />
                ) : (
                  <IconCaretRight size={10} weight="bold" aria-hidden="true" />
                )}{" "}
                Source: {name}.tsx
              </span>
          </button>
          <CopyButton text={source} />
        </div>
        {showCode && (
          <pre className="mt-2 overflow-x-auto rounded-sm border border-outline-variant bg-surface-dim p-3 font-mono text-xs leading-relaxed text-fg-muted">
            {source}
          </pre>
        )}
        <p className="mt-2 text-pretty text-xs leading-relaxed text-fg-subtle">
          Self-contained: copy the folder into any Tailwind+React app, or use the
          install command above. Docs and this page render the same file on disk:
          they cannot drift.
        </p>
      </section>

      </div>

      {/* ── footer ───────────────────────────────────────────── */}
      <footer className="mt-10 flex items-center justify-between border-t border-outline-variant pt-4 font-mono text-sm">
        <Link href={`/design/${prev}`} className="text-fg-muted underline-offset-2 hover:underline">
          ‹ {prev}
        </Link>
        <Link href={`/design/${next}`} className="text-fg-muted underline-offset-2 hover:underline">
          {next} ›
        </Link>
      </footer>
    </div>
  );
}
