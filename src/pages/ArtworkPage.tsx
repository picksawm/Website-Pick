import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Room from "../components/shell/Room";
import {
  artworkBySlug,
  artworkSiblings,
  collectionBySlug,
  tx,
} from "../config/collections";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import ScrollScene from "../animation/ScrollScene";
import ImageSequence from "../animation/ImageSequence";
import VideoScrub from "../animation/VideoScrub";
import { useReducedMotion } from "../animation/useReducedMotion";
import Art from "../components/ui/Art";
import NotFoundPage from "./NotFoundPage";

/**
 * ArtworkPage — /collections/:collection/:artwork
 *
 * One artwork, given the whole screen. The scroll scene is what makes
 * this a viewing rather than a page view:
 *
 *   • has `sequence` → canvas frame scrub (falls back to the still)
 *   • has `video`    → video scrubbed by scroll
 *   • has neither    → a still, with a slow scroll-linked reveal
 *
 * Stopping the scroll freezes it; scrolling back runs it in reverse.
 * With reduced motion, the finished composition renders immediately.
 */
export default function ArtworkPage({ lang }: { lang: Lang }) {
  const { slug = "", artworkSlug = "" } = useParams();
  const collection = collectionBySlug(slug);
  const artwork = artworkBySlug(slug, artworkSlug);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  if (!collection || !artwork) return <NotFoundPage lang={lang} />;

  const t = SITE_TEXTS[lang];
  const { prev, next } = artworkSiblings(artwork);

  const mode: "sequence" | "video" | "still" = artwork.sequence
    ? "sequence"
    : artwork.video
      ? "video"
      : "still";

  // scenes are driven from a ref, not state, to keep React out of the
  // scroll loop; we only nudge state for the caption/parallax bits.
  const onProgress = (p: number) => {
    progressRef.current = p;
    setProgress(p);
  };

  return (
    <Room tone="room-work" lang={lang} current="work">
      {/* ── the scene ────────────────────────────────────────── */}
      <section className="relative">
        <ScrollScene
          distance={mode === "still" ? 1.2 : 2.1}
          pin
          onProgress={onProgress}
          poster={
            /* static composition: what a crawler, a no-JS visitor, or a
               reduced-motion visitor sees. Always a real image. */
            <div className="relative h-[100svh] w-full">
              <Art src={artwork.image} alt={tx(artwork.alt, lang)} priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
            </div>
          }
          className="h-[100svh]"
        >
          <div className="absolute inset-0">
            {mode === "sequence" && artwork.sequence ? (
              <ImageSequence
                dir={artwork.sequence.dir}
                frames={artwork.sequence.frames}
                ext={artwork.sequence.ext}
                progress={reduced ? 1 : progress}
                alt={tx(artwork.alt, lang)}
              />
            ) : mode === "video" && artwork.video ? (
              <VideoScrub
                src={artwork.video}
                progress={reduced ? 1 : progress}
                poster={artwork.image}
                alt={tx(artwork.alt, lang)}
              />
            ) : (
              /* still: image holds, and the frame quietly pushes in */
              <div
                className="h-full w-full"
                style={{
                  transform: reduced ? undefined : `scale(${1 + progress * 0.06})`,
                  transition: "transform .1s linear",
                }}
              >
                <Art src={artwork.image} alt={tx(artwork.alt, lang)} priority />
              </div>
            )}

            {/* legibility scrim for the title over the image */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,9,11,0.88) 0%, rgba(8,9,11,0.35) 34%, transparent 62%)",
              }}
            />
          </div>
        </ScrollScene>

        {/* title plate — fixed over the scene while it is pinned */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] px-5 pb-10 sm:px-8 sm:pb-14">
          <div className="mx-auto max-w-[1680px]">
            <Link
              to={`/collections/${collection.slug}`}
              className="pointer-events-auto mono-label inline-block text-bone/50 underline-draw hover:text-bone"
            >
              ← {tx(collection.name, lang)}
            </Link>
            <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4.4rem)] leading-[0.98] tracking-tight text-bone">
              {tx(artwork.title, lang)}
            </h1>
            <p className="mono-label mt-3 text-bone/45">
              {[artwork.year, tx(artwork.medium, lang), artwork.dimensions].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {/* scroll affordance */}
        {!reduced && (
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 z-[5] -translate-x-1/2"
            style={{ opacity: Math.max(0, 1 - progress * 6) }}
          >
            <span className="mono-label text-bone/40">
              {lang === "fa" ? "اسکرول کنید" : "Scroll to unfold"}
            </span>
          </div>
        )}
      </section>

      {/* ── the writing ──────────────────────────────────────── */}
      <section className="relative border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto grid max-w-[1680px] gap-10 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <p className="mono-label opacity-35">{lang === "fa" ? "درباره‌ی اثر" : "On this work"}</p>
          </div>
          <div className="sm:col-span-8">
            <p className="max-w-2xl text-pretty text-sm leading-relaxed opacity-80">
              {tx(artwork.caption, lang)}
            </p>
            {artwork.note && (
              <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed opacity-55">
                {tx(artwork.note, lang)}
              </p>
            )}

            {artwork.tools?.length ? (
              <div className="mt-8">
                <p className="mono-label mb-2 opacity-35">{lang === "fa" ? "ابزارها" : "Process"}</p>
                <p className="text-xs opacity-60">{artwork.tools.join(" · ")}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── siblings within the collection ───────────────────── */}
      <nav
        aria-label={lang === "fa" ? "آثار دیگر" : "More from this collection"}
        className="border-t px-5 py-10 sm:px-8"
        style={{ borderColor: "var(--room-line)" }}
      >
        <div className="mx-auto grid max-w-[1680px] gap-6 sm:grid-cols-2">
          {[{ a: prev, dir: "prev" as const }, { a: next, dir: "next" as const }].map(({ a, dir }) =>
            a ? (
              <Link
                key={dir}
                to={`/collections/${collection.slug}/${a.slug}`}
                className="group block border-b pb-3"
                style={{ borderColor: "var(--room-line)" }}
              >
                <p className="mono-label mb-2 opacity-35">
                  {dir === "prev"
                    ? lang === "fa"
                      ? "قبلی"
                      : "Previous"
                    : lang === "fa"
                      ? "بعدی"
                      : "Next"}
                </p>
                <p className="font-display text-xl leading-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-2xl">
                  {tx(a.title, lang)}
                </p>
              </Link>
            ) : (
              <span key={dir} />
            )
          )}
        </div>
      </nav>

      <p className="px-5 pb-10 text-center text-[10px] opacity-25 sm:px-8">
        {t.footerRights}
      </p>
    </Room>
  );
}
