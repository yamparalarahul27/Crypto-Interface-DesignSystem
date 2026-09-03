# Dialog

Status: stable
Version: 1.0.1
Centered modal: Sheet's desktop-centered sibling. Behavior is Radix Dialog; the title prop is required because a dialog must name itself.

## Usage

```tsx
import { Dialog, Button } from "@/design-system";

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Remove wallet?"
  description="This disconnects @mira from this device."
  footer={<>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={confirm}>Remove</Button>
  </>}
/>
```

## Anatomy

```
┈┈ overlay (black/50 + blur) ┈┈
   ┌ Title              × ┐
   │ description          │
   │ body                 │
   │          [btn] [btn] │ ← footer, right-aligned
   └───────────────────────┘  rounded-sheet, shadow-overlay
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `onOpenChange` | controlled pair | - | Caller owns state. |
| `title` | `string` | **required** | Radix Title → accessible name. |
| `description` | `string` | - | Radix Description → `aria-describedby`. |
| `children` | `ReactNode` | - | Body. |
| `footer` | `ReactNode` | - | Action row (destructive actions confirm here). |
| `className` | `string` | - | cn-merged onto the panel. |

## Tokens

- `--surface` panel · `--outline-variant` · `--radius-sheet` · `--elevation-3` via `shadow-overlay` · `--z-modal`

## States

closed · open (fade+zoom via Radix `data-[state]`) · dismissing (Escape / overlay click / ×).

## Motion

fade-in-0 + zoom-in-95 presets on open, reverse on close; reduced-motion collapses via the global reset.

## A11y

- Radix Dialog: focus trap, Escape, overlay dismiss, focus restore to the opener.
- Required `title` = accessible name; `description` wired to `aria-describedby` (suppressed cleanly when absent).
- Panel padding `p-6` (24px sheet recipe); close control `h-10 w-10` (≥40).
- Use for destructive confirmations (CLAUDE.md: destructive actions require an explicit step).
