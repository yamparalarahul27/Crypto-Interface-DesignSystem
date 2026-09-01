"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog } from "../Dialog";
import { Input } from "../Input";
import { TokenIcon } from "../TokenIcon";

export type TokenOption = {
  /** Stable id (mint address or ticker key). */
  id: string;
  symbol: string;
  name: string;
  iconSrc?: string;
  /** Preformatted balance on the right (e.g. "12.40"). */
  balance?: string;
  disabled?: boolean;
};

/**
 * Token picker: the swap/send atom every DeFi UI rebuilds by hand.
 * Trigger shows the selected token (icon + symbol); Dialog hosts a
 * searchable list with optional balances. Presentational: you own the
 * token list and selection; open state is ephemeral UI only.
 */
export function TokenSelect({
  tokens,
  value,
  onValueChange,
  placeholder = "Select token",
  emptyText = "No tokens found",
  disabled,
  className,
  "aria-label": ariaLabel = "Select token",
}: {
  tokens: TokenOption[];
  /** Selected token id: undefined means none chosen yet. */
  value: string | undefined;
  onValueChange: (id: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const optId = (i: number) => `${baseId}-option-${i}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = tokens.find((t) => t.id === value);

  const q = query.trim().toLowerCase();
  const matches = q
    ? tokens.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q),
      )
    : tokens;

  const openPicker = () => {
    if (disabled) return;
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const select = (token: TokenOption) => {
    if (token.disabled) return;
    onValueChange(token.id);
    setOpen(false);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (matches[active] && !matches[active].disabled) {
        e.preventDefault();
        select(matches[active]);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(matches.length - 1, 0));
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          selected ? `${ariaLabel}: ${selected.symbol}` : ariaLabel
        }
        onClick={openPicker}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-control border border-outline-variant bg-surface-container px-3 text-sm font-medium text-fg",
          "transition-[background-color,border-color,transform] duration-150",
          "hover:bg-surface-container-high active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          "disabled:pointer-events-none disabled:opacity-40",
          className,
        )}
      >
        {selected ? (
          <>
            <TokenIcon src={selected.iconSrc} symbol={selected.symbol} size="sm" />
            <span className="font-mono">{selected.symbol}</span>
          </>
        ) : (
          <span className="text-fg-muted">{placeholder}</span>
        )}
        <span aria-hidden="true" className="text-fg-subtle">
          ▾
        </span>
      </button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Select token"
        description="Search by symbol, name, or mint."
        className="p-4"
      >
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onSearchKeyDown}
          placeholder="Search tokens…"
          aria-label="Search tokens"
          aria-controls={listId}
          aria-activedescendant={
            matches[active] ? optId(active) : undefined
          }
          autoComplete="off"
          spellCheck={false}
          className="mb-3"
        />
        <div
          role="listbox"
          id={listId}
          aria-label="Tokens"
          className="max-h-64 overflow-y-auto rounded-chip border border-outline-variant bg-surface-container p-1"
        >
          {matches.length === 0 ? (
            <p className="px-2.5 py-3 text-xs text-fg-subtle">{emptyText}</p>
          ) : (
            matches.map((token, i) => {
              const isSelected = token.id === value;
              const isActive = i === active;
              return (
                <div
                  key={token.id}
                  role="option"
                  id={optId(i)}
                  aria-selected={isSelected}
                  aria-disabled={token.disabled || undefined}
                  data-active={isActive || undefined}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(token)}
                  className={cn(
                    "flex cursor-default select-none items-center gap-2.5 rounded-control px-2.5 py-2 text-sm",
                    "data-[active]:bg-surface-container-high",
                    token.disabled ? "opacity-40" : "text-fg",
                    isSelected && "font-semibold",
                  )}
                >
                  <TokenIcon src={token.iconSrc} symbol={token.symbol} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono leading-tight">{token.symbol}</span>
                    <span className="block truncate text-[11px] font-normal text-fg-muted">
                      {token.name}
                    </span>
                  </span>
                  {token.balance != null && (
                    <span className="data-sm flex-none text-fg-subtle">{token.balance}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Dialog>
    </>
  );
}
