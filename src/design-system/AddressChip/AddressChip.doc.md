# AddressChip

Status: stable
Version: 1.0.1
Truncated address with one-tap copy + optional explorer link; the full address is always the accessible name.

## Usage

```tsx
import { AddressChip } from "@/design-system";

<AddressChip address={mint} href={`https://solscan.io/token/${mint}`} />
```

## Anatomy

```
[ 7xKt...9fQ2  ⧉  ↗ ]  <- mono truncate - copy - explorer
                 │  └ IconExternal (only when `href` is given)
                 └ IconCopy, swapping to IconCheck for 1.5s on success
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `address` | `string` | - | Full address; truncated visually (4...4). |
| `href` | `string` | - | Explorer URL; renders the link when present. |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--surface-container` + `--outline-variant` - `--radius-chip/control` - `--buy` (copied tick) - `font-mono`

## States

rest - copy hover - copied (1.5s IconCheck) - copy failed (label + sell ink) - with/without explorer.

## Motion

Color transition 150ms on the affordances; nothing else.

## A11y

- Truncation is visual only: the text span carries the full address as `aria-label`, and the copy button names it ("Copy address <full>").
- Copy confirmation is a label change ("Copied"); rejection becomes "Copy failed" (not color alone).
- Copy and explorer controls are ≥40×40 hit targets.
