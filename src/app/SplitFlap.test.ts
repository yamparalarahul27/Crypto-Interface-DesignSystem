import { describe, expect, it } from "vitest";
import { CONTROL_CELL, MESSAGES, toCells } from "./SplitFlap";

const COLS = 15;
const ROWS = 3;

describe("toCells", () => {
  it("always fills the fixed board — no layout shift between messages", () => {
    for (const m of MESSAGES) {
      expect(toCells(m)).toHaveLength(COLS * ROWS);
    }
  });

  it("wraps on words, never mid-word", () => {
    const lines = chunk(toCells("CIDS IS AN OPEN DESIGN SYSTEM FOR CRYPTO UIS"));
    expect(lines).toEqual(["CIDS IS AN OPEN", "DESIGN SYSTEM  ", "FOR CRYPTO UIS "]);
  });

  it("fits every authored message in the board", () => {
    // A message that needs a 4th line would be silently clipped — catch it here.
    for (const m of MESSAGES) {
      const flat = chunk(toCells(m)).join(" ").split(/\s+/).filter(Boolean);
      expect(flat.join(" ")).toBe(m);
    }
  });

  it("leaves the control flap free in every message", () => {
    // The bottom-right flap is the play/pause button. A message that
    // reaches it would put a letter behind the control.
    for (const m of MESSAGES) {
      expect(toCells(m)[CONTROL_CELL]).toBe(" ");
    }
  });

  it("pads short lines with blanks rather than resizing", () => {
    const cells = toCells("GO");
    expect(cells[0]).toBe("G");
    expect(cells[1]).toBe("O");
    expect(cells.slice(2).every((c) => c === " ")).toBe(true);
  });
});

function chunk(cells: string[]): string[] {
  return Array.from({ length: ROWS }, (_, r) =>
    cells.slice(r * COLS, (r + 1) * COLS).join(""),
  );
}
