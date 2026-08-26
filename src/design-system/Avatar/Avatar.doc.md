# Avatar

Status: stable
Version: 1.0.0
Identity disc: initial, shards, or blocks; with an optional network or connection badge.

## Usage

```tsx
import { Avatar } from "@/design-system";

<Avatar name="mira" seed={walletAddress} size="md" />
<Avatar name="you" you size="sm" />  {/* signed-in user: --id-tide */}
```

## Anatomy

```
   ┌─────────┐
   │    M    │  ← glyph: first letter of `name`,
   │ (hue    │    --id-glyph on the -fill gradient,
   │  disc)  │    font-mono 600
   └─────────┘
   radial-gradient(120% 120% at 30% 20%,
     var(--id-<hue>),
     color-mix(in srgb, var(--id-<hue>) 60%, black))
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | - | First character → glyph; also the `aria-label`. |
| `seed` | `string` | `name` | Value hashed to pick the hue. Pass the wallet address for stable per-person color. |
| `hue` | `IdHue` | - | Explicit override; skips hashing. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | xs 20 · sm 28 · md 40 · lg 64 px; glyph scales with the disc. |
| `variant` | `"initial" \| "shards" \| "blocks"` | `"initial"` | Figure style. A user setting in most wallets: persist it, don't vary per view. |
| `chain` | `{ name: string; iconSrc?: string }` | - | Corner network marker; without `iconSrc` it shows the initial. |
| `connection` | `"active" \| "inactive" \| "offline"` | - | Status dot. Ignored when `chain` is set: one corner, one marker. |
| `you` | `boolean` | `false` | Forces the reserved `--id-tide` hue (the signed-in user). |
| `className` | `string` | - | Merged via `cn` (e.g. group ring/overlap). |

**Which variant.** `initial` hashes to one of 8 hues: fine for a named
person in a feed, useless for a wallet (five addresses collide ~79% of the
time). `shards` and `blocks` derive the whole figure from the seed instead.
`blocks` is mirrored, so it survives 20px where `shards` blurs. For an
address, reach for [WalletAvatar](../WalletAvatar/WalletAvatar.doc.md): the
same component, without inventing a display name for a hex string.

## Tokens

- `--id-*-fill` (via `hueGradient`): the 8 avatar-disc fills. The plain `--id-*`
  accents are the handle/presence colour and are far too light to carry a glyph.
- `--color-id-glyph` (`text-id-glyph`): the light glyph colour the contrast guard verifies.
- `--id-*` (accents): used by the `shards`/`blocks` figures, which carry no glyph.
- `--color-success`: connection `active`/`inactive` · `--color-fg-subtle`: `offline`
- `--color-surface-container`: badge ground · `--color-surface-page`: badge ring

## States

Single visual state (identity is not interactive). Press/hover feedback belongs to the wrapping control (link/card), not the Avatar.

## Motion

None. Static identity surface: playfulness is budgeted to feedback, not to identity chrome.

## A11y

- `role="img"` + `aria-label={name}` so AT reads the person, not the letter.
- Glyph contrast: light `--id-glyph` on every `--id-*-fill` is **5.96–8.03:1** (AA), enforced by `npm run check:contrast`. The flat fill is the gradient's lightest point and therefore the worst case, so it is what the guard asserts; the dark end only helps.
- Decorative-only usage next to a visible handle: pass an empty label at the call site if the name is already announced.
