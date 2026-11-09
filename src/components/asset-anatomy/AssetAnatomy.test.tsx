import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { AssetAnatomy } from "./AssetAnatomy";
import { usdt } from "./usdt";

afterEach(() => { cleanup(); vi.restoreAllMocks(); window.history.replaceState(null, "", "/"); });

function finalChapterAtReadingPosition() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return { top: this.id === "pieces" ? 0 : -2000, height: window.innerHeight, left: 0, right: 0, bottom: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) };
  });
}

describe("Asset anatomy", () => {
  it("keeps the diagram description and legend in sync when filtering by location", () => {
    finalChapterAtReadingPosition();
    render(<AssetAnatomy asset={usdt} />);
    const filters = screen.getByRole("group", { name: "Highlight layers by location" });
    fireEvent.click(within(filters).getByRole("button", { name: /^Off-chain$/ }));
    expect(screen.getByRole("img", { name: /^USDT, taken apart/ }).textContent).toContain("Highlighted: Reserves, The issuer.");
    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(2);
    expect(legend.textContent).not.toContain("Balances");
    fireEvent.click(within(filters).getByRole("button", { name: "All pieces" }));
    expect(within(legend).getAllByRole("listitem")).toHaveLength(6);
  });

  it("jumps without smooth motion and moves focus to the requested chapter", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(query => ({ matches: true, media: query } as MediaQueryList));
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<AssetAnatomy asset={usdt} />);
    fireEvent.click(screen.getByRole("button", { name: "6. Behind the dollar" }));
    expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ behavior: "instant" }));
    expect(window.location.hash).toBe("#reserves");
    expect(document.activeElement?.id).toBe("reserves");
  });

  it("gives a recovery message when copying a share link fails", async () => {
    const clipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    finalChapterAtReadingPosition();
    render(<AssetAnatomy asset={usdt} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Share this story" })); });
    expect(screen.getByRole("status").textContent).toBe("Copy this page’s address to share");
    if (clipboard) Object.defineProperty(navigator, "clipboard", clipboard);
    else Reflect.deleteProperty(navigator, "clipboard");
  });
});
