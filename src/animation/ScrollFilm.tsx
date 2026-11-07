import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import type { FilmManifest } from "../config/films.generated";

/* ═══════════════════════════ frame cache ═══════════════════════════
   A decoded frame is an ImageBitmap holding real pixels — ~3.2 MB at
   1200×675. We cannot keep 96 of those (300 MB). So this module owns a
   small LRU per tier, shared across every player on the page, and
   explicitly closes bitmaps when evicting (Safari leaks them otherwise). */

interface TierState {
  cache: Map<number, ImageBitmap>;
  inflight: Map<number, Promise<ImageBitmap | null>>;
  order: number[]; // recency, oldest first
}

const TIERS = new Map<string, TierState>();
/** decoded bitmaps kept per tier. hi ≈ 3.2 MB each, so 18 ≈ 58 MB. */
const LIMITS = { hi: 18, lo: Number.POSITIVE_INFINITY };

const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const tierKey = (film: FilmManifest, tier: "hi" | "lo") => `${film.slug}:${tier}`;

function stateFor(film: FilmManifest, tier: "hi" | "lo"): TierState {
  const key = tierKey(film, tier);
  let s = TIERS.get(key);
  if (!s) {
    s = { cache: new Map(), inflight: new Map(), order: [] };
    TIERS.set(key, s);
  }
  return s;
}

/** Mobile halves the hi-tier ceiling: fewer decoded frames, less GC pressure. */
const limitFor = (tier: "hi" | "lo") =>
  tier === "lo" ? LIMITS.lo : isMobile() ? 10 : LIMITS.hi;

function evict(film: FilmManifest, tier: "hi" | "lo", keep: number) {
  const s = stateFor(film, tier);
  const limit = limitFor(tier);
  if (s.cache.size <= limit) return;

  // least-recently-used first, but never drop the frame we're showing
  for (const key of [...s.order]) {
    if (s.cache.size <= limit) break;
    if (key === keep) continue;
    s.cache.get(key)?.close();
    s.cache.delete(key);
    s.order = s.order.filter((k) => k !== key);
  }
}

export const frameUrl = (film: FilmManifest, tier: "hi" | "lo", index: number) =>
  `${film.dir}/${film.tiers[tier]}/${String(index + 1).padStart(4, "0")}.${film.ext}`;

/** Load one frame. Idempotent, dedupes in-flight requests, never throws. */
export function loadFrame(
  film: FilmManifest,
  tier: "hi" | "lo",
  index: number,
  resolveUrl?: (index: number) => string
): Promise<ImageBitmap | null> {
  if (index < 0 || index >= film.frames) return Promise.resolve(null);
  const s = stateFor(film, tier);

  const hit = s.cache.get(index);
  if (hit) {
    s.order = s.order.filter((k) => k !== index);
    s.order.push(index);
    return Promise.resolve(hit);
  }

  const pending = s.inflight.get(index);
  if (pending) return pending;

  const p = new Promise<ImageBitmap | null>((done$) => {
    const img = new Image();
    img.decoding = "async";
    img.src = resolveUrl ? resolveUrl(index) : frameUrl(film, tier, index);

    const done = (bmp: ImageBitmap | null) => {
      s.inflight.delete(index);
      if (bmp) {
        s.cache.set(index, bmp);
        s.order.push(index);
        evict(film, tier, index);
      }
      done$(bmp);
    };

    (img.decode?.() ?? Promise.reject(new Error("no decode")))
      .then(() => createImageBitmap(img))
      .then(done)
      .catch(() => {
        // fall back to the plain load event for browsers without decode()
        if (img.complete && img.naturalWidth) {
          createImageBitmap(img).then(done).catch(() => done(null));
        } else done(null);
      });
  });

  s.inflight.set(index, p);
  return p;
}

/* ═══════════════════════════ the player ═══════════════════════════ */

export interface ScrollFilmProps {
  film: FilmManifest;
  /** scroll progress 0..1 */
  progress: number;
  alt: string;
  className?: string;
  /** how many sharp frames to keep fetched around the playhead */
  window?: number;
  /** start loading sharp frames at all (false = preview tier only) */
  eager?: boolean;
  /** a still that holds the frame until the first decoded frame arrives —
      this is also what a no-JS visitor sees, so it must be a real image */
  posterSrc?: string;
  /**
   * Single-tier mode. When an artwork supplies its own frame sequence
   * (one folder, no lo/hi split), this resolves frame URLs directly and
   * the preview lane is skipped.
   */
  urlFor?: (index: number) => string;
}

/**
 * ScrollFilm — the "video" that is actually frames.
 *
 * Two lanes, painted on the same canvas:
 *
 *   lo/  400×225, all 96 of them (~0.8 MB total). Fetched in sequence the
 *        moment the scene starts, so *every* scroll position has a real
 *        image within a second. This is what makes it feel continuous
 *        rather than like a slideshow waiting on network.
 *
 *   hi/  1200×675, windowed ±8 frames around the playhead. As each one
 *        lands it paints over the lo frame. You get sharpness where you
 *        are looking and nowhere else.
 *
 * The canvas is scaled to the viewport with `cover`, so the aspect never
 * jumps and there is no layout work during scrub. Painting is driven
 * entirely by the `progress` prop — no rAF loop, no autoplay.
 */
