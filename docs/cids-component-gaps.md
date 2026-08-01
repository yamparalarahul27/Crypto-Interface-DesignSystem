# CIDS — Component gap tracker

> Created 2026-07-15. The roadmap's original inventory (Tiers 1–3 +
> crypto whitespace) shipped in full by M4 — this file tracks the
> **next ring**: what reference systems (Material ~36, shadcn ~79,
> Carbon ~67, Coinbase CDS ~141) have that CIDS still lacks, so gaps
> stay recorded instead of rediscovered per session.
>
> Rules: one PR per batch; every component follows
> [cids-contributing.md](./cids-contributing.md) (7-section doc, tests,
> axe case, polish coverage, canvas demo, registry regen). New
> components enter as `draft @ 0.9.0` and are promoted per the
> CONVENTIONS.md ladder.

## Batch 1 — containment & forms (PR in flight)

The "every generic system has this" tier. All Radix-backed or trivial.

- [x] **Accordion** — collapsible sections (single/multiple)
- [x] **Card** — the generic container primitive (canonicalizes the
      hand-rolled `rounded-card border bg-surface-container` recipe)
- [x] **Alert** — inline callout on the tinted state surfaces
      (info/success/warning/error); Toast = events, Alert = conditions
- [x] **RadioGroup** — visible one-of-N (≤5 options; more → Select)
- [x] **Textarea** — Input's multi-line sibling, same grammar
- [x] **Progress** — determinate bar + indeterminate shimmer

## Batch 2 — navigation & overlays (PR in flight)

Every template/demo hand-rolls its header and bottom bar today —
repeated composition begging to be components.

- [x] **AppBar** — page header (title · actions · optional back)
- [x] **BottomNav** — mobile tab bar (the feed demo hand-rolls one)
- [x] **Combobox** — typeahead search-select; pick-from-list only
      (decision 2026-07-15). Hand-rolled ARIA 1.2 on Radix Popover —
      no cmdk (would break the portability import allowlist)
- [x] **Popover** — public primitive (Radix Popover was already used
      inside ReactionBar but wasn't exported)
- [x] **Drawer** — side sheet, right/left (Sheet stays bottom-only)
- [x] **Breadcrumbs** — path navigation for docs/console surfaces
- [x] **Pagination** — page controls for long tables
- [ ] ContextMenu — right-click menu (Radix; low urgency)

## Batch 3 — crypto vertical, round 2 (PR in flight)

Same argument as Phase 5b: the whitespace no generic system covers.

- [x] **WalletButton** — connect → connecting → connected account pill
      (Reown's atom; templates hand-rolled it from Button + AddressChip).
      Presentational; disconnect lives in the account UI, never on the button
- [x] **ChainSwitcher** — active network + switch menu (NetworkBadge
      stays display-only). Radix DropdownMenu radio semantics
- [x] **GasFee** — fee/priority display with congestion severity (no
      reference system ships this; pure whitespace). Word + tint, mono-safe
- [x] **Amount** — read-only formatted token amount (AmountInput's
      display sibling: magnitude-aware decimals, dust handling, sign discipline)
- [x] **PriceChart** — interactive price chart (CDS's signature). Decision
      2026-07-15: **use EvilCharts directly** rather than reimplement in
      portable SVG. Consequence — it lives in `src/components/PriceChart/`,
      NOT `src/design-system/` (it pulls recharts via the vendored
      `EvilLineChart`, so it can't pass `check:portable` and isn't in the
      registry). Composes EvilLineChart (line · crosshair · tooltip) +
      CIDS Lane (range switch) + PriceChange (header). Credited to
      [legions-developer/evilcharts](https://github.com/legions-developer/evilcharts).
- [ ] QRCode — receive-address display (needs a dependency decision)
- [ ] SeedPhrase — reveal/confirm grid (only if onboarding flows land)

## Batch 4 — trading interface imports from DeFi-Triangle-Learn

The private DeFi-Triangle-Learn repo has a richer paper-trading terminal.
This batch extracts the pieces that are reusable as CIDS primitives
without carrying over product state, Zustand stores, Supabase, or chart
engines.

- [x] **OrderBook** — bid/ask depth table with tick aggregation,
      asks/mixed/bids views, cumulative bars, row price-pick callbacks,
      and explicit loading/empty/error/stale states.
- [x] **OrderTypeTabs** — swipeable order-type strip for Market,
      Limit, Stop-Market, Stop-Limit, Iceberg, TWAP, OCO, and
      Trailing-Stop; unsupported types can stay visible-disabled.
- [x] **SizeSlider** — percent-of-balance slider with 0/25/50/75/100
      stops, sub-ticks, keyboard support, and fixed value readout.
- [x] **MarketTabs** — browser-like open-market tabs with token icon,
      symbol, live price, signed change, close, and add affordance.
- [x] **MarginHealth** — margin-ratio meter with Healthy/Caution/High/
      Critical tiers, semantic tones, and `role="meter"`.

> **Note — the portable core vs. compositions.** PriceChart is the first
> intentional resident of a second tier: *compositions* that build on
> non-portable deps (here, recharts via vendored EvilCharts). They're real
> and shown on the canvas, but they're not copy-in registry primitives and
> don't carry the `check:portable` guarantee. Keep them under
> `src/components/`, credit upstream, and never let them import back into
> the design-system barrel.

## Batch 5 — crypto vertical, round 3

The DeFi ticket atoms still missing after rounds 2–4. Swap/send/trade
UIs hand-roll these every time; shipping them closes the gap to
Uniswap/Jupiter/CDS ticket completeness.

- [x] **TokenSelect** — searchable token picker (icon + symbol trigger,
      Dialog list with optional balances). Combobox stays for generic
      lists; this is the crypto-shaped sibling.
- [ ] **SlippageControl** — tolerance presets + custom bps (≤0.5 /
      ≤1.0 / custom); tone bands for risk; lives above confirm.
- [ ] **AccountMenu** — WalletButton's connected sibling: address,
      copy, explorer link, disconnect (never on the connect button).
- [ ] **ActivityRow** — tx history atom (icon · title · time · status
      · amount); composes TxStatus + Amount + AddressChip patterns.
- [ ] ContextMenu — finish Batch 2 deferred (Radix; low urgency)
- [ ] QRCode — receive-address display (needs a dependency decision)
- [ ] SeedPhrase — reveal/confirm grid (only if onboarding flows land)

## Deliberate non-goals (recorded, not forgotten)

- **FAB / SplitButton** — no surface in the crypto vertical wants them.
- **DatePicker / Calendar** — heavy; defer until a real consumer asks.
- **Virtualized lists** — recipe documented (DataTable ↔ TanStack
  pairing) instead of a component.
- **RTL / i18n** — boundary documented in CONVENTIONS.md.

## History

| Date | Change |
|---|---|
| 2026-07-15 | File created; Batch 1 shipped as `feat/components-batch-1` (PR #97, merged). |
| 2026-07-15 | Batch 2 shipped as `feat/components-batch-2` (PR #98, merged; ContextMenu deferred). |
| 2026-07-15 | Batch 3 shipped as `feat/components-batch-3` (PR #99, merged; PriceChart split to its own PR). |
| 2026-07-15 | PriceChart shipped as `feat/price-chart` — EvilCharts-backed composition, outside the portable core. |
| 2026-07-31 | Batch 4 started from DeFi-Triangle-Learn trading-interface patterns: OrderBook, OrderTypeTabs, SizeSlider, MarketTabs, MarginHealth. |
| 2026-08-01 | Batch 5 opened — crypto ticket atoms: TokenSelect shipped first; SlippageControl, AccountMenu, ActivityRow queued. |
