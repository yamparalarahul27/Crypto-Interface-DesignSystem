import { describe, expect, it } from "vitest";
import {
  extractStateLabels,
  extractTokenNames,
  kebabCase,
  parseComponentDoc,
  slugify,
} from "./parseComponentDoc";
import { isColorToken } from "./TokenSwatches";

const SAMPLE = `# Button

Status: stable
Version: 1.0.0
The action primitive — four variants on the semantic tokens.

## Usage

\`\`\`tsx
import { Button } from "@/design-system";
<Button variant="primary">Confirm</Button>
\`\`\`

Best for: primary actions in forms and dialogs. Prefer IconButton
for icon-only controls.

## Anatomy

wireframe

## Props

| Prop | Type |
|---|---|
| x | y |

## Tokens

- \`--brand\` / \`--on-brand\` / \`--brand-hover\` (primary) · \`--surface-container\`
- \`--radius-control\` · \`--motion-fast\` timing via the 150ms transition

## States

- default · hover (fill shift) · active (\`scale 0.96\`) · disabled (\`opacity-40\`)

## Motion

none
`;

describe("parseComponentDoc", () => {
  it("extracts purpose, best-for, usage, tokens, states, TOC", () => {
    const p = parseComponentDoc(SAMPLE);
    expect(p.purpose).toBe("The action primitive — four variants on the semantic tokens.");
    expect(p.bestFor).toContain("primary actions");
    expect(p.usageCode).toContain('<Button variant="primary">');
    expect(p.tokens).toEqual(
      expect.arrayContaining([
        "brand",
        "on-brand",
        "brand-hover",
        "surface-container",
        "radius-control",
        "motion-fast",
      ]),
    );
    expect(p.states).toEqual(expect.arrayContaining(["default", "hover", "active", "disabled"]));
    expect(p.sections.map((s) => s.id)).toEqual([
      "token-swatches",
      "states-live",
      "anatomy",
      "props",
      "motion",
    ]);
    expect(p.body).not.toContain("## Usage");
    expect(p.body).not.toContain("## Tokens");
    expect(p.body).not.toContain("## States");
  });

  it("kebabCase and slugify", () => {
    expect(kebabCase("TokenSelect")).toBe("token-select");
    expect(slugify("When to use")).toBe("when-to-use");
  });

  it("extractTokenNames dedupes", () => {
    expect(extractTokenNames(["`--brand` / `--brand`", "--motion-fast"])).toEqual([
      "brand",
      "motion-fast",
    ]);
  });

  it("extractStateLabels splits on middots", () => {
    expect(extractStateLabels(["default · hover (x) · disabled"])).toEqual([
      "default",
      "hover",
      "disabled",
    ]);
  });
});

describe("isColorToken", () => {
  it("classifies paint vs structural tokens", () => {
    expect(isColorToken("brand")).toBe(true);
    expect(isColorToken("motion-fast")).toBe(false);
    expect(isColorToken("radius-control")).toBe(false);
  });
});
