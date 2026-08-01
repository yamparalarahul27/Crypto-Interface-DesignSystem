# CIDS — Component gap tracker

> Created 2026-07-15. The roadmap's original inventory (Tiers 1–3 +
> crypto whitespace) shipped in full by M4 — this file tracks the
> **next ring**: what reference systems (Material ~36, shadcn ~79,
> Carbon ~67, Coinbase CDS ~141, **[interior.dev](https://www.interior.dev/docs)**
> ~54 micro-interactions) have that CIDS still lacks, so gaps
> stay recorded instead of rediscovered per session.
>
> Interior mapping (what to steal vs skip, `motion` constraint):
> [`references/interior.md`](./references/interior.md). Agents must
> check that file before proposing feedback / async / gesture components.
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

## Deliberate non-goals (recorded, not forgotten)

- **FAB / SplitButton** — no surface in the crypto vertical wants them.
- **DatePicker / Calendar** — heavy; defer until a real consumer asks.
- **Virtualized lists** — recipe documented (DataTable ↔ TanStack
  pairing) instead of a component.
- **RTL / i18n** — boundary documented in CONVENTIONS.md.

## Interior-inspired interactions

Standing reference: [Interior.dev](https://www.interior.dev/docs) (see
also PR docs when merged). Steal contracts; reimplement CIDS-native
(no `motion` in portable core).

- [x] **LoadingButton** — width-stable async faces (Sign → Signing… →
      Signed | Retry). First Interior-inspired portable atom.
- [ ] HoldToConfirm / LongPress — irreversible actions
- [ ] InlineValidation — amount / address field errors
- [ ] OTPInput — connect codes / 2FA-ish
- [ ] WizardSteps — multi-step send / onboarding

## History

| Date | Change |
|---|---|
| 2026-08-01 | LoadingButton shipped (Interior loading-button contract, CSS-only). |
| 2026-07-15 | File created; Batch 1 shipped as `feat/components-batch-1` (PR #97, merged). |
| 2026-07-15 | Batch 2 shipped as `feat/components-batch-2` (PR #98, merged; ContextMenu deferred). |
| 2026-07-15 | Batch 3 shipped as `feat/components-batch-3` (PR #99, merged; PriceChart split to its own PR). |
| 2026-07-15 | PriceChart shipped as `feat/price-chart` — EvilCharts-backed composition, outside the portable core. |
| 2026-07-31 | Batch 4 started from DeFi-Triangle-Learn trading-interface patterns: OrderBook, OrderTypeTabs, SizeSlider, MarketTabs, MarginHealth. |
