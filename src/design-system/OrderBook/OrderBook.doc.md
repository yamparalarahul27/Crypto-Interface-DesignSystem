# OrderBook

Status: draft
Version: 0.9.0
Bid/ask depth table for trading terminals: tick aggregation, side view modes, cumulative depth, and stale-feed states.

## Usage

```tsx
import { OrderBook } from "@/design-system";

<OrderBook
  asks={asks}
  bids={bids}
  midPrice={184.26}
  baseLabel="SOL"
  quoteLabel="USDT"
  onPriceSelect={(price) => setLimitPrice(String(price))}
/>
```

## Anatomy

```
+ Order book                    Stale 7s
+ [both] [asks] [bids]             [0.01 v]
+ Price (USDT)        Size (SOL)   Depth
+ 184.38              102.4        ----     ask rows, sell text + depth fill
+ 184.31               88.1        ---
+ Mid 184.26
+ 184.22              120.9        -----    bid rows, buy text + depth fill
+ 184.18               72.5        --
+ B 48.30%  =========  51.70% S
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `asks` / `bids` | `OrderBookLevel[]` | - | Raw levels. Asks sort low to high; bids sort high to low after aggregation. |
| `midPrice` | `number \| null` | derived from best ask/bid | Center row. |
| `valueFormat` / `sizeFormat` | `(value:number)=>string` | built-in formatters | Caller owns exchange-specific decimals. |
| `quoteLabel` / `baseLabel` | `string` | `USDT` / `BASE` | Header units. |
| `view` / `defaultView` / `onViewChange` | `OrderBookView` | `mixed` | Controlled or uncontrolled asks/mixed/bids view. |
| `tick` / `defaultTick` / `tickOptions` / `onTickChange` | `number` | `defaultTickOptions(mid)` | Controlled or uncontrolled tick aggregation. |
| `showCumulativeBars` | `boolean` | `true` | Adds right-side cumulative depth bars. |
| `loading` | `boolean` | `false` | Skeleton rows. |
| `error` | `string \| null` | - | Inline error state. |
| `stale` | `{ level; secondsSinceUpdate? }` | - | `mild` shows a small pill; `severe`/`frozen` blur rows and show updating overlay. |
| `onReconnect` | `() => void` | - | Adds retry/reconnect action in error/frozen states. |
| `onPriceSelect` | `(price, side) => void` | - | When provided, rows become buttons that fill a price input. |
| `rowsPerSide` | `number` | `8` | Mixed view rows per side; one-side views render at least 16. |
| `aria-label` | `string` | `Order book` | Names the region. |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--surface-container`, `--surface-container-high`, `--surface-bright`
- `--outline-variant`, `--fg`, `--fg-muted`, `--fg-subtle`
- `--buy`, `--sell`, `--info`
- `--row-h`, `--cell-px`, `--radius-card`, `--radius-control`
- `--z-raised`, `--motion-fast`

## States

default, loading skeleton, empty, error with retry, mild stale, severe stale, frozen stale with reconnect, asks-only, bids-only, mixed, cumulative bars on/off, selectable rows on/off.

## Motion

Filter/opacity transition for stale masking, row hover color transition, ratio/depth width updates. Motion is decorative; the book remains readable without it.

## A11y

- Region is named with `aria-label`; loading sets `aria-busy`.
- View controls are real buttons in a `tablist`; tick size uses a native `select`.
- Rows are plain text unless `onPriceSelect` is provided; then they become labelled buttons.
- Loading, empty, and error states are explicit. The reconnect action is inline, not toast-only.
