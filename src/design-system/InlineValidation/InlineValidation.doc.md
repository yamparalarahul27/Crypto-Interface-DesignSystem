# InlineValidation

Status: stable
Version: 1.0.0
Labeled field with reserved-height hint ↔ error swap. Validates on blur / debounce. Interior inline-validation contract on CIDS Input.

## Usage

```tsx
import { InlineValidation } from "@/design-system";

<InlineValidation
  label="Recipient"
  value={addr}
  onChange={setAddr}
  validate={(v) => (v.length >= 32 ? null : "Enter a Solana address")}
  hint="Paste a wallet or mint address."
/>
```

## Anatomy

```
Label
┌──────────────────────────── ✓/! ┐
│ value                           │ ← Input + status icon
                                     (IconCheck / IconExclamation,
                                      cross-faded in one grid cell)
└─────────────────────────────────┘
hint ⟷ error   ← same grid cell, fixed height
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | - | Visible label (`htmlFor`). |
| `value` / `onChange` | controlled | - | Field owns no text. |
| `validate` | `(v: string) => string \| null` | - | Message or `null` if ok. |
| `hint` | `string` | - | Resting help; crossfades with error. |
| `debounce` | `number` | `400` | ms before invalid message updates. |
| `type` | input types | `"text"` | Native type. |
| `required` / `disabled` | `boolean` | `false` | - |
| `className` | `string` | - | cn-merged. |

## Tokens

- Input tokens · `--buy` valid icon · `--sell` invalid icon/message · `--fg-muted` hint

## States

- idle · pending (debounce) · valid · invalid · disabled

## Motion

- Opacity 150ms on hint/error/icons. No `motion`. Clearing invalid is immediate (no debounce).

## A11y

- Label linked; `aria-invalid` + `aria-describedby` for hint/error
- Error announced via polite live region
- Hit area follows Input md (36px)
