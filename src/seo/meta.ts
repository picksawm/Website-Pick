/**
 * meta.ts — the single source of truth for every page's <head>.
 *
 * Deliberately pure: no React, no DOM, no imports from the app. That is
 * what lets `scripts/prerender.mjs` run it in Node and emit identical
 * tags to what `Seo.tsx` writes at runtime. If the two ever disagree,
 * the static HTML is what crawlers see — so there is exactly one copy.
 *
 * Every page gets: unique title, unique description, canonical, OG,
 * Twitter card, and (where useful) route-scoped JSON-LD.
 */
import type { Lang } from "../config/siteTexts";

export const SITE = {
  origin: "https://picksaw.ir",
  name: "Picksaw",
  artist: "Amirehsan Ashoori",
  artistFa: "امیراحسان عاشوری",
  defaultOg: "/og-image.png",
  twitter: "@picksawm",
} as const;

export type JsonLd = Record<string, unknown>;

export interface RouteMeta {
  /** path without origin, always leading slash */
  path: string;
  title: string;
  description: string;
  /** absolute OG image path */
  ogImage?: string;
  ogImageAlt?: string;
  /** og:type — profile for /about, article-style for artworks */
  ogType?: string;
  /** hidden from search engines (404, journal admin views) */
  noindex?: boolean;
  jsonLd?: JsonLd[];
}

const abs = (p: string) => `${SITE.origin}${p}`;

/* ─────────────────────────── EN ─────────────────────────── */

export const ROUTES_EN: RouteMeta[] = [
  {
    path: "/",
    title: "Picksaw — Original Artwork by Amirehsan Ashoori",
    description:
      "Picksaw is the art practice of Amirehsan Ashoori: high-contrast, experimental images and moving work — fractured geometry, metallic surfaces, electric interruptions. Explore the collections.",
    ogImage: "/art/hero.jpg",
    ogImageAlt: "Rain-soaked night avenue between brutalist towers, lit by Persian geometric neon",
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.origin}/#artwork-index`,
        url: abs("/"),
        name: "Picksaw — artwork collections",
        isPartOf: { "@id": `${SITE.origin}/#website` },
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/work",
    title: "Collections — Picksaw Artwork",
    description:
      "The collections of Picksaw: websites, visual identity systems and creative code by Amirehsan Ashoori, presented as artwork rather than services.",
    ogImage: "/art/worlds-02.jpg",
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.origin}/work#page`,
        url: abs("/work"),
        name: "Picksaw collections",
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/worlds",
    title: "Worlds — 3D Environments & Unreal Scenes · Picksaw",
    description:
      "Cinematic 3D environments and real-time scenes by Amirehsan Ashoori — concrete, fog and a single light source doing the storytelling.",
    ogImage: "/art/worlds-01.jpg",
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.origin}/worlds#page`,
        url: abs("/worlds"),
        name: "Worlds — 3D environments",
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/ai",
    title: "AI Art — Generative Works by Amirehsan Ashoori · Picksaw",
    description:
      "Generative imagery edited by hand: Persian miniature meeting chrome, machine dreams with a human edit. Selected works from the Picksaw archive.",
    ogImage: "/art/ai-01.jpg",
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.origin}/ai#page`,
        url: abs("/ai"),
        name: "AI Art — generative works",
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/sound",
    title: "Sound — Scores & Design by Amirehsan Ashoori · Picksaw",
    description:
      "Scores, sound design and production credits by Amirehsan Ashoori for games, trailers and brand films.",
    ogImage: "/art/ai-05.jpg",
    jsonLd: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.origin}/sound#page`,
        url: abs("/sound"),
        name: "Sound — scores and design",
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/about",
    title: "About Amirehsan Ashoori — Artist Behind Picksaw",
    description:
      "Amirehsan Ashoori is a multidisciplinary artist working across image, 3D, AI and sound — cyberpunk futurism, Persian art, cinematic light and symbolic storytelling.",
    ogImage: "/art/worlds-04.jpg",
    ogType: "profile",
    jsonLd: [
      {
        "@type": "AboutPage",
        "@id": `${SITE.origin}/about#page`,
        url: abs("/about"),
        name: "About Amirehsan Ashoori",
        mainEntity: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/contact",
    title: "Contact — Work with Picksaw",
    description:
      "Start a project with Amirehsan Ashoori (Picksaw) — commissions, collaborations and exhibitions. WhatsApp, email and Instagram.",
    ogImage: "/art/hero.jpg",
    jsonLd: [
      {
        "@type": "ContactPage",
        "@id": `${SITE.origin}/contact#page`,
        url: abs("/contact"),
        name: "Contact Picksaw",
        about: { "@id": `${SITE.origin}/#amir` },
        inLanguage: "en",
      },
    ],
  },
  {
    path: "/journal",
    title: "Journal — Studio Notes · Picksaw",
    description: "Uploads, fragments and studio notes from Picksaw, published as they happen.",
    ogImage: "/art/ai-02.jpg",
    jsonLd: [
      {
        "@type": "Blog",
        "@id": `${SITE.origin}/journal#page`,
        url: abs("/journal"),
        name: "Picksaw Journal",
        inLanguage: "en",
      },
    ],
  },
];

