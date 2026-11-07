import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ScrollScene — the one scroll engine for the whole site.
 *
 * Contract (this is what "scroll-controlled" actually means here):
 *   • Scrolling is the ONLY input. No ambient rAF loop, no autoplay.
 *   • Stop scrolling → the timeline freezes exactly where it is.
 *   • Scroll up → `scrub` plays the timeline backwards, frame-accurately.
 *
 * How progress is delivered to children:
 *   `children` receives a getter for 0..1 progress. Children may either
 *   animate with it via GSAP (`onUpdate`) or paint it into a canvas.
 *   We deliberately avoid React state on every scroll frame — that would
 *   re-render the tree 60×/s. Progress lives in a ref; children subscribe.
 *
 * Accessibility / resilience:
 *   • `prefers-reduced-motion`: the scene snaps to its end state, no
 *     ScrollTrigger, no pinning — the static composition is what ships.
 *   • `poster` renders underneath, so a no-JS or pre-hydration visitor
 *     still sees a composed image.
 */

export type SceneProgress = (value: number) => void;

interface ScrollSceneProps {
  children?: ReactNode;
  /** static composition shown before hydration and under reduced motion */
  poster?: ReactNode;
  /** vertical scroll distance the scene occupies, in viewport heights */
  distance?: number;
  /** pin the scene while it plays (default true) */
  pin?: boolean;
  /** starting progress when reduced motion is on (default 1 = end state) */
  reducedMotionProgress?: number;
  /** receives scroll progress 0..1 */
  onProgress: SceneProgress;
  className?: string;
  /** enable in dev overlays */
  marker?: boolean;
  /** runs once when the scene is created, for one-off setup */
  onReady?: (ctx: { duration: number }) => void;
}

export default function ScrollScene({
  children,
  poster,
  distance = 1.6,
  pin = true,
  reducedMotionProgress = 1,
  onProgress,
  className,
  marker = false,
  onReady,
}: ScrollSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  // keep the latest callback without re-creating the ScrollTrigger
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;

  const { contextSafe } = useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        // no scroll hijacking at all — paint the finished composition
        progressRef.current = reducedMotionProgress;
        cbRef.current(reducedMotionProgress);
        return;
      }

      // a single dummy tween gives us a scrub-able timeline whose
      // progress is the scene clock that every child reads.
      const state = { p: 0 };
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          progressRef.current = state.p;
          cbRef.current(state.p);
        },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${Math.round(distance * 100)}%`,
          scrub: true, // ← the actual "stop scrolling freezes it" mechanism
          pin: pin ? el : false,
          pinSpacing: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: marker,
        },
      });

      onReady?.({ duration: tween.duration() });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef }
  );

  // expose a refresh hook for consumers that change layout (e.g. filters)
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 240);
    return () => window.clearTimeout(id);
  }, []);

  void contextSafe;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {poster}
      {children}
    </div>
  );
}
