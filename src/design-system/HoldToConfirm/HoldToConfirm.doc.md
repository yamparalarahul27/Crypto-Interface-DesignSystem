# HoldToConfirm

Status: stable
Version: 1.0.0
Press-and-hold control for irreversible actions. Progress fills while held; early release cancels. Interior hold-to-confirm contract, CSS-only.

## Usage

```tsx
import { HoldToConfirm } from "@/design-system";

<HoldToConfirm
  duration={1400}
  confirmLabel="Disconnected"
  onConfirm={() => disconnectForever()}
>
  Hold to disconnect
</HoldToConfirm>
```

## Anatomy

```
┌──────────────────────────┐
│████░░░░  Hold to confirm │ ← sell fill sweeps L→R while held
└──────────────────────────┘
  release early → drains · full hold → onConfirm once
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onConfirm` | `() => void` | - | Fires once at full duration. Click never reaches it. |
| `children` | `ReactNode` | - | Resting label / accessible name. |
| `onAbort` | `() => void` | - | Early release / stray click. |
| `confirmLabel` | `string` | `"Confirmed"` | Post-commit face + live region. |
| `duration` | `number` | `1800` | ms of continuous hold. |
| `resetAfter` | `number` | `1600` | ms to hold confirmed before idle. `0` = stay. |
| `releaseRate` | `number` | `2.5` | Drain speed vs fill. |
| `disabled` | `boolean` | `false` | `aria-disabled` (keeps focus). |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--sell-strong` fill · `--surface-container` / `--outline-variant` / `--fg` resting surface · `--radius-control`

## States

- idle · holding (fill progress) · releasing (drain) · committed · disabled

## Motion

- Fill width via rAF + CSS `transition-[width]` 75ms; label opacity 150ms. Reduced-motion: global reset. No `motion` package.

## A11y

- Native button; Space/Enter hold; Escape cancels; blur/visibility abort
- Hint via `aria-describedby`; polite live region on commit
- Move past tolerance cancels the hold
