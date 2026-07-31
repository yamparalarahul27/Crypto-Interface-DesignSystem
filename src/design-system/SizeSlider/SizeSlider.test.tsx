import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SizeSlider } from "./SizeSlider";

describe("SizeSlider", () => {
  it("renders clamped value and slider aria", () => {
    render(<SizeSlider value={128} onValueChange={() => {}} />);
    const slider = screen.getByRole("slider", { name: "Size as percent of balance" });
    expect(slider.getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByLabelText("Selected size").textContent).toBe("100%");
  });

  it("stop labels jump to exact percentages", async () => {
    const onValueChange = vi.fn();
    render(<SizeSlider value={0} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "75%" }));
    expect(onValueChange).toHaveBeenCalledWith(75);
  });

  it("keyboard changes value and supports Home/End", async () => {
    const onValueChange = vi.fn();
    render(<SizeSlider value={50} onValueChange={onValueChange} />);
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(51);
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(onValueChange).toHaveBeenLastCalledWith(45);
    await userEvent.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    await userEvent.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("disabled removes tab stop and suppresses jumps", async () => {
    const onValueChange = vi.fn();
    render(<SizeSlider value={25} onValueChange={onValueChange} disabled />);
    expect(screen.getByRole("slider").getAttribute("aria-disabled")).toBe("true");
    expect((screen.getByRole("slider") as HTMLElement).tabIndex).toBe(-1);
    await userEvent.click(screen.getByRole("button", { name: "100%" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