/* ─────────────────────────── FA ─────────────────────────── */

export const ROUTES_FA: RouteMeta[] = [
  {
    path: "/",
    title: "پیکساو — آثار اصیل امیراحسان عاشوری",
    description:
      "پیکساو کارستان هنری امیراحسان عاشوری است: تصویر و ویدیوی تجربی، پرکنتراست و ساخته‌شده با هندسه‌ی شکسته، سطوح فلزی و ورودهای الکتریکی. مجموعه‌ها را ببینید.",
    ogImage: "/art/hero.jpg",
  },
  {
    path: "/work",
    title: "مجموعه‌ها — آثار پیکساو",
    description:
      "مجموعه‌های پیکساو: وب‌سایت، هویت بصری و کد خلاقانه‌ی امیراحسان عاشوری، ارائه‌شده به‌عنوان اثر هنری.",
    ogImage: "/art/worlds-02.jpg",
  },
  {
    path: "/worlds",
    title: "دنیاها — محیط‌های سه‌بعدی و صحنه‌های Unreal · پیکساو",
    description:
      "محیط‌های سینمایی سه‌بعدی و صحنه‌های بلادرنگ امیراحسان عاشوری — بتن، مه و یک منبع نور که روایت را می‌سازد.",
    ogImage: "/art/worlds-01.jpg",
  },
  {
    path: "/ai",
    title: "هنر هوش مصنوعی — آثار مولد امیراحسان عاشوری · پیکساو",
    description:
      "تصاویر مولد با تدوین انسانی: نگارگری ایرانی در کنار کروم، رؤیای ماشین با تصمیم انسان.",
    ogImage: "/art/ai-01.jpg",
  },
  {
    path: "/sound",
    title: "صدا — موسیقی متن و طراحی صدا · پیکساو",
    description: "موسیقی متن، طراحی صدا و آثار امیراحسان عاشوری برای بازی، تیزر و فیلم برند.",
    ogImage: "/art/ai-05.jpg",
  },
  {
    path: "/about",
    title: "درباره امیراحسان عاشوری — هنرمند پشت پیکساو",
    description:
      "امیراحسان عاشوری هنرمند چندرشته‌ای است که در تصویر، سه‌بعدی، هوش مصنوعی و صدا کار می‌کند — آینده‌نگر، هنر ایرانی، نور سینمایی و روایت نمادین.",
    ogImage: "/art/worlds-04.jpg",
  },
  {
    path: "/contact",
    title: "تماس — همکاری با پیکساو",
    description:
      "شروع یک پروژه با امیراحسان عاشوری (پیکساو) — سفارش، همکاری و نمایشگاه. واتس‌اپ، ایمیل و اینستاگرام.",
    ogImage: "/art/hero.jpg",
  },
  {
    path: "/journal",
    title: "ژورنال — یادداشت‌های استودیو · پیکساو",
    description: "آپلودها، تکه‌ها و یادداشت‌های استودیو از پیکساو.",
    ogImage: "/art/ai-02.jpg",
  },
];

export const ROUTES: Record<Lang, RouteMeta[]> = { en: ROUTES_EN, fa: ROUTES_FA };

/** Every crawlable path, in default-language form. */
export const ALL_PATHS = ROUTES_EN.map((r) => r.path);

export function metaFor(lang: Lang, path: string): RouteMeta {
  const list = ROUTES[lang] ?? ROUTES_EN;
  const clean = path.replace(/\/+$/, "") || "/";
  return (
    list.find((r) => r.path === clean) ??
    ROUTES_EN.find((r) => r.path === clean) ??
    list[0]
  );
}

/** hreflang alternate pairs for a path (BAKED: default lang is EN). */
export function alternates(path: string) {
  return [
    { hreflang: "en", href: abs(path) },
    { hreflang: "fa-IR", href: `${abs(path)}#fa` },
    { hreflang: "x-default", href: abs(path) },
  ];
}
