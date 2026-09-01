// Shared CIDS theme store: ThemeToggle, canvas iframe bridge, and
// ThemeSync (root) all read/write through this module so ?theme= and
// localStorage stay one contract.

export const CIDS_THEMES = ["dark", "mono", "light", "violet"] as const;
export type CidsTheme = (typeof CIDS_THEMES)[number];
export const CIDS_THEME_STORAGE_KEY = "cids-theme";

const listeners = new Set<() => void>();

export function emitCidsTheme() {
  listeners.forEach((l) => l());
}

export function subscribeCidsTheme(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", cb);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", cb);
    }
  };
}

export function isCidsTheme(v: string | null | undefined): v is CidsTheme {
  return !!v && (CIDS_THEMES as readonly string[]).includes(v);
}

export function getStoredCidsTheme(): CidsTheme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(CIDS_THEME_STORAGE_KEY);
  return isCidsTheme(stored) ? stored : "dark";
}

export function getServerCidsTheme(): CidsTheme {
  return "dark";
}

export function setStoredCidsTheme(t: CidsTheme) {
  localStorage.setItem(CIDS_THEME_STORAGE_KEY, t);
  emitCidsTheme();
}

/** Stamp <html data-theme>. Dark clears the attribute (matches ThemeToggle). */
export function applyCidsTheme(t: CidsTheme, root: HTMLElement = document.documentElement) {
  if (t === "dark") delete root.dataset.theme;
  else root.dataset.theme = t;
}

/** Append or replace `theme` query param on a same-origin path/URL. */
export function withThemeParam(src: string, theme: CidsTheme): string {
  try {
    const url = new URL(src, "http://cids.local");
    if (theme === "dark") url.searchParams.delete("theme");
    else url.searchParams.set("theme", theme);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return src;
  }
}
