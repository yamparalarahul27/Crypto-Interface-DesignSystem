# TokenSelect

Status: draft
Version: 0.9.0
Searchable token picker — icon + symbol trigger, Dialog list with balances.

## Usage

```tsx
import { TokenSelect } from "@/design-system";

const tokens = [
  { id: "sol", symbol: "SOL", name: "Solana", balance: "12.40" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "1,204.00" },
  { id: "jup", symbol: "JUP", name: "Jupiter", balance: "840.2" },
];

<TokenSelect tokens={tokens} value={token} onValueChange={setToken} />
```

Best for: swap "from/to" rows, send-asset pickers, trade tickets — any
surface where the user chooses one token from a known list. Prefer
Combobox for non-token searchable lists; Prefer Select when the list
is ≤5 and doesn't need icons/balances.

## Anatomy

```
┌ trigger ──────────────────┐
│ [◎] SOL                ▾  │  ← TokenIcon + symbol (or placeholder)
└───────────────────────────┘
         │ opens Dialog
         ▼
┌ Select token ────────── × ┐
│ [ Search tokens…        ] │
├───────────────────────────┤
│ [◎] SOL                   │
│     Solana         12.40  │  ← icon · symbol/name · balance
│ [◎] USDC                  │
│     USD Coin    1,204.00  │
└───────────────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tokens` | `TokenOption[]` | — | `{ id, symbol, name, iconSrc?, balance?, disabled? }`. |
| `value` | `string \| undefined` | — | Selected token `id`; undefined = none chosen. |
| `onValueChange` | `(id: string) => void` | — | Fires on pick; closes the Dialog. |
| `placeholder` | `string` | `"Select token"` | Trigger text when nothing selected. |
| `emptyText` | `string` | `"No tokens found"` | Shown when search matches nothing. |
| `disabled` | `boolean` | — | Disables the trigger. |
| `className` | `string` | — | cn-merged onto the trigger. |
| `aria-label` | `string` | `"Select token"` | Accessible name; appends selected symbol when set. |

`"use client"` — owns ephemeral open/query/active state; domain value
is controlled by the caller.

## Tokens

`--surface-container` / `-high` (trigger + rows) · `--outline-variant`
(borders) · `--fg` / `--fg-muted` / `--fg-subtle` · `--brand` (focus
ring) · `--text-data-sm` (balance) · `--radius-control` / `--radius-chip`
· `--motion` via `duration-150` on trigger transitions.

## States

- **empty** — trigger shows placeholder muted text.
- **selected** — TokenIcon + mono symbol on the trigger.
- **open** — Dialog with search focused; list filters live.
- **active row** — `data-active` highlight follows mouse/arrows.
- **disabled token** — row opacity 40; not selectable.
- **disabled control** — trigger opacity 40; no open.
- **no matches** — `emptyText` in the listbox.

## Motion

Trigger: `transition-[background-color,border-color,transform]
duration-150` + `active:scale-[0.96]` (control press). Dialog enter/
exit via Radix `data-[state]` presets. List highlight is instant
(keyboard/mouse tracking — never animate data surfaces).

## A11y

Trigger: `aria-haspopup="dialog"`, `aria-expanded`, label includes the
selected symbol when set. Dialog: Radix focus trap + Escape + overlay
dismiss. Search: ArrowUp/Down/Home/End move `aria-activedescendant`
through the listbox; Enter selects. Options expose `aria-selected` /
`aria-disabled`. Hit area: trigger h-9 (≥36) · rows py-2.
