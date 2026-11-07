import { useEffect, useRef, useState } from "react";

/** ────────────────────────────────────────────────────────────────
 *  Scroll + pointer primitives. Kept dependency-free and rAF-batched
 *  so six rooms can all use them without competing for frames.
 *  ──────────────────────────────────────────────────────────────── */

/** Normalized document scroll: 0 at top, 1 at the end. */
export function usePageProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

/** Raw scrollY, rAF-batched. */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      setY(window.scrollY);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return y;
}

/**
 * Progress of an element through the viewport:
 * 0 when its top hits the bottom of the screen, 1 when its bottom
 * leaves the top. Great for per-section parallax without libs.
 */
export function useElementProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      setProgress(Math.min(Math.max(passed / total, 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

/** Pointer position normalized to -1..1 around the viewport centre. */
export function usePointer() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let next = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      next = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      if (!raf)
        raf = requestAnimationFrame(() => {
          setPos(next);
          raf = 0;
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return pos;
}

/**
 * Adds `is-in` to elements with `.reveal` / `.clip-reveal` once seen.
 *
 * A MutationObserver keeps watching for nodes added later (filter tabs,
 * a page of results, an album switch, a language flip). Without it,
 * anything rendered after mount keeps `.reveal`'s opacity:0 forever.
 */
export function useRevealObserver(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const plain = !("IntersectionObserver" in window);
    const observed = new WeakSet<Element>();

    const io = plain
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target as HTMLElement;
              const delay = Number(el.dataset.revealDelay ?? 0);
              if (delay > 0) window.setTimeout(() => el.classList.add("is-in"), delay);
              else el.classList.add("is-in");
              io?.unobserve(el);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in), .clip-reveal:not(.is-in)")
        .forEach((el) => {
          if (plain) {
            el.classList.add("is-in");
            return;
          }
          if (observed.has(el)) return;
          observed.add(el);
          io?.observe(el);
        });
    };

    scan();

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = window.requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
      if (queued) cancelAnimationFrame(queued);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Clamp helper. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/** Map a value from one range to another, clamped. */
export const mapRange = (v: number, a: number, b: number, c: number, d: number) =>
  c + (clamp((v - a) / (b - a)) * (d - c));
