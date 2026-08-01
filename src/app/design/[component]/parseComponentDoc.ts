// Pure parser for the CONVENTIONS.md doc shape — used by the
// per-component page chrome so it can surface purpose / install /
// best-for / tokens / states without duplicating content out of .doc.md.

export type DocSection = { id: string; title: string };

export function kebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Collect `--token` names from a section's raw lines (order preserved, unique). */
export function extractTokenNames(sectionLines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of sectionLines) {
    for (const m of l.matchAll(/--([a-z][a-z0-9-]*)/g)) {
      const name = m[1];
      if (name.endsWith("-") || name.includes("(")) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

/** Split a States section into short labels (· / bullets / commas). */
export function extractStateLabels(sectionLines: string[]): string[] {
  const raw = sectionLines
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("```"))
    .join(" · ");
  if (!raw) return [];
  return raw
    .split(/\s*[·•|,]\s*|\s{2,}/)
    .map((s) => s.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 0 && s.length < 48);
}

function sectionLines(stripped: string[], title: string): string[] {
  const want = title.toLowerCase();
  const out: string[] = [];
  let inSection = false;
  for (const l of stripped) {
    if (l.startsWith("## ")) {
      inSection = l.slice(3).trim().toLowerCase() === want;
      continue;
    }
    if (inSection) out.push(l);
  }
  return out;
}

/**
 * Strip Status/Version/H1 chrome lines the page header already shows,
 * then pull purpose, Best for, first Usage fence, tokens, states, TOC.
 */
export function parseComponentDoc(doc: string): {
  body: string;
  purpose: string;
  bestFor: string | null;
  usageCode: string | null;
  tokens: string[];
  states: string[];
  sections: DocSection[];
} {
  const lines = doc.split("\n");
  const stripped = lines.filter(
    (l, i) =>
      !(i < 6 && (l.startsWith("# ") || l.startsWith("Status:") || l.startsWith("Version:"))),
  );

  let purpose = "";
  for (const l of stripped) {
    const t = l.trim();
    if (!t || t.startsWith("#") || t.startsWith("```") || t.startsWith("|") || t.startsWith("-")) {
      if (purpose) break;
      continue;
    }
    if (t.startsWith("Best for:")) continue;
    purpose = t;
    break;
  }

  let bestFor: string | null = null;
  for (let i = 0; i < stripped.length; i++) {
    const t = stripped[i].trim();
    if (t.startsWith("Best for:")) {
      const rest = t.slice("Best for:".length).trim();
      const buf = [rest];
      let j = i + 1;
      while (j < stripped.length) {
        const n = stripped[j].trim();
        if (!n || n.startsWith("#") || n.startsWith("```") || n.startsWith("|") || n.startsWith("-")) {
          break;
        }
        buf.push(n);
        j++;
      }
      bestFor = buf.filter(Boolean).join(" ");
      break;
    }
  }

  let usageCode: string | null = null;
  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i].startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < stripped.length && !stripped[i].startsWith("```")) buf.push(stripped[i++]);
      usageCode = buf.join("\n").trim() || null;
      break;
    }
  }

  const tokens = extractTokenNames(sectionLines(stripped, "Tokens"));
  const states = extractStateLabels(sectionLines(stripped, "States"));

  const sections: DocSection[] = [];
  if (tokens.length) sections.push({ id: "token-swatches", title: "Tokens" });
  if (states.length) sections.push({ id: "states-live", title: "States" });

  for (const l of stripped) {
    if (l.startsWith("## ")) {
      const title = l.slice(3).trim();
      const lower = title.toLowerCase();
      if (lower === "usage" || lower === "tokens" || lower === "states") continue;
      sections.push({ id: slugify(title), title });
    }
  }

  const skip = new Set(["usage", "tokens", "states"]);
  const bodyLines: string[] = [];
  let skipping = false;
  for (const l of stripped) {
    if (l.startsWith("## ")) {
      skipping = skip.has(l.slice(3).trim().toLowerCase());
      if (skipping) continue;
    }
    if (skipping) continue;
    bodyLines.push(l);
  }

  return {
    body: bodyLines.join("\n"),
    purpose,
    bestFor,
    usageCode,
    tokens,
    states,
    sections,
  };
}
