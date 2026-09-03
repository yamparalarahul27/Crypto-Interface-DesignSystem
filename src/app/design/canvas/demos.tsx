"use client";

import { useEffect, useState } from "react";
import { PATTERN_DEMOS } from "./patternDemos";
import type { DemoFn, DemoOpts } from "./demoStates";
import { PriceChart, type PricePoint } from "@/components/PriceChart/PriceChart";
import { QRCode } from "@/components/QRCode/QRCode";
import {
  Accordion,
  AccountMenu,
  ActivityRow,
  AddressChip,
  Alert,
  Amount,
  AmountInput,
  AppBar,
  Avatar,
  AvatarGroup,
  Badge,
  BottomNav,
  Breadcrumbs,
  Button,
  Card,
  ChainSwitcher,
  Checkbox,
  Combobox,
  CommentThread,
  ContextMenu,
  DataTable,
  Dialog,
  Divider,
  Drawer,
  EmptyState,
  FollowButton,
  GasFee,
  HoldToConfirm,
  ID_HUES,
  IconAdd,
  IconButton,
  IconClose,
  IconFeed,
  IconMarkets,
  IconOverflow,
  IconPortfolio,
  IconRadioOff,
  IconRadioOn,
  IconSettings,
  InlineValidation,
  Input,
  Lane,
  LoadingButton,
  MarginHealth,
  MarketTabs,
  Menu,
  NetworkBadge,
  OTPInput,
  Onboarding,
  OrderBook,
  OrderTypeTabs,
  Pagination,
  PegBadge,
  Popover,
  PostCard,
  PriceChange,
  Progress,
  RadioGroup,
  ReactionBar,
  RollingNumber,
  SectionSkeleton,
  Select,
  Sheet,
  SizeSlider,
  Skeleton,
  SlippageControl,
  SocialProofChip,
  Sparkline,
  StatCell,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  TokenChip,
  TokenIcon,
  TokenSelect,
  Tooltip,
  TxStatus,
  WalletAvatar,
  WalletButton,
  WizardSteps,
  type Column,
  type Comment,
  type MarketTabItem,
  type OrderBookLevel,
  type OrderType,
  type Reaction,
  type TokenOption,
  type TxState,
  type WalletStatus,
  useToast,
} from "@/design-system";

const SURFACES = [
  ["dim", "bg-surface-dim"],
  ["page", "bg-surface-page"],
  ["surface", "bg-surface"],
  ["container", "bg-surface-container"],
  ["high", "bg-surface-container-high"],
  ["bright", "bg-surface-bright"],
] as const;

const MOTION = [
  ["--motion-fast", "150ms ease-out", "state / hover"],
  ["--motion-settle", "200ms settle bezier", "enter / morph"],
  ["--motion-spring", "250ms overshoot", "human feedback"],
] as const;

const TRIGGER =
  "rounded-sm border border-outline bg-surface-container px-3 py-2 text-xs font-semibold text-fg transition-transform active:scale-[0.98]";

function toggle(prev: Reaction[], emoji: string): Reaction[] {
  const f = prev.find((r) => r.emoji === emoji);
  if (!f) return [...prev, { emoji, count: 1, mine: true }];
  return prev.map((r) =>
    r.emoji === emoji
      ? { ...r, mine: !r.mine, count: r.count + (r.mine ? -1 : 1) }
      : r,
  );
}

function ReactionDemo() {
  const [rs, setRs] = useState<Reaction[]>([
    { emoji: "♥", count: 12, mine: true },
    { emoji: "🔥", count: 8 },
  ]);
  return <ReactionBar reactions={rs} onReact={(e) => setRs((p) => toggle(p, e))} />;
}

function FollowDemo() {
  const [f, setF] = useState(false);
  return <FollowButton following={f} onToggle={() => setF((v) => !v)} />;
}

function LoadingButtonDemo() {
  const wait = (ms: number, ok = true) =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => (ok ? resolve() : reject(new Error("failed"))), ms);
    });
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LoadingButton
        onAction={() => wait(900)}
        pendingLabel="Signing…"
        successLabel="Signed"
      >
        Sign
      </LoadingButton>
      <LoadingButton
        variant="secondary"
        onAction={() => wait(700, false)}
        pendingLabel="Publishing…"
        errorLabel="Retry"
      >
        Publish
      </LoadingButton>
    </div>
  );
}

function HoldToConfirmDemo() {
  return (
    <HoldToConfirm
      duration={1200}
      confirmLabel="Disconnected"
      onConfirm={() => {}}
    >
      Hold to disconnect
    </HoldToConfirm>
  );
}

function OTPInputDemo() {
  const [err, setErr] = useState(false);
  return (
    <OTPInput
      length={6}
      hint="Paste the whole code into any cell."
      error={err}
      errorMessage="That code is wrong."
      onComplete={(code) => setErr(code !== "123456")}
      onChange={() => setErr(false)}
    />
  );
}

function InlineValidationDemo() {
  const [addr, setAddr] = useState("");
  return (
    <InlineValidation
      label="Recipient"
      value={addr}
      onChange={setAddr}
      validate={(v) => (v.trim().length >= 8 ? null : "Enter a wallet address")}
      hint="Paste a Solana address."
      debounce={200}
    />
  );
}

