# AccountMenu

Status: stable
Version: 1.0.1
Connected-wallet menu: address, copy, explorer, disconnect.

## Usage

```tsx
import { AccountMenu, WalletButton } from "@/design-system";

{status === "connected" ? (
  <AccountMenu
    address={address}
    balance="12.4 SOL"
    explorerHref={`https://solscan.io/account/${address}`}
    onDisconnect={disconnect}
  />
) : (
  <WalletButton status={status} onClick={connect} />
)}
```

Best for: the connected state that `WalletButton` opens into.
**Disconnect lives here, never on WalletButton**: accidental
disconnects are hostile (Reown/ethereum.org guidance).

## Anatomy

```
┌ trigger ─────────────────────┐
│ [A] 7xKt…9fQ2  ●             │  ← Avatar · truncated · online dot
└──────────────┬───────────────┘
               ▼ DropdownMenu
┌──────────────────────────────┐
│ 7xKtF2mP…full address…       │
│ 12.4 SOL                     │
├──────────────────────────────┤
│ Copy address                 │
│ View on explorer             │
├──────────────────────────────┤
│ Disconnect          (sell)   │
└──────────────────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `address` | `string` | - | Full wallet address (accessible name + copy target). |
| `balance` | `string` | - | Preformatted balance line. |
| `explorerHref` | `string` | - | Opens in a new tab when present. |
| `onDisconnect` | `() => void` | - | Renders the Disconnect item when set. |
| `disabled` | `boolean` | - | Disables the trigger. |
| `className` | `string` | - | cn-merged onto the trigger. |

`"use client"`: Radix menu + ephemeral copied label.

## Tokens

`--surface-container` / `-high` / `--surface-bright` · `--outline-variant`
· `--fg` / `--fg-muted` · `--buy` (online dot) · `--sell` (Disconnect) ·
`--brand` (focus ring) · `--z-raised` · `--elevation` via `shadow-raised`
· `--radius-control` / `--radius-chip` · identity Avatar (`--id-tide`
via `you`).

## States

- **default / hover / press**: trigger bg + `active:scale-[0.96]`.
- **open**: Radix panel; highlight follows keyboard/pointer.
- **copied**: "Copy address" label flips to "Copied" for ~1.5s
  (menu kept open via `preventDefault` on select).
- **copy failed**: label "Copy failed" + sell ink when clipboard rejects.
- **disabled**: trigger opacity 40.

## Motion

Trigger: `duration-150` bg/border + press scale. Panel:
`data-[state=open]:fade-in` via Radix presets. Copy confirmation is a
label swap: no bounce.

## A11y

Trigger `aria-label` includes the **full** address (truncation is
visual only). Radix DropdownMenu: typeahead, arrows, Escape, focus
return. Disconnect uses sell ink + the word "Disconnect" (never color
alone). Online dot is `aria-hidden`.
