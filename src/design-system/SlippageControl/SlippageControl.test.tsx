import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SlippageControl, slippageLevel } from "./SlippageControl";

describe("slippageLevel", () => {
  it("bands by magnitude (mono-safe word mapping)", () => {
    expect(slippageLevel(10)).toBe("low");
    expect(slippageLevel(50)).toBe("low");
    expect(slippageLevel(100)).toBe("normal");
    expect(slippageLevel(200)).toBe("elevated");
    expect(slippageLevel(250)).toBe("high");
  });
});

describe("SlippageControl", () => {
  it("renders label, percent value, and level word", () => {
    render(<SlippageControl value={50} onValueChange={() => {}} />);
    expect(screen.getByText("Slippage")).toBeTruthy();
    expect(screen.getByRole("button", { name: "0.5%", pressed: true })).toBeTruthy();
    expect(screen.getByText("low")).toBeTruthy();
  });

  it("selecting a preset calls onValueChange with bps", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SlippageControl value={50} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "1%" }));
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  it("Custom opens the percent input and accepts typed values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SlippageControl value={50} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Custom" }));
    const input = screen.getByLabelText("Custom slippage percent");
    await user.clear(input);
    await user.type(input, "2.5");
    expect(onValueChange).toHaveBeenCalledWith(250);
  });

  it("high slippage shows the high level word + error ink", () => {
    render(<SlippageControl value={300} onValueChange={() => {}} />);
    const word = screen.getByText("high");
    expect(word.className).toContain("text-error");
  });
});
