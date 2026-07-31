import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  OrderBook,
  aggregateLevels,
  defaultTickOptions,
  type OrderBookLevel,
} from "./OrderBook";

const ASKS: OrderBookLevel[] = [
  { price: 100.11, size: 2 },
  { price: 100.19, size: 3 },
  { price: 100.27, size: 1 },
];
const BIDS: OrderBookLevel[] = [
  { price: 99.98, size: 4 },
  { price: 99.91, size: 5 },
  { price: 99.82, size: 1 },
];

describe("OrderBook", () => {
  it("aggregates asks up and bids down by tick", () => {
    expect(aggregateLevels(ASKS, 0.1, "ask")).toEqual([
      { price: 100.2, size: 5 },
      { price: 100.3, size: 1 },
    ]);
    expect(aggregateLevels(BIDS, 0.1, "bid")).toEqual([
      { price: 99.9, size: 9 },
      { price: 99.8, size: 1 },
    ]);
  });

  it("picks larger tick defaults for larger prices", () => {
    expect(defaultTickOptions(20_000)[0]).toBe(0.5);
    expect(defaultTickOptions(0.5)[0]).toBe(0.0001);
  });

  it("renders bid and ask rows plus buy/sell ratio", () => {
    render(<OrderBook asks={ASKS} bids={BIDS} midPrice={100} />);
    expect(screen.getByRole("region", { name: "Order book" })).toBeTruthy();
    expect(screen.getByText("Mid")).toBeTruthy();
    expect(screen.getByText(/B /)).toBeTruthy();
    expect(screen.getByText(/ S/)).toBeTruthy();
  });

  it("row buttons call onPriceSelect when selectable", async () => {
    const onPriceSelect = vi.fn();
    render(<OrderBook asks={ASKS} bids={BIDS} onPriceSelect={onPriceSelect} />);
    await userEvent.click(screen.getAllByRole("button", { name: /Ask/ })[0]);
    expect(onPriceSelect).toHaveBeenCalledWith(expect.any(Number), "ask");
  });

  it("switches view and tick through real controls", async () => {
    const onViewChange = vi.fn();
    const onTickChange = vi.fn();
    render(
      <OrderBook
        asks={ASKS}
        bids={BIDS}
        view="mixed"
        onViewChange={onViewChange}
        tick={0.01}
        tickOptions={[0.01, 0.1]}
        onTickChange={onTickChange}
      />,
    );
    await userEvent.click(screen.getByRole("tab", { name: "Bids only" }));
    expect(onViewChange).toHaveBeenCalledWith("bids");
    await userEvent.selectOptions(screen.getByRole("combobox"), "0.1");
    expect(onTickChange).toHaveBeenCalledWith(0.1);
  });

  it("shows loading, empty, error, and frozen reconnect states", async () => {
    const { rerender } = render(<OrderBook asks={[]} bids={[]} loading />);
    expect(screen.getByLabelText("Loading order book")).toBeTruthy();

    rerender(<OrderBook asks={[]} bids={[]} />);
    expect(screen.getByText("No depth yet")).toBeTruthy();

    const onReconnect = vi.fn();
    rerender(<OrderBook asks={[]} bids={[]} error="Feed unavailable" onReconnect={onReconnect} />);
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onReconnect).toHaveBeenCalled();

    rerender(
      <OrderBook
        asks={ASKS}
        bids={BIDS}
        stale={{ level: "frozen", secondsSinceUpdate: 34 }}
        onReconnect={onReconnect}
      />,
    );
    expect(screen.getByText("Updating...")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reconnect" })).toBeTruthy();
  });
});