function WizardStepsDemo() {
  return (
    <WizardSteps
      height={120}
      finishLabel="Send"
      onComplete={() => {}}
      steps={[
        { id: "amount", label: "Amount", content: <p className="text-fg-muted">Enter how much to send.</p> },
        { id: "review", label: "Review", content: <p className="text-fg-muted">Confirm recipient + fee.</p> },
      ]}
    />
  );
}

function LaneDemo() {
  const [v, setV] = useState("following");
  return (
    <Lane
      options={[
        { value: "following", label: "Following" },
        { value: "everyone", label: "Everyone" },
      ]}
      value={v}
      onChange={setV}
    />
  );
}

function PostCardDemo() {
  const [rs, setRs] = useState<Reaction[]>([
    { emoji: "♥", count: 5 },
    { emoji: "📈", count: 2, mine: true },
  ]);
  return (
    <PostCard
      kind="take"
      author={{ name: "Mira", handle: "mira", seed: "wallet-mira" }}
      time="4m"
      body="JUP printing a clean higher-low. Adding on the retest."
      token={{ symbol: "JUP", price: "$0.8123", change24h: 4.2 }}
      reactions={rs}
      onReact={(e) => setRs((p) => toggle(p, e))}
    />
  );
}

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={TRIGGER} onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Sheet">
        <p className="pb-4 text-sm text-fg-muted">
          Backdrop, focus trap, drag-to-dismiss. The base for the sheets below.
        </p>
      </Sheet>
    </>
  );
}

const COMMENTS: Comment[] = [
  {
    author: { name: "Kip", handle: "kip", seed: "wallet-kip" },
    time: "6m",
    body: "Agreed: the retest held cleanly.",
    likes: 3,
    liked: true,
  },
  {
    author: { name: "Nova", handle: "nova", seed: "wallet-nova" },
    time: "1m",
    body: "Careful, low liquidity above.",
    likes: 0,
  },
];

function CommentsDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={TRIGGER} onClick={() => setOpen(true)}>
        Open comments
      </button>
      <CommentThread open={open} onOpenChange={setOpen} comments={COMMENTS} />
    </>
  );
}

function OnboardingDemo() {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [handle, setHandle] = useState("");
  return (
    <>
      <button type="button" className={TRIGGER} onClick={() => setOpen(true)}>
        Open onboarding
      </button>
      <Onboarding
        open={open}
        onOpenChange={setOpen}
        walletAddress={connected ? "7xKtPq4rZ9fQ2mNvB1cD" : null}
        onConnectWallet={() => setConnected(true)}
        handle={handle}
        onHandleChange={setHandle}
        availability={handle.length < 3 ? "idle" : handle.length % 2 === 0 ? "available" : "taken"}
        onJoin={() => setOpen(false)}
      />
    </>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Remove wallet…</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Remove wallet?"
        description="This disconnects @mira from this device."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Remove
            </Button>
          </>
        }
      />
    </>
  );
}

function SwitchDemo({ state }: DemoOpts = {}) {
  const [on, setOn] = useState(true);
  if (state === "on" || state === "off" || state === "disabled") {
    return (
      <label className="flex items-center gap-3 text-sm text-fg">
        <Switch
          checked={state === "on"}
          disabled={state === "disabled"}
          onCheckedChange={() => {}}
          aria-label="Public watchlist"
        />
        Public watchlist
      </label>
    );
  }
  return (
    <label className="flex items-center gap-3 text-sm text-fg">
      <Switch checked={on} onCheckedChange={setOn} aria-label="Public watchlist" />
      Public watchlist
    </label>
  );
}

function RadioGroupDemo() {
  const [slippage, setSlippage] = useState<"0.1" | "0.5" | "1.0" | undefined>("0.5");
  return (
    <RadioGroup
      aria-label="Slippage tolerance"
      value={slippage}
      onValueChange={setSlippage}
      options={[
        { value: "0.1", label: "0.1%", description: "May fail on volatile pairs" },
        { value: "0.5", label: "0.5%", description: "Recommended" },
        { value: "1.0", label: "1.0%" },
      ]}
    />
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(15);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 17)), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs text-fg-muted">Determinate: value {Math.min(value, 100)}%</p>
        <Progress aria-label="Upload progress" value={value} />
      </div>
      <div className="space-y-1.5">
        <p className="text-xs text-fg-muted">Indeterminate: unknown duration</p>
        <Progress aria-label="Syncing" />
      </div>
    </div>
  );
}

function BottomNavDemo() {
  const [tab, setTab] = useState<"feed" | "markets" | "portfolio">("feed");
  return (
    <BottomNav
      value={tab}
      onValueChange={setTab}
      items={[
        { value: "feed", label: "Feed", icon: <IconFeed size={18} /> },
        { value: "markets", label: "Markets", icon: <IconMarkets size={18} /> },
        { value: "portfolio", label: "Portfolio", icon: <IconPortfolio size={18} /> },
      ]}
    />
  );
}

