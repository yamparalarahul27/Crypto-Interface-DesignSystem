"use client";

import type { ReactNode } from "react";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Input,
  PegBadge,
  PriceChange,
  Switch,
  TxStatus,
} from "@/design-system";
import { StatesFromDoc } from "./TokenSwatches";

export type StateCell = { label: string; node: ReactNode };

/**
 * Curated live state matrices for primitives where forcing states in a
 * grid is honest (not every component: overlays stay in the hero demo).
 * Missing entry → doc state chips only.
 */
export const STATE_MATRICES: Record<string, StateCell[]> = {
  Button: [
    { label: "primary", node: <Button variant="primary">Confirm</Button> },
    { label: "secondary", node: <Button variant="secondary">Cancel</Button> },
    { label: "ghost", node: <Button variant="ghost">Skip</Button> },
    { label: "destructive", node: <Button variant="destructive">Remove</Button> },
    { label: "disabled", node: <Button variant="primary" disabled>Confirm</Button> },
    { label: "sm", node: <Button size="sm">Small</Button> },
  ],
  Badge: [
    { label: "neutral", node: <Badge>pending</Badge> },
    { label: "brand", node: <Badge tone="brand">live</Badge> },
    { label: "buy", node: <Badge tone="buy">on peg</Badge> },
    { label: "sell", node: <Badge tone="sell">error</Badge> },
    { label: "warning", node: <Badge tone="warning">drift</Badge> },
    { label: "info", node: <Badge tone="info">note</Badge> },
  ],
  Input: [
    { label: "rest", node: <Input aria-label="Handle" placeholder="@handle" /> },
    { label: "invalid", node: <Input aria-label="Handle" invalid defaultValue="!!" /> },
    { label: "disabled", node: <Input aria-label="Handle" disabled placeholder="@handle" /> },
  ],
  Switch: [
    { label: "on", node: <Switch checked onCheckedChange={() => {}} aria-label="On" /> },
    { label: "off", node: <Switch checked={false} onCheckedChange={() => {}} aria-label="Off" /> },
    {
      label: "disabled",
      node: <Switch checked disabled onCheckedChange={() => {}} aria-label="Disabled" />,
    },
  ],
  Checkbox: [
    { label: "checked", node: <Checkbox checked onCheckedChange={() => {}} aria-label="Yes" /> },
    {
      label: "unchecked",
      node: <Checkbox checked={false} onCheckedChange={() => {}} aria-label="No" />,
    },
    {
      label: "disabled",
      node: <Checkbox checked disabled onCheckedChange={() => {}} aria-label="Locked" />,
    },
  ],
  Alert: [
    { label: "info", node: <Alert tone="info" title="Network fee updated" /> },
    { label: "success", node: <Alert tone="success" title="Swap confirmed" /> },
    { label: "warning", node: <Alert tone="warning" title="High slippage" /> },
    { label: "error", node: <Alert tone="error" title="Transaction failed" /> },
  ],
  TxStatus: [
    { label: "idle", node: <TxStatus state="idle" /> },
    { label: "signing", node: <TxStatus state="signing" /> },
    { label: "pending", node: <TxStatus state="pending" detail="5xK…9fQ2" /> },
    { label: "confirmed", node: <TxStatus state="confirmed" detail="5xK…9fQ2" /> },
    { label: "failed", node: <TxStatus state="failed" detail="User rejected" /> },
  ],
  PegBadge: [
    { label: "on peg", node: <PegBadge deviationBps={4} /> },
    { label: "drifting", node: <PegBadge deviationBps={-38} /> },
    { label: "depegged", node: <PegBadge deviationBps={-230} /> },
  ],
  PriceChange: [
    { label: "up", node: <PriceChange value={4.2} /> },
    { label: "down", node: <PriceChange value={-4.2} /> },
    { label: "flat", node: <PriceChange value={0} /> },
  ],
};

export function StateMatrix({
  name,
  states,
}: {
  name: string;
  states: string[];
}) {
  const cells = STATE_MATRICES[name];
  if (!cells && states.length === 0) return null;

  return (
    <section id="states-live" className="mb-6 scroll-mt-6">
      <h3 className="font-mono text-[11px] font-semibold text-fg-subtle">
        States · {cells ? "live" : "from doc"}
      </h3>
      <p className="mt-1 text-[11px] text-fg-subtle">
        {cells
          ? "Forced instances: hover/focus still work on the live demo above."
          : "Parsed from the doc. Interact with the live demo for hover/active."}
      </p>
      <div className="mt-3">
        <StatesFromDoc states={states} />
        {cells && (
          <div className="grid gap-3 sm:grid-cols-2">
            {cells.map((c) => (
              <div
                key={c.label}
                className="rounded-control border border-outline-variant bg-surface-container p-3"
              >
                <p className="mb-2 font-mono text-[10px] text-fg-subtle">
                  {c.label}
                </p>
                {c.node}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
