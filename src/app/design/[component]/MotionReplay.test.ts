import { describe, expect, it } from "vitest";
import { extractMotionNote, extractMotionTokens } from "./MotionReplay";

describe("extractMotionTokens", () => {
  it("collects --motion-* from the Motion section", () => {
    const doc = `# X
Status: stable
Version: 1.0.0
hi

## Motion

Targeted transition via \`--motion-fast\`; press uses \`--motion-spring\`.

## A11y
ok
`;
    expect(extractMotionTokens(doc)).toEqual(["--motion-fast", "--motion-spring"]);
  });

  it("returns [] when Motion is none", () => {
    expect(
      extractMotionTokens(`# X\n\n## Motion\n\nNone. Fee updates swap text.\n`),
    ).toEqual([]);
  });
});

describe("extractMotionNote", () => {
  it("joins the Motion section prose", () => {
    const note = extractMotionNote(`# X\n\n## Motion\n\n- 150ms targeted\n- Reduced-motion: global reset.\n`);
    expect(note).toContain("150ms");
    expect(note).toContain("Reduced-motion");
  });
});
