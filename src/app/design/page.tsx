import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Avatar,
  AvatarGroup,
  ID_HUES,
  IconArrowRight,
  IconPriceDown,
  IconPriceUp,
  PostCard,
  SocialProofChip,
  TokenChip,
} from "@/design-system";
import { categorize } from "./canvas/zones";
import { parseComponentDoc } from "./[component]/parseComponentDoc";
import { InteractiveDemos } from "./InteractiveDemos";
import { ThemeToggle } from "./ThemeToggle";

export const metadata: Metadata = {
  title: "cids / design",
  robots: { index: false, follow: false },
};

// Section label matching DESIGN.md's Type Scale: 0.6875rem, sentence case,
// text-fg-subtle. See DESIGN.md → Typography.
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[0.6875rem] font-semibold text-fg-subtle">
      {children}
    </h2>
  );
}

/** Flatten inline markdown for the index cards: they clamp to two lines
 *  and have no inline renderer, so `code` and **bold** would otherwise
 *  print their own backticks and asterisks. */
function plain(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

const SURFACES = [
  ["dim", "bg-surface-dim"],
  ["page", "bg-surface-page"],
  ["surface", "bg-surface"],
  ["container", "bg-surface-container"],
  ["high", "bg-surface-container-high"],
  ["bright", "bg-surface-bright"],
] as const;

const WATCHERS = [
  { name: "mira", seed: "wallet-mira" },
  { name: "kip", seed: "wallet-kip" },
  { name: "nova", seed: "wallet-nova" },
  { name: "aria", seed: "wallet-aria" },
  { name: "sol", seed: "wallet-sol" },
];

export default function DesignGalleryPage() {
  const index = componentIndex();
  const byName = new Map(index.map((c) => [c.name, c]));
  const groups = categorize(index.map((c) => c.name));

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl bg-surface-page px-5 pb-24 pt-8 text-fg">
      <header className="mb-8">
        <h1 className="font-display text-xl font-bold text-fg">
          cids <span className="text-brand">~</span>{" "}
          <span className="text-fg-subtle">/ design</span>
        </h1>
        <p className="mt-2 text-pretty text-sm text-fg-muted">
          Live gallery of <code>src/design-system/</code>. Numbers are the hero;
          identity hues carry people, never data.
        </p>
        <div className="mt-3"><ThemeToggle /></div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/design/feed"
            className="inline-flex items-center gap-1 rounded-sm border border-outline bg-surface-container px-3 py-1.5 text-xs font-semibold text-fg"
          >
            See it as a screen <IconArrowRight size={12} weight="bold" aria-hidden="true" />{" "}
            /design/feed
          </Link>
          <Link
            href="/design/canvas"
            className="inline-flex items-center gap-1 rounded-sm border border-outline bg-surface-container px-3 py-1.5 text-xs font-semibold text-fg"
          >
            Open canvas <IconArrowRight size={12} weight="bold" aria-hidden="true" />{" "}
            /design/canvas <span className="text-fg-subtle">(desktop)</span>
          </Link>
        </div>
      </header>

      <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* ── Foundations ─────────────────────────────────────── */}
        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>Foundations · surfaces</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {SURFACES.map(([label, cls]) => (
              <div key={label}>
                <div
                  className={`h-12 rounded-lg border border-outline-variant ${cls}`}
                />
                <div className="mt-1 text-[10px] text-fg-subtle">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>Foundations · identity hues</SectionLabel>
          <Row>
            {ID_HUES.map((hue) => (
              <div key={hue} className="text-center">
                <Avatar name={hue} hue={hue} size="md" />
                <div className="mt-1 text-[10px] text-fg-subtle">{hue}</div>
              </div>
            ))}
          </Row>
          <p className="mt-2 text-[11px] text-fg-subtle">
            hash(wallet) % 8 · tide reserved for you · AA-verified
          </p>
        </section>

        {/* ── Components ──────────────────────────────────────── */}
        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>Avatar · sizes</SectionLabel>
          <Row>
            <Avatar name="Mira" seed="wallet-mira" size="xs" />
            <Avatar name="Mira" seed="wallet-mira" size="sm" />
            <Avatar name="Mira" seed="wallet-mira" size="md" />
            <Avatar name="Mira" seed="wallet-mira" size="lg" />
            <Avatar name="You" you size="md" />
          </Row>
          <p className="mt-2 text-[11px] text-fg-subtle">
            20 · 28 · 40 · 64 · you (tide)
          </p>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>AvatarGroup</SectionLabel>
          <div className="space-y-3">
            <AvatarGroup members={WATCHERS} />
            <AvatarGroup members={WATCHERS} max={5} size="sm" />
          </div>
          <p className="mt-2 text-[11px] text-fg-subtle">
            −8px overlap · +N overflow · 2px ring
          </p>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>TokenChip · both directions</SectionLabel>
          <div className="flex flex-col items-start gap-3">
            <TokenChip symbol="JUP" price="$0.8123" change24h={4.2} />
            <TokenChip symbol="BONK" price="$0.0000213" change24h={-1.31} />
            <TokenChip symbol="SOL" price="$182.40" change24h={0} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-fg-subtle">
            direction from sign (<IconPriceUp size={9} weight="fill" aria-hidden="true" /> buy /{" "}
            <IconPriceDown size={9} weight="fill" aria-hidden="true" /> sell) · number from magnitude
          </p>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>SocialProofChip</SectionLabel>
          <Row>
            <SocialProofChip count={41} />
            <SocialProofChip count={41} compact />
            <SocialProofChip count={7} label="holding" />
          </Row>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>PostCard · milestone</SectionLabel>
          <div className="space-y-3">
            <PostCard
              kind="milestone"
              direction="up"
              time="1h"
              body="@kip's JUP watch crossed +25% since they flagged it."
            />
            <PostCard
              kind="milestone"
              direction="down"
              time="3h"
              body="BONK broke below its 24h floor: watchers notified."
            />
          </div>
        </section>

        <section className="rounded-card border border-outline-variant bg-surface-container p-4">
          <SectionLabel>Motion + PostCard · interactive</SectionLabel>
          <InteractiveDemos />
          <p className="mt-2 text-[11px] text-fg-subtle">
            tap ♥ = spring-pop · Follow morphs 200ms · Lane fill = state
          </p>
        </section>

      </div>

      <section className="mt-8">
        <SectionLabel>All components · {index.length} pages</SectionLabel>
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.id}>
              <h3 className="mb-2 font-mono text-[0.6875rem] font-semibold text-fg-subtle">
                {g.title}{" "}
                <span className="tabular-nums text-fg-subtle/60">{g.components.length}</span>
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.components.map((n) => {
                  const c = byName.get(n);
                  if (!c) return null;
                  return (
                    <Link
                      key={n}
                      href={`/design/${n}`}
                      className="group rounded-card border border-outline-variant bg-surface-container p-3 transition-colors duration-150 hover:border-outline hover:bg-surface-container-high"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-fg transition-colors duration-150 group-hover:text-brand">
                          {c.name}
                        </span>
                        <span
                          className={
                            c.status === "stable"
                              ? "flex-none rounded-chip bg-buy-surface px-1.5 py-0.5 text-[10px] font-medium text-buy"
                              : "flex-none rounded-chip bg-warning-surface px-1.5 py-0.5 text-[10px] font-medium text-warning"
                          }
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] tabular-nums text-fg-subtle">
                        v{c.version}
                      </div>
                      {c.purpose && (
                        <p className="mt-1.5 line-clamp-2 text-pretty text-xs leading-relaxed text-fg-muted">
                          {plain(c.purpose)}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-fg-subtle">
          One page per component: live demo · density · install · when-to-use ·
          doc · source, rendered from the same files as the canvas inspector.
        </p>
      </section>
    </main>
  );
}

/** Status / version / purpose per component, straight from its `.doc.md`
 *  (the same source the component pages and the canvas inspector read),
 *  so the index cannot drift from what ships. */
type ComponentMeta = { name: string; status: string; version: string; purpose: string };

function componentIndex(): ComponentMeta[] {
  const dir = join(process.cwd(), "src/design-system");
  return readdirSync(dir)
    .filter((n) => {
      try {
        return statSync(join(dir, n, `${n}.doc.md`)).isFile();
      } catch {
        return false;
      }
    })
    .sort()
    .map((name) => {
      const doc = readFileSync(join(dir, name, `${name}.doc.md`), "utf8");
      return {
        name,
        status: doc.match(/^Status: (\w+)$/m)?.[1] ?? "draft",
        version: doc.match(/^Version: ([\d.]+)$/m)?.[1] ?? "0.0.0",
        purpose: parseComponentDoc(doc).purpose,
      };
    });
}
