# LoadingButton

Status: stable
Version: 1.1.0
Async action button: width-stable idle → pending → success|error → idle. Interior loading-button contract, CIDS tokens, no `motion`.

## Usage

```tsx
import { LoadingButton } from "@/design-system";

<LoadingButton
  onAction={async () => {
    const res = await fetch("/api/orders", { method: "POST" });
    if (!res.ok) throw new Error("failed");
  }}
  pendingLabel="Signing…"
  successLabel="Signed"
  errorLabel="Retry"
>
  Sign transaction
</LoadingButton>
```

## Anatomy

```
┌─────────────────────────────┐
│ [spinner|✓|!]  Label        │ ← faces stacked in one grid cell
                                 (IconSpinner spun by `animate-spin`,
                                  IconCheck, IconExclamation)
└─────────────────────────────┘
  idle → pending → success|error → idle (resetAfter)
  width = max(face): no layout jump
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onAction` | `() => unknown` | - | Sync throw / rejected promise → error; else success. |
| `children` | `string` | - | Idle label (also the accessible name base). |
| `pendingLabel` | `string` | `children` | In-flight label. |
| `successLabel` | `string` | `"Done"` | Settled-ok label + check. |
| `errorLabel` | `string` | `"Try again"` | Settled-fail label + alert: next action, not diagnosis. |
| `resetAfter` | `number` | `1400` | ms to hold success/error before idle. |
| `disabled` | `boolean` | `false` | Genuinely unavailable (native `disabled`). Busy ≠ disabled. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type for forms. |
| `onError` | `(error: unknown) => void` | - | Caller reports the error; button only shows state. |
| `variant` | ButtonVariant | `"primary"` | Same surface map as Button. |
| `size` | ButtonSize | `"md"` | Shared height scale. |
| `className` | `string` | - | cn-merged. |

## Tokens

- Button surfaces via shared `BUTTON_VARIANT` / `BUTTON_SIZE` (`--brand` / `--on-brand` / `--sell` / surfaces / `--radius-control`)
- `--motion-fast` timing via 150ms targeted opacity / press transitions
- Icons use `currentColor` (theme-safe; no hardcoded hues)

## States

- **idle**: idle label; clickable
- **pending**: spinner + `pendingLabel`; `aria-busy`; clicks ignored (not native-disabled: focus stays)
- **success**: check + `successLabel`; auto-resets
- **error**: alert + `errorLabel`; click runs again (Retry)
- **disabled**: native attribute, 40% opacity

## Motion

- Label faces: `transition-opacity` 150ms (stacked grid, zero width jump)
- Press: `active:scale-[0.96]` when idle/settled (suppressed while pending)
- Spinner: `animate-spin` (global `prefers-reduced-motion` collapses the loop)
- No `motion` package: portable core

## A11y

- Native `<button type={type}>` (default `button`); `aria-label` tracks the visible face
- `aria-busy` while pending; `aria-disabled` while pending (not native disabled)
- Polite live region announces success / error labels
- Hit area follows Button size (md 36 · lg 44)
