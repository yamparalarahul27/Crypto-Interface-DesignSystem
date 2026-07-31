import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderTypeTabs } from "./OrderTypeTabs";

describe("OrderTypeTabs", () => {
  it("renders a tablist with the active value selected", () => {
    render(<OrderTypeTabs value="limit" onValueChange={() => {}} />);
    expect(screen.getByRole("tablist", { name: "Order type" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /^Limit/ }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: /^Market/ }).getAttribute("aria-selected")).toBe("false");
  });

  it("fires onValueChange when an order type is clicked", async () => {
    const onValueChange = vi.fn();
    render(<OrderTypeTabs value="limit" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: /TWAP/ }));
    expect(onValueChange).toHaveBeenCalledWith("twap");
  });

  it("roves with arrow keys and skips disabled options", async () => {
    const onValueChange = vi.fn();
    render(
      <OrderTypeTabs
        value="limit"
        onValueChange={onValueChange}
        options={[
          { value: "limit", label: "Limit" },
          { value: "market", label: "Market", disabled: true },
          { value: "twap", label: "TWAP" },
        ]}
      />,
    );
    screen.getByRole("tab", { name: /Limit/ }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("twap");
  });

  it("does not fire for disabled tabs", async () => {
    const onValueChange = vi.fn();
    render(
      <OrderTypeTabs
        value="limit"
        onValueChange={onValueChange}
        options={[
          { value: "limit", label: "Limit" },
          { value: "market", label: "Market", disabled: true },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("tab", { name: /Market/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
