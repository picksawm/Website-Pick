import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./useReducedMotion";
import { cn } from "../utils/cn";
import type { Lang } from "../config/siteTexts";

interface CinematicIntroProps {
  lang: Lang;
  /** name shown in the opening frame */
  wordmark: string;
  /** short line under it */
  kicker: string;
  onDone: () => void;
}

/**
 * CinematicIntro — the exhibition opens.
 *
 * Design intent: this is a curtain, not a loading bar. It should feel
 * like the room lights going down: a black field, a thin horizontal
 * filament of light, the wordmark resolving out of grain, then the
 * field splits and the artwork is already moving underneath.
 *
 * Budget: pure CSS/GSAP opacity + transform, ~1.6s, skipped entirely
 * for reduced motion and on repeat visits (sessionStorage), so it never
 * taxes a returning visitor or a crawler.
 *
 * It renders nothing permanent — on completion it calls onDone and the
 * page underneath is already mounted and interactive.
 */
export default function CinematicIntro({ lang, wordmark, kicker, onDone }: CinematicIntroProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (reduced) {
      setHidden(true);
      onDone();
      return;
    }

    // never make a returning visitor (or a reload) sit through this twice
    let seen = false;
    try {
      seen = sessionStorage.getItem("picksaw:intro") === "1";
    } catch {
      /* storage blocked */
    }
    if (seen) {
      setHidden(true);
      onDone();
      return;
    }

    const el = rootRef.current;
    if (!el) {
      setHidden(true);
      onDone();
      return;
    }

    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        try {
          sessionStorage.setItem("picksaw:intro", "1");
        } catch {
          /* ignore */
        }
        setHidden(true);
        onDone();
      },
    });

    tl.set(el, { autoAlpha: 1 })
      // the filament ignites
      .fromTo(q(".intro-filament"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.7 })
      // wordmark resolves upward out of the grain
      .fromTo(
        q(".intro-word"),
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.75 },
        "-=0.35"
      )
      .fromTo(q(".intro-kicker"), { opacity: 0 }, { opacity: 1, duration: 0.45 }, "-=0.3")
      .to({}, { duration: 0.32 })
      // the field splits and lifts away
      .to(q(".intro-word, .intro-kicker, .intro-filament"), {
        opacity: 0,
        yPercent: -12,
        duration: 0.42,
        ease: "power2.in",
      })
      .to(el, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.1");

    return () => {
      tl.kill();
    };
  }, [reduced, onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      style={{ visibility: "hidden" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#05060a]"
      aria-hidden
    >
      {/* grain + storm residue so the intro belongs to the same world */}
      <div className="grain-layer pointer-events-none absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 50%, rgba(127,220,255,0.10) 0%, transparent 68%)",
        }}
      />

      <div className="intro-filament mb-8 h-px w-[52vw] max-w-[520px] origin-center bg-gradient-to-r from-transparent via-[#c8e8ff] to-transparent shadow-[0_0_24px_rgba(127,220,255,0.8)]" />

      <div className="overflow-hidden px-6">
        {/* the page's real <h1> lives in CoverPage; this is a decorative
            wordmark that leaves the DOM, so it must not be a heading */}
        <div
          className={cn(
            "intro-word text-center font-display text-[clamp(2rem,7vw,4.5rem)] leading-none tracking-tight text-bone",
            lang === "fa" && "font-[var(--font-fa)]"
          )}
        >
          {wordmark}
        </div>
      </div>

      <p className="intro-kicker mono-label mt-5 text-center text-bone/40">{kicker}</p>
    </div>
  );
}
