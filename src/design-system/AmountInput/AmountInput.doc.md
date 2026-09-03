# AmountInput

Status: stable
Version: 1.1.0
Token amount entry: decimal string (never floats), symbol anchored, fiat echo + Max, the undocumented fiat/token pattern, componentized.

## Usage

```tsx
import { AmountInput } from "@/design-system";

<AmountInput value={amt} onValueChange={setAmt} symbol="SOL" fiatValue="≈ $231.40" onMax={fillMax} />
```

## Anatomy

```
+ 1.25          Max  SOL +  <- data-md input - Max - symbol
  ≈ $231.40                <- fiat echo (data-sm, subtle)
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `onValueChange` | `string` pair | - | Decimal STRING; sanitized to digits + one dot. Parse with mint decimals downstream. |
| `symbol` | `string` | - | Right-anchored token symbol. |
| `fiatValue` | `string` | - | Pre-formatted echo line (hidden when `errorMessage` is set). |
| `onMax` | `() => void` | - | Renders the Max affordance (≥40×40 hit). |
| `invalid` | `boolean` | `false` | aria-invalid + sell border. |
| `errorMessage` | `string` | - | Visible error; sets `aria-describedby` + `role="alert"`. |
| `maxDecimals` | `number` | - | Clamp fractional digits to the mint's decimals. |
| `disabled` | `boolean` | - | |
| `aria-label` | `string` | `"Amount in <symbol>"` | |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--surface-container` + `--outline(-variant)` - `--sell` invalid - `--brand` Max - `--radius-control` - data ramp

## States

rest - focus-within - invalid - disabled - with/without Max + fiat.

## Motion

Border transition 150ms.

## A11y

- `inputMode="decimal"` for the right mobile keyboard; sanitization never blocks paste (it filters).
- Labelled by default from the symbol; `aria-invalid` on error with `errorMessage` linked via `aria-describedby`.
- Max control is ≥40×40.
