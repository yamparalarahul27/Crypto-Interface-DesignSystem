import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TxStatus } from "./TxStatus";

describe("TxStatus", () => {
  it("is a polite live region", () => {
    render(<TxStatus state="pending" />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.textContent).toContain("Pending confirmation…");
  });

  it("terminal states carry icon + word, not color alone", () => {
    const { container, rerender } = render(<TxStatus state="confirmed" />);
    expect(screen.getByRole("status").textContent).toContain("Confirmed");
    expect(container.querySelector("svg")).toBeTruthy();
    rerender(<TxStatus state="failed" />);
    expect(screen.getByRole("status").textContent).toContain("Failed");
    expect(container.querySelector("svg")).toBeTruthy();
    // …and in-flight states are not marked: the icon means "terminal".
    rerender(<TxStatus state="pending" />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("in-flight states pulse; terminal states are still", () => {
    const { container, rerender } = render(<TxStatus state="pending" />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
    rerender(<TxStatus state="confirmed" />);
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("renders the mono detail line", () => {
    render(<TxStatus state="signing" detail="5D3k…Wq" />);
    expect(screen.getByText("5D3k…Wq").className).toContain("font-mono");
  });

  it("detailHref turns detail into an explorer link", () => {
    render(
      <TxStatus
        state="pending"
        detail="5D3k…Wq"
        detailHref="https://solscan.io/tx/5D3k"
      />,
    );
    const link = screen.getByRole("link", { name: "5D3k…Wq" });
    expect(link.getAttribute("href")).toContain("solscan");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("action slot renders beside the status", () => {
    render(
      <TxStatus state="failed" detail="User rejected" action={<button type="button">Retry</button>} />,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Failed");
  });
});
