import { useCallback, useRef, useState } from "react";
import ScrollScene from "./ScrollScene";
import ScrollFilm from "./ScrollFilm";
import type { FilmManifest } from "../config/films.generated";
import { cn } from "../utils/cn";

interface ScrollFilmSceneProps {
  film: FilmManifest;
  alt: string;
  /** scroll distance in viewport heights — longer = slower film */
  distance?: number;
  className?: string;
  /** caption that fades up under the frame */
  caption?: React.ReactNode;
  /** hud label fixed in the corner, e.g. "01 / 96" */
  hud?: boolean;
  /**
   * Type drawn over the film inside the pinned frame. Receives 0..1 so
   * the headline can leave as the film gets going — one scroll system,
   * not two fighting over the same pixels.
   */
  overlay?: (progress: number) => React.ReactNode;
}

/**
 * ScrollFilmScene — ScrollScene + ScrollFilm, wired so that scroll is the
 * projector.
 *
 * The only subtlety worth reading: `ScrollScene` fires `onProgress` on
 * every scrub update (up to 60×/s). We absolutely do not want that to
 * re-render React 60 times a second. So progress is compared down to a
 * *frame index* and state is only set when that integer changes — at
 * most 96 renders across the whole film, usually far fewer.
 */
export default function ScrollFilmScene({
  film,
  alt,
  distance = 2.6,
  className,
  caption,
  hud = true,
  overlay,
}: ScrollFilmSceneProps) {
  const [index, setIndex] = useState(0);
  const last = useRef(-1);

  const onProgress = useCallback(
    (p: number) => {
      const next = Math.min(film.frames - 1, Math.max(0, Math.round(p * (film.frames - 1))));
      if (next !== last.current) {
        last.current = next;
        setIndex(next);
      }
    },
    [film.frames]
  );

  const progress = film.frames > 1 ? index / (film.frames - 1) : 0;

  const posterFrame = String(Math.round(film.frames * 0.14) + 1).padStart(4, "0");
  const posterSrc = `${film.dir}/${film.tiers.lo}/${posterFrame}.${film.ext}`;

  return (
    <ScrollScene
      distance={distance}
      onProgress={onProgress}
      reducedMotionProgress={0.62}
      className={cn("bg-[#06070a]", className)}
    >
      <div className="relative h-[100svh] w-full overflow-hidden">
        <ScrollFilm film={film} progress={progress} alt={alt} posterSrc={posterSrc} />

        {/* vignette — keeps type legible over any frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(4,5,8,0.55) 100%), linear-gradient(to bottom, rgba(4,5,8,0.5), transparent 22%, transparent 74%, rgba(4,5,8,0.72))",
          }}
        />

        {overlay?.(progress)}

        {hud && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-5 sm:px-8">
            <span className="mono-label text-bone/50">
              {String(index + 1).padStart(2, "0")} / {film.frames}
            </span>
            {/* the film strip: how far through we are, as a filled line */}
            <span className="relative h-px w-24 bg-bone/20 sm:w-40">
              <span
                className="absolute inset-y-0 left-0 bg-bone/70"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
          </div>
        )}

        {caption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 px-5 sm:px-8">{caption}</div>
        )}
      </div>
    </ScrollScene>
  );
}
