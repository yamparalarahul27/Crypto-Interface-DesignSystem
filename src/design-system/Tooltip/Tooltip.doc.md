# Tooltip

Status: stable
Version: 1.0.0
Input-adaptive help bubble: hover tooltip on pointer devices, bottom-sheet dialog on touch (where hover doesn't exist, so a plain tooltip would be unreachable).

## Usage

```tsx
import { Tooltip } from "@/design-system";

<Tooltip content="Jupiter's 0–100 organic-volume estimate." title="Organic score">
  <button type="button" aria-label="About organic score">ⓘ</button>
</Tooltip>
```

## Anatomy

```
pointer:                 touch:
   ┌ bubble ───────┐      ┌──── sheet ────────┐
   │ content       │      │ ▔▔ grabber        │
   └──▼ arrow──────┘      │ Title          ×  │
  [trigger]               │ content           │
                          └───────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `ReactNode` | - | The help content. |
| `children` | `ReactNode` | - | Trigger (rendered `asChild`: must accept a ref, e.g. a button). |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Bubble placement (pointer only). |
| `title` | `string` | `"Details"` | Sheet heading (touch only). |
| `className` | `string` | - | cn-merged onto the floating content. |

## Tokens

- `--surface-bright` (bubble) · `--surface-container` (sheet) · `--fg`
- `--radius-control` (bubble) · `--radius-sheet` (sheet top)
- `--elevation-2` via `shadow-raised` (bubble) · `--elevation-3` via `shadow-overlay` (sheet)
- `--z-toast` (bubble floats above everything) · `--z-modal` (sheet + backdrop)

## States

- Closed (default) · delayed-open on hover/focus (150ms) · open sheet on tap.
- Dismiss: pointer-out / Escape (tooltip); Escape, ×, outside-tap (sheet).

## Motion

- Fade in/out on the bubble; slide-from-bottom on the touch sheet (Radix
  `data-[state]` animations). Collapses under `prefers-reduced-motion`
  via the global reset.

## A11y

- Behavior is Radix Tooltip / Dialog: focus-visible triggers the bubble,
  Escape dismisses, the sheet traps focus and restores it on close.
- Touch adaptation is the a11y feature: hover-only affordances are never
  the sole path to content.
- Trigger must be focusable and labelled (the tooltip content is
  supplementary, not the accessible name).
