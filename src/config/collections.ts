/**
 * collections.ts — the Articksaw taxonomy.
 *
 * Six collections, one creative identity. These are *creative
 * directions*, not visual templates: each artwork keeps its own
 * identity regardless of which collection it sits in.
 *
 * RULES THAT KEEP THIS MODULAR
 * ────────────────────────────
 * 1. Nothing about a collection is hard-coded in a component. Adding,
 *    removing, renaming or reordering one is an edit to this file and
 *    nothing else. Slugs are generated from the names below.
 * 2. Artwork counts are never written down. They are derived at runtime
 *    from *published* artworks only (see `collectionCount`).
 * 3. Artworks are DRAFTS until they have real media and `published:
 *    true`. Drafts appear in no page, no count, no sitemap, no nav.
 * 4. `ARTWORKS` ships with 12 empty draft slots — 2 per collection, as
 *    requested. They are intentionally blank: inventing titles or art
 *    here would be presenting unpublished concepts as finished pieces.
 *    Fill a slot, upload its file, flip `published`, and the collection
 *    page, counts and sitemap all update on the next build.
 */
import type { Lang } from "./siteTexts";

export type Localized = Record<Lang, string>;
const L = (en: string, fa: string): Localized => ({ en, fa });
export const tx = (value: Localized | undefined, lang: Lang) =>
  value ? value[lang] ?? value.en : "";

/* ══════════════════════ the five creative pillars ══════════════════════
   These are artistic *principles* behind every collection. They are
   deliberately NOT navigation categories — do not build routes for them.
   They are surfaced as copy and as metadata/keywords only. */

export interface Pillar {
  id: string;
  name: Localized;
  note: Localized;
}

export const PILLARS: Pillar[] = [
  {
    id: "intrusion",
    name: L("Unexpected aesthetic intrusions", "ورودهای زیبایی‌شناسانه‌ی غافلگیرکننده"),
    note: L(
      "Something enters the frame that should not be there — and the composition accepts it.",
      "چیزی وارد کادر می‌شود که نباید آنجا باشد — و ترکیب‌بندی آن را می‌پذیرد."
    ),
  },
  {
    id: "fragments",
    name: L("Floating fragments", "تکه‌های شناور"),
    note: L(
      "Detached pieces suspended mid-collapse, holding their own gravity.",
      "تکه‌های جدا‌شده در میانه‌ی فروپاشی، با گرانش خودشان."
    ),
  },
  {
    id: "geometry",
    name: L("Strange geometry", "هندسه‌ی غریب"),
    note: L(
      "Forms that obey an internal logic rather than a familiar one.",
      "فرم‌هایی که از منطق درونی خود پیروی می‌کنند، نه از منطق آشنا."
    ),
  },
  {
    id: "organic",
    name: L("Organic-mechanical detail", "جزئیات اندام‌وار و ماشینی"),
    note: L(
      "Wet metal, tendon and chrome, bone and circuitry sharing one surface.",
      "فلز خیس، پی و کروم، استخوان و مدار روی یک سطح."
    ),
  },
  {
    id: "accident",
    name: L("Controlled visual accidents", "حوادث بصری کنترل‌شده"),
    note: L(
      "Glitch, smear, corruption — introduced on purpose, framed with intent.",
      "گلیچ، لکه، خرابی — عمداً وارد شده و با قصد قاب گرفته."
    ),
  },
];

/* ══════════════════════════ the collections ══════════════════════════ */

