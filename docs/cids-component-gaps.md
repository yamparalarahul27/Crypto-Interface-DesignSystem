# CIDS: Component gap tracker

> Created 2026-07-15. The roadmap's original inventory (Tiers 1–3 +
> crypto whitespace) shipped in full by M4: this file tracks the
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

## Production → finish ladder

> Locked 2026-09-01. Promotions alone do not make the system shippable.
> Sequence: **production-ready core** first, then finish the catalog.

```
1 Public prod     you · Vercel SSO off + live URL
2 Harden ticket   swap path P0/P1/P2
3 Stable core     promote only after harden
4 Finish DS       remaining drafts, Batch 6, SeedPhrase if needed
```

**Harden progress:** P0 (#118) AmountInput · AddressChip · WalletButton ·
GasFee. P1 (#119) TokenSelect Combobox ARIA + loading · Slippage ≥40 ·
AccountMenu clipboard. P2 (#120) TxStatus detail/action · NetworkBadge
wrong-network. **Pattern wire:** P5/P2 frames + Inspector chips exercise
those APIs (this track).

## Batch 1: containment & forms (PR in flight)

The "every generic system has this" tier. All Radix-backed or trivial.

- [x] **Accordion**: collapsible sections (single/multiple)
- [x] **Card**: the generic container primitive (canonicalizes the
      hand-rolled `rounded-card border bg-surface-container` recipe)
- [x] **Alert**: inline callout on the tinted state surfaces
      (info/success/warning/error); Toast = events, Alert = conditions
- [x] **RadioGroup**: visible one-of-N (≤5 options; more → Select)
- [x] **Textarea**: Input's multi-line sibling, same grammar
- [x] **Progress**: determinate bar + indeterminate shimmer

## Batch 2: navigation & overlays (PR in flight)

Every template/demo hand-rolls its header and bottom bar today:
repeated composition begging to be components.

- [x] **AppBar**: page header (title · actions · optional back)
- [x] **BottomNav**: mobile tab bar (the feed demo hand-rolls one)
- [x] **Combobox**: typeahead search-select; pick-from-list only
      (decision 2026-07-15). Hand-rolled ARIA 1.2 on Radix Popover:
      no cmdk (would break the portability import allowlist)
- [x] **Popover**: public primitive (Radix Popover was already used
      inside ReactionBar but wasn't exported)
- [x] **Drawer**: side sheet, right/left (Sheet stays bottom-only)
- [x] **Breadcrumbs**: path navigation for docs/console surfaces
- [x] **Pagination**: page controls for long tables
- [x] ContextMenu: right-click menu (Radix; was deferred)

## Batch 3: crypto vertical, round 2 (PR in flight)

Same argument as Phase 5b: the whitespace no generic system covers.

- [x] **WalletButton**: connect → connecting → connected account pill
      (Reown's atom; templates hand-rolled it from Button + AddressChip).
      Presentational; disconnect lives in the account UI, never on the button
- [x] **ChainSwitcher**: active network + switch menu (NetworkBadge
      stays display-only). Radix DropdownMenu radio semantics
- [x] **GasFee**: fee/priority display with congestion severity (no
      reference system ships this; pure whitespace). Word + tint, mono-safe
- [x] **Amount**: read-only formatted token amount (AmountInput's
      display sibling: magnitude-aware decimals, dust handling, sign discipline)
- [x] **PriceChart**: interactive price chart (CDS's signature). Decision
      2026-07-15: **use EvilCharts directly** rather than reimplement in
      portable SVG. Consequence; it lives in `src/components/PriceChart/`,
      NOT `src/design-system/` (it pulls recharts via the vendored
      `EvilLineChart`, so it can't pass `check:portable` and isn't in the
      registry). Composes EvilLineChart (line · crosshair · tooltip) +
      CIDS Lane (range switch) + PriceChange (header). Credited to
      [legions-developer/evilcharts](https://github.com/legions-developer/evilcharts).
- [x] **QRCode**; receive-address display. Decision 2026-08-01: composition
      tier + `qrcode` npm (same pattern as PriceChart). Lives in
      `src/components/QRCode/`; composes CIDS AddressChip; theme-aware SVG
      via CSS variables. Not in the portable registry.
- [ ] SeedPhrase: reveal/confirm grid (only if onboarding flows land)

## Batch 4: trading interface imports from DeFi-Triangle-Learn

The private DeFi-Triangle-Learn repo has a richer paper-trading terminal.
This batch extracts the pieces that are reusable as CIDS primitives
without carrying over product state, Zustand stores, Supabase, or chart
engines.

- [x] **OrderBook**: bid/ask depth table with tick aggregation,
      asks/mixed/bids views, cumulative bars, row price-pick callbacks,
      and explicit loading/empty/error/stale states.
- [x] **OrderTypeTabs**: swipeable order-type strip for Market,
      Limit, Stop-Market, Stop-Limit, Iceberg, TWAP, OCO, and
      Trailing-Stop; unsupported types can stay visible-disabled.
- [x] **SizeSlider**: percent-of-balance slider with 0/25/50/75/100
      stops, sub-ticks, keyboard support, and fixed value readout.
- [x] **MarketTabs**: browser-like open-market tabs with token icon,
      symbol, live price, signed change, close, and add affordance.
- [x] **MarginHealth**: margin-ratio meter with Healthy/Caution/High/
      Critical tiers, semantic tones, and `role="meter"`.

> **Note: the portable core vs. compositions.** PriceChart and QRCode are
> intentional residents of a second tier: *compositions* that build on
> non-portable deps (recharts via vendored EvilCharts; `qrcode` npm). They're real
> and shown on the canvas, but they're not copy-in registry primitives and
> don't carry the `check:portable` guarantee. Keep them under
> `src/components/`, credit upstream, and never let them import back into
> the design-system barrel.

## Batch 5: crypto vertical, round 3

The DeFi ticket atoms still missing after rounds 2–4. Swap/send/trade
UIs hand-roll these every time; shipping them closes the gap to
Uniswap/Jupiter/CDS ticket completeness.

- [x] **TokenSelect**: searchable token picker (icon + symbol trigger,
      Dialog list with optional balances). Combobox stays for generic
      lists; this is the crypto-shaped sibling.
- [x] **SlippageControl**: tolerance presets + custom bps (≤0.5 /
      ≤1.0 / custom); tone bands for risk; lives above confirm.
- [x] **AccountMenu**; WalletButton's connected sibling: address,
      copy, explorer link, disconnect (never on the connect button).
- [x] **ActivityRow**: tx history atom (icon · title · time · status
      · amount); composes TxStatus + Amount + AddressChip patterns.
- [x] ContextMenu: right-click menu (Radix; was deferred)
- [x] **QRCode**: receive-address display (composition tier + `qrcode`)
- [ ] SeedPhrase: reveal/confirm grid (only if onboarding flows land)

## Deliberate non-goals (recorded, not forgotten)

- **FAB / SplitButton**: no surface in the crypto vertical wants them.
- **DatePicker / Calendar**: heavy; defer until a real consumer asks.
- **Virtualized lists**: recipe documented (DataTable ↔ TanStack
  pairing) instead of a component.
- **RTL / i18n**: boundary documented in CONVENTIONS.md.

## Interior-inspired interactions

Standing reference: [Interior.dev](https://www.interior.dev/docs) (see
also PR docs when merged). Steal contracts; reimplement CIDS-native
(no `motion` in portable core).

- [x] **LoadingButton**: width-stable async faces (Sign → Signing… →
      Signed | Retry). First Interior-inspired portable atom.
- [x] **HoldToConfirm**: irreversible hold-to-commit (revoke / disconnect)
- [x] **InlineValidation**: reserved-height hint ↔ error on Input
- [x] **OTPInput**: connect / verify code cells
- [x] **WizardSteps**: multi-step send / onboarding rail + panel


## Batch 6: the identity system (planned)

> Sourced from MetaMask design-system reference screenshots
> (2026-08-25). Two shipped already: the rest is the next ring.
> Everything here is one component family, so it wants one PR.

**Shipped in this pass:**

- [x] **Avatar `variant`**: `initial` (v1, unchanged default) ·
      `shards` (jazzicon-style sectors) · `blocks` (mirrored 5×5 grid).
      Geometry lives in `identity.ts` beside `hueFor`, so every identity
      figure derives from one hash family and one palette.
- [x] **Avatar `chain` / `connection`**: corner network badge, and the
      three-state status dot (active / inactive / offline). `chain` wins
      the corner when both are passed; states differ by shape as well as
      colour.
- [x] **WalletAvatar**: address-first wrapper over Avatar (truncates the
      address for the accessible name, defaults to `shards`).

**Open; needs a decision before building:**

- [ ] **Size scale mismatch.** Reference uses **16 / 24 / 32 / 40 / 48**
      (Xs–Xl, five steps). CIDS ships **20 / 28 / 40 / 64** (xs–lg, four).
      Only `md 40` coincides. Adopting the reference scale is a breaking
      change to a stable component *and* to the DESIGN.md avatar spec;
      it is not a component change, it is a foundation change. Options:
      (a) keep ours, (b) adopt theirs wholesale, (c) add `xl` and retune
      xs/sm toward 16/24. **Blocked on a call.**
- [ ] **Generative palette.** The `--id-*` hues are documented as "muted
      to sit on near-black"; the reference figures are fully saturated.
      Matching that punch needs a *new token set* + a `check:contrast`
      pass, not a component tweak. **Blocked on a call.**

**Open; buildable once the scale is settled:**

- [ ] **AvatarGroup: full size scale.** Currently accepts `xs | sm` only,
      against Avatar's four. Whatever scale wins above, the group should
      offer all of it.
- [ ] **AvatarGroup: content variants.** Reference stacks four kinds,
      Accounts, Tokens, Networks, Favicons. Ours takes `members` and
      renders `Avatar` exclusively, so a row of token or network icons is
      impossible. Wants an API change: a `children`/item-union shape
      instead of an Avatar-only member list. `TokenIcon` and
      `NetworkBadge` already exist to fill the other three.
- [ ] **AvatarGroup: `reverse`.** Controls stack direction and z-order
      (first-on-top vs last-on-top). Not expressible today.
- [ ] **AvatarGroup: overflow as an explicit prop.** Reference treats
      `hasOverflow` as a boolean; ours derives it from `max`. Probably a
      doc fix rather than an API change (`max={Infinity}` already means
      "no counter"), but the two should be described in the same terms.

**Adjacent, surfaced while building the above:**

- [x] **Accordion `defaultValue`.** The component page now renders every
      doc section as an accordion, but `Accordion` cannot open one by
      default: so Props, the section people actually come for, starts
      collapsed. Accordion's own doc warns against burying primary
      content. Small addition; benefits every consumer. Shipped 2026-09-01.

## History

| Date | Change |
|---|---|
| 2026-08-01 | Interior-inspired batch: HoldToConfirm, InlineValidation, OTPInput, WizardSteps (CSS-only). |
| 2026-08-01 | LoadingButton shipped (Interior loading-button contract, CSS-only). |
| 2026-07-15 | File created; Batch 1 shipped as `feat/components-batch-1` (PR #97, merged). |
| 2026-07-15 | Batch 2 shipped as `feat/components-batch-2` (PR #98, merged; ContextMenu deferred). |
| 2026-07-15 | Batch 3 shipped as `feat/components-batch-3` (PR #99, merged; PriceChart split to its own PR). |
| 2026-07-15 | PriceChart shipped as `feat/price-chart`: EvilCharts-backed composition, outside the portable core. |
| 2026-07-31 | Batch 4 started from DeFi-Triangle-Learn trading-interface patterns: OrderBook, OrderTypeTabs, SizeSlider, MarketTabs, MarginHealth. |
| 2026-08-01 | ContextMenu shipped (Batch 2 deferred item). |
| 2026-08-01 | QRCode shipped as composition tier + `qrcode` npm (PriceChart pattern). SeedPhrase still deferred. |
| 2026-08-01 | Batch 5 crypto ticket atoms: TokenSelect, SlippageControl, AccountMenu, ActivityRow. SeedPhrase remains deferred. |
| 2026-08-25 | Batch 6 opened (identity system). Avatar gained variant/chain/connection; WalletAvatar shipped. Size scale + generative palette blocked on a decision. |
| 2026-09-01 | Promotion cohort → stable @ 1.0.0: LoadingButton, HoldToConfirm, OTPInput, InlineValidation, WizardSteps, ContextMenu, TokenSelect, SlippageControl, AccountMenu, ActivityRow. |
| 2026-09-01 | Batch 1 → stable @ 1.0.0: Alert, Card, RadioGroup, Textarea, Progress (Accordion deferred to #115). |
| 2026-09-01 | Batch 2 → stable @ 1.0.0: AppBar, BottomNav, Combobox, Popover, Drawer, Breadcrumbs, Pagination. |
