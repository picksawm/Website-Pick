import { useState } from "react";
import { Link } from "react-router-dom";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import StormLayer from "../components/storm/StormLayer";
import CinematicIntro from "../animation/CinematicIntro";
import Wordmark from "../components/brand/Wordmark";
import ScrollFilmScene from "../animation/ScrollFilmScene";
import CoverHeadline from "../components/cover/CoverHeadline";
import { filmFor } from "../config/films.generated";
import { collectionsSorted, collectionCount, totalPublished, tx } from "../config/collections";
import { cn } from "../utils/cn";

/**
 * CoverPage — the threshold, and the first "opening palm".
 *
 * Scroll behaviour: the cover is a frame sequence — a film that only
 * plays because you are scrolling. The camera pushes through a
 * rain-soaked avenue, into Persian arches, into the city behind them.
 * Stopping freezes the frame; scrolling back runs it in reverse. The
 * headline sits inside the shot and lifts away in the first third, so
 * the rest of the film is just the picture.
 */
/** the opening film, generated from artwork by scripts/build-frames.mjs */
const OPENING_FILM = filmFor("opening");

export default function CoverPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [, setIntroDone] = useState(false);
  return (
    <div id="room" className="relative bg-[#06070a] text-bone">
      <StormLayer mode="dark" intensity={1.3} lightning />

      {/* the exhibition opens — skipped for reduced motion and repeat visits */}
      <CinematicIntro
        lang={lang}
        wordmark="Articksaw"
        kicker={`${t.ownerName} · ${lang === "fa" ? "شش جهت" : "six directions"}`}
        onDone={() => setIntroDone(true)}
      />

      {/* ── the opening film ─────────────────────────────────────
          The cover is no longer a still being revealed: it is a frame
          sequence that plays as you scroll. Scroll position *is* the
          playhead, so stopping freezes the picture and scrolling back
          runs it backwards. The headline rides on top and leaves early,
          so the film is unobstructed for the rest of its run. */}
      {OPENING_FILM ? (
        <ScrollFilmScene
          film={OPENING_FILM}
          distance={3.2}
          alt={
            lang === "fa"
              ? "خیابان شبانه زیر باران، طاق‌های هندسی پارسی و شهری از نور سرد"
              : "A rain-soaked night avenue opening into Persian arches, then a city of cold light"
          }
          overlay={(p) => <CoverHeadline progress={p} lang={lang} />}
        />
      ) : (
        /* no film built yet (fresh clone, or frames not committed) — the
           cover still has to be a cover, so fall back to the single still */
        <section className="relative h-[100svh] w-full overflow-hidden">
          <img
            src="/art/hero.jpg"
            alt="Rain-soaked night avenue between brutalist towers, lit by Persian geometric neon"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#06070a]/35" />
        </section>
      )}

      {/* ── statement: a single column, set like the first page of a
             catalogue. No cards, no grid of tiles — one idea, one
             measure, and a great deal of air around it. ───────────── */}
      <section className="page-shell relative py-24 sm:py-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <p className="plate col-span-12 sm:col-span-1">(01)</p>

          <div className="col-span-12 sm:col-span-7">
            <p
              className={cn(
                "font-display text-[clamp(1.5rem,3.1vw,2.6rem)] leading-[1.16] tracking-[-0.02em] text-balance",
                lang === "fa" && "leading-[1.5]"
              )}
            >
              {t.coverIntro}
            </p>

            <div className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              <Link to="/work" className="group btn-quiet">
                <span>{t.coverEnter}</span>
                <span className="arrow-step">{lang === "fa" ? "←" : "→"}</span>
              </Link>
              <Link to="/journal" className="mono-label text-[var(--color-chalk)] underline-draw hover:text-[var(--color-bone)]">
                {t.navJournal}
              </Link>
            </div>
          </div>

          {/* the right column is deliberately almost empty: one mark,
              one line of provenance. The emptiness is the composition. */}
          <div className="col-span-12 flex flex-col justify-end gap-3 sm:col-span-3 sm:col-start-10">
            <Wordmark className="h-[0.5rem] w-fit text-[var(--color-bone)] opacity-70" />
            <p className="plate">
              {t.ownerName}
              <br />
              {t.city} · 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── the six directions: an index, not a menu ─────────────── */}
      <section className="page-shell relative pb-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-3">
          <h2 className="eyebrow">Articksaw — {lang === "fa" ? "مجموعه‌ها" : "collections"}</h2>
          <p className="plate">
            {totalPublished()} {lang === "fa" ? "منتشرشده" : "published"}
            <span className="mx-2 opacity-40">/</span>
            {collectionsSorted().length} {lang === "fa" ? "جهت" : "directions"}
          </p>
        </div>

        <ul className="hair-t">
          {collectionsSorted().map((c, i) => {
            const count = collectionCount(c.id);
            return (
              <li key={c.id}>
                <Link
                  to={`/collections/${c.slug}`}
                  className="group index-row"
                  style={{ borderColor: "var(--hair)" }}
                >
                  <span className="plate">{String(i + 1).padStart(2, "0")}</span>

                  <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span
                      className={cn(
                        "lure font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.02] tracking-[-0.03em]",
                        lang === "fa" && "text-[clamp(1.2rem,2.8vw,1.9rem)] leading-[1.3]"
                      )}
                    >
                      {tx(c.name, lang)}
                    </span>
                    <span className="hidden max-w-[38ch] text-[0.8125rem] leading-relaxed text-[var(--color-chalk)] md:block">
                      {tx(c.tagline, lang)}
                    </span>
                  </span>

                  <span className="flex items-baseline gap-4">
                    <span className="plate">
                      {count > 0
                        ? `${String(count).padStart(2, "0")} ${lang === "fa" ? "اثر" : "works"}`
                        : lang === "fa"
                          ? "در آماده‌سازی"
                          : "in preparation"}
                    </span>
                    <span
                      aria-hidden
                      className="text-[0.7rem] opacity-30 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-70"
                    >
                      {lang === "fa" ? "←" : "→"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── colophon ───────────────────────────────────────────── */}
      <footer className="page-shell pb-10">
        <div className="hair-t flex flex-col gap-2 pt-4 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="plate">{t.footerCredit.replace("{year}", String(new Date().getFullYear()))}</p>
          <p className="voice text-sm text-[var(--color-chalk)]">{t.footerTagline}</p>
        </div>
      </footer>
    </div>
  );
}


