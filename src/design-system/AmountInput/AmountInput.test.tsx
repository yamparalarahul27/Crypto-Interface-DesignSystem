import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { AmountInput } from "./AmountInput";

function Controlled(props: { onMax?: () => void }) {
  const [v, setV] = useState("");
  return <AmountInput value={v} onValueChange={setV} symbol="SOL" {...props} />;
}

describe("AmountInput", () => {
  it("sanitizes to decimal string: strips letters, single dot", async () => {
    render(<Controlled />);
    const el = screen.getByRole("textbox", { name: "Amount in SOL" });
    await userEvent.type(el, "1a.2.5x");
    expect((el as HTMLInputElement).value).toBe("1.25");
  });

  it("shows fiat echo and symbol", () => {
    render(
      <AmountInput value="1.25" onValueChange={() => {}} symbol="SOL" fiatValue="≈ $231.40" />,
    );
    expect(screen.getByText("≈ $231.40")).toBeTruthy();
    expect(screen.getByText("SOL")).toBeTruthy();
  });

  it("Max fires the callback; invalid sets aria-invalid", async () => {
    const onMax = vi.fn();
    const { rerender } = render(
      <AmountInput value="" onValueChange={() => {}} symbol="SOL" onMax={onMax} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Max" }));
    expect(onMax).toHaveBeenCalled();
    rerender(<AmountInput value="99" onValueChange={() => {}} symbol="SOL" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("errorMessage wires aria-describedby and is announced", () => {
    render(
      <AmountInput
        value="99"
        onValueChange={() => {}}
        symbol="SOL"
        invalid
        errorMessage="Exceeds balance"
      />,
    );
    const input = screen.getByRole("textbox");
    const err = screen.getByRole("alert");
    expect(err.textContent).toBe("Exceeds balance");
    expect(input.getAttribute("aria-describedby")).toBe(err.id);
  });

  it("maxDecimals clamps fractional digits", async () => {
    function Clamped() {
      const [v, setV] = useState("");
      return (
        <AmountInput value={v} onValueChange={setV} symbol="USDC" maxDecimals={2} />
      );
    }
    render(<Clamped />);
    const el = screen.getByRole("textbox");
    await userEvent.type(el, "1.2399");
    expect((el as HTMLInputElement).value).toBe("1.23");
  });
});
