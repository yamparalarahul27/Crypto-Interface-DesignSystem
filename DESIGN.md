# Design System: CIDS (Crypto Interface Design System)

> Single source of truth for the CIDS design language: foundations
> (color, type, spacing, radius, motion) live here; component specs
> live in `src/design-system/<Name>/<Name>.doc.md` (see Components).
> All agents and code generation must follow these specifications.
> Token values are authoritative in `src/app/globals.css`; this file
> explains the roles and rules.

---

## Identity

**Product name:** CIDS, the design system is the product (pivoted 2026-07-11)
**Visual theme:** Near-Black Financial Terminal, "Fey Dark Wealth" / market-dark
**Aesthetic:** A premium, data-dense trading interface that communicates competence and authority. A cinematic near-black canvas with soft charcoal elevation; mint-teal is the single identity accent. Numbers are the hero, decoration is the enemy: depth comes from tonal layering and soft shadows, not borders.

**Mood words:** Precise · Premium · Spacious · Trustworthy · Calm authority · Cinematic
**Anti-mood words:** Flashy · Neon · Cluttered · Bright

> **Amendment: tide social layer (calm base, playful moments).** The
> canvas, typography, and data surfaces keep calm authority. Playfulness
> is budgeted *exclusively* to feedback on human actions: reacting,
> following, watching, celebrating. If a static screen looks playful, we
> overspent. *Playful* is therefore removed from the anti-mood list as an
> absolute; *Gamified* is refined to **no mechanics** (points / streaks /
> ranks): celebratory feedback is allowed, game loops are not. Rationale
> and scope: [docs/tide/02-design-system.md](./docs/tide/02-design-system.md).

---

## Color

> **Single source of truth: `src/app/globals.css`.** Every colour is a CSS variable
> exposed as a semantic Tailwind utility via `@theme inline`. **Consume tokens:
> never hardcode hex in classes.** Use `bg-surface-container`, `text-fg`,
> `text-brand`, `text-buy`, etc. The `npm run check:theme` guard fails CI if a
> `*-[#hex]` utility class reappears anywhere under `src/` (evilcharts exempt).
> The whole app is dark; there is no light mode.
>
> **Token tiers (the naming grammar).** Two deliberate layers, analogous
> to Material's `ref → sys` tiers: **raw tokens** in `:root`
> (`--brand`, `--surface-container`, `--elevation-1`) hold values and are
> what themes override; **system aliases** in `@theme inline`
> (`--color-brand`, `--shadow-card`) map raw tokens to Tailwind
> utilities and are what components consume. Never point a component at
> a raw value a theme can't retune.

