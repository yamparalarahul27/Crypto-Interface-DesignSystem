"use client";

import { ContextMenu as RadixContextMenu } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "../Menu";

/**
 * Right-click / long-press menu — Menu's context sibling. Same item
 * data shape as Menu; behavior from Radix ContextMenu (position at
 * pointer, Escape/outside dismiss, arrow keys, typeahead). Wrap the
 * surface that owns the context actions — not the whole page.
 */
export function ContextMenu({
  children,
  items,
  className,
}: {
  /** Area that receives the context gesture. */
  children: ReactNode;
  /** Same shape as Menu — `{label, onSelect, …}` or `{kind:"separator"}`. */
  items: MenuItem[];
  /** Merged onto the menu panel. */
  className?: string;
}) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={cn(
            "z-[var(--z-raised)] min-w-40 rounded-chip border border-outline-variant bg-surface-bright p-1 shadow-raised",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            className,
          )}
        >
          {items.map((item, i) =>
            item.kind === "separator" ? (
              <RadixContextMenu.Separator
                key={i}
                className="mx-1 my-1 h-px bg-outline-variant"
              />
            ) : (
              <RadixContextMenu.Item
                key={i}
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn(
                  "flex cursor-default select-none items-center rounded-control px-2.5 py-1.5 text-xs outline-none",
                  "data-[highlighted]:bg-surface-container-high data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                  item.destructive ? "text-sell" : "text-fg",
                )}
              >
                {item.label}
              </RadixContextMenu.Item>
            ),
          )}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
