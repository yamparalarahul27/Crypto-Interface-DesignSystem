# OrderTypeTabs

Status: draft
Version: 0.9.0
Scrollable order-type selector for trading forms: market, limit, and advanced order modes in one compact strip.

## Usage

```tsx
import { OrderTypeTabs, type OrderType } from "@/design-system";

const [type, setType] = useState<OrderType>("limit");

<OrderTypeTabs value={type} onValueChange={setType} />
```

## Anatomy

```
+ Limit + + Market + + Stop-Market * + + Stop-Limit * + + Iceberg * + ...
  active: raised surface + fg text
  advanced: brand dot
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `OrderType` | -- | Controlled active order type. |
| `onValueChange` | `(value: OrderType) => void` | -- | Fires on click or keyboard selection. |
| `options` | `OrderTypeOption[]` | `DEFAULT_ORDER_TYPE_OPTIONS` | Use to hide/disable unsupported engine types. |
| `aria-label` | `string` | `Order type` | Names the tablist. |
| `className` | `string` | -- | cn-merged. |

`OrderTypeOption` has `value`, `label`, optional `description`, `group`, `disabled`, and `icon`.

## Tokens

- `--surface-container`, `--surface-container-high`, `--surface-page`
- `--outline-variant`, `--fg`, `--fg-muted`, `--brand`
- `--radius-control`, `--motion-fast`

## States

default, active, hover, pressed, disabled, scroll overflow, keyboard roving focus.

## Motion

Targeted color/border/transform transition at 150ms. Active press scales to 0.98 and is removed for disabled buttons.

## A11y

- Uses real buttons with `role="tab"` inside a `tablist`.
- Only the active tab is tabbable; ArrowLeft/ArrowRight/Home/End change selection.
- Descriptions are exposed through `aria-describedby`.
- Disabled order types remain visible and non-interactive.
