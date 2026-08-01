# QRCode

Status: draft
Version: 0.9.0
Receive-address QR — composition tier (`qrcode` npm), not portable core.

> Lives in `src/components/QRCode/`, not `src/design-system/`. Same
> pattern as PriceChart: a real crypto surface that needs a non-allowlisted
> dependency. Not in the copy-in registry; `check:portable` does not
> cover it.

## Usage

```tsx
import { QRCode } from "@/components/QRCode/QRCode";

<QRCode
  value="7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM"
  explorerHref="https://solscan.io/account/…"
  label="Scan to send"
/>
```

Best for: receive / deposit screens. Encodes the address; `AddressChip`
below handles truncation, copy, and explorer. Prefer keeping the full
address as the QR payload (never a truncated string).

## Anatomy

```
┌─────────────────────────┐
│      Scan to send       │  ← optional label
│  ┌───────────────────┐  │
│  │ ▓▓░▓▓ … matrix    │  │  ← SVG, theme tokens
│  └───────────────────┘  │
│     7xKt…Q2rM  ⧉  ↗     │  ← AddressChip
└─────────────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | Full address / payload encoded in the matrix. |
| `size` | `number` | `160` | SVG width/height px. |
| `label` | `string` | `"Scan to send"` | Caption; `""` hides it. |
| `explorerHref` | `string` | — | Passed to AddressChip. |
| `className` | `string` | — | cn-merged onto the figure. |
| `aria-label` | `string` | `"QR code for {value}"` | Accessible name. |

`"use client"` — generates SVG in an effect.

## Tokens

`--surface-container` / `--surface-bright` (card + quiet zone) ·
`--outline-variant` · `--fg` (modules via `currentColor`) ·
`--fg-muted` (label) · `--radius-card` / `--radius-control` ·
`--sell` (error). AddressChip brings its own tokens.

## States

loading (pulse placeholder) · ready (SVG) · error ("Couldn't render QR").
Theme flips recolor without regenerating (CSS vars on the SVG).

## Motion

Loading pulse only. Matrix itself is static — never animate QR modules.

## A11y

`figure` with aria-label including the full address. AddressChip keeps
the full address as its accessible name (truncation visual only). Error
text is visible, not color-only. SVG is decorative relative to the
chip's copy affordance for screen-reader users who can't scan.
