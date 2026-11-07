import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

interface ImageSequenceProps {
  /** directory holding the frames, e.g. "/art/sequences/relic-01" */
  dir: string;
  frames: number;
  ext?: "avif" | "webp" | "jpg";
  /** frame filenames are zero-padded to this width */
  pad?: number;
  className?: string;
  /** given scroll progress 0..1, paint that frame */
  progress: number;
  alt: string;
  /** memory ceiling — decoded frames kept alive (mobile is lower) */
  maxCached?: number;
}

/**
 * ImageSequence — canvas frame scrubber.
 *
 * The brief's hard requirement: "avoid downloading entire image
 * sequences before they are needed". So this never preloads the set.
 * It keeps a small LRU of decoded bitmaps around the current frame,
 * fetches ahead one frame either direction (so reversing is smooth),
 * and paints synchronously from cache when scrolling.
 *
 * Memory: each decoded frame is an ImageBitmap holding real pixels.
 * `maxCached` defaults to 24 on mobile / 60 on desktop, and evicted
 * bitmaps are explicitly `.close()`d — otherwise Safari leaks them.
 */
export default function ImageSequence({
  dir,
  frames,
  ext = "avif",
  pad = 4,
  className,
  progress,
  alt,
  maxCached,
}: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cache = useRef(new Map<number, ImageBitmap>());
  const loading = useRef(new Set<number>());
  const lastDrawn = useRef(-1);
  const [firstReady, setFirstReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const limit = maxCached ?? (isMobile ? 24 : 60);

  const src = useCallback(
    (i: number) => `${dir}/${String(i).padStart(pad, "0")}.${ext}`,
    [dir, pad, ext]
  );

  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const bmp = cache.current.get(index);
    if (!canvas || !bmp) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // cover-fit without stretching
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / bmp.width, ch / bmp.height);
    const w = bmp.width * scale;
    const h = bmp.height * scale;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
    lastDrawn.current = index;
  }, []);

  const evict = useCallback(
    (keep: number) => {
      if (cache.current.size <= limit) return;
      // evict the frame furthest from the one we need
      const entries = [...cache.current.keys()].sort(
        (a, b) => Math.abs(b - keep) - Math.abs(a - keep)
      );
      while (cache.current.size > limit && entries.length) {
        const key = entries.shift()!;
        cache.current.get(key)?.close();
        cache.current.delete(key);
      }
    },
    [limit]
  );

  const load = useCallback(
    (index: number) => {
      if (index < 0 || index >= frames) return;
      if (cache.current.has(index) || loading.current.has(index)) return;
      loading.current.add(index);

      const img = new Image();
      img.decoding = "async";
      img.src = src(index);
      img
        .decode()
        .then(() => createImageBitmap(img))
        .then((bmp) => {
          cache.current.set(index, bmp);
          evict(index);
          if (!firstReady) setFirstReady(true);
        })
        .catch(() => {
          // a missing frame must not break the scene
          if (index === 0) setFailed(true);
        })
        .finally(() => loading.current.delete(index));
    },
    [frames, src, evict, firstReady]
  );

  // size the canvas to its box at capped DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      if (lastDrawn.current >= 0) draw(lastDrawn.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw, isMobile]);

  // fetch the nearest frames around the current progress
  useEffect(() => {
    if (failed) return;
    const target = Math.min(frames - 1, Math.max(0, Math.round(progress * (frames - 1))));
    load(target);
    load(target + 1);
    load(target - 1);
    if (cache.current.has(target)) draw(target);
  }, [progress, frames, load, draw, failed]);

  // free every bitmap on unmount — ImageBitmap is not GC'd reliably
  useEffect(() => {
    const store = cache.current;
    return () => {
      store.forEach((b) => b.close());
      store.clear();
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0b0c0e]", className)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        role="img"
        aria-label={alt}
        style={{ opacity: firstReady ? 1 : 0, transition: "opacity .6s ease" }}
      />
      {!firstReady && !failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono-label text-bone/25">loading</span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111316]">
          <p className="mono-label max-w-xs px-6 text-center text-bone/30">{alt}</p>
        </div>
      )}
    </div>
  );
}
