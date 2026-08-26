// The CIDS icon layer: Phosphor (phosphoricons.com, MIT) behind
// intent-named exports. Components import what an icon MEANS
// (IconClose, IconPriceUp), never the vendor's spelling, so the family
// can be re-weighted, re-sized or swapped wholesale in this one file
// instead of across forty components.
//
// Why /dist/ssr and not the package root: the root icons read
// IconContext, which makes them client-only and would force "use client"
// onto the design-system components that still render on the server. The
// ssr build is context-free and renders in both. It also defaults to
// size="1em" and fill="currentColor", so an icon inherits the font-size
// and colour of the row it sits in: precisely what the unicode glyphs
// these replace used to do for free.
//
// Why per-icon paths and not the /dist/ssr barrel: the barrel pulls the
// whole family into the module graph. Deep paths stay tree-shakeable in
// any bundler, so a vendored copy of this system costs an adopter only
// the icons it actually draws.
//
// Adding one: find it on phosphoricons.com, re-export its `<Name>Icon`
// binding below under a CIDS-intent name, and use that name downstream.
// The unsuffixed `<Name>` bindings are deprecated upstream: don't use
// them.

export type { Icon, IconProps, IconWeight } from "@phosphor-icons/react/dist/lib/types";

// ── dismissal + markers ──────────────────────────────────────────────
/** Dismiss affordance: Dialog, Drawer, Sheet, Toast, Tooltip, overlays. */
export { XIcon as IconClose } from "@phosphor-icons/react/dist/ssr/X";
/** Negative marker in prose: "Don't" rows, failed states. Not a control. */
export { XIcon as IconCross } from "@phosphor-icons/react/dist/ssr/X";
/** Affirmative marker: checkbox, select indicator, step done, copied. */
export { CheckIcon as IconCheck } from "@phosphor-icons/react/dist/ssr/Check";

// ── field validation ─────────────────────────────────────────────────
// Validity reads as a bare mark, never an enclosed badge: at the 12–14px
// these render, a surrounding circle closes up and the state is lost.
// Pass is IconCheck; fail is the exclamation below.
/** Field-level or action-level failure. */
export { ExclamationMarkIcon as IconExclamation } from "@phosphor-icons/react/dist/ssr/ExclamationMark";

// ── money + direction ────────────────────────────────────────────────
// Rendered weight="fill" at the call site: the sign-discipline primitive
// (DESIGN.md #5) wants a solid triangle, matching the ▲/▼ it replaces.
/** Signed direction, positive. Always paired with a "+" and text-buy. */
export { CaretUpIcon as IconPriceUp } from "@phosphor-icons/react/dist/ssr/CaretUp";
/** Signed direction, negative. Always paired with "−" and text-sell. */
export { CaretDownIcon as IconPriceDown } from "@phosphor-icons/react/dist/ssr/CaretDown";

// ── disclosure + sort ────────────────────────────────────────────────
// Regular weight, unlike the filled money carets above: these are
// affordances the user can act on, not a value being reported.
/** Expanded disclosure, and descending sort. */
export { CaretDownIcon as IconCaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
/** Collapsed disclosure. */
export { CaretRightIcon as IconCaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
/** Ascending sort. */
export { CaretUpIcon as IconCaretUp } from "@phosphor-icons/react/dist/ssr/CaretUp";

// ── actions ──────────────────────────────────────────────────────────
/** Copy-to-clipboard, swapped for IconCheck on success. */
export { CopyIcon as IconCopy } from "@phosphor-icons/react/dist/ssr/Copy";
/** Leaves the app: explorer links, anything opening a new tab. */
export { ArrowSquareOutIcon as IconExternal } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
/** "More actions" trigger. */
export { DotsThreeIcon as IconOverflow } from "@phosphor-icons/react/dist/ssr/DotsThree";
/** Unselected radio/option. */
export { CircleIcon as IconRadioOff } from "@phosphor-icons/react/dist/ssr/Circle";
/** Selected radio/option. */
export { RadioButtonIcon as IconRadioOn } from "@phosphor-icons/react/dist/ssr/RadioButton";
/** Settings. */
export { GearIcon as IconSettings } from "@phosphor-icons/react/dist/ssr/Gear";
/** Additive action. */
export { PlusIcon as IconAdd } from "@phosphor-icons/react/dist/ssr/Plus";
/** Compose. */
export { PencilSimpleIcon as IconCompose } from "@phosphor-icons/react/dist/ssr/PencilSimple";
/** Search. */
export { MagnifyingGlassIcon as IconSearch } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
/** Passive audience count: SocialProofChip's "watching". */
export { EyeIcon as IconWatching } from "@phosphor-icons/react/dist/ssr/Eye";
/** Comments / replies. */
export { ChatCircleIcon as IconComments } from "@phosphor-icons/react/dist/ssr/ChatCircle";

// ── destinations (BottomNav, canvas layers) ──────────────────────────
/** The social feed: "tide". */
export { WavesIcon as IconFeed } from "@phosphor-icons/react/dist/ssr/Waves";
/** Markets list. */
export { TableIcon as IconMarkets } from "@phosphor-icons/react/dist/ssr/Table";
/** Holdings. */
export { WalletIcon as IconPortfolio } from "@phosphor-icons/react/dist/ssr/Wallet";
/** Price history. */
export { ChartLineIcon as IconChart } from "@phosphor-icons/react/dist/ssr/ChartLine";
/** The signed-in person. */
export { UserCircleIcon as IconAccount } from "@phosphor-icons/react/dist/ssr/UserCircle";
/** A canvas layer backed by a live demo component. */
export { DiamondIcon as IconLayerDemo } from "@phosphor-icons/react/dist/ssr/Diamond";
/** A token with no logo: ActivityRow's placeholder disc. */
export { DiamondIcon as IconTokenFallback } from "@phosphor-icons/react/dist/ssr/Diamond";
/** Nothing here yet: EmptyState's default marker. */
export { CircleDashedIcon as IconEmpty } from "@phosphor-icons/react/dist/ssr/CircleDashed";
/** A canvas layer backed by an embedded frame. */
export { BoundingBoxIcon as IconLayerFrame } from "@phosphor-icons/react/dist/ssr/BoundingBox";

// ── navigation ───────────────────────────────────────────────────────
/** Forward affordance on CTAs and list links. */
export { ArrowRightIcon as IconArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
/** Back affordance. */
export { ArrowLeftIcon as IconArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
/** Up and out of a detail view, back to the index that linked here.
 *  Distinct from IconArrowLeft, which means "previous in a sequence". */
export { ArrowUUpLeftIcon as IconBack } from "@phosphor-icons/react/dist/ssr/ArrowUUpLeft";
/** Keyboard hints and vertical movement. */
export { ArrowUpIcon as IconArrowUp } from "@phosphor-icons/react/dist/ssr/ArrowUp";
export { ArrowDownIcon as IconArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";

// ── transport + status ───────────────────────────────────────────────
/** Play. Drawn by the family, so it optically matches IconPause. */
export { PlayIcon as IconPlay } from "@phosphor-icons/react/dist/ssr/Play";
/** Pause. */
export { PauseIcon as IconPause } from "@phosphor-icons/react/dist/ssr/Pause";
/** Pending. Spin it with `animate-spin`; the notch gives the gap. */
export { CircleNotchIcon as IconSpinner } from "@phosphor-icons/react/dist/ssr/CircleNotch";

// ── brand ────────────────────────────────────────────────────────────
/** GitHub mark: the one brand glyph the system ships. */
export { GithubLogoIcon as IconGithub } from "@phosphor-icons/react/dist/ssr/GithubLogo";
