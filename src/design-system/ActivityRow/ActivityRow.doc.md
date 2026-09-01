# ActivityRow

Status: stable
Version: 1.0.0
Tx / activity history row: icon · title · time · status · amount.

## Usage

```tsx
import { ActivityRow } from "@/design-system";

<ActivityRow
  title="Swapped SOL → USDC"
  time="2m ago"
  status="confirmed"
  amount="+12.40 USDC"
  tokenSymbol="USDC"
/>
<ActivityRow
  title="Send failed"
  time="1h ago"
  status="failed"
  amount="−0.50 SOL"
  tokenSymbol="SOL"
  onClick={() => openDetail()}
/>
```

Best for: wallet activity feeds, exchange order history, notification
lists. Compose many rows in a `DataTable`-free vertical stack: this
is the atom, not the list. Status uses word + tint (never color alone).
Amount is **preformatted** so sign/fiat discipline stays with the caller
(guideline #5).

## Anatomy

```
┌──────────────────────────────────────────────┐
│ [◎]  Swapped SOL → USDC          +12.40 USDC │
│      2m ago  CONFIRMED                       │
│ icon  title · time · status word      amount │
└──────────────────────────────────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | - | What happened. |
| `time` | `string` | - | Preformatted ("2m ago"). |
| `status` | `"pending" \| "confirmed" \| "failed"` | - | Word + tint. |
| `amount` | `string` | - | Preformatted with sign + unit. |
| `tokenSymbol` | `string` | - | Drives TokenIcon; omit → diamond placeholder. |
| `tokenIconSrc` | `string` | - | TokenIcon image. |
| `onClick` | `() => void` | - | When set, row renders as a `<button>`. |
| `className` | `string` | - | cn-merged. |

Server-safe (no `"use client"`) unless the caller needs handlers: the
component itself has no client-only APIs.

## Tokens

`--surface-bright` / `--surface-container-high` · `--fg` / `--fg-muted`
/ `--fg-subtle` · `--info` (pending) · `--buy` (confirmed) · `--sell`
(failed) · `--text-data-sm` (amount) · `--brand` (focus ring) ·
`--radius-control` · `duration-150`.

## States

- **pending / confirmed / failed**: status word + semantic ink.
- **static**: `<div>` when no `onClick`.
- **interactive**: `<button>` with hover lift + `active:scale-[0.98]`
  (card-grade press: the whole row is the target).

## Motion

Interactive only: `duration-150` background + press scale. Status and
amount updates swap text in place: data surfaces never bounce.

## A11y

Status is a visible word, not color alone. Interactive rows are real
`<button>`s with focus ring. Title truncates visually but remains in
the accessible name. Prefer pairing pending rows with a live-region
parent (or `TxStatus`) when the list itself streams.
