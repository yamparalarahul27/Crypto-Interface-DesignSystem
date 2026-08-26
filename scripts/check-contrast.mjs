#!/usr/bin/env node
// Static guard for the identity-hue foundation (tide social layer).
// docs/tide/02-design-system.md mandates the 8 identity hues be
// "verified, not eyeballed" before they enter the token layer. This
// asserts WCAG AA (4.5:1) for the two ways an --id-* hue is consumed:
//   1. as an avatar glyph: dark --fg-inverse text on the flat hue fill
//   2. as a handle / presence accent: the hue as text on the surface ladder
// Pure Node, no deps. Mirrors check-theme.mjs. Reads globals.css so the
// hue and surface values stay single-sourced: no duplicated hex here.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const GLOBALS = join(ROOT, "src/app/globals.css");
const css = readFileSync(GLOBALS, "utf8");

const AA = 4.5; // normal-text threshold: avatars glyphs and 13px handles are both normal text

// --- WCAG relative-luminance contrast ------------------------------------
const chan = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * chan((n >> 16) & 255) + 0.7152 * chan((n >> 8) & 255) + 0.0722 * chan(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// 40% toward black: mirrors the avatar radial-gradient dark end
// (color-mix(in srgb, <hue> 60%, black)). Used for the informational note only.
const deepEnd = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(c * 0.6);
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => mix(c).toString(16).padStart(2, "0")).join("");
};

// --- read token values per theme from globals.css --------------------------
// :root is the default theme; each [data-theme="x"] block overrides a subset
// of the same token names. Every theme is verified with root values as the
// fallback for tokens it doesn't override.
const parseVars = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)].map((m) => [m[1], m[2]])
  );
const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/);
const rootVars = rootBlock ? parseVars(rootBlock[1]) : {};
const themes = { dark: rootVars };
for (const m of css.matchAll(/\[data-theme="([a-z-]+)"\]\s*\{([\s\S]*?)\n\}/g)) {
  themes[m[1]] = { ...rootVars, ...parseVars(m[2]) };
}

const failures = [];
if (Object.keys(rootVars).length === 0) failures.push("no :root token block found in globals.css");

// An identity hue now ships as a PAIR: --id-<hue> is the accent (text on
// the surface ladder) and --id-<hue>-fill is the avatar disc, with
// --id-glyph as the letter on that disc. The two have opposite contrast
// requirements, so they are asserted separately, and the filters below
// must not let a -fill or the glyph masquerade as an accent hue.
const isAccent = (k) => k.startsWith("id-") && !k.endsWith("-fill") && k !== "id-glyph";
const accentsOf = (vars) => Object.fromEntries(Object.entries(vars).filter(([k]) => isAccent(k)));

for (const [themeName, vars] of Object.entries(themes)) {
  const accents = accentsOf(vars);
  const glyph = vars["id-glyph"];
  const surfaces = {
    "surface-page": vars["surface-page"],
    "surface-container": vars["surface-container"],
    "surface-bright": vars["surface-bright"],
  };
  if (Object.keys(accents).length === 0) failures.push(`[${themeName}] no --id-* hues found`);
  if (!glyph) failures.push(`[${themeName}] --id-glyph (avatar glyph color) not found`);
  for (const [k, v] of Object.entries(surfaces)) if (!v) failures.push(`[${themeName}] --${k} not found`);
  if (failures.length) continue;

  for (const [name, hex] of Object.entries(accents)) {
    const fill = vars[`${name}-fill`];

    // Rule C1: every accent hue must ship a matching -fill, or a new hue
    // would silently fall back to another theme's disc colour.
    if (!fill) {
      failures.push(`[${themeName}] --${name} has no --${name}-fill (avatar disc colour)`);
      continue;
    }

    // Rule C2: the glyph on the avatar disc. The flat fill is the LIGHTEST
    // point of the radial gradient, so it is the worst case for a light
    // glyph; the dark end only helps.
    const g = ratio(glyph, fill);
    if (g < AA) {
      failures.push(`[${themeName}] glyph ${glyph} on --${name}-fill ${fill} = ${g.toFixed(2)}:1 (< ${AA})`);
    }

    // Rule C3: the accent hue as text on every surface it can land on.
    for (const [sName, sHex] of Object.entries(surfaces)) {
      const t = ratio(hex, sHex);
      if (t < AA) failures.push(`[${themeName}] --${name} text on --${sName} = ${t.toFixed(2)}:1 (< ${AA})`);
    }
  }
}
// values reused by the summary output below
const hues = accentsOf(rootVars);
const glyph = rootVars["id-glyph"];

if (failures.length) {
  console.error("✗ check:contrast, identity hues below WCAG AA:\n");
  for (const f of failures) console.error("  " + f);
  console.error(`\n${failures.length} failure(s). Adjust the hue in globals.css until ≥ ${AA}:1.`);
  process.exit(1);
}

console.log(`✓ check:contrast, ${Object.keys(hues).length} identity hues pass WCAG AA (${AA}:1) across ${Object.keys(themes).length} theme(s): ${Object.keys(themes).join(", ")}`);
console.log("  glyph-on-fill, accent-on-surface (page/container/bright), and fill completeness all verified.");
console.log("\n  avatar disc, glyph on the flat fill (the gradient's lightest point, so the worst case):");
for (const name of Object.keys(hues)) {
  const fill = rootVars[`${name}-fill`];
  console.log(`    --${name}-fill ${fill}: ${ratio(glyph, fill).toFixed(2)}:1`);
}
