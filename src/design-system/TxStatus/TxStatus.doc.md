# TxStatus

Status: stable
Version: 1.1.0
The transaction lifecycle, always visible (heuristic #1): the component no reference library ships.

## Usage

```tsx
import { TxStatus } from "@/design-system";

<TxStatus state="pending" detail="5D3k...Wq" detailHref="https://solscan.io/tx/…" />
<TxStatus state="failed" detail="User rejected" action={<Button size="sm">Retry</Button>} />
```

## Anatomy

```
o  Waiting for wallet...   signing: warning pulse
o  Pending confirmation... pending: info pulse + optional detail link
✓  Confirmed               buy   |  ✕ Failed  sell  [Retry]
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `state` | `"idle" \| "signing" \| "pending" \| "confirmed" \| "failed"` | - | The lifecycle. |
| `detail` | `string` | - | Mono line under the label (signature, error hint). |
| `detailHref` | `string` | - | When set, `detail` is an explorer link (`noopener`). |
| `action` | `ReactNode` | - | Right-side affordance (typically Retry on failed). |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--warning` (signing) - `--info` (pending) - `--buy`/`--sell` (terminal states) - `--fg-subtle` dot at idle

## States

idle - signing - pending - confirmed - failed. Copy per state is the component contract.

## Motion

Pulse on the in-flight dot only (status indicator, not data; collapses under reduced-motion). Terminal states are still.

## A11y

- `role="status"` + `aria-live="polite"`: transitions are announced without stealing focus, the user acts in the wallet while the UI reports (heuristic #2).
- Terminal states carry an icon (`IconCheck` / `IconCross`) + words, never color alone.
  The icons are `aria-hidden`, so the live region announces just the word.
