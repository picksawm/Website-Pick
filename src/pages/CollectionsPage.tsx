import { Link } from "react-router-dom";
import Room from "../components/shell/Room";
import {
  collectionsSorted,
  collectionCount,
  totalPublished,
  collectionPillars,
  tx,
} from "../config/collections";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { cn } from "../utils/cn";

/**
 * CollectionsPage — /work
 *
 * The index of the six Articksaw directions, laid out as a printed
 * catalogue rather than a card grid: numbered entries, a wide measure
 * for the direction's own voice, and a hairline that runs the full width.
 *
 * Two things it deliberately does not do:
 *   • fake thumbnails — counts come from published data, and a direction
 *     with nothing published says so in its own column
 *   • pill the metadata — pillars are set as small caps in a run, the way
 *     a catalogue prints keywords under a plate
 *
 * The layout is asymmetric on purpose: the entry number is a wide
 * gutter, the title takes more columns than the description, and the
 * whole block steps in from the left edge at each breakpoint.
 */
export default function CollectionsPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const collections = collectionsSorted();
  const published = totalPublished();

  return (
    <Room tone="room-work" lang={lang} current="work">
      {/* ── masthead ─────────────────────────────────────────────── */}
      <header className="page-shell pt-32 sm:pt-40">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-4">
          <p className="eyebrow">Articksaw</p>
          <p className="plate">
            {collections.length} {lang === "fa" ? "مجموعه" : "directions"}
            <span className="mx-2 opacity-40">/</span>
            {published} {lang === "fa" ? "اثر منتشرشده" : "published"}
          </p>
        </div>

        <div className="blade mt-2 grid grid-cols-12 gap-x-6 gap-y-10 pt-8">
          <h1
            className={cn(
              "display-xl col-span-12 text-balance lg:col-span-8",
              lang === "fa" && "leading-[1.1]"
            )}
          >
            {lang === "fa" ? (
              "شش جهت، یک دست"
            ) : (
              <>
                Six directions,
                <br />
                <span className="voice text-[0.62em] leading-[1.1] opacity-90">one hand</span>
              </>
            )}
          </h1>

          <div className="col-span-12 self-end lg:col-span-3 lg:col-start-10">
            <p className="lede">
              {lang === "fa"
                ? "هر مجموعه یک جهت خلاقانه است، نه یک قالب بصری. هر اثر هویت خودش را نگه می‌دارد."
                : "Each collection is a creative direction, not a template. Every work keeps its own identity."}
            </p>
          </div>
        </div>
      </header>

      {/* ── the catalogue ────────────────────────────────────────── */}
      <section className="page-shell mt-20 pb-28 sm:mt-28">
        <div className="hair-t">
          {collections.map((c, i) => {
            const count = collectionCount(c.id);
            const pillars = collectionPillars(c);

            return (
              <Link
                key={c.id}
                to={`/collections/${c.slug}`}
                className="group grid grid-cols-12 items-start gap-x-5 gap-y-3 border-b py-8 transition-colors duration-500 hover:bg-[rgba(239,233,220,0.018)] sm:py-10"
                style={{ borderColor: "var(--hair)" }}
              >
                {/* the gutter: a catalogue number, set small and high */}
                <span className="plate col-span-2 pt-2 sm:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* the title carries the entry */}
                <h2
                  className={cn(
                    "font-display col-span-10 text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.95] tracking-[-0.03em] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:translate-x-2 sm:col-span-6",
                    lang === "fa" && "text-[clamp(1.5rem,3.4vw,2.4rem)] leading-[1.15]"
                  )}
                >
                  {tx(c.name, lang)}
                </h2>

                {/* the direction's own voice — one line, italic, quiet */}
                <p className="col-span-10 col-start-3 text-[0.9375rem] leading-relaxed text-[var(--color-bone-dim)] sm:col-span-4 sm:col-start-8">
                  {tx(c.tagline, lang)}
                </p>

                {/* meta: pillars as a printed keyword run, then the tally */}
                <div className="col-span-10 col-start-3 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:col-span-4 sm:col-start-8 sm:mt-0">
                  <span className="plate">
                    {pillars
                      .slice(0, 2)
                      .map((p) => tx(p.name, lang))
                      .join(" · ")}
                  </span>
                  <span className="plate text-[var(--color-bone-dim)]">
                    {count > 0
                      ? `${String(count).padStart(2, "0")} ${lang === "fa" ? "اثر" : "works"}`
                      : lang === "fa"
                        ? "در دست آماده‌سازی"
                        : "in preparation"}
                  </span>
                </div>

                {/* the arrow: present, never a button */}
                <span
                  aria-hidden
                  className="col-span-2 hidden justify-self-end pt-2 text-sm opacity-25 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-70 sm:col-span-1 sm:block"
                >
                  {lang === "fa" ? "←" : "→"}
                </span>
              </Link>
            );
          })}
        </div>

        {/* closing note, set as a colophon */}
        <p className="voice mt-16 max-w-[26ch] text-[clamp(1.3rem,2.6vw,1.9rem)] text-[var(--color-bone-dim)]">
          {lang === "fa"
            ? "آثار یکی‌یکی از راه می‌رسند."
            : "The works arrive one at a time."}
        </p>
        <p className="plate mt-3">
          {t.ownerName} · {t.city} · 2026
        </p>
      </section>
    </Room>
  );
}
