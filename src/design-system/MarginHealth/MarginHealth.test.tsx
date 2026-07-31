import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarginHealth, marginHealthLevel } from "./MarginHealth";

describe("MarginHealth", () => {
  it("maps thresholds to levels", () => {
    expect(marginHealthLevel(12)).toBe("healthy");
    expect(marginHealthLevel(50)).toBe("caution");
    expect(marginHealthLevel(80)).toBe("high");
    expect(marginHealthLevel(90)).toBe("critical");
  });

  it("renders meter semantics, label, tier, and value", () => {
    render(<MarginHealth value={37.42} />);
    const meter = screen.getByRole("meter", { name: "Margin ratio" });
    expect(meter.getAttribute("aria-valuenow")).toBe("37.42");
    expect(meter.getAttribute("aria-valuetext")).toBe("Healthy 37.42%");
    expect(screen.getByText("Healthy")).toBeTruthy();
    expect(screen.getByText("37.42%")).toBeTruthy();
  });

  it("clamps overflow and applies critical copy", () => {
    render(<MarginHealth value={130} />);
    const meter = screen.getByRole("meter");
    expect(meter.getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByText("Critical")).toBeTruthy();
  });

  it("accepts custom label and precision", () => {
    render(<MarginHealth value={81.234} label="Cross risk" precision={1} />);
    expect(screen.getByRole("meter", { name: "Cross risk" }).getAttribute("aria-valuenow")).toBe("81.2");
    expect(screen.getByText("81.2%")).toBeTruthy();
  });
});
