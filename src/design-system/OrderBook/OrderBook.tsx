"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OrderBookSide = "ask" | "bid";
export type OrderBookView = "asks" | "mixed" | "bids";

export type OrderBookLevel = {
  price: number;
  size: number;
};

export type OrderBookStaleState = {
  level: "fresh" | "mild" | "severe" | "frozen";
  secondsSinceUpdate?: number;
};

const ROWS_PER_SIDE = 8;
const ROWS_SINGLE_SIDE = 16;

function fmtPrice(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 8,
  });
}

function fmtSize(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function snapToTickDecimals(tick: number): number {
  if (tick >= 1) return 0;
  return Math.min(8, Math.ceil(-Math.log10(tick)));
}

export function defaultTickOptions(midPrice: number | null): number[] {
  const p = midPrice ?? 100;
  if (p >= 10_000) return [0.5, 1, 5, 10, 50];
  if (p >= 1_000) return [0.1, 0.5, 1, 5, 10];
  if (p >= 100) return [0.01, 0.1, 0.5, 1, 5];
  if (p >= 1) return [0.001, 0.01, 0.1, 0.5, 1];
  return [0.0001, 0.001, 0.01, 0.1, 0.5];
}

export function aggregateLevels(
  levels: OrderBookLevel[],
  tick: number,
  side: OrderBookSide,
): OrderBookLevel[] {
  if (tick <= 0) {
    return [...levels].sort((a, b) =>
      side === "ask" ? a.price - b.price : b.price - a.price,
    );
  }

  const buckets = new Map<number, number>();
  for (const level of levels) {
    const bucket =
      side === "ask"
        ? Math.ceil(level.price / tick) * tick
        : Math.floor(level.price / tick) * tick;
    const key = Number(bucket.toFixed(snapToTickDecimals(tick)));
    buckets.set(key, (buckets.get(key) ?? 0) + level.size);
  }

  return Array.from(buckets.entries())
    .map(([price, size]) => ({ price, size }))
    .sort((a, b) => (side === "ask" ? a.price - b.price : b.price - a.price));
}

export function OrderBook({
  asks,
  bids,
  midPrice,
  valueFormat = fmtPrice,
  sizeFormat = fmtSize,
  quoteLabel = "USDT",
  baseLabel = "BASE",
  view,
  defaultView = "mixed",
  onViewChange,
  tick,
  defaultTick,
  tickOptions,
  onTickChange,
  showCumulativeBars = true,
  loading = false,
  error,
  stale,
  onReconnect,
  onPriceSelect,
  rowsPerSide = ROWS_PER_SIDE,
  "aria-label": ariaLabel = "Order book",
  className,
}: {
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
  midPrice?: number | null;
  valueFormat?: (value: number) => string;
  sizeFormat?: (value: number) => string;
  quoteLabel?: string;
  baseLabel?: string;
  view?: OrderBookView;
  defaultView?: OrderBookView;
  onViewChange?: (view: OrderBookView) => void;
  tick?: number;
  defaultTick?: number;
  tickOptions?: number[];
  onTickChange?: (tick: number) => void;
  showCumulativeBars?: boolean;
  loading?: boolean;
  error?: string | null;
  stale?: OrderBookStaleState;
  onReconnect?: () => void;
  onPriceSelect?: (price: number, side: OrderBookSide) => void;
  rowsPerSide?: number;
  "aria-label"?: string;
  className?: string;
}) {
  const computedMid = useMemo(() => {
    if (midPrice !== undefined) return midPrice;
    const bestAsk = aggregateLevels(asks, 0, "ask")[0]?.price;
    const bestBid = aggregateLevels(bids, 0, "bid")[0]?.price;
    if (bestAsk !== undefined && bestBid !== undefined) return (bestAsk + bestBid) / 2;
    return bestAsk ?? bestBid ?? null;
  }, [asks, bids, midPrice]);

  const [innerView, setInnerView] = useState<OrderBookView>(defaultView);
  const actualView = view ?? innerView;
  const setView = (next: OrderBookView) => {
    if (view === undefined) setInnerView(next);
    onViewChange?.(next);
  };

  const options = tickOptions ?? defaultTickOptions(computedMid);
  const [innerTick, setInnerTick] = useState(defaultTick ?? options[0] ?? 0);
  const actualTick = tick ?? (options.includes(innerTick) ? innerTick : options[0] ?? 0);
  const setTick = (next: number) => {
    if (tick === undefined) setInnerTick(next);
    onTickChange?.(next);
  };

  const askRows =
    actualView === "bids"
      ? 0
      : actualView === "asks"
        ? Math.max(rowsPerSide, ROWS_SINGLE_SIDE)
        : rowsPerSide;
  const bidRows =
    actualView === "asks"
      ? 0
      : actualView === "bids"
        ? Math.max(rowsPerSide, ROWS_SINGLE_SIDE)
        : rowsPerSide;

  const fullAsks = useMemo(
    () => aggregateLevels(asks, actualTick, "ask").slice(0, rowsPerSide),
    [asks, actualTick, rowsPerSide],
  );
  const fullBids = useMemo(
    () => aggregateLevels(bids, actualTick, "bid").slice(0, rowsPerSide),
    [bids, actualTick, rowsPerSide],
  );
  const displayAsks = useMemo(
    () => aggregateLevels(asks, actualTick, "ask").slice(0, askRows).reverse(),
    [asks, actualTick, askRows],
  );
  const displayBids = useMemo(
    () => aggregateLevels(bids, actualTick, "bid").slice(0, bidRows),
    [bids, actualTick, bidRows],
  );

  const maxSize = Math.max(
    ...displayAsks.map((level) => level.size),
    ...displayBids.map((level) => level.size),
    1,
  );
  const askCumulative = cumulative(displayAsks, "ask");
  const bidCumulative = cumulative(displayBids, "bid");
  const cumulativeMax = Math.max(askCumulative[0] ?? 0, bidCumulative.at(-1) ?? 0, 1);
  const isStaleHeavy = stale?.level === "severe" || stale?.level === "frozen";
  const hasRows = displayAsks.length > 0 || displayBids.length > 0;

  return (
    <section
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={cn(
        "relative flex min-h-[360px] flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container text-sm",
        className,
      )}
    >
      <header className="flex h-9 shrink-0 items-center gap-3 border-b border-outline-variant px-3">
        <span className="text-[10px] font-semibold text-fg-subtle">
          Order book
        </span>
        {stale?.level === "mild" && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-info">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-info" />
            Stale {stale.secondsSinceUpdate ?? 0}s
          </span>
        )}
      </header>

      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-outline-variant px-3">
        <ViewToggle value={actualView} onChange={setView} />
        <div className="ml-auto">
          <TickSelector value={actualTick} options={options} onChange={setTick} />
        </div>
      </div>

      <div
        className={cn(
          "grid h-7 shrink-0 items-center gap-2 border-b border-outline-variant px-3 text-[10px] font-semibold text-fg-subtle",
          showCumulativeBars ? "grid-cols-[1fr_5rem_3.5rem]" : "grid-cols-[1fr_5rem]",
        )}
      >
        <span>Price ({quoteLabel})</span>
        <span className="text-right">Size ({baseLabel})</span>
        {showCumulativeBars && <span className="text-right">Depth</span>}
      </div>

      {loading ? (
        <OrderBookLoading showCumulativeBars={showCumulativeBars} />
      ) : error ? (
        <OrderBookMessage
          title="Could not load book"
          body={error}
          action={onReconnect ? { label: "Retry", onClick: onReconnect } : undefined}
        />
      ) : !hasRows ? (
        <OrderBookMessage title="No depth yet" body="Waiting for bid and ask levels." />
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {isStaleHeavy && (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[var(--z-raised)] flex -translate-y-1/2 flex-col items-center gap-2">
              <span className="rounded-full border border-outline-variant bg-surface-container-high px-3 py-1.5 text-xs font-medium text-fg shadow-card">
                Updating...
              </span>
              <span className="font-mono text-[10px] text-info">
                Stale {stale?.secondsSinceUpdate ?? 0}s
              </span>
            </div>
          )}

          {stale?.level === "frozen" && onReconnect && (
            <div className="absolute inset-x-0 top-2 z-[var(--z-raised)] flex justify-center px-2">
              <div className="flex max-w-[92%] items-center gap-2 rounded-full border border-info/40 bg-surface-container-high px-3 py-1 text-[11px] text-fg-muted shadow-card">
                <span className="truncate">
                  No updates for {stale.secondsSinceUpdate ?? 0}s. Trading should be locked.
                </span>
                <button
                  type="button"
                  onClick={onReconnect}
                  className="h-6 shrink-0 rounded-control border border-info/40 px-2 font-semibold text-info transition-colors duration-150 hover:bg-info-surface"
                >
                  Reconnect
                </button>
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col transition-[filter,opacity] duration-300",
              isStaleHeavy && "opacity-75 blur-sm",
            )}
          >
            {actualView !== "bids" && (
              <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
                {displayAsks.map((level, index) => (
                  <OrderBookRow
                    key={`ask-${level.price}-${index}`}
                    level={level}
                    side="ask"
                    maxSize={maxSize}
                    cumulativeRatio={(askCumulative[index] ?? 0) / cumulativeMax}
                    showCumulativeBars={showCumulativeBars}
                    valueFormat={valueFormat}
                    sizeFormat={sizeFormat}
                    onPriceSelect={onPriceSelect}
                  />
                ))}
              </div>
            )}

            <div className="flex h-9 shrink-0 items-center gap-2 border-y border-outline-variant px-3 font-mono text-sm tabular-nums">
              <span className="text-[10px] text-fg-subtle">Mid</span>
              <span className="text-fg">{computedMid === null ? "-" : valueFormat(computedMid)}</span>
            </div>

            {actualView !== "asks" && (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {displayBids.map((level, index) => (
                  <OrderBookRow
                    key={`bid-${level.price}-${index}`}
                    level={level}
                    side="bid"
                    maxSize={maxSize}
                    cumulativeRatio={(bidCumulative[index] ?? 0) / cumulativeMax}
                    showCumulativeBars={showCumulativeBars}
                    valueFormat={valueFormat}
                    sizeFormat={sizeFormat}
                    onPriceSelect={onPriceSelect}
                  />
                ))}
              </div>
            )}

            <BuySellRatio bids={fullBids} asks={fullAsks} />
          </div>
        </div>
      )}
    </section>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: OrderBookView;
  onChange: (view: OrderBookView) => void;
}) {
  const items: Array<{ value: OrderBookView; label: string; glyph: ReactNode }> = [
    {
      value: "mixed",
      label: "Both sides",
      glyph: (
        <span className="flex h-3 w-3 flex-col gap-0.5" aria-hidden="true">
          <span className="h-1 rounded-[1px] bg-sell" />
          <span className="h-1 rounded-[1px] bg-buy" />
        </span>
      ),
    },
    {
      value: "asks",
      label: "Asks only",
      glyph: <span aria-hidden="true" className="h-3 w-3 rounded-[2px] bg-sell/60" />,
    },
    {
      value: "bids",
      label: "Bids only",
      glyph: <span aria-hidden="true" className="h-3 w-3 rounded-[2px] bg-buy/60" />,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Order book view"
      className="inline-flex overflow-hidden rounded-control border border-outline-variant bg-surface"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-label={item.label}
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex h-8 w-10 items-center justify-center transition-colors duration-150",
              active ? "bg-surface-container-high text-fg" : "text-fg-muted hover:bg-surface-container",
            )}
          >
            {item.glyph}
          </button>
        );
      })}
    </div>
  );
}

