import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryPreview } from "./CategoryPreview";
import { categorize } from "./design/canvas/zones";
import { ThemeToggle } from "./design/ThemeToggle";
import { SplitFlap } from "./SplitFlap";
import { IconArrowRight, IconGithub } from "@/design-system";

// The landing page counts and groups what actually ships: folder list and
// Status headers come off disk at build time, categories come from the
// canvas zones. Nothing here is a hand-maintained number.

export const metadata: Metadata = {
  title: { absolute: "cids: crypto interface design system" },
  description:
    "Live components, tokens, and patterns for crypto UIs: inspect them on an infinite canvas.",
};

const REPO = "https://github.com/yamparalarahul27/Crypto-Interface-DesignSystem";
const DS = join(process.cwd(), "src/design-system");

function componentNames() {
  return readdirSync(DS).filter((n) =>
    existsSync(join(DS, n, `${n}.doc.md`)),
  );
}

// `image` is the swap-in point for the real graphics: drop the file under
// public/ and set the path: the placeholder box is already the final size,
// so nothing reflows when the art lands.
const QUICKSTARTS: {
  title: string;
  body: string;
  href: string;
  cta: string;
  image?: { src: string; alt: string };
  external?: boolean;
  beta?: boolean;
}[] = [
  {
    title: "Canvas",
    body: "Pan and zoom the whole system on one surface, then select any component to read the doc it ships with.",
    href: "/design/canvas",
    cta: "Open the canvas",
    beta: true,
  },
  {
    title: "Install",
    body: "Point the shadcn CLI at the registry and the component lands in your repo: source, doc, and cross-deps.",
    href: `${REPO}/blob/main/docs/cids-quickstart.md`,
    cta: "Read the quickstart",
    external: true,
  },
  {
    title: "Templates",
    body: "Both ends of the spectrum, composed from the same tokens: a consumer dApp and a compact-density exchange.",
    href: "/design/templates/simple-dapp",
    cta: "Open a template",
  },
  {
    title: "For agents",
    body: "A zero-dependency MCP server over the registry: an agent gets the spec and the source in one call.",
    href: `${REPO}/blob/main/docs/cids-contributing.md`,
    cta: "Wire up the server",
    external: true,
  },
];

const NAV = [
  { href: "/design/canvas", label: "Canvas" },
  { href: "/design", label: "Gallery" },
  { href: "/design/feed", label: "Feed" },
];

function SectionHeading({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between border-b border-outline-variant pb-3">
      <h2 className="text-2xl font-semibold tracking-tight text-fg">{title}</h2>
      {note && (
        <span className="font-mono text-[11px] text-fg-subtle">{note}</span>
      )}
    </div>
  );
}

export default function Home() {
  const categories = categorize(componentNames());

  return (
    <div className="min-h-dvh bg-surface-page text-fg">
      {/* ── Top bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-sticky border-b border-outline-variant bg-surface-page/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            cids <span className="text-brand">~</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-control px-3 py-2 text-sm text-fg-muted hover:bg-surface-container hover:text-fg"
                style={{
                  transition:
                    "background-color var(--motion-fast), color var(--motion-fast)",
                }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={REPO}
              aria-label="GitHub repository"
              title="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-control text-fg-muted hover:bg-surface-container hover:text-fg"
              style={{
                transition:
                  "background-color var(--motion-fast), color var(--motion-fast)",
              }}
            >
              <IconGithub size={18} weight="fill" aria-hidden="true" />
            </a>
          </nav>

          <ThemeToggle className="ml-auto md:ml-2" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="pt-10 sm:pt-16">
          <SplitFlap />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/design/canvas"
              className="inline-flex h-11 items-center rounded-control bg-brand px-5 text-sm font-semibold text-on-brand active:scale-[0.98]"
              style={{
                transition:
                  "background-color var(--motion-fast), transform var(--motion-fast)",
              }}
            >
              Open the canvas
            </Link>
            <Link
              href="/design"
              className="inline-flex h-11 items-center rounded-control border border-outline-variant bg-surface-container px-5 text-sm font-semibold text-fg active:scale-[0.98]"
              style={{
                transition:
                  "background-color var(--motion-fast), transform var(--motion-fast)",
              }}
            >
              Browse components
            </Link>
          </div>
        </section>

        {/* ── Quickstarts ─────────────────────────────────────── */}
        <section className="pt-20">
          <SectionHeading title="Quickstarts" />
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {QUICKSTARTS.map((q) => (
              <div key={q.title} className="flex items-start gap-5">
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-fg">
                    {q.title}
                    {q.beta && (
                      <span
                        className="rounded-chip bg-warning-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-warning"
                        title="Gestures are still being worked on"
                      >
                        Beta
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
                    {q.body}
                  </p>
                  {q.external ? (
                    <a
                      href={q.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
                      style={{ transition: "color var(--motion-fast)" }}
                    >
                      {q.cta} <IconArrowRight size={14} weight="bold" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={q.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
                      style={{ transition: "color var(--motion-fast)" }}
                    >
                      {q.cta} <IconArrowRight size={14} weight="bold" aria-hidden="true" />
                    </Link>
                  )}
                </div>
                {q.image ? (
                  <Image
                    src={q.image.src}
                    alt={q.image.alt}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-card object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-24 w-24 shrink-0 rounded-card border border-dashed border-outline bg-surface-container"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Components ──────────────────────────────────────── */}
        <section className="pt-20">
          <SectionHeading
            title="Components"
            note="grouped by canvas zone"
          />
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.id}>
                {/* The card: a live composition over the category's own
                    components, capped by a title/count bar. */}
                <div className="overflow-hidden rounded-card border border-outline-variant bg-surface">
                  <CategoryPreview id={c.id} />
                  <h3 className="flex items-baseline justify-between border-t border-outline-variant bg-surface-container px-4 py-3 text-base font-semibold text-fg">
                    {c.title}
                    <span className="rounded-chip bg-surface-container-high px-2 py-0.5 font-mono text-[11px] font-normal text-fg-muted">
                      {c.components.length}
                    </span>
                  </h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 px-1">
                  {c.components.map((name) => (
                    <li key={name}>
                      <Link
                        href={`/design/${name}`}
                        className="text-sm text-fg-muted hover:text-brand"
                        style={{ transition: "color var(--motion-fast)" }}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-outline-variant">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <p className="max-w-md text-pretty text-sm leading-relaxed text-fg-muted">
            cids is an open design system for crypto interfaces: tokens as
            the contract, themes as swappable value-sets, and a doc beside
            every component that a human and an AI agent both build from.
          </p>
          <nav className="flex gap-5 font-mono text-xs text-fg-subtle">
            <Link href="/design/canvas" className="hover:text-fg">
              Canvas
            </Link>
            <Link href="/design" className="hover:text-fg">
              Gallery
            </Link>
            <a href={REPO} className="hover:text-fg">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
