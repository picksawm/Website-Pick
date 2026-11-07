import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Lang } from "../config/siteTexts";
import { headTags, canonicalUrl } from "../seo/head";
import { metaFor } from "../seo/meta";

/**
 * Seo — the runtime half of the metadata system.
 *
 * The prerenderer writes the same tags into each static HTML file, so
 * crawlers never need this component. It exists for the two cases the
 * build cannot know about: client-side navigation between routes, and
 * the visitor toggling EN/فارسی.
 *
 * It reads `src/seo/head.ts`, the same module the prerenderer uses, so
 * the static and dynamic heads can never drift apart.
 */
export default function Seo({ lang }: { lang: Lang }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    const meta = metaFor(lang, pathname);
    const tags = headTags(lang, pathname);

    for (const tag of tags) {
      if (tag.tag === "title") {
        document.title = tag.text ?? meta.title;
        continue;
      }

      if (tag.tag === "script") {
        // replace the route-scoped JSON-LD block rather than stacking copies
        const existing = document.head.querySelectorAll('script[data-seo="route"]');
        existing.forEach((el) => el.remove());
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seo = "route";
        script.textContent = tag.text ?? "";
        document.head.appendChild(script);
        continue;
      }

      const key =
        tag.attrs.name
          ? `meta[name="${tag.attrs.name}"]`
          : tag.attrs.property
            ? `meta[property="${tag.attrs.property}"]`
            : tag.attrs.rel === "canonical"
              ? 'link[rel="canonical"]'
              : tag.attrs.rel === "alternate" && tag.attrs.hreflang
                ? `link[rel="alternate"][hreflang="${tag.attrs.hreflang}"]`
                : null;
      if (!key) continue;

      let el = document.head.querySelector<HTMLElement>(key);
      if (!el) {
        el = document.createElement(tag.tag);
        document.head.appendChild(el);
      }
      for (const [attr, value] of Object.entries(tag.attrs)) {
        el.setAttribute(attr, value);
      }
    }

    // canonical always reflects the current route
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl(meta.path);
  }, [lang, pathname]);

  return null;
}
