import { describe, expect, it } from "vitest";
import { kebabCase, parseComponentDoc, slugify } from "./parseComponentDoc";

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

- \`--brand\`
`;

describe("parseComponentDoc", () => {
  it("extracts purpose, best-for, usage fence, and TOC", () => {
    const p = parseComponentDoc(SAMPLE);
    expect(p.purpose).toBe("The action primitive — four variants on the semantic tokens.");
    expect(p.bestFor).toContain("primary actions");
    expect(p.bestFor).toContain("IconButton");
    expect(p.usageCode).toContain("<Button variant=\"primary\">");
    expect(p.sections.map((s) => s.id)).toEqual([
      "anatomy",
      "props",
      "tokens",
    ]);
    expect(p.body).not.toContain("Status:");
    expect(p.body).not.toContain("# Button");
    expect(p.body).not.toContain("## Usage");
    expect(p.body).not.toContain("<Button variant=\"primary\">");
  });

  it("kebabCase and slugify", () => {
    expect(kebabCase("TokenSelect")).toBe("token-select");
    expect(kebabCase("TxStatus")).toBe("tx-status");
    expect(slugify("When to use")).toBe("when-to-use");
  });
});
