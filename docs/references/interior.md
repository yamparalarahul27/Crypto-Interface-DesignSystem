# Reference — [interior.dev](https://www.interior.dev/docs)

> Micro-interactions for React (“the half-second after a click”).
> Copy-in source · headless hook + styled example · **depends on
> [`motion`](https://motion.dev)** · ~54 files in
> [`ddoemonn/interior`](https://github.com/ddoemonn/interior).
>
> **Role for CIDS:** a *motion / interaction* reference — not a crypto
> inventory, not a drop-in replacement for Radix. Check here **before
> inventing** feedback, async, gesture, or overlay micro-UX.

## Hard rule (do not skip)

Interior’s only runtime dependency is `motion`. CIDS portable core
(`check:portable`) allows only `react` · `radix-ui` · `@/lib/utils` ·
self. Therefore:

| Path | When |
|---|---|
| **Reimplement CIDS-native** (Radix + CSS tokens) | Default — steal *behavior contracts*, not files |
| **Composition tier** (`src/components/…` + `motion`) | Only with an explicit dep approval (PriceChart / QRCode pattern) |
| **Copy Interior file into `src/design-system/`** | **Never** — breaks portability + DESIGN.md token rules |

Also: CIDS budgets playfulness to human-action feedback
(DESIGN.md / tide amendment). Interior’s denser motion set must be
filtered through that budget — data surfaces stay calm.

## The three failures (always apply)

Interior’s north star — encode these in every new interactive CIDS
component (polish / a11y / tests):

1. **No layout jump** — every reachable state reserves its width first
   (label Save → Saving must not shove the row).
2. **Interruptible motion** — a second click resumes from *now*, never
   restarts or queues blindly.
3. **Reduced-motion still informs** — destination arrives; only the trip
   is optional (`prefers-reduced-motion`).

## Mapping — Interior → CIDS

### Already covered (study Interior for polish, don’t duplicate)

| Interior | CIDS today | Steal from Interior |
|---|---|---|
| `accordion` | Accordion | height interrupt / reduced-motion |
| `context-menu` | ContextMenu (open PR) | open-origin awareness |
| `copy-button` | AddressChip (copy) | width-stable “Copied” swap |
| `drawer` / `modal` / `popover` / `dropdown` | Drawer · Dialog · Popover · Menu | focus return, origin |
| `pagination` | Pagination | — |
| `progress-bar` | Progress | determinate vs shimmer honesty |
| `tabs` / `segmented-control` | Tabs · Lane | direction-aware panel |
| `skeleton-swap` | Skeleton · SectionSkeleton | zero-shift swap |
| `presence-avatars` | AvatarGroup | — |
| `value-flash` | RollingNumber · PriceChange | flash on *which* cell changed |
| `tooltip-group` | Tooltip | coordinated delay |
| `slider-detents` | SizeSlider | detent physics (if ever reworked) |
| `command-palette` | Canvas ⌘K search | denser keyboard UX ideas |

### High value for Web3 — consider next (CIDS-native reimplement)

| Interior | Why it fits crypto / CIDS | Suggested home |
|---|---|---|
| `hold-to-confirm` / `long-press` | Destructive / irreversible (revoke, disconnect forever) | DS primitive |
| `loading-button` | Width-stable Connect → Signing → … | Button enhancement or atom |
| `inline-validation` | Amount / address / handle errors next to the field | Pattern + Input affordance |
| `otp-input` | Wallet connect codes, 2FA-ish flows | DS primitive |
| `wizard-steps` / `task-steps` | Onboarding, multi-step send | Pattern or DS |
| `live-activity` | Tx lifecycle strip ideas next to TxStatus | Pattern / TxStatus polish |
| `streaming-text` | Agent / status copy that arrives over time | Composition if motion needed |
| `new-items-pill` | Feed / activity “N new” | DS or feed pattern |
| `tag-input` | Token / wallet tag lists | DS |
| `reorder-list` / `sortable-table` | Watchlists, order prefs | DataTable recipe or DS |
| `password-strength` | Seed / backup confirm UX (with SeedPhrase) | Only if onboarding wakes |
| `poll-results` | Social / governance demos | Low urgency |
| `swipe-deck` | NFT / card triage | Composition / product-specific |

### Low fit / deliberate skip (for now)

`logo-marquee`, `text-reveal`, `blur-up-image`, `lightbox`, `ripple`,
`press-depth`, `like-burst`, `icon-morph`, `reading-progress`,
`scroll-spy`, `hide-on-scroll`, `snap-carousel`, `filter-grid` —
marketing / editorial motion. Revisit only if a CIDS surface needs them;
most fight the terminal calm aesthetic.

## Agent checklist (before proposing a new component)

1. Search CIDS (`src/design-system/`, `docs/cids-component-gaps.md`).
2. Check crypto refs: Coinbase CDS · Reown · ethereum.org heuristics.
3. Check generic refs: Radix/Base UI · shadcn · Carbon.
4. **Check Interior** ([docs](https://www.interior.dev/docs) ·
   [repo](https://github.com/ddoemonn/interior)) for the *interaction*
   — especially Action Feedback · Async · Overlay · Gesture · Data.
5. Prefer Radix + tokens. If Interior’s hook is the only honest
   implementation, **stop and propose** `motion` as composition-tier
   (do not silently add it to the portable core).

## Links

- Docs: https://www.interior.dev/docs  
- Source: https://github.com/ddoemonn/interior  
- Preview index: https://21st.dev/@ddoemonn/library/interior-dev  