function ComboboxDemo() {
  const [token, setToken] = useState<string | undefined>("sol");
  return (
    <Combobox
      aria-label="Search tokens"
      placeholder="Search tokens…"
      value={token}
      onValueChange={setToken}
      options={[
        { value: "sol", label: "SOL", hint: "$184.26" },
        { value: "jup", label: "JUP", hint: "$0.8123" },
        { value: "bonk", label: "BONK", hint: "$0.00002314" },
        { value: "jto", label: "JTO", hint: "$2.448" },
        { value: "wif", label: "WIF", hint: "$1.852" },
      ]}
    />
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open order details
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Order details"
        description="Filled 2m ago"
        footer={
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-2 text-xs text-fg-muted">
          <p>Pair: SOL / USDC</p>
          <p>Side: buy · 1.25 SOL</p>
          <p>Route: Jupiter (best route)</p>
        </div>
      </Drawer>
    </>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(7);
  return <Pagination page={page} count={24} onPageChange={setPage} />;
}

function WalletButtonDemo({ state }: DemoOpts = {}) {
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const connect = () => {
    setStatus("connecting");
    setTimeout(() => setStatus("connected"), 1400);
  };
  const controlled =
    state === "disconnected" || state === "connecting" || state === "connected"
      ? (state as WalletStatus)
      : null;
  const shown = controlled ?? status;
  return (
    <div className="flex flex-col items-start gap-3">
      <WalletButton
        status={shown}
        address="7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM"
        onClick={
          controlled
            ? () => {}
            : shown === "disconnected"
              ? connect
              : () => setStatus("disconnected")
        }
      />
      {!controlled && (
        <p className="text-[11px] text-fg-subtle">
          {shown === "connected" ? "click to reset the demo" : "click to walk the states"}
        </p>
      )}
    </div>
  );
}

function ChainSwitcherDemo() {
  const [chain, setChain] = useState("solana");
  return (
    <ChainSwitcher
      value={chain}
      onValueChange={setChain}
      networks={[
        { id: "solana", label: "Solana" },
        { id: "eclipse", label: "Eclipse" },
        { id: "sonic", label: "Sonic" },
      ]}
    />
  );
}

// Deterministic synthetic series (no Math.random: the canvas SSRs, so
// random data would hydrate-mismatch). Shape varies by range via a seed.
function series(points: number, seed: number, base: number, amp: number): PricePoint[] {
  return Array.from({ length: points }, (_, i) => {
    const wobble = Math.sin((i + seed) * 0.7) + Math.sin((i + seed) * 0.23) * 0.6;
    return { label: `${i + 1}`, price: +(base + wobble * amp + i * (amp * 0.05)).toFixed(2) };
  });
}
const PRICE_RANGES: Record<string, PricePoint[]> = {
  "1D": series(24, 1, 182, 2.2),
  "1W": series(28, 5, 176, 5.5),
  "1M": series(30, 9, 168, 9),
  "1Y": series(36, 3, 120, 26),
};

function PriceChartDemo() {
  const [range, setRange] = useState("1W");
  return (
    <PriceChart
      symbol="SOL / USDC"
      data={PRICE_RANGES[range]}
      range={range}
      ranges={Object.keys(PRICE_RANGES)}
      onRangeChange={setRange}
      aria-label="SOL / USDC price chart"
    />
  );
}

function QRCodeDemo() {
  return (
    <QRCode
      value="7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM"
      explorerHref="https://solscan.io/account/7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM"
      label="Scan to send SOL"
    />
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <label className="flex items-center gap-2.5 text-sm text-fg">
      <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Show depegged" />
      Show depegged assets
    </label>
  );
}

function SelectDemo() {
  const [net, setNet] = useState<string | undefined>("sol");
  return (
    <Select
      aria-label="Network"
      value={net}
      onValueChange={setNet}
      options={[
        { value: "sol", label: "Solana" },
        { value: "eth", label: "Ethereum" },
        { value: "base", label: "Base", disabled: true },
      ]}
    />
  );
}

function TabsDemo() {
  const [tab, setTab] = useState("news");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      tabs={[
        { value: "news", label: "News", content: <p className="text-xs text-fg-muted">NVDAx leads tokenized-equity volume…</p> },
        { value: "kpis", label: "KPIs", content: <p className="data-md text-fg">$1.09B mcap · $84.2M vol</p> },
      ]}
    />
  );
}

function ToastInner() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => toast({ title: "Watchlist updated", description: "JUP added", tone: "buy" })}>
        Success toast
      </Button>
      <Button size="sm" variant="ghost" onClick={() => toast({ title: "Couldn't reach the network", tone: "sell" })}>
        Error toast
      </Button>
    </div>
  );
}

