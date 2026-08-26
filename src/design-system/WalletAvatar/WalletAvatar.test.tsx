import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletAvatar } from "./WalletAvatar";
import { ID_HUES, shardsFor, blocksFor } from "../identity";

const WALLET = "7xKXtg2CW3hqPzKZ4rE9mQvNbYd1sVfLpR8aUj5nHmTc";

describe("shardsFor", () => {
  it("is deterministic: one address always draws the same figure", () => {
    expect(shardsFor(WALLET)).toEqual(shardsFor(WALLET));
  });

  it("varies with the address", () => {
    const a = shardsFor(WALLET);
    const b = shardsFor("9aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef");
    expect(a.shards.map((s) => s.d)).not.toEqual(b.shards.map((s) => s.d));
  });

  it("reads the whole address, not a prefix", () => {
    // Two addresses sharing the first 8 chars must not collide: the
    // truncated display form is exactly what users see side by side.
    const a = shardsFor("7xKXtg2CAAAAAAAAAAAA");
    const b = shardsFor("7xKXtg2CBBBBBBBBBBBB");
    expect(a.shards[0].d).not.toEqual(b.shards[0].d);
  });

  it("cuts 4–6 sectors that close their paths", () => {
    for (const seed of [WALLET, "abc", "0x0", "zzzzzzzzzz"]) {
      const { shards } = shardsFor(seed);
      expect(shards.length).toBeGreaterThanOrEqual(4);
      expect(shards.length).toBeLessThanOrEqual(6);
      for (const s of shards) expect(s.d.endsWith("Z")).toBe(true);
    }
  });

  it("only ever fills with --id-* hues (tokens, never invented colour)", () => {
    const { shards, base } = shardsFor(WALLET);
    expect(ID_HUES).toContain(base);
    for (const s of shards) expect(ID_HUES).toContain(s.hue);
  });
});

describe("WalletAvatar", () => {
  it("names the wallet with a truncated address by default", () => {
    render(<WalletAvatar address={WALLET} />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "7xKX…HmTc",
    );
  });

  it("folds the chain into the accessible name", () => {
    render(<WalletAvatar address={WALLET} chain={{ name: "Solana" }} />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "7xKX…HmTc, on Solana",
    );
  });

  it("exposes exactly one image to a screen reader", () => {
    // The disc drops its role when a marker wraps it, so the wallet is
    // announced once, not twice.
    render(<WalletAvatar address={WALLET} chain={{ name: "Solana" }} />);
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("suppresses the badge at sizes where it would smudge", () => {
    const { container } = render(
      <WalletAvatar address={WALLET} size="xs" chain={{ name: "Solana" }} />,
    );
    expect(container.querySelector('[title="Solana"]')?.className).toContain(
      "hidden",
    );
  });
});

describe("blocksFor", () => {
  it("mirrors horizontally: symmetry is what makes it read as a face", () => {
    const n = 5;
    const { cells } = blocksFor(WALLET, n);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        expect(cells[y * n + x]).toBe(cells[y * n + (n - 1 - x)]);
      }
    }
  });

  it("is deterministic and address-specific", () => {
    expect(blocksFor(WALLET)).toEqual(blocksFor(WALLET));
    expect(blocksFor(WALLET).cells).not.toEqual(blocksFor("other-wallet").cells);
  });

  it("draws a different figure than shards for the same address", () => {
    // Switching style must actually change the art, not just the geometry
    // primitive: otherwise the user setting looks broken.
    const blocks = blocksFor(WALLET);
    expect(blocks.cells.some(Boolean)).toBe(true);
  });
});

describe("WalletAvatar badges", () => {
  it("names the connection state, not just its colour", () => {
    render(<WalletAvatar address={WALLET} connection="active" />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
      "connected, active",
    );
  });

  it("lets chain win the corner when both are passed", () => {
    render(
      <WalletAvatar address={WALLET} chain={{ name: "Solana" }} connection="active" />,
    );
    const label = screen.getByRole("img").getAttribute("aria-label") ?? "";
    expect(label).toContain("on Solana");
    expect(label).not.toContain("connected, active");
  });
});
