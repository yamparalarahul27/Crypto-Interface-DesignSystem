# MarginHealth

Status: stable
Version: 1.0.0
Margin-ratio meter for trading accounts, with tiered risk labels and semantic buy/warning/sell/error tones.

## Usage

```tsx
import { MarginHealth } from "@/design-system";

<MarginHealth value={37.42} />
```

## Anatomy

```
Margin ratio  [==========..............]  Healthy  37.42%
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | - | Percent, clamped to 0-100. |
| `label` | `string` | `Margin ratio` | Visible label and meter name. |
| `precision` | `number` | `2` | Percent decimals. |
| `className` | `string` | - | cn-merged. |

Thresholds are fixed: `<50 healthy`, `50-79.99 caution`, `80-89.99 high`, `>=90 critical`.

## Tokens

- `--surface-container`, `--surface-bright`
- `--outline-variant`, `--fg-subtle`
- `--buy`, `--warning`, `--sell`, `--error`
- `--radius-card`, `--motion-fast`

## States

healthy, caution, high, critical, zero, clamped overflow.

## Motion

Bar width transitions over 300ms. The label and value change immediately so risk is never hidden behind animation.

## A11y

- Uses `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and tiered `aria-valuetext`.
- Risk is not color-only: tier text and exact percent are visible.
- The meter is read-only and has no keyboard interaction.
