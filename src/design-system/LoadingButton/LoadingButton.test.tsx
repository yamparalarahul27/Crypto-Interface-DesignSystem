import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadingButton } from "./LoadingButton";

describe("LoadingButton", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts idle with the children label", () => {
    render(<LoadingButton onAction={() => {}}>Sign</LoadingButton>);
    expect(screen.getByRole("button", { name: "Sign" })).toBeTruthy();
  });

  it("moves idle → pending → success → idle", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    let resolve!: () => void;
    const action = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );

    render(
      <LoadingButton
        onAction={action}
        pendingLabel="Signing…"
        successLabel="Signed"
        resetAfter={1400}
      >
        Sign
      </LoadingButton>,
    );

    await user.click(screen.getByRole("button", { name: "Sign" }));
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("button", { name: "Signing…" })).toBeTruthy();

    await act(async () => {
      resolve();
    });
    expect(screen.getByRole("button", { name: "Signed" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Signed");

    await act(async () => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByRole("button", { name: "Sign" })).toBeTruthy();
  });

  it("settles to error on rejection and retries", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onError = vi.fn();
    let fail = true;
    const action = vi.fn(() => {
      if (fail) return Promise.reject(new Error("nope"));
      return Promise.resolve();
    });

    render(
      <LoadingButton
        onAction={action}
        errorLabel="Retry"
        successLabel="Done"
        onError={onError}
      >
        Publish
      </LoadingButton>,
    );

    await user.click(screen.getByRole("button", { name: "Publish" }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();

    fail = false;
    await user.click(screen.getByRole("button", { name: "Retry" }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("ignores a second click while pending", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const action = vi.fn(() => new Promise<void>(() => {}));

    render(<LoadingButton onAction={action}>Go</LoadingButton>);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("stacks all faces for width-stable layout", () => {
    const { container } = render(
      <LoadingButton
        onAction={() => {}}
        pendingLabel="Publishing a long thing…"
        successLabel="Published"
        errorLabel="Try again"
      >
        Publish
      </LoadingButton>,
    );
    const faces = container.querySelectorAll(".col-start-1.row-start-1");
    expect(faces.length).toBe(4);
  });

  it("native disabled does not run the action", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const action = vi.fn();
    render(
      <LoadingButton onAction={action} disabled>
        Go
      </LoadingButton>,
    );
    await user.click(screen.getByRole("button")).catch(() => {});
    expect(action).not.toHaveBeenCalled();
  });
});
