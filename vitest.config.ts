import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "src/design-system/**/*.test.{ts,tsx}",
      "src/components/**/*.test.{ts,tsx}", // PriceChart (evilcharts-backed, outside the portable core)
      "src/app/design/**/*.test.{ts,tsx}", // component-page parsers / showcase helpers
    ],
    setupFiles: ["./vitest.setup.ts"],
  },
});
