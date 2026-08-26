"use client";

import {
  AddressChip,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  Input,
  MarginHealth,
  OTPInput,
  Pagination,
  PegBadge,
  PriceChange,
  Progress,
  ReactionBar,
  SizeSlider,
  SocialProofChip,
  Sparkline,
  StatCell,
  Switch,
  TxStatus,
} from "@/design-system";

/**
 * Category card previews. Every tile is composed from the real exports,
 * the canonical calls out of each component's .doc.md, so the landing
 * page demonstrates the system rather than illustrating it.
 *
 * The compositions are decorative: `inert` on the wrapper takes them out
 * of the a11y tree AND the tab order in one attribute, so a card doesn't
 * hand the keyboard a dozen dead controls. The component names printed
 * beneath each card are the real links.
 */

const noop = () => {};

const WATCHERS = [
  { name: "mira", seed: "wallet-mira" },
  { name: "kip", seed: "wallet-kip" },
  { name: "nova", seed: "wallet-nova" },
  { name: "aria", seed: "wallet-aria" },
  { name: "sol", seed: "wallet-sol" },
];

const CLOSES = [12, 14, 13.4, 17, 16.2, 19, 18.4, 22, 21.5, 25];

const PREVIEWS: Record<string, () => React.ReactElement> = {
  primitives: () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm">
          Confirm
        </Button>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge tone="buy">on peg</Badge>
        <Badge tone="warning">pending</Badge>
        <Switch checked onCheckedChange={noop} aria-label="Preview" />
      </div>
    </div>
  ),

  containment: () => (
    <div className="w-full max-w-[240px] space-y-3">
      <Input placeholder="Search tokens…" readOnly />
      <Progress aria-label="Preview progress" value={64} />
    </div>
  ),

  navigation: () => (
    <div className="flex w-full max-w-[260px] flex-col items-center gap-4">
      <Breadcrumbs
        items={[
          { label: "Design", href: "/design" },
          { label: "Components" },
        ]}
      />
      <Pagination page={2} count={12} onPageChange={noop} />
    </div>
  ),

  data: () => (
    <div className="flex items-center gap-6">
      <StatCell
        label="Price"
        value="$184.26"
        change={<PriceChange value={3.6} />}
      />
      <Sparkline data={CLOSES} />
    </div>
  ),

  crypto: () => (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-2">
        <PegBadge deviationBps={4} />
        <PegBadge deviationBps={-230} />
      </div>
      <AddressChip address="7xKXtg2CW3hqPzKZ4rE9mQvNbYd1sVfLpR8aUj5nHmTc" />
      <TxStatus state="confirmed" />
    </div>
  ),

  trading: () => (
    <div className="w-full max-w-[240px] space-y-4">
      <MarginHealth value={37.42} />
      <SizeSlider value={45} onValueChange={noop} />
    </div>
  ),

  social: () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <AvatarGroup
          members={WATCHERS.map((w) => ({ name: w.name, seed: w.seed }))}
          max={4}
        />
        <SocialProofChip count={41} />
      </div>
      <ReactionBar
        reactions={[
          { emoji: "♥", count: 12, mine: true },
          { emoji: "🔥", count: 5 },
          { emoji: "📈", count: 3 },
        ]}
        onReact={noop}
      />
    </div>
  ),

  interactions: () => <OTPInput length={6} defaultValue="284" />,
};

export function CategoryPreview({ id }: { id: string }) {
  const Preview = PREVIEWS[id];
  if (!Preview) return null;
  return (
    <div
      inert
      className="pointer-events-none flex h-40 select-none items-center justify-center overflow-hidden px-4"
    >
      {/* Scaled to fill the frame: components render at their real sizes,
          which are tuned for a page, not a 160px card. */}
      <div className="scale-[1.05] sm:scale-[1.2]">
        <Preview />
      </div>
    </div>
  );
}