function RollingDemo() {
  const [px, setPx] = useState(184.26);
  useEffect(() => {
    const id = setInterval(
      () => setPx((v) => +(v + (Math.random() - 0.5) * 0.4).toFixed(2)),
      1200,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-baseline gap-3">
      <RollingNumber value={`$${px.toFixed(2)}`} className="data-lg" />
      <PriceChange value={+(px - 184.26).toFixed(2)} suffix="" />
    </div>
  );
}

type MarketRow = { sym: string; px: number; ch: number; vol: string; trend: number[] };
const MARKET_ROWS: MarketRow[] = [
  { sym: "SOL", px: 184.26, ch: 3.6, vol: "$3.18B", trend: [3, 4, 3, 5, 6, 7] },
  { sym: "JUP", px: 0.8123, ch: -1.7, vol: "$142.6M", trend: [5, 4, 4, 3, 3, 2] },
  { sym: "BONK", px: 0.00002314, ch: 6.9, vol: "$318.4M", trend: [2, 2, 3, 4, 4, 6] },
  { sym: "JTO", px: 2.448, ch: -2.1, vol: "$38.2M", trend: [5, 5, 4, 4, 3, 3] },
];
const MARKET_COLS: Column<MarketRow>[] = [
  { key: "sym", header: "Token", cell: (r) => r.sym, sortable: true, sortValue: (r) => r.sym },
  { key: "px", header: "Price", align: "right", sortable: true, cell: (r) => `$${r.px}`, sortValue: (r) => r.px },
  { key: "ch", header: "24h", align: "right", sortable: true, cell: (r) => <PriceChange value={r.ch} />, sortValue: (r) => r.ch },
  { key: "vol", header: "Volume", align: "right", cell: (r) => r.vol },
  { key: "trend", header: "7d", align: "right", cell: (r) => <Sparkline data={r.trend} width={64} height={20} /> },
];

function TxStatusDemo({ state: external }: DemoOpts = {}) {
  const [state, setState] = useState<TxState>("idle");
  const controlled =
    external === "idle" ||
    external === "signing" ||
    external === "pending" ||
    external === "confirmed" ||
    external === "failed"
      ? (external as TxState)
      : null;
  useEffect(() => {
    if (controlled) return;
    const SEQ: TxState[] = ["idle", "signing", "pending", "confirmed"];
    const id = setInterval(
      () => setState((s) => SEQ[(SEQ.indexOf(s) + 1) % SEQ.length]),
      1800,
    );
    return () => clearInterval(id);
  }, [controlled]);
  const shown = controlled ?? state;
  return (
    <TxStatus
      state={shown}
      detail={
        shown === "pending"
          ? "5D3k…Wq signature"
          : shown === "failed"
            ? "User rejected"
            : undefined
      }
      detailHref={shown === "pending" ? "https://solscan.io/tx/demo" : undefined}
      action={
        shown === "failed" ? (
          <Button size="sm" variant="ghost" onClick={() => setState("idle")}>
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}

function AmountDemo() {
  const [amt, setAmt] = useState("1.25");
  return (
    <AmountInput
      value={amt}
      onValueChange={setAmt}
      symbol="SOL"
      fiatValue={`≈ $${(Number(amt || 0) * 184.26).toFixed(2)}`}
      onMax={() => setAmt("12.4821")}
    />
  );
}

const BOOK_ASKS: OrderBookLevel[] = [
  { price: 184.42, size: 182.4 },
  { price: 184.38, size: 94.1 },
  { price: 184.34, size: 64.8 },
  { price: 184.31, size: 128.9 },
  { price: 184.28, size: 71.3 },
  { price: 184.25, size: 45.4 },
  { price: 184.22, size: 104.8 },
  { price: 184.19, size: 58.7 },
];
const BOOK_BIDS: OrderBookLevel[] = [
  { price: 184.12, size: 118.6 },
  { price: 184.09, size: 88.2 },
  { price: 184.05, size: 164.4 },
  { price: 184.01, size: 57.9 },
  { price: 183.98, size: 96.8 },
  { price: 183.94, size: 44.2 },
  { price: 183.91, size: 139.1 },
  { price: 183.87, size: 63.4 },
];

function OrderBookDemo() {
  const [picked, setPicked] = useState("184.12");
  return (
    <div className="space-y-2">
      <OrderBook
        asks={BOOK_ASKS}
        bids={BOOK_BIDS}
        midPrice={184.15}
        baseLabel="SOL"
        quoteLabel="USDT"
        rowsPerSide={6}
        onPriceSelect={(price) => setPicked(price.toFixed(2))}
      />
      <p className="font-mono text-[10px] text-fg-subtle">selected limit price: {picked}</p>
    </div>
  );
}

function OrderTypeTabsDemo() {
  const [type, setType] = useState<OrderType>("limit");
  return <OrderTypeTabs value={type} onValueChange={setType} />;
}

function SizeSliderDemo() {
  const [value, setValue] = useState(38);
  return <SizeSlider value={value} onValueChange={setValue} />;
}

const MARKET_TABS: MarketTabItem[] = [
  { symbol: "SOL-PERP", label: "SOL", price: "$184.26", changePct: 3.64 },
  { symbol: "BTC-PERP", label: "BTC", price: "$73,420", changePct: -0.42 },
  { symbol: "JUP-PERP", label: "JUP", price: "$0.8123", changePct: 4.2 },
];

function MarketTabsDemo() {
  const [active, setActive] = useState("SOL-PERP");
  const [markets, setMarkets] = useState(MARKET_TABS);
  return (
    <MarketTabs
      markets={markets}
      activeSymbol={active}
      onActiveChange={setActive}
      onClose={(symbol) => setMarkets((rows) => rows.filter((row) => row.symbol !== symbol))}
      onAdd={() => setMarkets(MARKET_TABS)}
      addDisabled={markets.length === MARKET_TABS.length}
    />
  );
}

function MarginHealthDemo() {
  const [value, setValue] = useState(37);
  return (
    <div className="space-y-3">
      <MarginHealth value={value} />
      <SizeSlider
        value={value}
        onValueChange={setValue}
        label="Demo margin ratio"
        stops={[0, 50, 80, 90, 100]}
        showSubTicks={false}
      />
    </div>
  );
}

const DEMO_TOKENS: TokenOption[] = [
  { id: "sol", symbol: "SOL", name: "Solana", balance: "12.40" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "1,204.00" },
  { id: "jup", symbol: "JUP", name: "Jupiter", balance: "840.2" },
  { id: "bonk", symbol: "BONK", name: "Bonk", balance: "12,400,000" },
];

function TokenSelectDemo() {
  const [token, setToken] = useState<string | undefined>("sol");
  return (
    <div className="flex flex-col items-start gap-3">
      <TokenSelect tokens={DEMO_TOKENS} value={token} onValueChange={setToken} />
      <p className="text-[11px] text-fg-subtle">
        {token ? `selected · ${token}` : "none selected: click to pick"}
      </p>
    </div>
  );
}

function SlippageControlDemo() {
  const [bps, setBps] = useState(50);
  return <SlippageControl value={bps} onValueChange={setBps} />;
}

function AccountMenuDemo() {
  const [connected, setConnected] = useState(true);
  if (!connected) {
    return (
      <Button variant="primary" onClick={() => setConnected(true)}>
        Reconnect demo
      </Button>
    );
  }
  return (
    <AccountMenu
      address="7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM"
      balance="12.4 SOL"
      explorerHref="https://solscan.io"
      onDisconnect={() => setConnected(false)}
    />
  );
}

function ActivityRowDemo() {
  return (
    <div className="w-full space-y-1">
      <ActivityRow
        title="Swapped SOL → USDC"
        time="2m ago"
        status="confirmed"
        amount="+12.40 USDC"
        tokenSymbol="USDC"
      />
      <ActivityRow
        title="Pending send"
        time="just now"
        status="pending"
        amount="−0.50 SOL"
        tokenSymbol="SOL"
      />
      <ActivityRow
        title="Swap failed"
        time="1h ago"
        status="failed"
        amount="−2.00 SOL"
        tokenSymbol="SOL"
        onClick={() => {}}
      />
    </div>
  );
}

const WALLET_SAMPLES = [
  { a: "7xKXtg2CW3hqPzKZ4rE9mQvNbYd1sVfLpR8aUj5nHmTc", c: "Solana" },
  { a: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", c: "Ethereum" },
  { a: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", c: "Polygon" },
  { a: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", c: "Optimism" },
  { a: "0xdAC17F958D2ee523a2206206994597C13D831ec7", c: "Arbitrum" },
  { a: "0x514910771AF9Ca656af840dff83E8264EcF986CA", c: "Base" },
];

export const DEMOS: Record<string, DemoFn> = {
  ...PATTERN_DEMOS,
  surfaces: () => (
    <div className="grid grid-cols-3 gap-2">
      {SURFACES.map(([label, cls]) => (
        <div key={label}>
          <div className={`h-10 rounded-lg border border-outline-variant ${cls}`} />
          <div className="mt-1 text-[10px] text-fg-subtle">{label}</div>
        </div>
      ))}
    </div>
  ),
  hues: () => (
    <div className="flex flex-wrap gap-2">
      {ID_HUES.map((hue) => (
        <div key={hue} className="text-center">
          <Avatar name={hue} hue={hue} size="md" />
          <div className="mt-1 text-[10px] text-fg-subtle">{hue}</div>
        </div>
      ))}
    </div>
  ),
  motion: () => (
    <div className="space-y-2">
      {MOTION.map(([token, value, use]) => (
        <div key={token} className="flex items-baseline justify-between gap-3">
          <code className="text-xs text-brand">{token}</code>
          <span className="text-[11px] text-fg-muted">{value}</span>
          <span className="text-[10px] text-fg-subtle">{use}</span>
        </div>
      ))}
    </div>
  ),
  Avatar: ({ state } = {}) => {
    if (state === "network")
      return (
        <div className="flex flex-col gap-2.5">
          {WALLET_SAMPLES.slice(0, 3).map((w) => (
            <div key={w.a} className="flex items-center gap-3">
              <Avatar
                name={w.c}
                seed={w.a}
                variant="shards"
                size="lg"
                chain={{ name: w.c }}
              />
              <span className="text-xs text-fg-muted">on {w.c}</span>
            </div>
          ))}
        </div>
      );
    if (state === "connection")
      return (
        <div className="flex flex-col gap-2.5">
          {(
            [
              ["active", "connected & active"],
              ["inactive", "connected & inactive"],
              ["offline", "no connection (offline)"],
            ] as const
          ).map(([c, labelText]) => (
            <div key={c} className="flex items-center gap-3">
              <Avatar
                name="Mira"
                seed="wallet-mira"
                variant="shards"
                size="lg"
                connection={c}
              />
              <span className="text-xs text-fg-muted">{labelText}</span>
            </div>
          ))}
        </div>
      );
    if (state === "hues")
      return (
        <div className="flex flex-wrap items-center gap-2">
          {ID_HUES.map((h) => (
            <Avatar key={h} name={h} hue={h} size="md" />
          ))}
        </div>
      );
    if (state === "sizes")
      return (
        <div className="flex items-end gap-3">
          {(["xs", "sm", "md", "lg"] as const).map((sz) => (
            <Avatar key={sz} name="Mira" seed="wallet-mira" size={sz} />
          ))}
        </div>
      );
    return (
      <div className="flex flex-col gap-3">
        {(
          [
            ["initial", "initial"],
            ["shards", "shards"],
            ["blocks", "blocks"],
          ] as const
        ).map(([v, labelText]) => (
          <div key={v} className="flex items-center gap-3">
            {WALLET_SAMPLES.slice(0, 4).map((w) => (
              <Avatar
                key={w.a}
                name={w.c}
                seed={w.a}
                variant={v}
                size="lg"
              />
            ))}
            <span className="text-xs text-fg-muted">{labelText}</span>
          </div>
        ))}
      </div>
    );
  },
  WalletAvatar: ({ state } = {}) => {
    if (state === "network")
      return (
        <div className="flex flex-col gap-2.5">
          {WALLET_SAMPLES.slice(0, 3).map((w) => (
            <div key={w.a} className="flex items-center gap-3">
              <WalletAvatar address={w.a} size="lg" chain={{ name: w.c }} />
              <span className="text-xs text-fg-muted">on {w.c}</span>
            </div>
          ))}
        </div>
      );
    if (state === "connection")
      return (
        <div className="flex flex-col gap-2.5">
          {(
            [
              ["active", "connected & active"],
              ["inactive", "connected & inactive"],
              ["offline", "no connection (offline)"],
            ] as const
          ).map(([c, labelText]) => (
            <div key={c} className="flex items-center gap-3">
              <WalletAvatar
                address={WALLET_SAMPLES[0].a}
                size="lg"
                connection={c}
              />
              <span className="text-xs text-fg-muted">{labelText}</span>
            </div>
          ))}
        </div>
      );
    if (state === "sizes")
      return (
        <div className="flex items-end gap-3">
          {(["xs", "sm", "md", "lg"] as const).map((sz) => (
            <WalletAvatar
              key={sz}
              address={WALLET_SAMPLES[0].a}
              size={sz}
              chain={{ name: "Solana" }}
            />
          ))}
        </div>
      );
    return (
      <div className="flex flex-col gap-3">
        {(["shards", "blocks"] as const).map((v) => (
          <div key={v} className="flex items-center gap-3">
            {WALLET_SAMPLES.slice(0, 4).map((w) => (
              <WalletAvatar key={w.a} address={w.a} size="lg" variant={v} />
            ))}
            <span className="text-xs text-fg-muted">{v}</span>
          </div>
        ))}
      </div>
    );
  },
  AvatarGroup: () => (
    <AvatarGroup
      members={[
        { name: "mira", seed: "wallet-mira" },
        { name: "kip", seed: "wallet-kip" },
        { name: "nova", seed: "wallet-nova" },
        { name: "sol", seed: "wallet-sol" },
        { name: "ali", seed: "wallet-ali" },
      ]}
    />
  ),
  TokenIcon: () => (
    <div className="flex items-center gap-3">
      <TokenIcon symbol="SOL" size="sm" />
      <TokenIcon symbol="JUP" size="md" />
      <TokenIcon symbol="BONK" size="lg" />
      <span className="text-[10px] text-fg-subtle">initials fallback · icon CDN default is a follow-up</span>
    </div>
  ),
  TokenChip: () => (
    <div className="flex flex-col items-start gap-2">
      <TokenChip symbol="JUP" price="$0.8123" change24h={4.2} />
      <TokenChip symbol="BONK" price="$0.0000213" change24h={-1.31} />
    </div>
  ),
  SocialProofChip: () => (
    <div className="flex items-center gap-4">
      <SocialProofChip count={41} />
      <SocialProofChip count={41} compact />
      <SocialProofChip count={7} label="holding" />
    </div>
  ),
  ReactionBar: ReactionDemo,
  FollowButton: FollowDemo,
  Lane: LaneDemo,
  PostCard: PostCardDemo,
  Sheet: SheetDemo,
  CommentThread: CommentsDemo,
  Onboarding: OnboardingDemo,
  Button: ({ state } = {}) =>
    state === "disabled" ? (
      <Button disabled>Disabled</Button>
    ) : (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary">Confirm</Button>
        <Button>Cancel</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="destructive" size="sm">Remove</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
  LoadingButton: LoadingButtonDemo,
  HoldToConfirm: HoldToConfirmDemo,
  OTPInput: OTPInputDemo,
  InlineValidation: InlineValidationDemo,
  WizardSteps: WizardStepsDemo,
  IconButton: () => (
    <div className="flex items-center gap-2">
      <IconButton aria-label="Settings" variant="secondary">
        <IconSettings size={16} />
      </IconButton>
      <IconButton aria-label="Close">
        <IconClose size={16} weight="bold" />
      </IconButton>
      <IconButton aria-label="Add" variant="primary" size="lg">
        <IconAdd size={18} weight="bold" />
      </IconButton>
    </div>
  ),
  Badge: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>neutral</Badge>
      <Badge tone="brand">new</Badge>
      <Badge tone="buy">on peg</Badge>
      <Badge tone="sell">depegged</Badge>
      <Badge tone="warning">pending</Badge>
      <Badge tone="info">bridged</Badge>
    </div>
  ),
  Input: ({ state } = {}) =>
    state === "invalid" ? (
      <Input aria-label="Handle" invalid defaultValue="taken_handle" />
    ) : state === "disabled" ? (
      <Input aria-label="Search" disabled placeholder="Search tokens…" />
    ) : state === "default" ? (
      <Input aria-label="Search" placeholder="Search tokens…" />
    ) : (
      <div className="space-y-2">
        <Input aria-label="Search" placeholder="Search tokens…" />
        <Input aria-label="Handle" invalid defaultValue="taken_handle" />
      </div>
    ),
  Dialog: DialogDemo,
  AddressChip: () => (
    <AddressChip
      address="7xKtF3aB9cD2eF4gH6jK8mN1pQ5rS7tU9vW2xY4z9fQ2"
      href="https://solscan.io/token/x"
    />
  ),
  PegBadge: ({ state } = {}) =>
    state === "on-peg" ? (
      <PegBadge deviationBps={4} />
    ) : state === "drifting" ? (
      <PegBadge deviationBps={-38} />
    ) : state === "depegged" ? (
      <PegBadge deviationBps={-230} />
    ) : (
      <div className="flex flex-wrap gap-2">
        <PegBadge deviationBps={4} />
        <PegBadge deviationBps={-38} />
        <PegBadge deviationBps={-230} />
      </div>
    ),
  NetworkBadge: () => (
    <div className="flex flex-wrap gap-2">
      <NetworkBadge name="Solana" iconSrc="https://cdn.defitriangle.xyz/logos/network/solana/32.png" />
      <NetworkBadge name="Base" />
      <NetworkBadge name="Wrong network" tone="warning" />
      <NetworkBadge name="Unsupported" tone="error" />
    </div>
  ),
  TxStatus: TxStatusDemo,
  AmountInput: AmountDemo,
  ExchangeOrderBook: OrderBookDemo,
  OrderBook: OrderBookDemo,
  OrderTypeTabs: OrderTypeTabsDemo,
  SizeSlider: SizeSliderDemo,
  MarketTabs: MarketTabsDemo,
  MarginHealth: MarginHealthDemo,
  TokenSelect: TokenSelectDemo,
  SlippageControl: SlippageControlDemo,
  AccountMenu: AccountMenuDemo,
  ActivityRow: ActivityRowDemo,
  RollingNumber: RollingDemo,
  PriceChange: ({ state } = {}) =>
    state === "up" ? (
      <PriceChange value={9.4} />
    ) : state === "down" ? (
      <PriceChange value={-4.2} />
    ) : state === "flat" ? (
      <PriceChange value={0.04} suffix=" bps" precision={2} />
    ) : (
      <div className="flex items-center gap-4">
        <PriceChange value={9.4} />
        <PriceChange value={-4.2} />
        <PriceChange value={0.04} suffix=" bps" precision={2} />
      </div>
    ),
  StatCell: () => (
    <div className="grid grid-cols-3 divide-x divide-outline-variant rounded-card border border-outline-variant bg-surface-container">
      <StatCell label="Market cap" value="$1.09B" />
      <StatCell label="24h volume" value="$84.2M" change={<PriceChange value={12.4} />} />
      <StatCell label="Liquidity" value="$18.7M" change={<PriceChange value={-0.8} />} />
    </div>
  ),
  Sparkline: () => (
    <div className="flex items-center gap-4">
      <Sparkline data={[2, 3, 2, 5, 6, 8]} label="up trend" />
      <Sparkline data={[8, 7, 7, 5, 4, 3]} label="down trend" />
      <Sparkline data={[4, 5, 4, 5, 4, 5]} tone="neutral" label="flat" />
    </div>
  ),
  DataTable: () => (
    <DataTable columns={MARKET_COLS} rows={MARKET_ROWS} rowKey={(r) => r.sym} caption="Markets" />
  ),
  Switch: SwitchDemo,
  Checkbox: CheckboxDemo,
  Select: SelectDemo,
  Tabs: TabsDemo,
  Toast: () => (
    <ToastProvider>
      <ToastInner />
    </ToastProvider>
  ),
  Divider: () => (
    <div className="text-xs text-fg-muted">
      Section one
      <Divider className="my-2" />
      Section two
    </div>
  ),
  EmptyState: ({ state } = {}) => (
    <EmptyState
      title="No watchers yet"
      hint="Quiet tide. First one in sets the current."
      action={
        state === "no-action" ? undefined : (
          <Button variant="primary" size="sm">Watch JUP</Button>
        )
      }
    />
  ),
  Menu: () => (
    <Menu
      trigger={<IconButton aria-label="Post actions" variant="secondary">
          <IconOverflow size={16} weight="bold" />
        </IconButton>}
      items={[
        { label: "Copy link", onSelect: () => {} },
        { label: "Mute @deg", onSelect: () => {} },
        { kind: "separator" },
        { label: "Delete", onSelect: () => {}, destructive: true },
      ]}
    />
  ),
  ContextMenu: () => (
    <ContextMenu
      items={[
        { label: "Copy address", onSelect: () => {} },
        { label: "View on explorer", onSelect: () => {} },
        { kind: "separator" },
        { label: "Remove", onSelect: () => {}, destructive: true },
      ]}
    >
      <div className="flex h-24 w-full cursor-context-menu items-center justify-center rounded-card border border-dashed border-outline-variant bg-surface-dim text-xs text-fg-muted">
        Right-click this surface
      </div>
    </ContextMenu>
  ),
  Skeleton: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SectionSkeleton height={96} label="Stats" />
    </div>
  ),
  Card: () => (
    <div className="space-y-3">
      <Card>
        <p className="text-sm font-medium text-fg">Portfolio</p>
        <p className="text-xs text-fg-muted">3 positions · $12,480</p>
      </Card>
      <Card interactive>
        <p className="text-sm font-medium text-fg">Interactive card</p>
        <p className="text-xs text-fg-muted">hover lifts · press scales 0.98</p>
      </Card>
    </div>
  ),
  Accordion: () => (
    <Accordion
      items={[
        { value: "fees", title: "Fees", content: <p>0.25% taker · 0.10% maker</p> },
        { value: "route", title: "Route details", content: <p>SOL → USDC via Jupiter</p> },
        { value: "risk", title: "Risk", content: <p>Price impact 0.4% · slippage 0.5%</p> },
      ]}
    />
  ),
  Alert: ({ state } = {}) => {
    const tone =
      state === "warning" || state === "error" || state === "info" || state === "success"
        ? state
        : null;
    if (tone) {
      return (
        <Alert
          tone={tone}
          title={
            tone === "warning"
              ? "High price impact"
              : tone === "error"
                ? "Feed unavailable"
                : tone === "info"
                  ? "Network fee updated"
                  : "Swap confirmed"
          }
          action={
            tone === "error" ? (
              <Button size="sm" variant="ghost">Retry</Button>
            ) : undefined
          }
        >
          {tone === "warning"
            ? "This trade moves the pool price by 4.2%."
            : tone === "error"
              ? "Prices may be stale."
              : undefined}
        </Alert>
      );
    }
    return (
      <div className="space-y-3">
        <Alert tone="warning" title="High price impact">
          This trade moves the pool price by 4.2%.
        </Alert>
        <Alert
          tone="error"
          title="Feed unavailable"
          action={<Button size="sm" variant="ghost">Retry</Button>}
        >
          Prices may be stale.
        </Alert>
      </div>
    );
  },
  Textarea: () => (
    <div className="space-y-3">
      <Textarea aria-label="Note" placeholder="Add a note to this transaction…" />
      <Textarea aria-label="Invalid note" invalid defaultValue="Too long for a memo field" rows={2} />
    </div>
  ),
  RadioGroup: RadioGroupDemo,
  Progress: ProgressDemo,
  AppBar: () => (
    <AppBar
      title="Markets"
      leading={<IconButton aria-label="Back" variant="ghost">‹</IconButton>}
      actions={
        <IconButton aria-label="Settings" variant="ghost">
          <IconSettings size={16} />
        </IconButton>
      }
    />
  ),
  BottomNav: BottomNavDemo,
  Breadcrumbs: () => (
    <Breadcrumbs
      items={[
        { label: "Design", href: "#" },
        { label: "Components", href: "#" },
        { label: "Accordion" },
      ]}
    />
  ),
  Combobox: ComboboxDemo,
  Drawer: DrawerDemo,
  Pagination: PaginationDemo,
  Amount: () => (
    <div className="flex flex-col gap-2">
      <Amount value={1234.5678} symbol="SOL" size="lg" />
      <Amount value={0.00002314} symbol="BONK" />
      <Amount value={-12.5} symbol="USDC" />
    </div>
  ),
  ChainSwitcher: ChainSwitcherDemo,
  PriceChart: PriceChartDemo,
  QRCode: QRCodeDemo,
  GasFee: () => (
    <div className="space-y-2">
      <GasFee amount="0.000005 SOL" usd="≈ $0.0009" level="low" />
      <GasFee amount="0.0021 SOL" usd="≈ $0.39" level="elevated" label="Priority fee" />
      <GasFee loading />
      <GasFee error="Fee unavailable" />
    </div>
  ),
  WalletButton: WalletButtonDemo,
  Popover: () => (
    <Popover trigger={<Button variant="secondary" size="sm">Filters</Button>}>
      <p className="mb-2 text-xs font-medium text-fg">Show</p>
      <div className="space-y-1 text-xs text-fg-muted">
        <p className="flex items-center gap-1.5">
          <IconRadioOn size={12} aria-hidden="true" /> All markets
        </p>
        <p className="flex items-center gap-1.5">
          <IconRadioOff size={12} aria-hidden="true" /> Watchlist only
        </p>
        <p className="flex items-center gap-1.5">
          <IconRadioOff size={12} aria-hidden="true" /> Depegged only
        </p>
      </div>
    </Popover>
  ),
  Tooltip: () => (
    <div className="flex items-center gap-2 text-sm text-fg-muted">
      Organic score
      <Tooltip
        content="Jupiter's 0–100 estimate of how much volume is real-human."
        title="Organic score"
      >
        <button
          type="button"
          aria-label="About organic score"
          className="inline-flex h-6 w-6 items-center justify-center rounded-control bg-surface-container-high text-[11px] text-fg-muted"
        >
          ?
        </button>
      </Tooltip>
    </div>
  ),
};