export interface Collection {
  /** stable id — never changes, used to link artworks */
  id: string;
  /** URL segment. Derived from the name unless overridden for SEO. */
  slug: string;
  name: Localized;
  /** one-line signature for nav/tooltips */
  tagline: Localized;
  /** the collection's statement — its own argument, not a service blurb */
  statement: Localized;
  /** what visual personality distinguishes this direction */
  character: Localized;
  /** which pillars this direction leans on hardest (ids from PILLARS) */
  pillarIds: string[];
  /** keywords folded into page metadata */
  keywords: string[];
  /** order in navigation and on the index */
  order: number;
  /** hide from nav/index/sitemap without deleting its artworks */
  hidden?: boolean;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "electric-relics",
    slug: "electric-relics",
    name: L("Electric Relics", "عتیقه‌های الکتریکی"),
    tagline: L("Sacred objects, rewired", "اشیای مقدس، سیم‌کشی‌شده"),
    statement: L(
      "Objects that were once holy, restored with current running through them. Votive forms crossed with conductors, talismans that still hold a charge.",
      "اشیائی که روزی مقدس بودند و حالا جریان از آن‌ها می‌گذرد. فرم‌های نذری در هم‌آمیخته با رسانا؛ طلسم‌هایی که هنوز بار دارند."
    ),
    character: L(
      "Metallic, aged, ceremonial — lit like an artifact under museum glass, but humming.",
      "فلزی، کهنه، آیینی — مثل شیئی موزه‌ای زیر شیشه نور می‌گیرد، اما زیر آن زمزمه می‌کند."
    ),
    pillarIds: ["intrusion", "organic", "accident"],
    keywords: ["relic", "voltage", "artifact", "ceremonial", "metal"],
    order: 1,
  },
  {
    id: "toxic-elegance",
    slug: "toxic-elegance",
    name: L("Toxic Elegance", "ظرافت سمی"),
    tagline: L("Beauty that should not be touched", "زیبایی‌ای که نباید لمس کرد"),
    statement: L(
      "Poison dressed for an evening. Seductive surfaces carrying something hazardous just beneath the finish — iridescent, luminous, quietly wrong.",
      "سمی که برای یک شب آراسته شده. سطوح فریبنده‌ای که درست زیر روکش چیزی خطرناک را حمل می‌کنند."
    ),
    character: L(
      "Glossy and expensive, with a faintly sick green in the highlights.",
      "براق و گران‌قیمت، با سبزی بیمارگونی که در درخشش‌ها می‌نشیند."
    ),
    pillarIds: ["intrusion", "organic", "accident"],
    keywords: ["toxic", "iridescent", "venom", "luxury", "gloss"],
    order: 2,
  },
  {
    id: "broken-dimensions",
    slug: "broken-dimensions",
    name: L("Broken Dimensions", "ابعاد شکسته"),
    tagline: L("Space that fails correctly", "فضایی که درست شکست می‌خورد"),
    statement: L(
      "Perspective pushed until it gives way. Rooms folded through themselves, planes that mirror what they should not, corridors ending in their own beginning.",
      "ژرفانمایی تا نقطه‌ی گسیختن پیش می‌رود. اتاق‌هایی که درون خودشان تا می‌خورند، صفحه‌هایی که آنچه نباید را بازمی‌تابانند."
    ),
    character: L(
      "Architectural and cold, with impossible joins rendered in perfect focus.",
      "معمارانه و سرد، با اتصال‌های ناممکن که در فوکوس کامل رندر شده‌اند."
    ),
    pillarIds: ["geometry", "fragments", "accident"],
    keywords: ["impossible", "perspective", "architecture", "fracture"],
    order: 3,
  },
  {
    id: "organic-machinery",
    slug: "organic-machinery",
    name: L("Organic Machinery", "ماشین‌آلات اندام‌وار"),
    tagline: L("Flesh with a maintenance schedule", "گوشتی با برنامه‌ی نگهداری"),
    statement: L(
      "Anatomy that was engineered, hardware that grew. Tissue threaded with cabling, housings that breathe, joints that were clearly designed by something that never studied a body.",
      "آناتومی‌ای که مهندسی شده، سخت‌افزاری که رشد کرده. بافتی که کابل‌ها در آن تنیده، قاب‌هایی که نفس می‌کشند."
    ),
    character: L(
      "Warm palette, wet speculars, unsettling symmetry — beautiful until you read the parts.",
      "پالت گرم، بازتاب‌های خیس، تقارنِ ناخوشایند — زیبا تا لحظه‌ای که جزئیات را بخوانی."
    ),
    pillarIds: ["organic", "geometry", "fragments"],
    keywords: ["biomech", "anatomy", "chrome", "tendon", "hybrid"],
    order: 4,
  },
  {
    id: "digital-decay",
    slug: "digital-decay",
    name: L("Digital Decay", "فرسایش دیجیتال"),
    tagline: L("The archive after the water", "آرشیو بعد از آب"),
    statement: L(
      "Files left in the weather. Compression artifacts as texture, banding as landscape, memory corruption scored like rust across a surface that used to be clean.",
      "فایل‌هایی که در هوا رها شده‌اند. آرتیفکت فشرده‌سازی به‌عنوان بافت، باندینگ به‌عنوان منظره، خرابی حافظه مثل زنگ روی سطحی که زمانی تمیز بود."
    ),
    character: L(
      "Low-fidelity and grey-edged, with one colour surviving the damage.",
      "کم‌کیفیت با لبه‌های خاکستری، و یک رنگ که از خرابی جان سالم برده."
    ),
    pillarIds: ["accident", "fragments", "geometry"],
    keywords: ["glitch", "corruption", "artifact", "decay", "lo-fi"],
    order: 5,
  },
  {
    id: "chromatic-chaos",
    slug: "chromatic-chaos",
    name: L("Chromatic Chaos", "هرج‌ومرج رنگی"),
    tagline: L("Colour used as a weapon", "رنگ به‌مثابه‌ی سلاح"),
    statement: L(
      "Composition held together only by hue relationships. Unreasonable colour decisions made confidently, collisions no palette would forgive, and a structure underneath that keeps it standing.",
      "ترکیبی که تنها با روابط رنگی کنار هم مانده. تصمیم‌های رنگی بی‌دلیل اما مطمئن، برخوردهایی که هیچ پالتی نمی‌بخشد."
    ),
    character: L(
      "Loud, saturated, deliberately unrefined — the opposite of a safe gradient.",
      "بلند، اشباع، عمداً پرداخت‌نشده — نقطه‌ی مقابل یک گرادیان بی‌خطر."
    ),
    pillarIds: ["accident", "intrusion", "geometry"],
    keywords: ["chromatic", "saturation", "clash", "colour", "chaos"],
    order: 6,
  },
];

