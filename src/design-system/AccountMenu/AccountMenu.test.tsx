import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountMenu } from "./AccountMenu";

const ADDR = "7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM";

describe("AccountMenu", () => {
  it("trigger accessible name includes the full address", () => {
    render(<AccountMenu address={ADDR} />);
    expect(
      screen.getByRole("button", { name: `Wallet ${ADDR}: open account` }),
    ).toBeTruthy();
    expect(screen.getByRole("button").textContent).toContain("7xKt…Q2rM");
  });

  it("Copy address writes the full address to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<AccountMenu address={ADDR} />);
    await userEvent.click(
      screen.getByRole("button", { name: `Wallet ${ADDR}: open account` }),
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Copy address" }));
    expect(writeText).toHaveBeenCalledWith(ADDR);
    expect(await screen.findByRole("menuitem", { name: "Copied" })).toBeTruthy();
  });

  it("Disconnect calls onDisconnect", async () => {
    const user = userEvent.setup();
    const onDisconnect = vi.fn();
    render(<AccountMenu address={ADDR} onDisconnect={onDisconnect} />);
    await user.click(screen.getByRole("button", { name: `Wallet ${ADDR}: open account` }));
    await user.click(screen.getByRole("menuitem", { name: "Disconnect" }));
    expect(onDisconnect).toHaveBeenCalledOnce();
  });

  it("hides Disconnect when onDisconnect is omitted", async () => {
    const user = userEvent.setup();
    render(<AccountMenu address={ADDR} />);
    await user.click(screen.getByRole("button", { name: `Wallet ${ADDR}: open account` }));
    expect(screen.queryByRole("menuitem", { name: "Disconnect" })).toBeNull();
  });
});
