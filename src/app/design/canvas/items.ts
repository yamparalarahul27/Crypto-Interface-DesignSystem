// Curated canvas layout — world coordinates (px at scale 1).
// Zones flow left→right: Foundations → Components → Screens → Mocks.

export type CanvasItemDef =
  | { kind: "label"; id: string; title: string; x: number; y: number }
  | { kind: "demo"; id: string; title: string; x: number; y: number; w: number }
  | {
      kind: "iframe";
      id: string;
      title: string;
      x: number;
      y: number;
      w: number;
      h: number;
      src: string;
    };

const COL = 400; // component column pitch
const CX = 60; // components zone origin x
const CY = 200;

export const CANVAS_ITEMS: CanvasItemDef[] = [
  // ── Zone: Foundations ────────────────────────────────────────
  { kind: "label", id: "z-foundations", title: "Foundations", x: 60, y: 60 },
  { kind: "demo", id: "surfaces", title: "Surfaces", x: CX, y: 120, w: 340 },
  { kind: "demo", id: "hues", title: "Identity hues", x: CX + COL, y: 120, w: 340 },
  { kind: "demo", id: "motion", title: "Motion", x: CX + COL * 2, y: 120, w: 340 },

  // ── Zone: Components (4 cols) ────────────────────────────────
  { kind: "label", id: "z-components", title: "Components", x: 60, y: CY + 200 },
  { kind: "demo", id: "Avatar", title: "Avatar", x: CX, y: CY + 260, w: 340 },
  { kind: "demo", id: "AvatarGroup", title: "AvatarGroup", x: CX + COL, y: CY + 260, w: 340 },
  { kind: "demo", id: "TokenChip", title: "TokenChip", x: CX + COL * 2, y: CY + 260, w: 340 },
  { kind: "demo", id: "SocialProofChip", title: "SocialProofChip", x: CX + COL * 3, y: CY + 260, w: 340 },
  { kind: "demo", id: "ReactionBar", title: "ReactionBar", x: CX, y: CY + 520, w: 340 },
  { kind: "demo", id: "FollowButton", title: "FollowButton", x: CX + COL, y: CY + 520, w: 340 },
  { kind: "demo", id: "Lane", title: "Lane", x: CX + COL * 2, y: CY + 520, w: 340 },
  { kind: "demo", id: "Sheet", title: "Sheet", x: CX + COL * 3, y: CY + 520, w: 340 },
  { kind: "demo", id: "PostCard", title: "PostCard", x: CX, y: CY + 780, w: 380 },
  { kind: "demo", id: "CommentThread", title: "CommentThread", x: CX + COL + 40, y: CY + 780, w: 340 },
  { kind: "demo", id: "Onboarding", title: "Onboarding", x: CX + COL * 2 + 40, y: CY + 780, w: 340 },
  { kind: "demo", id: "TokenIcon", title: "TokenIcon", x: CX + COL * 3 + 40, y: CY + 780, w: 300 },
  { kind: "demo", id: "Skeleton", title: "Skeleton", x: CX, y: CY + 1093, w: 340 },
  { kind: "demo", id: "Tooltip", title: "Tooltip", x: CX + COL, y: CY + 1093, w: 300 },

  // ── Zone: Primitives (Phase 4 core atoms) ────────────────────
  { kind: "label", id: "z-primitives", title: "Primitives — core atoms", x: CX, y: CY + 1367 },
  { kind: "demo", id: "Button", title: "Button", x: CX, y: CY + 1427, w: 380 },
  { kind: "demo", id: "LoadingButton", title: "LoadingButton", x: CX + COL + 40, y: CY + 1427, w: 340 },
  { kind: "demo", id: "IconButton", title: "IconButton", x: CX + COL * 2 + 40, y: CY + 1427, w: 300 },
  { kind: "demo", id: "Badge", title: "Badge", x: CX + COL * 3 + 40, y: CY + 1427, w: 340 },
  { kind: "demo", id: "Input", title: "Input", x: CX, y: CY + 1647, w: 340 },
  { kind: "demo", id: "Dialog", title: "Dialog", x: CX + COL, y: CY + 1647, w: 340 },
  { kind: "demo", id: "Menu", title: "Menu", x: CX + COL * 2 + 40, y: CY + 1647, w: 300 },
  { kind: "demo", id: "Select", title: "Select", x: CX + COL * 3 + 40, y: CY + 1647, w: 300 },
  { kind: "demo", id: "Switch", title: "Switch", x: CX, y: CY + 1867, w: 300 },
  { kind: "demo", id: "Checkbox", title: "Checkbox", x: CX + COL - 40, y: CY + 1867, w: 300 },
  { kind: "demo", id: "Tabs", title: "Tabs", x: CX + COL * 2 - 40, y: CY + 1867, w: 380 },
  { kind: "demo", id: "Toast", title: "Toast", x: CX, y: CY + 2107, w: 340 },
  { kind: "demo", id: "Divider", title: "Divider", x: CX + COL, y: CY + 2107, w: 300 },
  { kind: "demo", id: "EmptyState", title: "EmptyState", x: CX + COL * 2, y: CY + 2107, w: 380 },

  // ── Zone: Data (Phase 5 terminal-grade layer) ────────────────
  { kind: "label", id: "z-data", title: "Data — terminal grade", x: CX, y: CY + 2410 },
  { kind: "demo", id: "RollingNumber", title: "RollingNumber", x: CX, y: CY + 2470, w: 340 },
  { kind: "demo", id: "PriceChange", title: "PriceChange", x: CX + COL, y: CY + 2470, w: 300 },
  { kind: "demo", id: "StatCell", title: "StatCell", x: CX + COL * 2, y: CY + 2470, w: 380 },
  { kind: "demo", id: "Sparkline", title: "Sparkline", x: CX + COL * 3 + 40, y: CY + 2470, w: 300 },
  { kind: "demo", id: "DataTable", title: "DataTable", x: CX, y: CY + 2710, w: 560 },

  // ── Zone: Crypto (the whitespace no reference system ships) ──
  { kind: "label", id: "z-crypto", title: "Crypto — the vertical", x: CX, y: CY + 3090 },
  { kind: "demo", id: "AddressChip", title: "AddressChip", x: CX, y: CY + 3150, w: 340 },
  { kind: "demo", id: "PegBadge", title: "PegBadge", x: CX + COL, y: CY + 3150, w: 340 },
  { kind: "demo", id: "NetworkBadge", title: "NetworkBadge", x: CX + COL * 2, y: CY + 3150, w: 300 },
  { kind: "demo", id: "TxStatus", title: "TxStatus", x: CX + COL * 3, y: CY + 3150, w: 340 },
  { kind: "demo", id: "AmountInput", title: "AmountInput", x: CX, y: CY + 3390, w: 340 },
  { kind: "demo", id: "ExchangeOrderBook", title: "Order book — exchange density (demo)", x: CX, y: CY + 3590, w: 460 },

  // ── Zone: Patterns (PATTERNS.md — composition recipes, live) ─
  { kind: "label", id: "z-patterns", title: "Patterns — composition recipes", x: CX, y: CY + 4408 },
  { kind: "demo", id: "PatternStates", title: "P1 · States catalog", x: CX, y: CY + 4468, w: 420 },
  { kind: "demo", id: "PatternTxFlow", title: "P2 · Transaction flow", x: CX + COL + 80, y: CY + 4468, w: 420 },
  { kind: "demo", id: "PatternFormRow", title: "P3 · Form row", x: CX + COL * 2 + 160, y: CY + 4468, w: 380 },
  { kind: "demo", id: "PatternMarketList", title: "P4 · Market list", x: CX, y: CY + 4888, w: 520 },
  { kind: "demo", id: "PatternSwapReceive", title: "P5 · Swap / receive ticket", x: CX + COL + 140, y: CY + 4888, w: 440 },

  // Templates (Phase 6b) — the range claim, framed live
  { kind: "iframe", id: "tpl-dapp", title: "Template — simple dApp", x: CX + COL * 2 + 200, y: CY + 4888, w: 400, h: 640, src: "/design/templates/simple-dapp" },
  { kind: "iframe", id: "tpl-exchange", title: "Template — exchange (compact)", x: CX + COL * 3 + 280, y: CY + 4888, w: 560, h: 640, src: "/design/templates/exchange" },

  // ── Zone: Primitives batch 2 (component-gaps pass) ───────────
  { kind: "label", id: "z-primitives-2", title: "Primitives — containment & forms", x: CX, y: CY + 5608 },
  { kind: "demo", id: "Card", title: "Card", x: CX, y: CY + 5668, w: 340 },
  { kind: "demo", id: "Accordion", title: "Accordion", x: CX + COL, y: CY + 5668, w: 380 },
  { kind: "demo", id: "Alert", title: "Alert", x: CX + COL * 2 + 40, y: CY + 5668, w: 420 },
  { kind: "demo", id: "Textarea", title: "Textarea", x: CX + COL * 3 + 120, y: CY + 5668, w: 340 },
  { kind: "demo", id: "RadioGroup", title: "RadioGroup", x: CX, y: CY + 5968, w: 340 },
  { kind: "demo", id: "Progress", title: "Progress", x: CX + COL, y: CY + 5968, w: 340 },

  // ── Zone: Navigation & overlays (component-gaps batch 2) ─────
  { kind: "label", id: "z-nav-overlays", title: "Navigation & overlays", x: CX, y: CY + 6308 },
  { kind: "demo", id: "AppBar", title: "AppBar", x: CX, y: CY + 6368, w: 420 },
  { kind: "demo", id: "BottomNav", title: "BottomNav", x: CX + COL + 80, y: CY + 6368, w: 380 },
  { kind: "demo", id: "Breadcrumbs", title: "Breadcrumbs", x: CX + COL * 2 + 120, y: CY + 6368, w: 340 },
  { kind: "demo", id: "Combobox", title: "Combobox", x: CX, y: CY + 6608, w: 340 },
  { kind: "demo", id: "Popover", title: "Popover", x: CX + COL, y: CY + 6608, w: 340 },
  { kind: "demo", id: "Drawer", title: "Drawer", x: CX + COL * 2, y: CY + 6608, w: 340 },
  { kind: "demo", id: "Pagination", title: "Pagination", x: CX, y: CY + 6848, w: 420 },
  { kind: "demo", id: "ContextMenu", title: "ContextMenu", x: CX + COL + 80, y: CY + 6848, w: 340 },

  // ── Zone: Crypto round 2 (component-gaps batch 3) ────────────
  { kind: "label", id: "z-crypto-2", title: "Crypto — round 2", x: CX, y: CY + 7148 },
  { kind: "demo", id: "WalletButton", title: "WalletButton", x: CX, y: CY + 7208, w: 340 },
  { kind: "demo", id: "ChainSwitcher", title: "ChainSwitcher", x: CX + COL, y: CY + 7208, w: 340 },
  { kind: "demo", id: "Amount", title: "Amount", x: CX + COL * 2, y: CY + 7208, w: 300 },
  { kind: "demo", id: "GasFee", title: "GasFee", x: CX + COL * 3, y: CY + 7208, w: 380 },
  { kind: "demo", id: "PriceChart", title: "PriceChart — via EvilCharts", x: CX, y: CY + 7508, w: 520 },
  { kind: "demo", id: "QRCode", title: "QRCode — via qrcode", x: CX + COL + 160, y: CY + 7508, w: 300 },

  // ── Zone: Trading interface imports (DeFi-Triangle-Learn) ───
  { kind: "label", id: "z-trading-learn", title: "Trading interface — Learn imports", x: CX, y: CY + 7999 },
  { kind: "demo", id: "OrderTypeTabs", title: "OrderTypeTabs", x: CX, y: CY + 8059, w: 460 },
  { kind: "demo", id: "SizeSlider", title: "SizeSlider", x: CX + COL + 120, y: CY + 8059, w: 420 },
  { kind: "demo", id: "MarketTabs", title: "MarketTabs", x: CX, y: CY + 8259, w: 560 },
  { kind: "demo", id: "MarginHealth", title: "MarginHealth", x: CX + COL + 280, y: CY + 8259, w: 460 },
  { kind: "demo", id: "OrderBook", title: "OrderBook", x: CX, y: CY + 8519, w: 520 },

  // ── Zone: Crypto round 3 (component-gaps Batch 5) ────────────
  { kind: "label", id: "z-crypto-3", title: "Crypto — round 3", x: CX, y: CY + 9337 },
  { kind: "demo", id: "TokenSelect", title: "TokenSelect", x: CX, y: CY + 9397, w: 340 },
  { kind: "demo", id: "SlippageControl", title: "SlippageControl", x: CX + COL, y: CY + 9397, w: 380 },
  { kind: "demo", id: "AccountMenu", title: "AccountMenu", x: CX + COL * 2, y: CY + 9397, w: 340 },
  { kind: "demo", id: "WalletAvatar", title: "WalletAvatar", x: CX + COL * 3, y: CY + 9397, w: 360 },
  { kind: "demo", id: "ActivityRow", title: "ActivityRow", x: CX, y: CY + 9697, w: 420 },

  // ── Zone: Interior-inspired interactions ─────────────────────
  { kind: "label", id: "z-interior", title: "Interior-inspired interactions", x: CX, y: CY + 10057 },
  { kind: "demo", id: "HoldToConfirm", title: "HoldToConfirm", x: CX, y: CY + 10117, w: 360 },
  { kind: "demo", id: "OTPInput", title: "OTPInput", x: CX + COL, y: CY + 10117, w: 380 },
  { kind: "demo", id: "InlineValidation", title: "InlineValidation", x: CX + COL * 2, y: CY + 10117, w: 360 },
  { kind: "demo", id: "WizardSteps", title: "WizardSteps", x: CX, y: CY + 10437, w: 440 },

  // ── Zone: Screens (live build vs HTML mock, side by side) ────
  { kind: "label", id: "z-screens", title: "Screens — mock vs build", x: 1780, y: 60 },
  {
    kind: "iframe",
    id: "mock-feed",
    title: "feed.html (mock)",
    x: 1780,
    y: 120,
    w: 430,
    h: 900,
    src: "/Prototypes/tide/feed.html",
  },
  {
    kind: "iframe",
    id: "live-feed",
    title: "FeedScreen (live build)",
    x: 2280,
    y: 120,
    w: 430,
    h: 900,
    src: "/design/feed",
  },

  // ── Zone: HTML mocks ─────────────────────────────────────────
  { kind: "label", id: "z-mocks", title: "HTML prototypes", x: 1780, y: 1120 },
  {
    kind: "iframe",
    id: "mock-design",
    title: "design.html",
    x: 1780,
    y: 1180,
    w: 430,
    h: 800,
    src: "/Prototypes/tide/design.html",
  },
  {
    kind: "iframe",
    id: "mock-markets",
    title: "markets.html",
    x: 2280,
    y: 1180,
    w: 430,
    h: 800,
    src: "/Prototypes/tide/markets.html",
  },
  {
    kind: "iframe",
    id: "mock-states",
    title: "states.html",
    x: 2780,
    y: 1180,
    w: 430,
    h: 800,
    src: "/Prototypes/tide/states.html",
  },
];