> **Amendment: themes (CIDS pivot; light added Phase 3).** Themes are
> swappable token value-sets: `:root` is the default (`market-dark`),
> and each `[data-theme="x"]` block in `globals.css` overrides the same
> token names (activated via `<html data-theme="x">`, switchable at
> runtime from `/design` and the canvas). Current themes:
>
> | Theme | What it proves |
> |---|---|
> | **dark** | the default market-dark terminal |
> | **mono** | grayscale except the signal (buy/sell + hues kept) |
> | **light** | full re-valuation: white canvas, dark-jewel identity hues, deep-teal brand, inverted glyphs, softened elevations |
> | **violet** | white-labeling: the accent family (+ reserved "you" hue) swapped in ONE block, everything else inherited |
>
> `npm run check:contrast` verifies every theme (with `:root` fallback
> for tokens a theme doesn't override). The dark-only rule above is
> therefore historical: **dark remains the default and design target**,
> and every component must render correctly under all themes.

### Adding a theme (the recipe)

1. Add one `[data-theme="<name>"]` block to `globals.css`, overriding
   only the raw tokens that change (see `light` for a full re-valuation,
   `violet` for a minimal accent swap). Never introduce new token names.
2. Check the two forced pairs: if surfaces flip polarity, `--fg-inverse`
   (avatar glyph) and `--on-brand` must flip with them; identity hues
   must go dark-jewel on light surfaces.
3. Run `npm run check:contrast`: it auto-discovers the block and fails
   any hue/glyph/surface pair below WCAG AA. Adjust until green.
4. Add the name to `THEMES` in `src/app/design/ThemeToggle.tsx`.
   That's the whole integration: components need zero changes.

### Surfaces (near-black, layered by elevation)

| Token | Value | Utility | Role |
|---|---|---|---|
| `--surface-dim` | `#030405` | `bg-surface-dim` | Deepest frame, gutters, masked edges |
| `--surface-page` | `#090a0d` | `bg-surface-page` | Default app background (body) |
| `--surface` | `#101115` | `bg-surface` | Panel / dashboard body surface |
| `--surface-container` | `#17191e` | `bg-surface-container` | Cards, table rows, inputs |
| `--surface-container-high` | `#202228` | `bg-surface-container-high` | Hover, dropdowns, raised controls |
| `--surface-bright` | `#2a2d34` | `bg-surface-bright` | Selected rows, popovers, tooltips |

### Borders

| Token | Value | Utility | Role |
|---|---|---|---|
| `--outline` | `#383b43` | `border-outline` | Visible card / control separator |
| `--outline-variant` | `#23262d` | `border-outline-variant` | Hairline dividers, table rules |

### Foreground / Text

| Token | Value | Utility | Role |
|---|---|---|---|
| `--fg` | `#f4f4f5` | `text-fg` | Primary text, headline figures, active tabs |
| `--fg-muted` | `#a7abb3` | `text-fg-muted` | Secondary text, supporting labels |
| `--fg-subtle` | `#868b95` | `text-fg-subtle` | Tertiary metadata, placeholders, faint hints |
| `--fg-inverse` | `#07080a` | `text-fg-inverse` | Text on light pills (e.g. white CTA) |
| `--on-brand` | `#04110f` | `text-on-brand` | Text/icon on mint brand fills |

<sub>All fg-on-surface pairs clear WCAG AA (4.5:1) on every surface; `fg-subtle` is AA on page/container and AA-large on the rare `surface-bright`. Verified, not eyeballed.</sub>

### Identity hues (tide social layer)

> **Amendment: new foundation.** Social UIs need per-person color; one
> accent (`--brand`) can't carry N people, and free hex would break the
> token system. This adds a fixed **8-hue identity palette**, each hue
> shipping as an accent + disc pair (see below). Assigned deterministically
> from the wallet address
> (`hash(wallet) % 8`): stable, no user picker in v1. Consumed **only** by
> avatars, handle accents, and presence indicators: **never for data or
> state** (buy / sell / warning keep their semantic hues).

**Each hue is a pair** (changed 2026-08-26). A hue has two jobs that pull
in opposite directions: it is handle text on a near-black page, which
forces it *light*, and it is an avatar disc, which wants it *saturated*.
Serving both from one token is what kept the palette pale and forced a
near-black glyph. So:

| Token | Value | Utility | Role |
|---|---|---|---|
| `--id-tide` | `#5ad8c4` | `text-id-tide` | **accent**: handle text, presence dots. Reserved for the signed-in user (matches `--brand`; separate token so it can diverge) |
| `--id-coral` | `#e8927c` | `text-id-coral` | accent |
| `--id-sand` | `#d9b380` | `text-id-sand` | accent |
| `--id-lilac` | `#b39fd8` | `text-id-lilac` | accent |
| `--id-sky` | `#7fb3d9` | `text-id-sky` | accent |
| `--id-moss` | `#93b98a` | `text-id-moss` | accent |
| `--id-rose` | `#cf8ca3` | `text-id-rose` | accent |
| `--id-slate` | `#93a1b8` | `text-id-slate` | accent |
| `--id-tide-fill` | `#2d6c62` | `bg-id-tide-fill` | **disc**: the avatar fill. Free to saturate: only `--id-glyph` reads on it |
| `--id-coral-fill` | `#74493e` | `bg-id-coral-fill` | disc |
| `--id-sand-fill` | `#6c5a40` | `bg-id-sand-fill` | disc |
| `--id-lilac-fill` | `#5a506c` | `bg-id-lilac-fill` | disc |
| `--id-sky-fill` | `#405a6c` | `bg-id-sky-fill` | disc |
| `--id-moss-fill` | `#4a5c45` | `bg-id-moss-fill` | disc |
| `--id-rose-fill` | `#684652` | `bg-id-rose-fill` | disc |
| `--id-slate-fill` | `#4a505c` | `bg-id-slate-fill` | disc |
| `--id-glyph` | `#fbfcfe` | `text-id-glyph` | the letter on a disc. One value for every theme, because every disc is deep |

The `light` theme's accents are already deep enough to read on white, so
its discs reuse them rather than doubling down. `mono` inherits both sets;
`violet` overrides `--id-tide` and its fill together.

**Verification (not eyeballed).** `npm run check:contrast` asserts WCAG AA
(4.5:1) on all three paths, across all four themes, and fails CI otherwise:

- **Avatar glyph**: `--id-glyph` on each `--id-*-fill`: **5.96–8.03:1** ✓
- **Handle / presence accent**: the accent hue as text on `surface-page`,
  `surface-container`, `surface-bright`: lowest **5.2:1** ✓
- **Completeness**: every accent hue ships a matching `-fill`, so a new
  hue cannot silently inherit another theme's disc colour ✓

**Avatar fill** is a radial gradient
`radial-gradient(120% 120% at 30% 20%, var(--id-x-fill), color-mix(in srgb, var(--id-x-fill) 78%, black))`
: always reference the token, never a hardcoded dark end. The dark end is
now the *safe* direction: the glyph is light, so the flat fill (the
gradient's lightest point) is the worst case, and that is exactly what the
verifier asserts. No informational carve-out is needed any more.

**Generative variants** (`shards`, `blocks`) keep building from the accent
hues rather than the fills: they carry no glyph, so no contrast rule binds
them, and their per-facet `color-mix` at 35–56% already lands at luminance
0.039–0.155 against the discs' 0.079–0.122, the same depth family.

### Brand: mint-teal identity accent

| Token | Value | Utility | Role |
|---|---|---|---|
| `--brand` | `#5ad8c4` | `text-brand` / `bg-brand` | Primary CTA, links, selected state, focus |
| `--brand-hover` | `#78e8d7` | `bg-brand-hover` | Hover on brand-filled actions |
| `--brand-bright` | `#a7fff0` | - | High-contrast glow for charts/highlights |
| `--brand-subtle` | `#c9fbf2` | - | Pale mint tint for soft brand fills |

> **Filled mint surfaces use dark text (`text-on-brand`), never `text-white`**: mint
> is a light accent; white text on it fails contrast. The guard enforces this.

### Semantic: trading + state

| Token | Value | Utility | Role |
|---|---|---|---|
| `--buy` / `--buy-strong` | `#34d399` / `#10b981` | `text-buy` | Positive PnL, success, live, on-peg |
| `--sell` / `--sell-strong` | `#f87171` / `#ef4444` | `text-sell` | Negative PnL, errors, short |
| `--warning` / `--warning-strong` | `#f4d35e` / `#f59e0b` | `text-warning` | Warnings, pending, cautionary |
| `--info` / `--info-strong` | `#75a7ff` / `#3b82f6` | `text-info` | Informational accent (secondary to brand) |
| `--error` / `--error-strong` | `#fb7185` / `#f43f5e` | `text-error` | Destructive feedback (rose) |

### Tinted state surfaces (dark)

| Token | Value | Utility | Role |
|---|---|---|---|
| `--buy-surface` | `#0f1f1a` | `bg-buy-surface` | Subtle positive/success background |
| `--sell-surface` | `#211214` | `bg-sell-surface` | Subtle error background |
| `--warning-surface` | `#211d10` | `bg-warning-surface` | Subtle warning background |
| `--info-surface` | `#111827` | `bg-info-surface` | Subtle info background |
| `--error-surface` | `#221114` | `bg-error-surface` | Subtle destructive background |
| `--success-surface` | `#0f1f1a` | `bg-success-surface` | Subtle success background (same value as buy: distinct token so they can diverge) |

<sub>Sign vs. magnitude (guideline #5): magnitude drives tone via `Math.abs()`, direction drives the signed `+`/`−` and ▲/▼. Two concerns, two computations. Peg-health colour reflects health, not price direction.</sub>

## Typography

### Font Stack

What is actually loaded (nothing else may be referenced):

| Family | Source | Token / class | Role |
|---|---|---|---|
| **Geist** | `next/font/google` (`layout.tsx`) | `--font-sans` → `font-sans` | All UI text: labels, buttons, body |
| **Geist Mono** | `next/font/google` (`layout.tsx`) | `--font-mono` → `font-mono` | Code, addresses, handles |
| **GeistPixelSquare** | Self-hosted `/fonts/GeistPixelSquare.woff2` (`@font-face` in globals) | `.data-lg/md/sm` | Financial data (prices, %, PnL) |
| IBM Plex Mono | *not loaded*: CSS fallback only | inside `.data-*` stacks | Fallback if pixel font fails |

**Font smoothing:** `antialiased` on all body text.

### Type Scale

| Class / Level | Font | Weight | Size | Use |
|---|---|---|---|---|
| Page title | Geist | 600–700 | 1.25–1.5rem | Page/section headings |
| Section label | Geist | 600 | 0.6875rem, sentence case, `text-fg-subtle` | Section dividers (pattern, not a CSS class: see `SectionLabel` in `design/page.tsx`) |
| Body | Geist | 400–500 | 0.875rem | Descriptions, general UI |
| `.data-lg` | GeistPixelSquare | 400 | `--text-data-lg-size` 1.125rem (1.875 ≥768px) | Hero financial figures |
| `.data-md` | GeistPixelSquare | 400 | `--text-data-md-size` 0.875rem | Table values, prices |
| `.data-sm` | GeistPixelSquare | 400 | `--text-data-sm-size` 0.75rem | Secondary data, timestamps |

The financial ramp is **tokenized**: sizes live as `--text-data-*-size`
vars (the density lever), consumed by both the `.data-*` composite
classes and the `text-data-lg/md/sm` utilities (pair those with
`font-pixel` + `tabular-nums`).

### Rules

- All financial numbers use **GeistPixelSquare** (fallback: IBM Plex Mono) with `tabular-nums`. Never a serif or variable-weight font.
- Section labels are **sentence case at 0.6875rem**, `font-semibold`, `text-fg-subtle`.
  No all-caps and no tracking: letter-spacing exists to open up capitals, so
  once the capitals go it only loosens the word. (Changed 2026-08-26; the
  system was previously all-caps at 0.08–0.14em.)
- Never use serif fonts anywhere in the UI.

---

## Spacing

**Base unit: 8px**, tokenized as `--space-1…8` (the density lever, a
compact mode retunes these values and every consumer follows):

| Token | Value | Name | Use |
|---|---|---|---|
| `--space-1` | 8px | Tight | Related elements within a group |
| `--space-2` | 16px | Standard | Component spacing, card padding |
| `--space-3` | 24px | Comfortable | Section padding, sheet padding |
| `--space-4` | 32px | Spacious | Between major sections |
| `--space-5` | 40px | - | Large section gaps |
| `--space-6` | 48px | Generous | Hero/page-level padding |
| `--space-7` | 56px | - | Rare, page-level |
| `--space-8` | 64px | Maximal | Rare, page-level |

### Density (the terminal axis)

`<html data-density="compact">` re-values the spacing scale, the
financial type ramp, and the row grid (`--row-h` 44→32, `--cell-px`
12→8): one attribute, zero component changes. Orthogonal to themes;
switchable live from the canvas Theme Studio. Interactive controls
(Button/IconButton) keep their own heights: density compresses data
surfaces, never tap targets.

Rules:
- The scale is deliberately **not** mapped into Tailwind's `--spacing-*`
  namespace (that would silently retune `p-1/p-2` everywhere). Consume
  via `var(--space-*)` in styles, or `p-[var(--space-2)]` utilities,
  when the value is *semantic* (a card inset, a section gap).
- Tailwind's fine-grained default scale (`gap-1` = 4px, `px-2.5` = 10px…)
  remains allowed for micro-adjustments inside a component.

**Border radius scale**: token-driven since the Theme Studio work; a
theme (or the canvas token panel) can reshape every component by
overriding these:

| Token | Default | Utility | Use |
|---|---|---|---|
| `--radius-control` | `2px` | `rounded-control` | buttons, pills, inputs, segments, badges |
| `--radius-chip` | `4px` | `rounded-chip` | token chips, icon boxes |
| `--radius-card` | `8px` | `rounded-card` | cards, CTAs, list rows |
| `--radius-sheet` | `12px` | `rounded-sheet` (`rounded-t-sheet`) | sheets, large modals |
| - | `9999px` | `rounded-full` | discs, avatars (deliberately not a token) |

---

## Icons

**[Phosphor](https://phosphoricons.com) is the icon family.** One family,
one optical grid: the system previously improvised with unicode glyphs
(`▲`, `✓`, `⧉`, `⚙`) and hand-drawn SVG paths, which disagreed on weight
and baseline across platforms and could not be re-weighted together.

Components never name the vendor. They import intent from
[`src/design-system/icons.ts`](./src/design-system/icons.ts), the system's
single icon seam:

```tsx
import { IconClose, IconPriceUp } from "../icons";   // inside the design system
import { IconClose, IconPriceUp } from "@/design-system"; // from app code

<IconClose size={14} weight="bold" aria-hidden="true" />
```

`check:portable` enforces this (rule **P1a**): `@phosphor-icons/react` is
an allowed import, but only `icons.ts` may name it. That keeps the family
swappable in one file, and lets the registry declare the npm dependency
exactly once: every component that draws an icon picks up `@cids/icons`
as a registry dependency automatically.

### Rules

- **Import from `@phosphor-icons/react/dist/ssr`, not the package root.**
  Root icons read `IconContext` and are client-only; the ssr build is
  context-free and renders in server components too. `icons.ts` uses
  per-icon paths so a vendored copy costs an adopter only what it draws.
- **Size explicitly on icon-only controls** (`size={14}` in an `h-7`
  button). Omitting `size` inherits `1em`, which is right inside a text
  run and wrong inside a fixed-size control.
- **Colour comes from `currentColor`.** Put `text-buy` / `text-sell` /
  `text-fg-muted` on the icon or its wrapper; never hard-code a fill.
- **Centre icons against text with `inline-flex items-center`.** An SVG
  sits on the text baseline otherwise and rides high next to numerals.
- **Weight carries meaning.** `fill` for values being reported (the
  money carets) and brand marks; `bold` for small marks that must stay
  legible under 14px; `regular` for everything else.
- **Decorative by default.** Icons take `aria-hidden="true"`; the
  control's `aria-label` or adjacent text is the accessible name
  ([Icon-only controls](#icon-only-controls)).
- **Adding one:** find it on phosphoricons.com, re-export its
  `<Name>Icon` binding from `icons.ts` under a CIDS-intent name, and use
  that name downstream. The unsuffixed `<Name>` bindings are deprecated
  upstream.

### What is *not* an icon

Unicode that is typography or data stays as it is: `…` ellipses, the
`−` (U+2212) minus in number formatting, `×` in dimensions, `⌘` in key
hints, and the box-drawing art in `.doc.md` anatomy sketches. Emoji in
`ReactionBar` and `EmptyState` are user content, not iconography.
Structural SVG: `Sparkline` geometry, the `QRCode` matrix, `Avatar`
gradients, the `HoldToConfirm` progress ring: is drawing, not an icon.

---

## Components

> **Source of truth: [`src/design-system/`](./src/design-system/).**
> Every component is a folder of `<Name>.tsx` + `<Name>.doc.md` +
> `index.ts`; the `.doc.md` (fixed shape: Usage · Anatomy · Props ·
> Tokens · States · Motion · A11y) is the component's spec, enforced by
> `npm run check:portable` and rendered live by the canvas Inspector.
> **This file never duplicates component specs**; that's how docs
> stayed truthful. Authoring rules: [`src/design-system/CONVENTIONS.md`](./src/design-system/CONVENTIONS.md).

Current inventory (37):

| Component | Status | | Component | Status |
|---|---|---|---|---|
| Avatar | stable | | PostCard | stable |
| AvatarGroup | stable | | ReactionBar | stable |
| FollowButton | stable | | Sheet | stable |
| Lane | stable | | SocialProofChip | stable |
| TokenChip | stable | | CommentThread | draft |
| TokenIcon | stable | | Onboarding | draft |
| Skeleton | stable | | Tooltip | stable |
| Button | stable | | IconButton | stable |
| Badge | stable | | Input | stable |
| Dialog | stable | | Menu | stable |
| Switch | stable | | Checkbox | stable |
| Select | stable | | Tabs | stable |
| Toast | stable | | Divider | stable |
| EmptyState | stable | | DataTable | stable |
| RollingNumber | stable | | PriceChange | stable |
| StatCell | stable | | Sparkline | stable |
| AddressChip | stable | | PegBadge | stable |
| NetworkBadge | stable | | TxStatus | stable |
| AmountInput | stable | | LoadingButton | draft |

Components consume tokens from this file's foundations; they never
define color/spacing/motion values of their own (`check:theme`).
Evolution plan: [docs/cids-roadmap.md](./docs/cids-roadmap.md).

---

## Layout

### Page Structure

- **Dark-only**: every surface sits on the near-black ladder; there is
  no light body (light theme is a roadmap Phase 3 deliverable).
- **Canvas** (`/design/canvas`): full-viewport, desktop-first.
- **Gallery / feed demo / landing**: single centered column, `max-w`
  ~28rem (mobile-first), gutters on `bg-surface-dim`.

### Breakpoints

| Name | Width | Behaviour |
|---|---|---|
| Mobile | `< 640px` | Single column, hamburger nav, bottom-sheet modals |
| Tablet | `640–1024px` | Stacked layouts, compressed nav |
| Desktop | `1024–1400px` | Full layouts, horizontal nav |
| Wide | `> 1400px` | Capped at 1400px content width |

### Content Density

| Context | Density | Notes |
|---|---|---|
| Dashboard / Invest | Medium | Generous spacing, scannable |
| Trade Terminal | High | Maximise data, compact |
| Modals / Settings | Low | Generous whitespace, focused |

### Touch Targets

- Minimum `44px` height for all interactive elements on mobile
- `48px` recommended for primary CTAs

---

## Depth & Elevation

### Surface Hierarchy (dark-first)

Tokens only; values live in `globals.css` per theme:

| Layer | Token | Role |
|---|---|---|
| 0 | `surface-dim` | Deepest frame, gutters (floor) |
| 1 | `surface-page` | Page background |
| 2 | `surface` | Panel body |
| 3 | `surface-container` | Cards, rows, inputs |
| 4 | `surface-container-high` | Hover, dropdowns, raised controls |
| 5 | `surface-bright` | Selected, popovers, tooltips |
| - | `surface-dim/60 + backdrop-blur` | Modal/sheet backdrop |

### Elevation tokens

Shadows are tokens: components never write literal `box-shadow` values
(guard-enforced by `check:theme` T4 inside the DS + design app):

| Token | Utility | Use |
|---|---|---|
| `--elevation-1` | `shadow-card` | Card at rest |
| `--elevation-2` | `shadow-raised` | Popovers, raised controls, FABs |
| `--elevation-3` | `shadow-overlay` | Sheets, modals (over `surface-dim/60` backdrop) |
| `--glow-brand` | `shadow-glow-brand` | Active `bg-brand` segment/pill: the mint halo |
| `--glow-brand-strong` | `shadow-glow-brand-strong` | Brand FAB / hero CTA |

- **Depth comes from tonal layering** (surface → container → container-high → bright) first; shadows are secondary and deep/black.
- The **only** coloured shadows allowed are the two brand glows: and they derive from `--brand` via `color-mix` inside the token, so they re-tint per theme. No other neon glows.

### Z-index scale

One stacking ladder for the whole system, consumed via concrete token classes
such as `z-[var(--z-raised)]`
(numeric `z-10/20/…` utilities are guard-banned in the DS + design app):

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Normal flow |
| `--z-raised` | 10 | Popovers, canvas HUD |
| `--z-sticky` | 20 | Sticky headers, bottom bars |
| `--z-overlay` | 30 | FABs, floating layers |
| `--z-modal` | 50 | Sheets, dialogs (+ their backdrops) |
| `--z-toast` | 60 | Toasts / notifications (reserved) |

---

## Motion

| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Button / Pill hover | **`150ms`** | `ease` | all (background, color, border) |
| Nav item color | `150ms` | - | color |
| Card hover (interactive) | `150ms` | `ease-in-out` | all |
| `.animate-fade-up` | `400ms` | `ease-out` | opacity, transform (Y +8px → 0) |
| Active card press | - |: | `scale(0.98)` |
| Active CTA press (landing) | - | `200ms` | `scale(0.97)` |
| Chevron rotate (dropdown) | - |: | `rotate-180` on open |
| Modal entry | `300ms` | `ease-out` | opacity, transform |

**Note:** The standard transition is `150ms` across all interactive UI components, the old doc incorrectly stated `200ms`.

### Motion primitives (tide social layer)

> **Amendment: named tokens.** Three duration + easing pairs live in
> `globals.css` so motion is consumed by name, not by re-typed magic
> numbers. Consume via CSS (`transition: transform var(--motion-fast)`) or
> an arbitrary-value utility. All honor `prefers-reduced-motion` through
> the global reset.

Durations and easings are also split into their own tokens so they can
be consumed (and re-tuned) independently: `--duration-fast/settle/spring`
and `--ease-settle` / `--ease-spring` (the latter two also exist as
`ease-settle` / `ease-spring` utilities):

| Composite token | Value | Use |
|---|---|---|
| `--motion-fast` | `var(--duration-fast) ease-out` = 150ms | state / hover / press: the `150ms` base above, as a token |
| `--motion-settle` | `var(--duration-settle) var(--ease-settle)` = 200ms | enter / morph (e.g. FollowButton fill→outline) |
| `--motion-spring` | `var(--duration-spring) var(--ease-spring)` = 250ms overshoot | playful feedback on human actions only (react-pop): the "budgeted playfulness" from Identity |

### `fade-up` keyframe
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Rules:**
- Reserve `backdrop-filter: blur()` for modal backdrops only: never on cards
- No shine, sweep, or parallax effects
- No looping animations on data elements
- **Honor `prefers-reduced-motion`**: all motion is disabled under it via a global guard in `globals.css`. New motion must degrade to its final state instantly. See [Accessibility](#accessibility).

---

## Accessibility

> Keyboard, motion, and contrast guarantees the UI must hold. Not optional polish:
> the floor. Verified, not eyeballed.

### Keyboard focus

Every interactive element shows a **`:focus-visible` ring** on keyboard / programmatic focus:
brand mint, drawn with `outline` (never `box-shadow`, so layout never shifts), never removed.
The ring is suppressed for pointer interaction (`:focus` without `-visible`), so mouse users
don't see it. The base rule lives in `globals.css`:

```css
:focus-visible {
  outline: 2px solid var(--brand);   /* #5ad8c4 */
  outline-offset: 2px;
}
```

- **Never** `outline: none` without an equivalent visible replacement.
- Component-level focus styling (e.g. input focus border) is **additive**, not a replacement.
- One-off Tailwind override: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`.

### Reduced motion

All animation and transition is **disabled under `prefers-reduced-motion: reduce`** via a global
guard in `globals.css`. `.animate-fade-up`, modal entry, and press scales collapse to their final
state instantly:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Never gate meaning behind an animation.

### Contrast

All `fg`-on-surface pairs clear **WCAG AA (4.5:1)**; `fg-subtle` is AA on page/container and
AA-large on `surface-bright`. Filled mint surfaces use `text-on-brand` (dark): white on mint
fails contrast, and `check:theme` blocks it. See [Color](#color).

### Touch targets

Interactive controls are **≥ 40×40px**. When the visual is smaller, extend the hit area with a
`before:` pseudo-element rather than padding the visual (see the `MetaStrip` info dot). See
[Touch Targets](#touch-targets).

### Icon-only controls

Buttons or links with no visible text label require an **`aria-label`** describing the action.

---

## Scrollbar

```css
::-webkit-scrollbar        { width: 6px; height: 6px; }
::-webkit-scrollbar-track  { background: var(--main-bg); }
::-webkit-scrollbar-thumb  { background: rgba(255,255,255,0.10); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.20); }
.scrollbar-hide            { scrollbar-width: none; }
```

---

## Do's & Don'ts

### Do ✅
- Use background-color shifts for depth on dark surfaces (not shadows)
- Keep all financial numbers in **Geist Pixel Square** or IBM Plex Mono
- Use `rounded-sm` (2px) on buttons, pills, cards, inputs; it is the system default radius
- Use `bg-brand` (mint) as the single identity accent: links, selected state, primary CTA. Filled brand always pairs with `text-on-brand` (dark text)
- Use `bg-surface` modals over `bg-surface-dim/60` blurred backdrops for clear layer separation
- Show `text-buy` (mint-green) for positive values, `text-sell` (red) for negative: always
- Set section labels in sentence case at `text-[0.6875rem] font-semibold text-fg-subtle`: no `uppercase`, no `tracking-*`
- Keep a minimum `44px` touch target on mobile
- Draw every icon from Phosphor via `icons.ts` intent names, `aria-hidden`, sized to its control
- Use `150ms` for all hover/active transitions

### Don't ❌
- Don't use `border-radius: 0`: minimum is `rounded-sm` (2px)
- Don't use `rounded-full` (9999px) on buttons or pills; that's for status dots only
- Don't use neon glows or text shadows (the one allowed coloured shadow is the subtle mint glow on an active `bg-brand` pill)
- Don't use `backdrop-filter: blur()` on cards (Navbar and BottomBar use it: but not data cards)
- Don't use decorative corner accents or shine/sweep animations
- Don't use serif fonts anywhere
- Don't use gradients on cards or buttons (flat surface tokens only, except the featured StableCard, banners, and hero)
- Don't alternate table row background colours
- Don't hardcode hex in Tailwind classes (`bg-[#…]`): always use a semantic token; `npm run check:theme` enforces this
- Don't put `text-white` on a `bg-brand` fill: mint needs dark `text-on-brand`

---

## Font Loading

```tsx
// src/app/layout.tsx: next/font (self-hosted by Next, no external <link>)
import { Geist, Geist_Mono } from "next/font/google";
// exposed as --font-geist-sans / --font-geist-mono,
// mapped to --font-sans / --font-mono in globals @theme
```

```css
/* src/app/globals.css: the pixel data font */
@font-face {
  font-family: "GeistPixelSquare";
  src: url("/fonts/GeistPixelSquare.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
}
```

---

## Quick Reference for AI Agents

### Colour Tokens (semantic Tailwind utilities)

> Use these utilities: **never** `bg-[#hex]`. Defined in `globals.css @theme`.

```
/* Surfaces (low → high elevation) */
bg-surface-page              /* page background */
bg-surface                   /* panel body */
bg-surface-container         /* cards, rows, inputs */
bg-surface-container-high    /* hover / dropdowns */
bg-surface-bright            /* selected / popovers / tooltips */

/* Text */
text-fg                      /* primary / figures */
text-fg-muted                /* secondary */
text-fg-subtle               /* tertiary / placeholders */

/* Brand (mint) + filled */
text-brand                   /* links, selected, accent */
bg-brand text-on-brand hover:bg-brand-hover   /* primary CTA, DARK text */

/* Semantic */
text-buy   text-sell   text-warning   text-info
bg-buy-surface  bg-sell-surface  bg-warning-surface  /* tinted state bg */

/* Borders + glints on dark */
border-outline               /* visible separator */
border-outline-variant       /* hairline / table rule */
border-white/15              /* subtle glass rim on hero/glass only */
```

### Icons

```
import { IconClose, IconCheck } from "@/design-system";   /* app code   */
import { IconClose, IconCheck } from "../icons";          /* inside DS  */

<IconClose size={14} weight="bold" aria-hidden="true" />
```

> Phosphor, always via `src/design-system/icons.ts`: **never** import
> `@phosphor-icons/react` directly outside that file (`check:portable`
> rule P1a). Size explicitly inside fixed-size controls; colour via
> `text-*` on the icon or wrapper. See [Icons](#icons).

### Font Tokens

```
/* Financial numbers (hero → secondary) */
.data-lg  .data-md  .data-sm      /* GeistPixelSquare ramp */

/* UI / labels / body */
font-sans                          /* Geist */

/* Code, addresses, handles */
font-mono                          /* Geist Mono */

/* Section labels (pattern) */
font-sans font-semibold text-[0.6875rem] text-fg-subtle
```

### Component Prompt Recipes

**Data table:**
> "`bg-surface-container`. Headers: `font-sans` 600, 12px, sentence case, `text-fg-subtle`. Numbers: `.data-md` + `tabular-nums`, `text-fg`. Row rule: `border-outline-variant`. Row hover: `bg-surface-container-high`. `text-buy` positive, `text-sell` negative: magnitude via `Math.abs`, direction via sign."

**Card:**
> "`bg-surface-container`, `border border-outline-variant`, `rounded-card`, `16–24px` padding. Layered shadow; hover lifts to `bg-surface-container-high`. Text `text-fg` / `text-fg-muted`."

**Sheet / modal:**
> "`bg-surface` panel, `rounded-t-sheet`, `24px` padding, deep shadow, over `bg-surface-dim/60` backdrop with `backdrop-blur`. Title: `text-fg`, `font-sans` 600. Behavior via the DS `Sheet` (Radix Dialog)."

**Primary button:**
> "`bg-brand text-on-brand` (DARK text on mint), `font-sans` 600 14px, `rounded-control`. Hover `bg-brand-hover`, targeted `transition-[background-color,color,box-shadow,transform]` (never `transition-all`), `active:scale-[0.96]`."

**Segmented control:**
> "Use the DS `Lane`. Active: `bg-brand text-on-brand` + layered mint shadow. Inactive: transparent, `text-fg-muted`."
