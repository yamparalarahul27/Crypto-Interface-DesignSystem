import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceChange } from "./PriceChange";

describe("PriceChange (sign discipline)", () => {
  it("negative: down icon, −, magnitude via abs, sell tone", () => {
    const { container } = render(<PriceChange value={-4.2} />);
    const el = container.firstElementChild!;
    // Direction is a shape, asserted independently of the colour class:
    // colour alone is exactly what guideline #5 forbids relying on.
    expect(el.querySelector('[data-direction="down"] svg')).toBeTruthy();
    expect(el.querySelector('[data-direction="up"]')).toBeNull();
    expect(el.textContent).toContain("−4.20%");
    expect(el.textContent).not.toContain("-4.2"); // never the raw signed string
    expect(el.className).toContain("text-sell");
  });

  it("positive: up icon, +, buy tone", () => {
    const { container } = render(<PriceChange value={9.4} />);
    const el = container.firstElementChild!;
    expect(el.querySelector('[data-direction="up"] svg')).toBeTruthy();
    expect(el.querySelector('[data-direction="down"]')).toBeNull();
    expect(el.textContent).toContain("+9.40%");
    expect(el.className).toContain("text-buy");
  });

  it("zero counts as up (flat is not a loss)", () => {
    const { container } = render(<PriceChange value={0} />);
    expect(container.firstElementChild!.className).toContain("text-buy");
  });

  it("suffix + precision are configurable", () => {
    render(<PriceChange value={-0.1234} suffix=" bps" precision={1} />);
    expect(screen.getByText(/−0\.1 bps/)).toBeTruthy();
  });
});
