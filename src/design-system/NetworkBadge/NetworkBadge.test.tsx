import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NetworkBadge } from "./NetworkBadge";

describe("NetworkBadge", () => {
  it("renders the chain name as text, dot fallback without icon", () => {
    const { container } = render(<NetworkBadge name="Solana" />);
    expect(screen.getByText("Solana")).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("icon is decorative when provided", () => {
    const { container } = render(
      <NetworkBadge name="Solana" iconSrc="https://cdn.defitriangle.xyz/logos/network/solana/32.png" />,
    );
    expect(container.querySelector("img")!.getAttribute("alt")).toBe("");
  });

  it("warning/error tones use tinted surfaces (wrong-network)", () => {
    const { rerender } = render(<NetworkBadge name="Ethereum" tone="warning" />);
    expect(screen.getByText("Ethereum").className).toContain("bg-warning-surface");
    expect(screen.getByText("Ethereum").className).toContain("text-warning");
    rerender(<NetworkBadge name="Unsupported" tone="error" />);
    expect(screen.getByText("Unsupported").className).toContain("bg-error-surface");
    expect(screen.getByText("Unsupported").className).toContain("text-error");
  });
});
