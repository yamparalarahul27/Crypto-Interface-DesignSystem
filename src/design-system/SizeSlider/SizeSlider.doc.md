# SizeSlider

Status: draft
Version: 0.9.0
Percent-of-balance slider for trading forms, with major stops, sub-ticks, keyboard support, and a fixed value readout.

## Usage

```tsx
import { SizeSlider } from "@/design-system";

<SizeSlider value={sizePct} onValueChange={setSizePct} />
```

## Anatomy

```
0%       25%       50%       75%       100%
|---.---.---|---.---.---|---.---.---|---.---.---|
===============o                                      [ 38% ]
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | -- | 0-100; rounded and clamped. |
| `onValueChange` | `(value:number)=>void` | -- | Fires on drag, click, keyboard, or stop-label click. |
| `stops` | `readonly number[]` | `[0,25,50,75,100]` | Major labelled stops. |
| `label` | `string` | `Size as percent of balance` | Slider accessible name. |
| `disabled` | `boolean` | `false` | Removes tab stop and dims the control. |
| `showSubTicks` | `boolean` | `true` | Three sub-ticks per stop interval. |
| `className` | `string` | -- | cn-merged. |

## Tokens

- `--surface-container`, `--surface-bright`, `--outline-variant`
- `--fg`, `--fg-subtle`, `--brand`
- `--radius-control`, `--motion-fast`

## States

default, dragging, keyboard focus, disabled, stop active, sub-ticks on/off.

## Motion

Track fill and thumb position transition at 150ms when not dragging. Dragging writes directly so the thumb stays under the pointer.

## A11y

- Thumb uses `role="slider"` with `aria-valuenow` and `aria-valuetext`.
- Arrow keys nudge by 1; Shift+Arrow nudges by 5; Home/End jump to 0/100.
- Stop labels are buttons for direct jumps.
- Disabled removes the thumb from tab order and marks it `aria-disabled`.
