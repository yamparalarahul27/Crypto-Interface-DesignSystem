import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TokenSelect, type TokenOption } from "./TokenSelect";

const TOKENS: TokenOption[] = [
  { id: "sol", symbol: "SOL", name: "Solana", balance: "12.40" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "1,204.00" },
  { id: "jup", symbol: "JUP", name: "Jupiter", balance: "840.2", disabled: true },
];

describe("TokenSelect", () => {
  it("shows placeholder when nothing is selected", () => {
    render(
      <TokenSelect tokens={TOKENS} value={undefined} onValueChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Select token" }).textContent).toContain(
      "Select token",
    );
  });

  it("shows the selected symbol on the trigger", () => {
    render(
      <TokenSelect tokens={TOKENS} value="sol" onValueChange={() => {}} />,
    );
    expect(
      screen.getByRole("button", { name: "Select token: SOL" }).textContent,
    ).toContain("SOL");
  });

  it("opens the dialog, filters, and selects a token", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TokenSelect tokens={TOKENS} value={undefined} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Select token" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("option", { name: /Solana/ })).toBeTruthy();

    await user.type(screen.getByLabelText("Search tokens"), "usd");
    expect(screen.queryByRole("option", { name: /Solana/ })).toBeNull();
    expect(screen.getByRole("option", { name: /USD Coin/ })).toBeTruthy();

    await user.click(screen.getByRole("option", { name: /USD Coin/ }));
    expect(onValueChange).toHaveBeenCalledWith("usdc");
  });

  it("does not select a disabled token", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TokenSelect tokens={TOKENS} value="sol" onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Select token: SOL" }));
    await user.click(screen.getByRole("option", { name: /Jupiter/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keyboard: ArrowDown + Enter selects the active option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TokenSelect tokens={TOKENS} value={undefined} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Select token" }));
    const search = screen.getByLabelText("Search tokens");
    expect(search.getAttribute("role")).toBe("combobox");
    expect(search.getAttribute("aria-autocomplete")).toBe("list");
    await user.type(search, "{ArrowDown}{Enter}");
    // starts on first enabled (SOL); ArrowDown skips to USDC (JUP disabled later)
    expect(onValueChange).toHaveBeenCalledWith("usdc");
  });

  it("ArrowDown skips disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const list: TokenOption[] = [
      { id: "jup", symbol: "JUP", name: "Jupiter", disabled: true },
      { id: "sol", symbol: "SOL", name: "Solana" },
      { id: "bonk", symbol: "BONK", name: "Bonk", disabled: true },
      { id: "usdc", symbol: "USDC", name: "USD Coin" },
    ];
    render(
      <TokenSelect tokens={list} value={undefined} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Select token" }));
    const search = screen.getByLabelText("Search tokens");
    // first enabled = SOL; ArrowDown → USDC
    await user.type(search, "{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("usdc");
  });

  it("loading shows status and hides options", async () => {
    const user = userEvent.setup();
    render(
      <TokenSelect tokens={TOKENS} value={undefined} onValueChange={() => {}} loading />,
    );
    await user.click(screen.getByRole("button", { name: "Select token" }));
    expect(screen.getByRole("status").textContent).toContain("Loading tokens");
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("empty catalog uses catalogEmptyText", async () => {
    const user = userEvent.setup();
    render(
      <TokenSelect
        tokens={[]}
        value={undefined}
        onValueChange={() => {}}
        catalogEmptyText="No assets yet"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Select token" }));
    expect(screen.getByText("No assets yet")).toBeTruthy();
  });
});
