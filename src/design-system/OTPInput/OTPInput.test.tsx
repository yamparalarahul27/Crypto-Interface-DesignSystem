import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPInput } from "./OTPInput";

describe("OTPInput", () => {
  it("fills cells and fires onComplete", async () => {
    const onComplete = vi.fn();
    render(<OTPInput length={4} onComplete={onComplete} autoFocus />);
    const cells = screen.getAllByRole("textbox");
    expect(cells).toHaveLength(4);
    await userEvent.type(cells[0]!, "1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("pastes a full code into the group", async () => {
    const onComplete = vi.fn();
    render(<OTPInput length={4} onComplete={onComplete} />);
    const first = screen.getAllByRole("textbox")[0]!;
    first.focus();
    await userEvent.paste("9876");
    expect(onComplete).toHaveBeenCalledWith("9876");
  });

  it("shows error message without shifting layout", () => {
    const { rerender, container } = render(<OTPInput hint="Paste it" />);
    expect(container.querySelectorAll(".h-4").length).toBe(1);
    expect(screen.getAllByText("Paste it").length).toBeGreaterThan(0);
    rerender(<OTPInput error errorMessage="Wrong code" hint="Paste it" />);
    expect(screen.getAllByText("Wrong code").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".h-4").length).toBe(1);
  });
});
