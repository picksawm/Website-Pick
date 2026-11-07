import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import Room from "../components/shell/Room";
import {
  artworksIn,
  collectionBySlug,
  collectionPillars,
  collectionsSorted,
  tx,
} from "../config/collections";
import { type Lang } from "../config/siteTexts";
import Art from "../components/ui/Art";
import NotFoundPage from "./NotFoundPage";
import { cn } from "../utils/cn";

/**
 * CollectionPage — /collections/:slug
 *
 * A real, crawlable page per direction: its own h1, its own statement,
 * its own metadata (see src/seo/meta.ts) and links to every published
 * artwork inside it.
 *
 * When nothing is published the page still works and says so plainly.
 * It does not invent thumbnails.
 */
export default function CollectionPage({ lang }: { lang: Lang }) {
  const { slug = "" } = useParams();
  const collection = collectionBySlug(slug);

  if (!collection) return <NotFoundPage lang={lang} />;

  const artworks = useMemo(() => artworksIn(collection.id), [collection.id]);
  const pillars = collectionPillars(collection);
  const siblings = collectionsSorted().filter((c) => c.id !== collection.id);

  return (
    <Room tone="room-work" lang={lang} current="work">
      {/* ── masthead ─────────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <nav aria-label="Breadcrumb" className="mono-label mb-6 flex flex-wrap gap-2 opacity-40">
            <Link to="/work" className="underline-draw">
              {lang === "fa" ? "مجموعه‌ها" : "Collections"}
            </Link>
            <span aria-hidden>/</span>
            <span className="opacity-80">{tx(collection.name, lang)}</span>
          </nav>

          <div
            className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
            style={{ borderColor: "var(--room-line)" }}
          >
            <p className="eyebrow opacity-60">Articksaw</p>
            <p className="mono-label opacity-45">
              {artworks.length} {lang === "fa" ? "اثر" : "works"}
            </p>
          </div>

          <h1
            className={cn(
              "display-xl mt-8 max-w-[14ch] text-balance",
              lang === "fa" && "text-[clamp(2rem,7vw,4.6rem)] leading-[1.14]"
            )}
          >
            {tx(collection.name, lang)}
          </h1>

          <div className="mt-6 grid gap-8 sm:grid-cols-12">
            <p className="text-pretty text-sm leading-relaxed opacity-75 sm:col-span-6">
              {tx(collection.statement, lang)}
            </p>
            <p className="font-display text-lg leading-snug text-balance opacity-90 sm:col-span-5 sm:text-2xl">
              “{tx(collection.character, lang)}”
            </p>
          </div>

          {/* pillars are principles, not navigation */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4" style={{ borderColor: "var(--room-line)" }}>
            {pillars.map((p) => (
              <li key={p.id} className="mono-label opacity-45">
                {tx(p.name, lang)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── works ────────────────────────────────────────────── */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          {artworks.length === 0 ? (
            <div
              className="flex min-h-[32vh] flex-col items-start justify-center border-t pt-10"
              style={{ borderColor: "var(--room-line)" }}
            >
              <p className="font-display text-xl leading-snug opacity-80 sm:text-2xl">
                {lang === "fa"
                  ? "این مجموعه در حال آماده‌سازی است."
                  : "This collection is still being prepared."}
              </p>
              <p className="mt-2 max-w-md text-xs leading-relaxed opacity-50">
                {lang === "fa"
                  ? "آثاری که هنوز منتشر نشده‌اند اینجا نمایش داده نمی‌شوند. به‌زودی."
                  : "Works are shown only once they are finished and published. Nothing is previewed early."}
              </p>
            </div>
          ) : (
            <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
              {artworks.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(i % 3 === 0 && "sm:col-span-2")}
                >
                  <Link to={`/collections/${collection.slug}/${a.slug}`} className="group block">
                    <div className={cn("overflow-hidden", i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]")}>
                      <Art
                        src={a.image}
                        alt={tx(a.alt, lang)}
                        priority={i === 0}
                        className="ken-burns"
                      />
                    </div>
                    <div
                      className="mt-3 flex items-baseline justify-between gap-3 border-b pb-2"
                      style={{ borderColor: "var(--room-line)" }}
                    >
                      <h2 className="font-display text-xl leading-tight sm:text-2xl">
                        {tx(a.title, lang)}
                      </h2>
                      <span className="mono-label shrink-0 opacity-40">{a.year}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed opacity-55">{tx(a.caption, lang)}</p>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── other directions ─────────────────────────────────── */}
      <section className="border-t px-5 py-14 sm:px-8" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto max-w-[1680px]">
          <p className="mono-label mb-6 opacity-35">
            {lang === "fa" ? "جهت‌های دیگر" : "Other directions"}
          </p>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((c) => (
              <li key={c.id} className="border-b py-3" style={{ borderColor: "var(--room-line)" }}>
                <Link to={`/collections/${c.slug}`} className="group flex items-baseline justify-between gap-3">
                  <span className="text-sm opacity-70 transition-opacity group-hover:opacity-100">
                    {tx(c.name, lang)}
                  </span>
                  <span className="mono-label opacity-25">{String(c.order).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Room>
  );
}
