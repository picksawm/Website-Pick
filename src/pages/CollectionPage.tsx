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
import ScrollFilmScene from "../animation/ScrollFilmScene";
import { filmFor } from "../config/films.generated";
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
  // a collection may open with its own film; the slug doubles as the film
  // name so publishing one is a data step, not a code change
  const film = filmFor(collection.slug);
  const siblings = collectionsSorted().filter((c) => c.id !== collection.id);

  return (
    <Room tone="room-work" lang={lang} current="work">
      {/* ── masthead ─────────────────────────────────────────────
          Each direction opens with its number, its name at display
          size, and one italic line that is the direction's own voice.
          The statement sits in a narrow measure beside it, so the two
          are read as caption and plate rather than heading and body. */}
      <header className="page-shell pt-28 sm:pt-36">
        <nav aria-label="Breadcrumb" className="plate flex flex-wrap gap-2">
          <Link to="/work" className="underline-draw hover:text-[var(--color-bone)]">
            {lang === "fa" ? "مجموعه‌ها" : "Collections"}
          </Link>
          <span aria-hidden className="opacity-40">
            /
          </span>
          <span className="text-[var(--color-bone-dim)]">{tx(collection.name, lang)}</span>
        </nav>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="plate mb-4">
              Articksaw · {String(collection.order).padStart(2, "0")}
            </p>
            <h1
              className={cn(
                "display-xl text-balance",
                lang === "fa" && "text-[clamp(2rem,7vw,4.6rem)] leading-[1.14]"
              )}
            >
              {tx(collection.name, lang)}
            </h1>
          </div>

          <p
            className={cn(
              "voice col-span-12 text-[clamp(1.15rem,2.2vw,1.6rem)] text-[var(--color-bone-dim)] lg:col-span-3 lg:col-start-10 lg:pb-2",
              lang === "fa" && "leading-[1.7]"
            )}
          >
            {tx(collection.character, lang)}
          </p>
        </div>

        <div className="blade mt-12 grid grid-cols-12 gap-x-6 gap-y-6 pt-6">
          <p className="prose-body col-span-12 sm:col-span-7 lg:col-span-5">
            {tx(collection.statement, lang)}
          </p>

          <div className="col-span-12 flex flex-col justify-end gap-2 sm:col-span-4 sm:col-start-9">
            <p className="plate">
              {artworks.length > 0
                ? `${String(artworks.length).padStart(2, "0")} ${lang === "fa" ? "اثر" : "works"}`
                : lang === "fa"
                  ? "در آماده‌سازی"
                  : "in preparation"}
            </p>
            {/* pillars: principles set as a keyword run, never as filters */}
            <p className="plate leading-relaxed">
              {pillars.map((p) => tx(p.name, lang)).join("  ·  ")}
            </p>
          </div>
        </div>
      </header>

      {/* ── opening film (only for directions that have one) ───── */}
      {film && (
        <section className="mt-16 sm:mt-24">
          <ScrollFilmScene
            film={film}
            distance={2.2}
            hud={false}
            alt={
              lang === "fa"
                ? `فیلم افتتاحیه‌ی مجموعه ${tx(collection.name, lang)}`
                : `Opening film for the ${tx(collection.name, lang)} direction`
            }
          />
        </section>
      )}

      {/* ── works ─────────────────────────────────────────────────
          Deliberately not a uniform grid: the first work is given the
          width of the page, and later works alternate between a tall
          plate and a wide one, so the sequence reads as a hanging
          rather than a product listing. */}
      <section className="page-shell py-20 sm:py-28">
        {artworks.length === 0 ? (
          <div className="hair-t flex min-h-[30vh] max-w-2xl flex-col justify-center gap-3 pt-10">
            <p className="display-sm text-[var(--color-bone)]">
              {lang === "fa"
                ? "این مجموعه در حال آماده‌سازی است."
                : "This collection is still being prepared."}
            </p>
            <p className="prose-body">
              {lang === "fa"
                ? "آثاری که هنوز منتشر نشده‌اند اینجا نمایش داده نمی‌شوند. به‌زودی."
                : "Works appear only once they are finished and published. Nothing is previewed early."}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-12 gap-x-6 gap-y-16 sm:gap-y-24">
            {artworks.map((a, i) => {
              const lead = i === 0;
              const tall = i % 3 === 2;
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "col-span-12",
                    lead ? "lg:col-span-12" : tall ? "sm:col-span-5" : "sm:col-span-7",
                    !lead && tall && "sm:col-start-2",
                    !lead && !tall && "sm:col-start-6"
                  )}
                >
                  <Link to={`/collections/${collection.slug}/${a.slug}`} className="group block">
                    <div className={cn("artwork-frame", lead ? "aspect-[16/9]" : "aspect-[4/5]")}>
                      <Art
                        src={a.image}
                        alt={tx(a.alt, lang)}
                        priority={i === 0}
                        className="ken-burns h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h2
                        className={cn(
                          "font-display leading-[1.05] tracking-[-0.02em]",
                          lead ? "text-[clamp(1.5rem,3vw,2.4rem)]" : "text-[clamp(1.15rem,2vw,1.6rem)]"
                        )}
                      >
                        {tx(a.title, lang)}
                      </h2>
                      <span className="plate shrink-0">{a.year}</span>
                    </div>
                    <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-[var(--color-chalk)]">
                      {tx(a.caption, lang)}
                    </p>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── other directions ───────────────────────────────────── */}
      <section className="page-shell pb-24">
        <p className="eyebrow pb-3">{lang === "fa" ? "جهت‌های دیگر" : "Other directions"}</p>
        <ul className="hair-t">
          {siblings.map((c) => (
            <li key={c.id}>
              <Link
                to={`/collections/${c.slug}`}
                className="group index-row"
                style={{ borderColor: "var(--hair)" }}
              >
                <span className="plate">{String(c.order).padStart(2, "0")}</span>
                <span className="lure font-display text-[clamp(1.2rem,2.4vw,1.9rem)] leading-tight tracking-[-0.02em]">
                  {tx(c.name, lang)}
                </span>
                <span className="plate">{tx(c.tagline, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Room>
  );
}
