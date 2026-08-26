"use client";

// Live frames for src/design-system/PATTERNS.md: composed ONLY from
// design-system exports (the pattern contract). Registered into DEMOS
// via the spread in demos.tsx; kept separate for the 700-LOC cap.

import { useEffect, useRef, useState } from "react";
import type { DemoFn, DemoOpts } from "./demoStates";
import {
  AddressChip,
  AmountInput,
  Badge,
  Button,
  DataTable,
  Dialog,
  EmptyState,
  GasFee,
  IconArrowRight,
  IconCheck,
  IconCross,
  Input,
  Lane,
  LoadingButton,
  NetworkBadge,
  PriceChange,
  SectionSkeleton,
  SlippageControl,
  Sparkline,
  ToastProvider,
  TokenIcon,
  TokenSelect,
  TxStatus,
  type Column,
  type TokenOption,
  type TxState,
  useToast,
} from "@/design-system";

// ── Do/Don't strip (HIG's most-copied device) ────────────────────────
function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-outline-variant pt-3 text-[11px] leading-snug">
      <ul className="space-y-1">
        {dos.map((d) => (
          <li key={d} className="flex gap-1.5 text-fg-muted">
            <span className="inline-flex flex-none items-center gap-1 font-semibold text-buy">
              <IconCheck size={11} weight="bold" aria-hidden="true" /> Do
            </span>{" "}
            {d}
          </li>
        ))}
      </ul>
      <ul className="space-y-1">
        {donts.map((d) => (
          <li key={d} className="flex gap-1.5 text-fg-muted">
            <span className="inline-flex flex-none items-center gap-1 font-semibold text-sell">
              <IconCross size={11} weight="bold" aria-hidden="true" /> Don&apos;t
            </span>{" "}
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── P1 · States catalog ──────────────────────────────────────────────
type SurfaceState = "loading" | "loaded" | "empty" | "error" | "offline";

function StatesCatalogDemo({ state: external }: DemoOpts = {}) {
  const [internal, setInternal] = useState<SurfaceState>("loading");
  const controlled =
    external === "loading" ||
    external === "loaded" ||
    external === "empty" ||
    external === "error" ||
    external === "offline"
      ? external
      : null;
  const state = controlled ?? internal;
  const setState = setInternal;
  return (
    <div>
      {!controlled && (
        <div className="mb-3 flex flex-wrap gap-1">
          {(["loading", "loaded", "empty", "error", "offline"] as const).map((s) => (
            <Button key={s} size="sm" variant={state === s ? "primary" : "ghost"} onClick={() => setState(s)}>
              {s}
            </Button>
          ))}
        </div>
      )}
      {state === "offline" && (
        <div className="mb-2 flex items-center gap-2 rounded-chip bg-warning-surface px-2 py-1 text-[11px] text-warning">
          <Badge tone="warning">offline</Badge> Reconnecting: showing last-good data.
        </div>
      )}
      {state === "loading" ? (
        <SectionSkeleton height={132} label="Watchers" />
      ) : state === "error" ? (
        <div className="flex min-h-[132px] items-center justify-between rounded-card border border-outline-variant bg-surface-container p-4">
          <span className="flex items-center gap-2 text-sm text-fg-muted">
            <Badge tone="sell">error</Badge> Couldn&apos;t load watchers.
          </span>
          <Button size="sm" onClick={() => setState("loading")}>Retry</Button>
        </div>
      ) : state === "empty" ? (
        <EmptyState
          className="min-h-[132px] py-6"
          title="No watchers yet"
          hint="Quiet tide. First one in sets the current."
          action={<Button variant="primary" size="sm">Watch JUP</Button>}
        />
      ) : (
        <div className="min-h-[132px] rounded-card border border-outline-variant bg-surface-container p-4">
          <div className="text-[10px] text-fg-muted">Watchers</div>
          <div className="data-lg mt-1 text-fg">41</div>
          <div className="mt-1 text-xs text-fg-muted">9 joined today</div>
        </div>
      )}
      <DoDont
        dos={["give every empty a hint + one action", "match skeleton height to the loaded card"]}
        donts={["spinner-only pages (layout jumps)", "toast an error the user is looking at"]}
      />
    </div>
  );
}

// ── P2 · Transaction flow ────────────────────────────────────────────
function TxFlowInner() {
  const toast = useToast();
  const [amt, setAmt] = useState("1.25");
  const [step, setStep] = useState<"entering" | "review">("entering");
  const [tx, setTx] = useState<TxState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const sign = () => {
    setStep("entering");
    setTx("signing");
    timers.current.push(
      setTimeout(() => setTx("pending"), 1400),
      setTimeout(() => {
        setTx("confirmed");
        toast({ title: "Send confirmed", description: `${amt} SOL`, tone: "buy" });
      }, 3200),
    );
  };

  return (
    <div className="space-y-3">
      <AmountInput
        value={amt}
        onValueChange={setAmt}
        symbol="SOL"
        fiatValue={`≈ $${(Number(amt || 0) * 184.26).toFixed(2)}`}
        disabled={tx === "signing" || tx === "pending"}
      />
      <div className="flex items-center justify-between gap-3">
        <TxStatus state={tx} detail={tx === "pending" ? "5D3k…Wq signature" : undefined} />
        <span className="flex gap-2">
          {tx === "confirmed" || tx === "failed" ? (
            <Button size="sm" onClick={() => setTx("idle")}>Reset</Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              disabled={tx === "signing" || tx === "pending" || !Number(amt)}
              onClick={() => setStep("review")}
            >
              Send
            </Button>
          )}
        </span>
      </div>
      <Dialog
        open={step === "review"}
        onOpenChange={(o) => !o && setStep("entering")}
        title="Review send"
        description="You'll confirm this in your wallet."
        footer={
          <>
            <Button onClick={() => setStep("entering")}>Cancel</Button>
            <Button variant="primary" onClick={sign}>Confirm</Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="data-md text-fg">{amt} SOL</span>
          <IconArrowRight size={13} className="text-fg-subtle" aria-hidden="true" />
          <AddressChip address="7xKtF3aB9cD2eF4gH6jK8mN1pQ5rS7tU9vW2xY4z9fQ2" />
          <NetworkBadge name="Solana" />
        </div>
      </Dialog>
      <DoDont
        dos={["keep TxStatus mounted through the flow", "disable (don't hide) the action while signing"]}
        donts={["declare success at submission", "reshuffle the layout mid-flow"]}
      />
    </div>
  );
}
function TxFlowDemo() {
  return (
    <ToastProvider>
      <TxFlowInner />
    </ToastProvider>
  );
}

// ── P3 · Form row ────────────────────────────────────────────────────
function FormRowDemo() {
  const [handle, setHandle] = useState("mira");
  const taken = handle.trim().toLowerCase() === "mira";
  return (
    <div>
      <div className="space-y-1.5">
        <label htmlFor="p3-handle" className="block text-xs text-fg-muted">
          Handle
        </label>
        <Input
          id="p3-handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          invalid={taken}
          aria-describedby={taken ? "p3-handle-err" : undefined}
        />
        {taken && (
          <p id="p3-handle-err" className="text-xs text-sell">
            That handle is taken: try another.
          </p>
        )}
      </div>
      <DoDont
        dos={["message under the field, linked via aria-describedby"]}
        donts={["border color alone", "blocking paste"]}
      />
    </div>
  );
}

// ── P4 · Market list ─────────────────────────────────────────────────
type MarketRow = { sym: string; px: number; ch: number; trend: number[] };
const P4_ROWS: MarketRow[] = [
  { sym: "SOL", px: 184.26, ch: 3.6, trend: [3, 4, 3, 5, 6, 7] },
  { sym: "JUP", px: 0.8123, ch: -1.7, trend: [5, 4, 4, 3, 3, 2] },
  { sym: "BONK", px: 0.00002314, ch: 6.9, trend: [2, 2, 3, 4, 4, 6] },
];
const P4_COLS: Column<MarketRow>[] = [
  {
    key: "tok",
    header: "Token",
    sortable: true,
    sortValue: (r) => r.sym,
    cell: (r) => (
      <span className="flex items-center gap-2">
        <TokenIcon symbol={r.sym} size="sm" />
        <span className="font-medium">{r.sym}</span>
      </span>
    ),
  },
  { key: "px", header: "Price", align: "right", sortable: true, cell: (r) => `$${r.px}`, sortValue: (r) => r.px },
  { key: "ch", header: "24h", align: "right", sortable: true, cell: (r) => <PriceChange value={r.ch} />, sortValue: (r) => r.ch },
  { key: "tr", header: "7d", align: "right", cell: (r) => <Sparkline data={r.trend} width={56} height={18} /> },
];

function MarketListDemo() {
  return (
    <div>
      <DataTable columns={P4_COLS} rows={P4_ROWS} rowKey={(r) => r.sym} caption="Markets pattern" />
      <DoDont
        dos={["right-align numerals in the tabular ramp", "let density tokens set row height"]}
        donts={["color-only direction (pair the direction icon + sign)", "animate rows on data ticks"]}
      />
    </div>
  );
}

// ── P5 · Swap / receive ticket ───────────────────────────────────────
const TICKET_TOKENS: TokenOption[] = [
  { id: "sol", symbol: "SOL", name: "Solana", balance: "12.40" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "240.00" },
  { id: "jup", symbol: "JUP", name: "Jupiter", balance: "880.2" },
];

function SwapReceiveInner() {
  const toast = useToast();
  const [mode, setMode] = useState<"swap" | "receive">("swap");
  const [from, setFrom] = useState<string | undefined>("sol");
  const [to, setTo] = useState<string | undefined>("usdc");
  const [amt, setAmt] = useState("1.25");
  const [bps, setBps] = useState(50);
  const [tx, setTx] = useState<TxState>("idle");
  const [review, setReview] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const submit = async () => {
    setReview(false);
    setTx("signing");
    await new Promise<void>((r) => {
      timers.current.push(setTimeout(r, 900));
    });
    setTx("pending");
    await new Promise<void>((r) => {
      timers.current.push(setTimeout(r, 1200));
    });
    setTx("confirmed");
    toast({
      title: "Swap confirmed",
      description: `${amt} ${from?.toUpperCase() ?? ""} → ${to?.toUpperCase() ?? ""}`,
      tone: "buy",
    });
  };

  return (
    <div>
      <Lane
        options={[
          { value: "swap", label: "Swap" },
          { value: "receive", label: "Receive" },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === "swap" ? (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TokenSelect
              tokens={TICKET_TOKENS}
              value={from}
              onValueChange={setFrom}
              aria-label="You pay"
              className="min-w-[7.5rem]"
            />
            <IconArrowRight size={12} className="text-fg-subtle" aria-hidden="true" />
            <TokenSelect
              tokens={TICKET_TOKENS}
              value={to}
              onValueChange={setTo}
              aria-label="You receive"
              className="min-w-[7.5rem]"
            />
          </div>
          <AmountInput symbol="SOL" value={amt} onValueChange={setAmt} />
          <SlippageControl value={bps} onValueChange={setBps} />
          <GasFee amount="0.000005 SOL" usd="≈ $0.0009" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReview(true)}
              disabled={!from || !to || !amt}
            >
              Review
            </Button>
            <LoadingButton
              onAction={submit}
              pendingLabel="Signing…"
              successLabel="Submitted"
              disabled={!from || !to || !amt || tx === "signing" || tx === "pending"}
            >
              Swap
            </LoadingButton>
          </div>
          <TxStatus state={tx} detail={tx === "idle" ? undefined : "5D3k…Wq"} />
          <Dialog
            open={review}
            onOpenChange={setReview}
            title="Review swap"
            description="Confirm in your wallet after this step."
            footer={
              <>
                <Button onClick={() => setReview(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setReview(false);
                    void submit();
                  }}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <div className="space-y-2 text-xs text-fg-muted">
              <p>
                {amt} {from?.toUpperCase()} → {to?.toUpperCase()}
              </p>
              <p>Slippage {bps / 100}%</p>
              <NetworkBadge name="Solana" />
            </div>
          </Dialog>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <NetworkBadge name="Solana" />
          <AddressChip address="7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM" />
          <p className="text-[11px] text-fg-muted">
            Copy the address to receive. Pair with the QRCode composition in product
            UIs: it stays outside this portable pattern.
          </p>
        </div>
      )}
      <DoDont
        dos={["one ticket, two modes (Lane)", "Slippage above confirm; LoadingButton for async"]}
        donts={["QR inside the portable pattern", "call it Swapped before TxStatus confirmed"]}
      />
    </div>
  );
}

function SwapReceiveDemo() {
  return (
    <ToastProvider>
      <SwapReceiveInner />
    </ToastProvider>
  );
}

export const PATTERN_DEMOS: Record<string, DemoFn> = {
  PatternStates: StatesCatalogDemo,
  PatternTxFlow: TxFlowDemo,
  PatternFormRow: FormRowDemo,
  PatternMarketList: MarketListDemo,
  PatternSwapReceive: SwapReceiveDemo,
};
