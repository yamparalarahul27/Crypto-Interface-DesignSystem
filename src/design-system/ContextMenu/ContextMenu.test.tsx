import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";

const items = (onCopy = () => {}, onDel = () => {}) => [
  { label: "Copy address", onSelect: onCopy },
  { kind: "separator" as const },
  { label: "Remove", onSelect: onDel, destructive: true },
];

function renderCtx(onCopy?: () => void, onDel?: () => void) {
  return render(
    <ContextMenu items={items(onCopy, onDel)}>
      <div data-testid="surface">Right-click me</div>
    </ContextMenu>,
  );
}

describe("ContextMenu", () => {
  it("opens on contextmenu and lists items", async () => {
    renderCtx();
    fireEvent.contextMenu(screen.getByTestId("surface"));
    expect(await screen.findByRole("menu")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Copy address" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Remove" }).className).toContain(
      "text-sell",
    );
  });

  it("selecting an item fires onSelect and closes", async () => {
    const onCopy = vi.fn();
    renderCtx(onCopy);
    fireEvent.contextMenu(screen.getByTestId("surface"));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Copy address" }),
    );
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("Escape closes the menu", async () => {
    renderCtx();
    fireEvent.contextMenu(screen.getByTestId("surface"));
    expect(await screen.findByRole("menu")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
