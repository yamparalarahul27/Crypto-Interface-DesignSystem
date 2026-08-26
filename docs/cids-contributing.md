# Contributing a component to CIDS

> The authoring path, end to end. The contracts live in
> `src/design-system/CONVENTIONS.md` (API + doc shape + lifecycle) and
> `DESIGN.md` (tokens + rules); this is the checklist that strings them
> together. Everything below is guard-enforced: CI is the reviewer of
> record.

## Before you invent anything

Check these sources **in order** so we don’t rediscover solved UX or
duplicate inventory:

1. **CIDS itself**: `src/design-system/`, canvas, [`cids-component-gaps.md`](./cids-component-gaps.md).
2. **Crypto vertical**: Coinbase CDS · Reown/AppKit · ethereum.org D&UX heuristics.
3. **Generic systems**: Radix / Base UI · shadcn · Carbon (behavior & density).
4. **Motion / micro-interaction**: **[interior.dev](https://www.interior.dev/docs)**
   ([mapping](./references/interior.md)). Steal *contracts* (no jump ·
   interruptible · reduced-motion destination), not files: Interior
   needs `motion`, which is **not** in the portable allowlist.

If Interior (or another lib) is the only honest path and needs a new
dependency, **stop and propose** (composition tier vs portable core)
before writing code.

## The checklist

1. **Folder**: `src/design-system/<Name>/` with `<Name>.tsx`,
   `<Name>.doc.md`, `<Name>.test.tsx`, `index.ts`
   (`check:portable` P2).
2. **API contract**: `className` cn-merged; `size` from the shared
   string scale; `on<Event>` controlled callbacks; behavior from Radix
   where focus/dismiss/keyboard exist; server-safe unless state forces
   `"use client"` (CONVENTIONS → Component API contract).
3. **Tokens only**: no hex classes (`check:theme` T1), no raw
   shadows/z (`T4`), radius/motion/spacing from the token layer. New
   foundation values go to `globals.css` + DESIGN.md *first*.
4. **Doc**: 7 sections in order + `Status: draft` + `Version: 0.9.0`
   headers (guard-enforced). Write the A11y section as a contract you
   test, not a hope.
5. **Tests**: render, key interactions, keyboard where interactive,
   and add the component to the axe matrix (`a11y.test.tsx` CASES);
   it runs automatically × 4 themes.
6. **Polish**: either add assertions to `scripts/check-polish.mjs` or
   list the component in `NO_SPECIFIC_RULES` with a reason (G2 fails
   otherwise: coverage can't be skipped silently). Also verify
   Interior’s three failures don’t apply: **no layout jump**,
   **interruptible motion**, **reduced-motion still informs**.
7. **Canvas**: register a demo (`canvas/demos.tsx` + `items.ts`);
   a component that isn’t on the canvas doesn’t exist.
8. **Registry**: `npm run build:registry` and commit `public/r/`
   (`check:registry` fails CI on drift).
9. **Counts**: README + DESIGN.md inventory tables.

## Promotion (`draft → stable`, `0.x → 1.0.0`)

All four criteria from CONVENTIONS → Stability: API reviewed & frozen ·
tests pass (incl. the matrix) · doc complete · both-ends themes
verified. Promote in a PR that bumps `Version:` to `1.0.0` and adds the
CHANGELOG bullet. After that, props are only added; breaking = major +
migration note; removal goes through `deprecated` first.

## The gate (run before every PR: exit codes unmasked)

```bash
npx tsc --noEmit && npm run lint && npm test \
  && npm run check:theme && npm run check:polish \
  && npm run check:portable && npm run check:contrast \
  && npm run check:registry && npm run build
```

<sub>Patterns (composition recipes) follow `PATTERNS.md`'s shape instead
of the component contract; templates must be DS-exports-only. When in
doubt: the component isn't done until the canvas shows it, the guards
pass it, and the doc tells the truth about it.</sub>
