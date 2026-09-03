"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  applyCidsTheme,
  getStoredCidsTheme,
  isCidsTheme,
  subscribeCidsTheme,
} from "./theme";

/**
 * Keeps <html data-theme> in sync with localStorage, or with `?theme=`
 * when present (canvas iframe bridge). URL wins for this document and
 * does **not** write localStorage — so an iframe remount cannot clobber
 * the parent's chosen theme.
 */
export function ThemeSync() {
  const params = useSearchParams();

  useEffect(() => {
    const fromUrl = params.get("theme");
    if (isCidsTheme(fromUrl)) {
      applyCidsTheme(fromUrl);
      return;
    }
    applyCidsTheme(getStoredCidsTheme());
    return subscribeCidsTheme(() => applyCidsTheme(getStoredCidsTheme()));
  }, [params]);

  return null;
}
