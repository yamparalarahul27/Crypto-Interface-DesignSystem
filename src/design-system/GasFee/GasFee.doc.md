# GasFee

Status: draft
Version: 0.9.1
Network-fee row: amount + optional congestion level, mono-safe.

## Usage

```tsx
import { GasFee } from "@/design-system";

<GasFee amount="0.000005 SOL" usd="≈ $0.0009" level="low" />
<GasFee amount="0.0021 SOL" usd="≈ $0.39" level="elevated" label="Priority fee" />
<GasFee loading label="Network fee" />
<GasFee error="Fee unavailable" />
```

Best for: directly above the confirm button in any transaction flow,
fees users discover *after* signing are the #1 web3 trust killer
(ethereum.org heuristic: show costs up front). No generic design
system ships this; it's pure crypto whitespace. Omit `level` on
flat-fee chains: a permanent "low" is noise. Use `loading` while the
quote refreshes; `error` when the fee endpoint fails.

## Anatomy

```
Network fee     0.000005 SOL ≈ $0.0009 LOW
└ label (muted)  └ amount     └ fiat    └ level word
                  (data ramp)   (subtle)  (tone ink)          
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `amount` | `string` | - | Preformatted native units ("0.000005 SOL"). Optional when `loading`/`error`. |
| `usd` | `string` | - | Fiat approximation ("≈ $0.0009"). |
| `level` | `"low" \| "normal" \| "elevated" \| "high"` | - | Congestion; omit for flat-fee chains. |
| `label` | `string` | `"Network fee"` | E.g. "Priority fee", "Bridge fee". |
| `loading` | `boolean` | `false` | Shows Fetching… (`aria-busy`); hides amount. |
| `error` | `string` | - | Replaces amount; `role="alert"`. |
| `className` | `string` | - | cn-merged. |

## Tokens

`--text-data-sm` (amount) · `--success` (low) · `--warning` (elevated) ·
`--error` (high) · `--fg-muted`/`--fg-subtle`

## States

- **Ready**: amount (+ optional usd/level).
- **Loading**: `Fetching…` with `aria-busy` while the quote refreshes.
- **Error**: message replaces amount (`role="alert"`).
- Levels pair ink with a **word** (never color alone; mono-safe). Severity
  maps to congestion pricing, not danger.

## Motion

None. Fee updates swap text in place: if fees refresh live, debounce
upstream; a flickering fee row reads as instability.

## A11y

Plain text row: label, amount, fiat, and level word are all readable
in order. The level word doubles as the non-color cue. Keep `amount`
preformatted with its unit so screen readers say "0.000005 SOL", not
a bare float.
