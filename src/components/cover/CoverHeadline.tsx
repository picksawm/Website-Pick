import { SITE_TEXTS, type Lang } from "../../config/siteTexts";
import { cn } from "../../utils/cn";

/**
 * CoverHeadline — the type that sits inside the opening film.
 *
 * It lives inside the pinned frame rather than over it, so the headline
 * is part of the shot: it comes up with the first frames, holds while
 * the camera pushes in, and is gone by the time the film is halfway —
 * after that the picture is allowed to be just a picture.
 *
 * Everything here is driven by the single `progress` number handed down
 * from ScrollFilmScene. No second ScrollTrigger, no independent clock.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** map progress across [a,b] to 0..1 */
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export default function CoverHeadline({
  progress,
  lang,
}: {
  progress: number;
  lang: Lang;
}) {
  const t = SITE_TEXTS[lang];
  const lines = [t.coverLine1, t.coverLine2, t.coverLine3];

  // the type is fully present for the first third, then lifts away
  const out = range(progress, 0.42, 0.78);
  const opacity = 1 - out;
  const y = -out * 70;

  // each line arrives a beat after the last
  const rise = (i: number) => {
    const enter = range(progress, 0 + i * 0.03, 0.16 + i * 0.03);
    return (1 - enter) * 108;
  };

  // the small furniture clears out earliest — it belongs to the first frame only
  const furniture = 1 - range(progress, 0.02, 0.3);

  return (
    <div className="pointer-events-none absolute inset-0 z-[6] flex flex-col justify-between px-5 pb-24 pt-24 sm:px-8 sm:pb-8 sm:pt-28">
      {/* top furniture */}
      <div
        className="flex items-start justify-between gap-6"
        style={{ opacity: furniture, transform: `translateY(${(1 - furniture) * -12}px)` }}
      >
        <p className="mono-label max-w-[13rem] text-bone/55 sm:max-w-xs">{t.coverEyebrow}</p>
        <p className="mono-label hidden text-right text-bone/45 sm:block">
          {t.ownerName}
          <br />
          {t.city}
        </p>
      </div>

      {/* the headline */}
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          willChange: "transform, opacity",
        }}
        className="pb-14 sm:pb-10"
      >
        <h1
          className={cn(
            "display-xl max-w-[15ch] text-balance",
            lang === "fa" && "max-w-[14ch] text-[clamp(2.2rem,8.4vw,6.4rem)] leading-[1.1]"
          )}
        >
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em] last:pb-0">
              <span
                className={cn("block", i === 2 && "italic")}
                style={{
                  transform: `translateY(${rise(i)}%)`,
                  willChange: "transform",
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* bottom furniture — after the film takes over, all that remains
          is the shape of the frame itself */}
      <div
        className="flex flex-wrap items-end justify-between gap-4 border-t border-bone/15 pt-4"
        style={{ opacity: furniture }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {[t.coverMetaLeft, t.coverMetaMid, t.coverMetaRight].map((m) => (
            <span key={m} className="mono-label text-bone/45">
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-bone/60">
          <span className="mono-label">{t.coverScroll}</span>
          <span className="block h-8 w-px bg-bone/40" style={{ opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
}
