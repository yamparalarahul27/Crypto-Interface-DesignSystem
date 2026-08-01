# SlippageControl

Status: draft
Version: 0.9.0
Slippage tolerance — presets + custom %, with risk tone bands.

## Usage

```tsx
import { SlippageControl } from "@/design-system";

<SlippageControl value={50} onValueChange={setBps} />
{/* 50 bps = 0.5% */}
```

Best for: directly above the confirm button in swap/trade flows,
next to `GasFee`. Value is **basis points** (50 = 0.5%) so callers
never float-multiply; the UI shows percent. Prefer keeping Auto/smart
routing upstream — this component is the explicit user override.

## Anatomy

```
Slippage                         0.5% LOW
└ label                          └ value + level word (tone ink)

[ 0.1% ] [ 0.5% ] [ 1% ] [ Custom ] [ 0.5 % ]
  └ presets (aria-pressed)          └ custom input when active
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | — | Tolerance in **bps** (50 = 0.5%). |
| `onValueChange` | `(bps: number) => void` | — | Controlled. |
| `presets` | `number[]` | `[10, 50, 100]` | Preset chips in bps. |
| `maxBps` | `number` | `5000` | Cap for custom input (50%). |
| `label` | `string` | `"Slippage"` | Row label. |
| `disabled` | `boolean` | — | Disables chips + input. |
| `className` | `string` | — | cn-merged onto the root. |

`"use client"` — owns ephemeral custom-mode + draft string; domain
value is controlled.

Also exports `slippageLevel(bps)` and `DEFAULT_SLIPPAGE_PRESETS`.

## Tokens

`--brand` / `--on-brand` (active chip) · `--surface-container` /
`-high` · `--outline-variant` · `--success` / `--warning` / `--error`
(level words) · `--fg` / `--fg-muted` / `--fg-subtle` · `--text-data-sm`
· `--radius-control` · `duration-150` transitions.

## States

- **preset selected** — matching chip `aria-pressed` + brand fill.
- **custom** — Custom chip pressed; percent input visible.
- **level** — low (≤50bps) · normal (≤100) · elevated (≤200) · high (>200);
  word + tint together (mono-safe).
- **disabled** — opacity 40 on chips/input.

## Motion

Chip press: `active:scale-[0.96]` + `duration-150` color/bg. Level
word swaps instantly with the value — never animate risk readouts.

## A11y

`role="group"` labelled by the row label. Preset/Custom chips use
`aria-pressed`. Custom field has its own `aria-label`. Level word
doubles as the non-color risk cue. Hit area: chips h-8 (≥32; pair
with surrounding row padding for comfortable tap).
