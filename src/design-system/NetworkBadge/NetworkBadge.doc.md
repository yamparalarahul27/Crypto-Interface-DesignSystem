# NetworkBadge

Status: stable
Version: 1.1.0
Chain indicator; always show the network (ethereum.org heuristic #3). Neutral by default; warning/error tones for wrong-network.

## Usage

```tsx
import { NetworkBadge } from "@/design-system";

<NetworkBadge name="Solana" iconSrc="https://cdn.defitriangle.xyz/logos/network/solana/32.png" />
<NetworkBadge name="Wrong network" tone="warning" />
<NetworkBadge name="Unsupported" tone="error" />
```

Best for: connected-chain readout in headers and tickets. Use
`tone="warning"` / `"error"` when the wallet chain does not match the
app's expected network — word + tint together (mono-safe).

## Anatomy

```
( o Solana )           <- neutral: container-high
( o Wrong network )    <- warning-surface + warning ink
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | - | Chain name (or mismatch copy). |
| `iconSrc` | `string` | - | e.g. Logobase `network/<slug>`; falls back to a dot. |
| `tone` | `"neutral" \| "warning" \| "error"` | `"neutral"` | Wrong-network / unsupported signals. |
| `className` | `string` | - | cn-merged. |

## Tokens

`--surface-container-high` · `--warning-surface` / `--warning` ·
`--error-surface` / `--error` · `--fg-muted` · `--radius-chip`

## States

neutral (default) · warning · error; with/without icon.

## Motion

None.

## A11y

Name is real text; icon is decorative (`alt=""`). Tone changes surface
+ ink together — never color alone.
