// Opt-in canvas state switcher — selection-scoped chips in the Inspector
// drive a `state` arg into demos that declare options here. Demos without
// an entry keep today's zero-arg pose. Roadmap: "state switcher
// (default/hover/loading/empty/error per demo)" — hover stays live CSS;
// compositional states (loading/empty/error/…) are switched here.

import type { ReactNode } from "react";

export type DemoOpts = { state?: string };

export type DemoFn = (opts?: DemoOpts) => ReactNode;

/** Per-demo chip labels. First entry is the default when selected. */
export const DEMO_STATE_OPTIONS: Record<string, readonly string[]> = {
  Avatar: ["styles", "network", "connection", "sizes", "hues"],
  WalletAvatar: ["styles", "network", "connection", "sizes"],
  Button: ["default", "disabled"],
  Input: ["default", "invalid", "disabled"],
  Alert: ["warning", "error", "info", "success"],
  TxStatus: ["idle", "signing", "pending", "confirmed", "failed"],
  WalletButton: ["disconnected", "connecting", "connected"],
  PegBadge: ["on-peg", "drifting", "depegged"],
  PriceChange: ["up", "down", "flat"],
  Switch: ["on", "off", "disabled"],
  EmptyState: ["default", "no-action"],
  Skeleton: ["loading"],
  PatternStates: ["loading", "loaded", "empty", "error", "offline"],
};

export function defaultDemoState(id: string): string | undefined {
  return DEMO_STATE_OPTIONS[id]?.[0];
}
