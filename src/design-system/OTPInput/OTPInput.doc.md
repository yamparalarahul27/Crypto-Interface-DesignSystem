# OTPInput

Status: stable
Version: 1.0.0
One-time code cells for wallet connect / verify. Paste fills from any cell; width reserved on first paint. Interior otp-input contract, CSS-only.

## Usage

```tsx
import { OTPInput } from "@/design-system";

<OTPInput
  length={6}
  hint="Paste the whole code into any cell."
  error={rejected}
  errorMessage="That code is wrong."
  onComplete={(code) => verify(code)}
/>
```

## Anatomy

```
┌──┐ ┌──┐ ┌──┐   ┌──┐ ┌──┐ ┌──┐
│1 │ │2 │ │3 │ · │4 │ │5 │ │6 │  ← groupEvery gap
└──┘ └──┘ └──┘   └──┘ └──┘ └──┘
hint / error (shared reserved line)
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `length` | `number` | `6` | Cell count. |
| `mode` | `"numeric" \| "alphanumeric"` | `"numeric"` | Allowed chars + `inputMode`. |
| `defaultValue` | `string` | `""` | Seed, filtered + truncated. |
| `onChange` | `(value: string) => void` | - | Every accepted edit. |
| `onComplete` | `(value: string) => void` | - | When every cell is filled. |
| `error` | `boolean` | `false` | `aria-invalid` on cells. |
| `errorMessage` / `hint` | `string` | - | Shared status line (no jump). |
| `label` | `string` | `"Verification code"` | Group + per-cell names. |
| `groupEvery` | `number` | `3` | Visual gap every N cells. |
| `disabled` / `autoFocus` | `boolean` | `false` | - |
| `className` | `string` | - | cn-merged. |

## Tokens

- Input surface tokens · `--sell` error · `--outline` focus · `--radius-control` · mono tabular digits

## States

- empty · focused · filled · error · disabled

## Motion

- Border color 150ms. No `motion` package. Reduced-motion: global reset.

## A11y

- `role="group"` + per-cell labels; `one-time-code` autocomplete on first cell
- Arrow / Backspace navigation; paste supported
- Status via polite live region