/* ══════════════════════════ artworks ══════════════════════════ */

export type ArtworkStatus = "published" | "draft";

export interface Artwork {
  id: string;
  /** which collection this belongs to (Collection.id) */
  collectionId: string;
  /** URL segment — descriptive, SEO-bearing, never numbered */
  slug: string;
  title: Localized;
  /** one or two sentences, in the artist's voice */
  caption: Localized;
  /** longer note for the artwork page; optional */
  note?: Localized;
  /** alt text is REQUIRED for published work — describes the image, not the artist */
  alt: Localized;
  year: string;
  medium: Localized;
  dimensions?: string;
  /** image path(s). Empty string means "no media yet". */
  image: string;
  /** optional scrubbable video for artwork-page scenes */
  video?: string;
  /** optional image sequence for the canvas scrubber: dir + frame count */
  sequence?: { dir: string; frames: number; ext?: "avif" | "webp" | "jpg" };
  /**
   * DRAFTS ARE INVISIBLE EVERYWHERE:
   * no page, no count, no nav, no sitemap, no index.
   */
  status: ArtworkStatus;
  /** sort within a collection */
  order: number;
  /** optional project metadata */
  tools?: string[];
}

/**
 * 12 draft slots — 2 per collection.
 *
 * Intentionally empty. An artwork only becomes real when it has a title,
 * real media, alt text and `status: "published"`. Fill a slot in place
 * (keep the id, add the copy) or add/remove entries freely; nothing else
 * in the codebase needs to change.
 */
const draft = (collectionId: string, slot: number): Artwork => ({
  id: `${collectionId}-${slot}`,
  collectionId,
  slug: "",
  title: { en: "", fa: "" },
  caption: { en: "", fa: "" },
  alt: { en: "", fa: "" },
  year: "",
  medium: { en: "", fa: "" },
  image: "",
  status: "draft",
  order: slot,
});

export const ARTWORKS: Artwork[] = COLLECTIONS.flatMap((c) => [draft(c.id, 1), draft(c.id, 2)]);

/* ═══════════════════════════ selectors ═══════════════════════════
   Everything reads through these. Counts are always derived. */

/** a published artwork must also have the metadata that makes it indexable */
export function isPublishable(a: Artwork): boolean {
  return (
    a.status === "published" &&
    a.slug.trim().length > 0 &&
    a.title.en.trim().length > 0 &&
    a.image.trim().length > 0 &&
    a.alt.en.trim().length > 0
  );
}

export const publishedArtworks = (list: Artwork[] = ARTWORKS) => list.filter(isPublishable);

export const collectionsSorted = (): Collection[] =>
  [...COLLECTIONS].filter((c) => !c.hidden).sort((a, b) => a.order - b.order);

export function collectionById(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function collectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** artworks in a collection — published only, ordered */
export function artworksIn(collectionId: string, list: Artwork[] = ARTWORKS): Artwork[] {
  return publishedArtworks(list)
    .filter((a) => a.collectionId === collectionId)
    .sort((a, b) => a.order - b.order);
}

/** derived count — never hand-written anywhere */
export const collectionCount = (collectionId: string, list: Artwork[] = ARTWORKS): number =>
  artworksIn(collectionId, list).length;

/** total published works across the practice */
export const totalPublished = (list: Artwork[] = ARTWORKS): number => publishedArtworks(list).length;

/** drafts are counted separately, for the studio/admin view only */
export const totalDrafts = (list: Artwork[] = ARTWORKS): number =>
  list.filter((a) => a.status === "draft").length;

/** has this collection anything to show yet? */
export const isCollectionLive = (collectionId: string): boolean =>
  collectionCount(collectionId) > 0;

export function artworkBySlug(collectionSlug: string, artworkSlug: string) {
  const collection = collectionBySlug(collectionSlug);
  if (!collection) return undefined;
  return artworksIn(collection.id).find((a) => a.slug === artworkSlug);
}

/** previous / next within the same collection, for internal linking */
export function artworkSiblings(artwork: Artwork) {
  const list = artworksIn(artwork.collectionId);
  const i = list.findIndex((a) => a.id === artwork.id);
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
}

/** pillars a collection leans on, resolved for rendering */
export const collectionPillars = (collection: Collection): Pillar[] =>
  collection.pillarIds.map((id) => PILLARS.find((p) => p.id === id)).filter(Boolean) as Pillar[];
