import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarketTabs } from "./MarketTabs";

const MARKETS = [
  { symbol: "SOL-PERP", label: "SOL", price: "$184.26", changePct: 3.64 },
  { symbol: "BTC-PERP", label: "BTC", price: "$73,420", changePct: -0.42 },
];

describe("MarketTabs", () => {
  it("renders tabs with active state and signed changes", () => {
    render(<MarketTabs markets={MARKETS} activeSymbol="SOL-PERP" onActiveChange={() => {}} />);
    expect(screen.getByRole("list", { name: "Open markets" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^SOL/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText("+3.64%")).toBeTruthy();
    expect(screen.getByText("-0.42%")).toBeTruthy();
  });

  it("activates, closes, and adds via separate buttons", async () => {
    const onActiveChange = vi.fn();
    const onClose = vi.fn();
    const onAdd = vi.fn();
    render(
      <MarketTabs
        markets={MARKETS}
        activeSymbol="SOL-PERP"
        onActiveChange={onActiveChange}
        onClose={onClose}
        onAdd={onAdd}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /^BTC/ }));
    expect(onActiveChange).toHaveBeenCalledWith("BTC-PERP");
    await userEvent.click(screen.getByRole("button", { name: "Close BTC-PERP" }));
    expect(onClose).toHaveBeenCalledWith("BTC-PERP");
    await userEvent.click(screen.getByRole("button", { name: "Add market" }));
    expect(onAdd).toHaveBeenCalled();
  });

  it("hides close buttons when there is only one market", () => {
    render(
      <MarketTabs
        markets={[MARKETS[0]]}
        activeSymbol="SOL-PERP"
        onActiveChange={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.queryByRole("button", { name: "Close SOL-PERP" })).toBeNull();
  });

  it("disabled add and disabled market do not fire", async () => {
    const onActiveChange = vi.fn();
    const onAdd = vi.fn();
    render(
      <MarketTabs
        markets={[{ ...MARKETS[0], disabled: true }]}
        activeSymbol="SOL-PERP"
        onActiveChange={onActiveChange}
        onAdd={onAdd}
        addDisabled
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /^SOL/ }));
    await userEvent.click(screen.getByRole("button", { name: "Add market" }));
    expect(onActiveChange).not.toHaveBeenCalled();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
