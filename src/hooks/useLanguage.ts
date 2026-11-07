import { useState, useCallback } from "react";
import type { Lang } from "../config/siteTexts";

/** Reads ?lang / #fa so a Persian visitor keeps Persian across reloads. */
function detectLang(initial?: Lang): Lang {
  if (initial) return initial;
  if (typeof window === "undefined") return "en";
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    if (q === "fa" || q === "en") return q;
    if (url.hash.includes("fa")) return "fa";
    const stored = window.localStorage.getItem("picksaw:lang");
    if (stored === "fa" || stored === "en") return stored;
  } catch {
    // storage / URL unavailable — fall through to default
  }
  return "en";
}

export function useLanguage(initial?: Lang) {
  const [lang, setLangState] = useState<Lang>(() => detectLang(initial));

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem("picksaw:lang", next);
    } catch {
      // private mode — the toggle still works for this session
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "fa" : "en";
      try {
        window.localStorage.setItem("picksaw:lang", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { lang, toggle, setLang };
}
