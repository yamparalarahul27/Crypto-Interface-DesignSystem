# TokenChip

Status: stable
Version: 1.0.0
Compact inline token reference: icon, symbol, live price, signed 24h change.

## Usage

```tsx
import { TokenChip } from "@/design-system";

<TokenChip
  symbol="JUP"
  iconSrc={logoUrl}
  price="$0.8123"        // preformatted by the caller
  change24h={4.2}        // SIGNED: drives arrow/prefix/color
/>
```

## Anatomy

```
┌ surface, r-4, border outline-variant, p-6×10 ┐
│ ○20  JUP   $0.8123   ▲ +4.2%                  │
│  │    │      │         └ signed 24h: color +   │
│  │    │      └ price, .data-sm                  │   arrow + prefix from SIGN,
│  │    └ symbol, mono 13/medium                  │   number from MAGNITUDE
│  └ TokenIcon sm (20px)                          │
└─────────────────────────────────────────────────┘
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `symbol` | `string` | - | Ticker; also the icon fallback initials. |
| `iconSrc` | `string?` | - | Token logo; falls back to initials disc. |
| `price` | `string` | - | Preformatted (e.g. `"$0.8123"`): formatting is the caller's job. |
| `change24h` | `number` | - | **Signed** percent. Positive/zero → `IconPriceUp` `+` buy; negative → `IconPriceDown` `−` sell. |
| `className` | `string` | - | Merged via `cn`. |

## Tokens

- `--color-surface`, `--color-outline-variant`: chip surface + hairline border.
- `--color-fg`: symbol + price text.
- `--color-buy` / `--color-sell`: 24h direction only (never identity hues for data).
- `.data-sm`: Geist Pixel Square number ramp.
- `--radius-chip` (`rounded-chip`): chip corner.

## States

- **Up / flat** (`change24h >= 0`): `IconPriceUp` + `+N%` in `text-buy`.
- **Down** (`change24h < 0`): `IconPriceDown` + `−N%` in `text-sell`.
- **No icon**: `TokenIcon` renders the initials disc.

## Motion

None. Prices update by value, not animation: terminal calm (DESIGN.md → Motion).

## A11y

- Direction is encoded by **arrow + sign + color**, not color alone, so it survives color-blindness and grayscale.
- Sign discipline (guideline #5): `up` is computed once from the signed value and drives icon/prefix/color together; the number uses `Math.abs`. No `Math.abs` leaks into the direction path, so a genuine −value can never render as `+`.
