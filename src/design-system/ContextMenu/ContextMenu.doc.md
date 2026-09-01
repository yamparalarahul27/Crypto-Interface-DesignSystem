# ContextMenu

Status: stable
Version: 1.0.0
Right-click / long-press menu: Menu's context sibling on Radix ContextMenu.

## Usage

```tsx
import { ContextMenu } from "@/design-system";

<ContextMenu
  items={[
    { label: "Copy address", onSelect: copy },
    { label: "View on explorer", onSelect: open },
    { kind: "separator" },
    { label: "Remove", onSelect: remove, destructive: true },
  ]}
>
  <div className="rounded-card border p-4">Right-click this row</div>
</ContextMenu>
```

Best for: row/card actions that shouldn't compete with a visible ⋯
trigger (order book rows, watchlist lines, activity items). Prefer
`Menu` when the affordance must be visible and keyboard-first on
mobile: context menus are pointer/long-press native.

## Anatomy

```
┌ wrapped surface ─────────────┐
│  (right-click / long-press)  │
└──────────────┬───────────────┘
               ▼ at pointer
        ┌ Copy address   ┐
        │ View explorer  │
        │ ────────────── │
        │ Remove         │ ← destructive: sell ink
        └────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | **required** | Trigger surface; rendered `asChild`: pass one element. |
| `items` | `MenuItem[]` | **required** | Same shape as `Menu` (`label`/`onSelect`/`destructive?`/`disabled?` or `separator`). |
| `className` | `string` | - | cn-merged onto the panel. |

`"use client"`: Radix ContextMenu.

## Tokens

`--surface-bright` panel · `--surface-container-high` highlight ·
`--outline-variant` · `--sell` (destructive) · `--radius-chip` /
`--radius-control` · `--elevation-2` via `shadow-raised` · `--z-raised`

## States

closed · open (at pointer) · item highlighted · item disabled ·
destructive item.

## Motion

Panel: `data-[state=open]:fade-in` via Radix presets. Item highlight
is instant (keyboard/pointer tracking).

## A11y

Radix ContextMenu: arrow keys, typeahead, Escape, outside dismiss,
focus return. Destructive items use sell ink **and** the word (never
color alone). On touch, Radix maps long-press; still offer a visible
`Menu` on dense mobile UIs where long-press isn't discoverable.
