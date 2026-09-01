import { describe, expect, it } from "vitest";
import { isCidsTheme, withThemeParam } from "./theme";

describe("withThemeParam", () => {
  it("adds theme for non-dark", () => {
    expect(withThemeParam("/design/templates/simple-dapp", "mono")).toBe(
      "/design/templates/simple-dapp?theme=mono",
    );
  });

  it("strips theme for dark (default)", () => {
    expect(withThemeParam("/design/templates/simple-dapp?theme=mono", "dark")).toBe(
      "/design/templates/simple-dapp",
    );
  });

  it("replaces an existing theme param", () => {
    expect(withThemeParam("/x?theme=light&item=a", "violet")).toBe(
      "/x?theme=violet&item=a",
    );
  });
});

describe("isCidsTheme", () => {
  it("accepts known themes only", () => {
    expect(isCidsTheme("mono")).toBe(true);
    expect(isCidsTheme("nope")).toBe(false);
  });
});
