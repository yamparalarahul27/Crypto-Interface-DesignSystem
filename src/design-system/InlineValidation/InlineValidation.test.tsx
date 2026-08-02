import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InlineValidation } from "./InlineValidation";

describe("InlineValidation", () => {
  it("shows a reserved hint until blur validation fails", async () => {
    render(
      <InlineValidation
        label="Recipient"
        value="ab"
        onChange={() => {}}
        validate={(v) => (v.length >= 4 ? null : "Too short")}
        hint="Enter an address"
        debounce={0}
      />,
    );
    expect(screen.getAllByText("Enter an address").length).toBeGreaterThan(0);
    await userEvent.click(screen.getByLabelText("Recipient"));
    await userEvent.tab();
    expect(screen.getAllByText("Too short").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Recipient").getAttribute("aria-invalid")).toBe("true");
  });

  it("clears invalid when validate returns null", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <InlineValidation
        label="Email"
        value="bad"
        onChange={onChange}
        validate={(v) => (v.includes("@") ? null : "Need @")}
        debounce={0}
      />,
    );
    await userEvent.click(screen.getByLabelText("Email"));
    await userEvent.tab();
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");

    rerender(
      <InlineValidation
        label="Email"
        value="a@b.co"
        onChange={onChange}
        validate={(v) => (v.includes("@") ? null : "Need @")}
        debounce={0}
      />,
    );
    await userEvent.click(screen.getByLabelText("Email"));
    await userEvent.tab();
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBeNull();
  });
});
