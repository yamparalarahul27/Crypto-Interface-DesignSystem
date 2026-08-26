# Drawer

Status: draft
Version: 0.9.0
Side sheet on Radix Dialog: slides from an edge; Sheet's desktop sibling.

## Usage

```tsx
import { Drawer, Button } from "@/design-system";

const [open, setOpen] = useState(false);

<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Order details"
  description="Filled 2m ago"
  footer={<Button variant="primary" size="sm">Done</Button>}
>
  {/* detail rows */}
</Drawer>
```

Best for: supporting tasks and detail views that shouldn't leave the
page: order details, filters, settings panels. Rule of thumb by
pointer: thumbs get Sheet (bottom), pointers get Drawer (edge),
decisions get Dialog (center). Content scrolls; header and footer pin.

## Anatomy

```
      ┌─────────────────┐
▒▒▒▒▒▒│ Title        [×]│ ← header pins
▒over-│ description     │
▒lay▒▒│ children        │ ← scrolls (flex-1)
▒▒▒▒▒▒│                 │
      │        [actions]│ ← footer pins (safe-area pb)
      └─────────────────┘
       ← w-[min(88vw,340px)], inset-y-0, side border
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `onOpenChange` | `boolean` / `(open) => void` | - | Controlled. |
| `title` | `string` | - | Required: a drawer must name itself. |
| `description` | `string` | - | Wired to `aria-describedby`. |
| `side` | `"right" \| "left"` | `"right"` | Edge it slides from. |
| `children` | `ReactNode` | - | Scrollable body. |
| `footer` | `ReactNode` | - | Pinned action row. |
| `className` | `string` | - | Merged onto the panel. |

## Tokens

`--surface` · `--outline-variant` · `--z-modal` · `--shadow-overlay`

## States

- **Closed**: nothing rendered.
- **Open**: overlay + panel; Escape, overlay click, or the × closes.
- No half-open state; that's Sheet's drag territory.

## Motion

Panel slides from its edge (`slide-in-from-right/left`, 150ms enter +
exit via the animate presets); overlay fades. Neutralized by
`prefers-reduced-motion`.

## A11y

Radix Dialog semantics: `role="dialog"`, `aria-modal`, focus trap,
focus restore to the trigger on close, required accessible name from
`title` (+ optional `description` via `aria-describedby`, wired with
an explicit id). The close button carries `aria-label="Close"`.