export default function ScrollFilm({
  film,
  progress,
  alt,
  className,
  window: win = 8,
  eager = true,
  posterSrc,
  urlFor,
}: ScrollFilmProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);
  const direction = useRef(1);
  const [firstReady, setFirstReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // which frame each tier is currently showing (-1 = nothing yet)
  const shown = useRef<{ lo: number; hi: number }>({ lo: -1, hi: -1 });

  const index = useMemo(
    () => Math.min(film.frames - 1, Math.max(0, Math.round(progress * (film.frames - 1)))),
    [progress, film.frames]
  );
  const indexRef = useRef(index);
  indexRef.current = index;

  /** cover-fit paint; also clears when a tier has nothing yet */
  const paint = useCallback((bmp: ImageBitmap) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / bmp.width, ch / bmp.height);
    const w = bmp.width * scale;
    const h = bmp.height * scale;

    ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
  }, []);

  // size the backing store once, at a DPR that respects memory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // a resize wipes the canvas — repaint whatever we were showing
        const lo = stateFor(film, "lo").cache.get(shown.current.lo);
        const hi = stateFor(film, "hi").cache.get(shown.current.hi);
        const bmp = hi ?? lo;
        if (bmp) paint(bmp);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [film, paint]);

  // ── preview lane: fetch the whole lo set, in order, once ──────────
  //    ~0.8 MB for the entire film. Fetching it unconditionally (rather
  //    than only near the playhead) is what guarantees that a fast
  //    scroller always has *something* to look at.
  useEffect(() => {
    if (urlFor) return; // single-tier mode has no preview lane
    let cancelled = false;
    const s = stateFor(film, "lo");

    (async () => {
      for (let i = 0; i < film.frames && !cancelled; i++) {
        if (s.cache.has(i)) {
          if (i === 0) setFirstReady(true);
          continue;
        }
        const bmp = await loadFrame(film, "lo", i);
        if (cancelled) return;
        if (!bmp) {
          if (i === 0) setFailed(true);
          return;
        }
        if (i === 0) setFirstReady(true);
        // show it immediately if it is the frame currently under the playhead
        if (i === indexRef.current && shown.current.hi !== i) {
          shown.current.lo = i;
          paint(bmp);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [film, paint]);

  // ── playhead: paint the exact frame, preview tier first ───────────
  useEffect(() => {
    let alive = true;

    // start both requests at once; the small one almost always wins
    if (urlFor) {
      // single-tier: every frame is its own "sharp" frame
      loadFrame(film, "hi", index, urlFor).then((bmp) => {
        if (!alive || !bmp) return;
        if (indexRef.current === index) {
          shown.current.hi = index;
          paint(bmp);
          setFirstReady(true);
        }
      });
      return;
    }

    const loReq = loadFrame(film, "lo", index);
    const hiReq = eager ? loadFrame(film, "hi", index) : Promise.resolve(null);

    (async () => {
      if (urlFor) return;
      const cachedHi = stateFor(film, "hi").cache.get(index);
      if (cachedHi && shown.current.hi !== index) {
        shown.current.hi = index;
        paint(cachedHi);
        setFirstReady(true);
        return;
      }

      const lo = await loReq;
      if (!alive) return;
      if (lo && shown.current.hi !== index) {
        shown.current.lo = index;
        paint(lo);
        setFirstReady(true);
      }

      const hi = await hiReq;
      if (!alive || !hi) return;
      // only paint if the playhead has not moved on since we asked
      if (indexRef.current === index) {
        shown.current.hi = index;
        paint(hi);
        setFirstReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [index, film, paint, eager, urlFor]);

  // ── sharp lane: keep a window of full-size frames around the playhead ──
  useEffect(() => {
    if (!eager) return;
    const dir = direction.current;
    for (let d = 1; d <= win; d++) {
      loadFrame(film, "hi", index + d * dir, urlFor);
      loadFrame(film, "hi", index - d * dir, urlFor);
    }
  }, [index, film, win, eager, urlFor]);

  // a lo frame arriving late should still land if hi never came
  useEffect(() => {
    if (firstReady) return;
    const t = window.setTimeout(() => {
      const lo = stateFor(film, "lo").cache.get(indexRef.current);
      if (lo) {
        shown.current.lo = indexRef.current;
        paint(lo);
        setFirstReady(true);
      }
    }, 1200);
    return () => window.clearTimeout(t);
  }, [firstReady, paint, film]);

  // detect a totally broken film (bad manifest) rather than staring at black
  useEffect(() => {
    let cancelled = false;
    loadFrame(film, urlFor ? "hi" : "lo", 0, urlFor).then((b) => {
      if (cancelled) return;
      if (b) setFirstReady(true);
      else setFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [film]);

  // which way is the visitor travelling? the sharp window leans that way
  if (progress !== progressRef.current) {
    direction.current = progress > progressRef.current ? 1 : -1;
    progressRef.current = progress;
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#06070a]", className)}>
      {/* backdrop: visible pre-hydration, on no-JS, and until frame 1 decodes */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt=""
          aria-hidden
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: firstReady ? 0 : 1, transition: "opacity 700ms ease" }}
        />
      )}

      <canvas
        ref={canvasRef}
        className="h-full w-full"
        role="img"
        aria-label={alt}
        style={{ opacity: firstReady ? 1 : 0, transition: "opacity 700ms ease" }}
      />

      {!firstReady && !failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono-label animate-pulse text-bone/30">loading film</span>
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0b0c0e]">
          <p className="mono-label max-w-xs px-6 text-center leading-relaxed text-bone/30">{alt}</p>
        </div>
      )}
    </div>
  );
}
