# MarketTabs

Status: draft
Version: 0.9.0
Browser-like open-market tabs for trading workspaces: symbol, token icon, live price, optional change, close, and add.

## Usage

```tsx
import { MarketTabs } from "@/design-system";

<MarketTabs
  markets={[
    { symbol: "SOL-PERP", label: "SOL", price: "$184.26", changePct: 3.64 },
    { symbol: "BTC-PERP", label: "BTC", price: "$73,420", changePct: -0.42 },
  ]}
  activeSymbol="SOL-PERP"
  onActiveChange={setActiveSymbol}
  onClose={closeMarket}
  onAdd={openSearch}
/>
```

## Anatomy

```
+ SOL  $184.26  +3.64%  x + BTC  $73,420  -0.42%  x + [+]
  active tab gets a brand underline
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `markets` | `MarketTabItem[]` | -- | Each item has `symbol`, optional `label`, `price`, `changePct`, `iconSrc`, `disabled`. |
| `activeSymbol` | `string` | -- | Active tab key. |
| `onActiveChange` | `(symbol:string)=>void` | -- | Activates a market. |
| `onClose` | `(symbol:string)=>void` | -- | Renders close buttons when provided and more than one tab exists. |
| `onAdd` | `() => void` | -- | Renders the trailing add button. |
| `addDisabled` | `boolean` | `false` | Disables the add button, e.g. tab cap reached. |
| `addLabel` | `string` | `Add market` | Add button accessible label. |
| `aria-label` | `string` | `Open markets` | Names the tablist. |
| `className` | `string` | -- | cn-merged. |

## Tokens

- `--surface-page`, `--surface-container`, `--surface-container-high`
- `--outline-variant`, `--fg`, `--fg-subtle`, `--fg-muted`
- `--brand`, `--buy`, `--sell`
- `--radius-card`, `--motion-fast`

## States

default, active, hover, disabled market, close available, one-tab no-close, add enabled/disabled, horizontal overflow.

## Motion

Color and opacity transitions at 150ms. Active tab scrolls into view on market changes.

## A11y

- Markets render as a named `list`; each activator is a real button.
- The active market carries `aria-current="page"`.
- Close and add are separate buttons with explicit labels.
- Price and change remain text, not color-only; positive values include a plus sign.
- Disabled markets stay visible but are removed from interaction.
