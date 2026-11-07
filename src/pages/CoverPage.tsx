import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import StormLayer from "../components/storm/StormLayer";
import CinematicIntro from "../animation/CinematicIntro";
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

      {/* ── statement ──────────────────────────────────────────── */}
      <section className="relative border-t border-bone/10 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <p className="mono-label text-bone/35 lg:col-span-2">(01)</p>
          <div className="lg:col-span-8">
            <motion.p
              className="font-display text-[1.5rem] leading-[1.35] tracking-tight text-balance text-bone/90 sm:text-[2.15rem]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.coverIntro}
            </motion.p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 border border-bone/25 px-5 py-3 transition-colors hover:border-bone/60"
              >
                <span className="mono-label">{t.coverEnter}</span>
                <span className="arrow-step text-sm">{lang === "fa" ? "←" : "→"}</span>
              </Link>
              <Link to="/journal" className="mono-label text-bone/50 underline-draw hover:text-bone">
                {t.navJournal}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── the six directions ─────────────────────────────────── */}
      <section className="relative border-t border-bone/10 px-5 pb-24 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-md">{lang === "fa" ? "مجموعه‌ها" : "Collections"}</h2>
            <p className="hidden max-w-xs text-right text-xs leading-relaxed text-bone/45 sm:block">
              {totalPublished()}{" "}
              {lang === "fa" ? "اثر منتشرشده" : "published works"} ·{" "}
              {collectionsSorted().length} {lang === "fa" ? "جهت" : "directions"}
            </p>
          </div>

          <ul className="border-t border-bone/12">
            {collectionsSorted().map((c, i) => {
              const count = collectionCount(c.id);
              return (
                <motion.li
                  key={c.id}
                  className="group border-b border-bone/12"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/collections/${c.slug}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-2 py-5 sm:gap-8 sm:py-6">
                    <span className="mono-label w-7 shrink-0 text-bone/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[1.7rem] leading-none tracking-tight transition-all duration-500 group-hover:translate-x-1.5 sm:text-[2.9rem]",
                        lang === "fa" && "text-[1.4rem] sm:text-[2.2rem]"
                      )}
                    >
                      {tx(c.name, lang)}
                    </span>
                    <span className="mono-label hidden text-bone/30 sm:ml-auto sm:block">
                      {count > 0 ? `${count} ${lang === "fa" ? "اثر" : "works"}` : lang === "fa" ? "به‌زودی" : "soon"}
                    </span>
                    <span className="ml-auto text-bone/30 transition-transform duration-500 group-hover:translate-x-1 sm:ml-6">
                      {lang === "fa" ? "←" : "→"}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── colophon ───────────────────────────────────────────── */}
      <section className="border-t border-bone/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-2 text-[11px] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label">{t.footerCredit.replace("{year}", String(new Date().getFullYear()))}</p>
          <p className="mono-label">{t.footerTagline}</p>
        </div>
      </section>
    </div>
  );
}


