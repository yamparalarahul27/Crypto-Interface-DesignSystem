import { Avatar, type AvatarConnection, type AvatarSize } from "../Avatar";

/**
 * Address-first convenience wrapper over `Avatar`.
 *
 * The figure, badges and a11y all live in `Avatar`: this exists only so
 * wallet call sites don't have to invent a display name for a hex string.
 * It truncates the address for the accessible name and defaults to the
 * `shards` figure, because an address has no initial worth drawing.
 */
export function WalletAvatar({
  address,
  label,
  size = "md",
  variant = "shards",
  chain,
  connection,
  className,
}: {
  /** Wallet address: seeds the figure. The whole string is hashed, not a prefix. */
  address: string;
  /** Accessible name. Defaults to a truncated address. */
  label?: string;
  size?: AvatarSize;
  /** `shards` (default) or `blocks`. `initial` would draw a hex character: don't. */
  variant?: "shards" | "blocks";
  chain?: { name: string; iconSrc?: string };
  connection?: AvatarConnection;
  className?: string;
}) {
  return (
    <Avatar
      name={label ?? `${address.slice(0, 4)}…${address.slice(-4)}`}
      seed={address}
      size={size}
      variant={variant}
      chain={chain}
      connection={connection}
      className={className}
    />
  );
}
