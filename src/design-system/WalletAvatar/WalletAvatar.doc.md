# WalletAvatar

Status: draft
Version: 0.1.0
Generative wallet identity: a seeded disc in two art styles, with an optional network or connection badge.

## Usage

```tsx
import { WalletAvatar } from "@/design-system";

<WalletAvatar address={wallet} />
<WalletAvatar address={wallet} variant="blocks" />
<WalletAvatar address={wallet} size="lg" chain={{ name: "Solana", iconSrc: "/brand/solana.svg" }} />
<WalletAvatar address={wallet} size="lg" connection="active" />
```

Best for: identifying a *wallet*. Reach for [Avatar](../Avatar/Avatar.doc.md)
when you're identifying a *person* in the social layer; it carries a name
and an initial, this carries an address. `Avatar` picks one of 8 hues, so a
group of five collides about 79% of the time; this derives its figure from
the whole address instead, which is what makes a wallet recognisable before
anyone reads the hex.

## Anatomy

```
 shards            blocks
 ╭─────────╮      ╭─────────╮
 │ ▞▚  ▛▀▚ │      │ ▐▌ ▄ ▐▌ │ ← 5×5 grid,
 │ ▚▞▖ ▙▄▟ │      │ ▀▄▄▄▄▄▀ │   mirrored
 │      ╭──┤      │      ╭──┤
 ╰──────┤◈ │      ╰──────┤● │ ← ONE corner
        ╰──╯             ╰──╯   marker only
```

`chain` and `connection` share the corner, so `chain` wins when both are
passed: two glyphs in one notch read as a single smudged mark.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `address` | `string` | - | Seeds the figure. The whole string is hashed, not a prefix. |
| `label` | `string` | truncated address | Accessible name on the disc. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | 20 / 28 / 40 / 64px. Badge renders at md and lg only. |
| `variant` | `"shards" \| "blocks"` | `"shards"` | Art style. A user setting in most wallets: persist the choice, don't vary it per view. |
| `connection` | `"active" \| "inactive" \| "offline"` | - | Status dot. Ignored when `chain` is set. |
| `chain` | `{ name: string; iconSrc?: string }` | - | Corner network marker; without `iconSrc` it shows the initial. |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--id-*` (all 8 identity hues): sector fills, chosen by seeded rotation.
  Colour is consumed, never invented: no new palette was added for this.
- `--color-surface-container`: badge ground · `--color-surface-page`: badge ring
- `--color-fg`: badge initial fallback
- `--color-success`: connection `active`/`inactive` · `--color-fg-subtle`: `offline`

## States

- **default**; deterministic: one address always draws the same figure.
- **variant=shards**: 4–6 sectors; the richer figure, best from 28px up.
- **variant=blocks**: mirrored 5×5 grid; symmetry survives 20px, where
  shards blur into a single smear.
- **connection**: `active` filled success · `inactive` hollow ring
  (same footprint, so the row doesn't shift) · `offline` filled subtle.
- **xs / sm**: badge is suppressed (`hidden`); at 20–28px it would collapse
  into a smudge rather than read as a network.
- **no `iconSrc`**: badge falls back to the chain's first letter.

## Motion

None. Identity is a static surface; the same reasoning as `Avatar`:
playfulness is budgeted for feedback, not for identity chrome.

## A11y

- `role="img"` + `aria-label` on the SVG names the wallet, not the artwork;
  the shards are decorative and carry no meaning a reader needs.
- The chain is appended to the accessible name via an `sr-only` span, so a
  screen reader hears "7xKX…nHmTc on Solana" as one identity.
- Badge `<img>` is `alt=""` + `aria-hidden`: the name already carries it.
- Connection is appended to the accessible name too ("…, connected, active"),
  never colour-only: `inactive` is a hollow ring and `offline` a muted fill,
  so the three states differ by shape as well as hue.
- Contrast: sector fills are the `--id-*` hues that `npm run check:contrast`
  verifies per theme. No text sits on the disc, so no glyph-contrast pair to
  hold; the badge initial sits on `surface-container`, not on a hue.
