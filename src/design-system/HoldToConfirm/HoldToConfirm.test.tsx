import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoldToConfirm } from "./HoldToConfirm";

describe("HoldToConfirm", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not confirm on a short click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onConfirm = vi.fn();
    render(
      <HoldToConfirm onConfirm={onConfirm} duration={500}>
        Delete
      </HoldToConfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms after a sustained hold", async () => {
    const onConfirm = vi.fn();
    render(
      <HoldToConfirm onConfirm={onConfirm} duration={100} resetAfter={0}>
        Delete
      </HoldToConfirm>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    await act(async () => {
      btn.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          button: 0,
          clientX: 0,
          clientY: 0,
          pointerId: 1,
        }),
      );
      // Drive rAF loop: advance wall clock so performance.now deltas accumulate
      for (let i = 0; i < 20; i++) {
        vi.advanceTimersByTime(20);
        await Promise.resolve();
      }
    });
    expect(onConfirm).toHaveBeenCalled();
  });
});
