/**
 * head.ts — turns a RouteMeta into the exact <head> tags for a page.
 *
 * Used in two places, which is the whole point:
 *   1. `scripts/prerender.mjs` (Node) → writes real static HTML per route
 *   2. `src/components/Seo.tsx` (browser) → keeps them correct on
 *      client-side navigation and language toggle
 *
 * Pure string/array output: no DOM APIs, so it runs identically in both.
 */
import { alternates, metaFor, SITE, type RouteMeta } from "./meta";
import type { Lang } from "../config/siteTexts";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const canonicalUrl = (path: string) =>
  path === "/" ? `${SITE.origin}/` : `${SITE.origin}${path}`;

/** Ordered descriptor list — one shape, two renderers. */
export interface HeadTag {
  tag: "title" | "meta" | "link" | "script";
  attrs: Record<string, string>;
  text?: string;
}

export function headTags(lang: Lang, path: string, extra?: Partial<RouteMeta>): HeadTag[] {
  const base = metaFor(lang, path);
  const meta: RouteMeta = { ...base, ...extra };
  const canonical = canonicalUrl(meta.path);
  const og = `${SITE.origin}${meta.ogImage ?? SITE.defaultOg}`;

  const tags: HeadTag[] = [
    { tag: "title", attrs: {}, text: meta.title },

    { tag: "meta", attrs: { name: "description", content: meta.description } },
    { tag: "meta", attrs: { name: "author", content: SITE.artist } },
    { tag: "meta", attrs: { name: "creator", content: `${SITE.artist} — ${SITE.name}` } },
    {
      tag: "meta",
      attrs: {
        name: "robots",
        content: meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
      },
    },
    { tag: "link", attrs: { rel: "canonical", href: canonical } },

    // ── Open Graph ──
    { tag: "meta", attrs: { property: "og:type", content: meta.ogType ?? "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE.name } },
    { tag: "meta", attrs: { property: "og:url", content: canonical } },
    { tag: "meta", attrs: { property: "og:title", content: meta.title } },
    { tag: "meta", attrs: { property: "og:description", content: meta.description } },
    { tag: "meta", attrs: { property: "og:image", content: og } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { property: "og:locale", content: lang === "fa" ? "fa_IR" : "en_US" } },
    {
      tag: "meta",
      attrs: { property: "og:locale:alternate", content: lang === "fa" ? "en_US" : "fa_IR" },
    },
    ...(meta.ogImageAlt
      ? [{ tag: "meta" as const, attrs: { property: "og:image:alt", content: meta.ogImageAlt } }]
      : []),

    // ── Twitter / X ──
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:site", content: SITE.twitter } },
    { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: meta.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: og } },

    // ── language targeting (baked: EN is default, FA lives behind #fa) ──
    ...alternates(meta.path).map((a) => ({
      tag: "link" as const,
      attrs: { rel: "alternate", hreflang: a.hreflang, href: a.href },
    })),
  ];

  // route-scoped structured data on top of the global graph in index.html
  const jsonLd = meta.jsonLd ?? [];
  if (jsonLd.length) {
    tags.push({
      tag: "script",
      attrs: { type: "application/ld+json", "data-seo": "route" },
      text: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@graph": [
            ...jsonLd,
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Picksaw", item: `${SITE.origin}/` },
                ...(meta.path === "/"
                  ? []
                  : [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: meta.title.split("—")[0].trim(),
                        item: canonical,
                      },
                    ]),
              ],
            },
          ],
        },
        null,
        0
      ),
    });
  }

  return tags;
}

/** Serialise to an HTML string (for the prerenderer). */
export function renderHeadHtml(lang: Lang, path: string): string {
  return headTags(lang, path)
    .map((t) => {
      if (t.tag === "title") return `<title>${esc(t.text ?? "")}</title>`;
      const attrs = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${esc(v)}"`)
        .join(" ");
      if (t.tag === "script") return `<script ${attrs}>${t.text ?? ""}</script>`;
      if (t.tag === "link" || t.tag === "meta") return `<${t.tag} ${attrs} />`;
      return `<${t.tag} ${attrs}>`;
    })
    .join("\n    ");
}
