import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActivityRow } from "./ActivityRow";

describe("ActivityRow", () => {
  it("renders title, time, status word, and amount", () => {
    render(
      <ActivityRow
        title="Swapped SOL → USDC"
        time="2m ago"
        status="confirmed"
        amount="+12.40 USDC"
        tokenSymbol="USDC"
      />,
    );
    expect(screen.getByText("Swapped SOL → USDC")).toBeTruthy();
    expect(screen.getByText("2m ago")).toBeTruthy();
    expect(screen.getByText("confirmed")).toBeTruthy();
    expect(screen.getByText("+12.40 USDC")).toBeTruthy();
  });

  it("each status carries word + tone ink (mono-safe)", () => {
    const cases = [
      ["pending", "text-info"],
      ["confirmed", "text-buy"],
      ["failed", "text-sell"],
    ] as const;
    for (const [status, cls] of cases) {
      const { unmount } = render(
        <ActivityRow
          title="Tx"
          time="now"
          status={status}
          amount="0"
        />,
      );
      expect(screen.getByText(status).className).toContain(cls);
      unmount();
    }
  });

  it("static row is not a button; onClick makes it one", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <ActivityRow title="Tx" time="now" status="pending" amount="0" />,
    );
    expect(screen.queryByRole("button")).toBeNull();

    rerender(
      <ActivityRow
        title="Tx"
        time="now"
        status="pending"
        amount="0"
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
