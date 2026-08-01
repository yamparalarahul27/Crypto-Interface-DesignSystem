// Pure parser for the CONVENTIONS.md doc shape — used by the
// per-component page chrome so it can surface purpose / install /
// best-for without duplicating content out of the .doc.md.

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

/**
 * Strip Status/Version/H1 chrome lines the page header already shows,
 * then pull purpose, Best for, first Usage fence, and ## TOC entries.
 */
export function parseComponentDoc(doc: string): {
  body: string;
  purpose: string;
  bestFor: string | null;
  usageCode: string | null;
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

  const sections: DocSection[] = [];
  for (const l of stripped) {
    if (l.startsWith("## ")) {
      const title = l.slice(3).trim();
      // Usage is promoted into page chrome — keep it out of the TOC body.
      if (title.toLowerCase() === "usage") continue;
      sections.push({ id: slugify(title), title });
    }
  }

  // Drop the ## Usage block from the rendered body (snippet already shown
  // above). Best-for is extracted separately; other sections keep order.
  const bodyLines: string[] = [];
  let skipUsage = false;
  for (const l of stripped) {
    if (l.startsWith("## ")) {
      skipUsage = l.slice(3).trim().toLowerCase() === "usage";
      if (skipUsage) continue;
    }
    if (skipUsage) continue;
    bodyLines.push(l);
  }

  return {
    body: bodyLines.join("\n"),
    purpose,
    bestFor,
    usageCode,
    sections,
  };
}
