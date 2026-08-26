"use client";

// ⌘K / Ctrl+K canvas search: jump to any demo or iframe frame.
// Uses Radix Dialog via CIDS Dialog for focus trap + Escape.

import { useId, useState } from "react";
import {
  Dialog,
  IconArrowDown,
  IconArrowUp,
} from "@/design-system";
import { cn } from "@/lib/utils";
import { filterCanvasItems, type SearchableItem } from "./canvasSearch";

export function CanvasSearch({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const matches = filterCanvasItems(query);

  const choose = (item: SearchableItem) => {
    onSelect(item.id);
    onOpenChange(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(matches.length - 1, 0));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search canvas"
      description="Jump to a component, pattern, or template."
      className="p-3"
    >
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder="Button, OrderBook, exchange…"
        aria-label="Search canvas items"
        aria-controls={listId}
        aria-activedescendant={
          matches[active] ? `${listId}-${matches[active].id}` : undefined
        }
        autoComplete="off"
        spellCheck={false}
        autoFocus
        className={cn(
          "mb-2 h-9 w-full rounded-control border border-outline-variant bg-surface-container px-3 text-sm text-fg placeholder:text-fg-subtle",
          "transition-[border-color] duration-150 focus:border-outline focus:outline-none",
        )}
      />
      <div
        role="listbox"
        id={listId}
        aria-label="Canvas items"
        className="max-h-64 overflow-y-auto rounded-chip border border-outline-variant bg-surface-dim p-1"
      >
        {matches.length === 0 ? (
          <p className="px-2.5 py-3 text-xs text-fg-subtle">No matches</p>
        ) : (
          matches.map((item, i) => (
            <div
              key={item.id}
              role="option"
              id={`${listId}-${item.id}`}
              aria-selected={i === active}
              data-active={i === active || undefined}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(item)}
              className={cn(
                "flex cursor-default select-none items-center justify-between gap-3 rounded-control px-2.5 py-1.5 text-xs",
                "data-[active]:bg-surface-container-high",
              )}
            >
              <span className="min-w-0 truncate font-medium text-fg">{item.title}</span>
              <span className="flex-none font-mono text-[10px] text-fg-subtle">
                {item.kind === "iframe" ? "frame" : "demo"}
              </span>
            </div>
          ))
        )}
      </div>
      <p className="mt-2 flex items-center gap-1 font-mono text-[10px] text-fg-subtle">
        <IconArrowUp size={10} weight="bold" aria-hidden="true" />
        <IconArrowDown size={10} weight="bold" aria-hidden="true" />
        Move · Enter open · Esc close · ⌘K anytime
      </p>
    </Dialog>
  );
}