function TickSelector({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Tick size</span>
      <select
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-8 rounded-control border border-outline-variant bg-surface px-2 font-mono text-xs text-fg transition-colors duration-150 hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OrderBookRow({
  level,
  side,
  maxSize,
  cumulativeRatio,
  showCumulativeBars,
  valueFormat,
  sizeFormat,
  onPriceSelect,
}: {
  level: OrderBookLevel;
  side: OrderBookSide;
  maxSize: number;
  cumulativeRatio: number;
  showCumulativeBars: boolean;
  valueFormat: (value: number) => string;
  sizeFormat: (value: number) => string;
  onPriceSelect?: (price: number, side: OrderBookSide) => void;
}) {
  const ratio = Math.min(100, Math.max(0, (level.size / maxSize) * 100));
  const sideLabel = side === "ask" ? "Ask" : "Bid";
  const rowClass = cn(
    "group relative grid h-[var(--row-h)] min-h-6 items-center gap-2 px-3 font-mono text-xs tabular-nums transition-colors duration-150",
    showCumulativeBars ? "grid-cols-[1fr_5rem_3.5rem]" : "grid-cols-[1fr_5rem]",
    onPriceSelect && "cursor-pointer hover:bg-surface-container-high",
  );
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 right-0",
          side === "ask" ? "bg-sell/10" : "bg-buy/10",
        )}
        style={{ width: `${ratio}%` }}
      />
      <span className={cn("relative", side === "ask" ? "text-sell" : "text-buy")}>
        {valueFormat(level.price)}
      </span>
      <span className="relative text-right text-fg">{sizeFormat(level.size)}</span>
      {showCumulativeBars && (
        <span className="relative flex justify-end">
          <DepthBar side={side} ratio={cumulativeRatio} />
        </span>
      )}
    </>
  );

  if (onPriceSelect) {
    return (
      <button
        type="button"
        onClick={() => onPriceSelect(level.price, side)}
        className={rowClass}
        aria-label={`${sideLabel} ${valueFormat(level.price)}, size ${sizeFormat(level.size)}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={rowClass}>
      {content}
    </div>
  );
}

function DepthBar({ ratio, side }: { ratio: number; side: OrderBookSide }) {
  return (
    <span
      aria-hidden="true"
      className={cn("h-2.5 rounded-[1px]", side === "ask" ? "bg-sell/35" : "bg-buy/35")}
      style={{ width: `${Math.min(1, Math.max(0, ratio)) * 100}%` }}
    />
  );
}

function BuySellRatio({
  bids,
  asks,
}: {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}) {
  const bidVol = bids.reduce((acc, level) => acc + level.size, 0);
  const askVol = asks.reduce((acc, level) => acc + level.size, 0);
  const total = bidVol + askVol;
  if (total <= 0) return null;
  const buyPct = (bidVol / total) * 100;
  const sellPct = 100 - buyPct;

  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-t border-outline-variant px-3 font-mono text-[10px] tabular-nums">
      <span className="font-semibold text-buy">B {buyPct.toFixed(2)}%</span>
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-surface-bright">
        <span className="block h-full bg-buy" style={{ width: `${buyPct}%` }} />
        <span className="block h-full bg-sell" style={{ width: `${sellPct}%` }} />
      </div>
      <span className="font-semibold text-sell">{sellPct.toFixed(2)}% S</span>
    </div>
  );
}

function cumulative(levels: OrderBookLevel[], side: OrderBookSide): number[] {
  if (side === "ask") {
    const reversed = [...levels].reverse();
    const out: number[] = [];
    let acc = 0;
    for (const level of reversed) {
      acc += level.size;
      out.push(acc);
    }
    return out.reverse();
  }
  const out: number[] = [];
  let acc = 0;
  for (const level of levels) {
    acc += level.size;
    out.push(acc);
  }
  return out;
}

function OrderBookLoading({ showCumulativeBars }: { showCumulativeBars: boolean }) {
  return (
    <div className="flex flex-1 flex-col p-3" aria-label="Loading order book">
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "mb-1 grid h-5 animate-pulse gap-2",
            showCumulativeBars ? "grid-cols-[1fr_5rem_3.5rem]" : "grid-cols-[1fr_5rem]",
          )}
        >
          <span className="rounded-sm bg-surface-bright" />
          <span className="rounded-sm bg-surface-bright" />
          {showCumulativeBars && <span className="rounded-sm bg-surface-bright" />}
        </div>
      ))}
    </div>
  );
}

function OrderBookMessage({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="max-w-[24ch] text-xs text-fg-muted">{body}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 h-8 rounded-control border border-outline-variant px-3 text-xs font-semibold text-fg transition-colors duration-150 hover:bg-surface-container-high"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
