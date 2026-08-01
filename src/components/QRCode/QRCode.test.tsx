import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QRCode } from "./QRCode";

const toString = vi.fn();

vi.mock("qrcode", () => ({
  default: {
    toString: (...args: unknown[]) => toString(...args),
  },
}));

beforeEach(() => {
  toString.mockReset();
  toString.mockResolvedValue(
    '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff"/><path stroke="#000000"/></svg>',
  );
});

describe("QRCode", () => {
  it("renders a themed SVG matrix and the address chip", async () => {
    const addr = "7xKtF2mPqR8vN3wLbJd5cYhT6gAeS4uZ1oXnE9fQ2rM";
    render(<QRCode value={addr} />);
    expect(screen.getByText("Scan to send")).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByRole("figure").innerHTML).toContain("currentColor");
      expect(screen.getByRole("figure").innerHTML).toContain("var(--surface-bright)");
    });
    expect(screen.getByLabelText(addr)).toBeTruthy();
    expect(toString).toHaveBeenCalledWith(
      addr,
      expect.objectContaining({ type: "svg", width: 160 }),
    );
  });

  it("hides the caption when label is empty", async () => {
    render(<QRCode value="abc" label="" />);
    await waitFor(() => expect(screen.getByRole("figure").innerHTML).toContain("svg"));
    expect(screen.queryByText("Scan to send")).toBeNull();
  });

  it("shows an error when generation fails", async () => {
    toString.mockRejectedValueOnce(new Error("boom"));
    render(<QRCode value="bad" />);
    expect(await screen.findByText(/Couldn't render QR/)).toBeTruthy();
  });

  it("rejects non-svg library output", async () => {
    toString.mockResolvedValueOnce("<div>nope</div>");
    render(<QRCode value="x" />);
    expect(await screen.findByText(/Couldn't render QR/)).toBeTruthy();
  });
});
