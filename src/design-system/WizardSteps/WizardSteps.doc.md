# WizardSteps

Status: stable
Version: 1.0.0
Multi-step flow rail + fixed-height panel for send / onboarding. Visited steps jumpable; Next/Finish width-stable. Interior wizard-steps contract, CSS-only.

## Usage

```tsx
import { WizardSteps } from "@/design-system";

<WizardSteps
  steps={[
    { id: "amount", label: "Amount", content: <AmountInput … /> },
    { id: "review", label: "Review", content: <p>…</p> },
  ]}
  finishLabel="Send"
  onComplete={submit}
/>
```

## Anatomy

```
Step label
(1): (2): (3)     ← rail; past = check, future inert
┌─────────────────────┐
│ panel (fixed height)│
└─────────────────────┘
[Back]        [Next|Finish]
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `steps` | `{ id, label, content }[]` | - | Stable `id` keys the panel. |
| `index` / `defaultIndex` | `number` | uncontrolled `0` | Controlled or default. |
| `onIndexChange` | `(i, dir) => void` | - | `dir` is `1 \| -1`. |
| `onComplete` | `() => void` | - | Primary on last step. |
| `height` | `number` | `184` | Panel viewport px. |
| `backLabel` / `nextLabel` / `finishLabel` | `string` | Back / Next / Finish | Finish shares grid with Next. |
| `label` | `string` | `"Steps"` | Rail list name. |
| `className` | `string` | - | cn-merged. |

## Tokens

- `--brand` / `--on-brand` done tiles + connector · surfaces for panel · Button primary/secondary for nav

## States

- current · visited (jumpable) · future (inert) · first (no Back) · last (Finish)

## Motion

- Tile scale / connector `scaleX` / label opacity 150ms. No `motion` package.

## A11y

- Live region announces step position; rail uses `aria-current="step"`
- Arrow keys on focused step button; only up to `furthest` navigable
- Panel `role="group"` labeled with position
