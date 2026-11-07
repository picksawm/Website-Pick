import { type ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ROOMS, roomLabel } from "../../config/portfolio";
import { SITE_TEXTS, type Lang } from "../../config/siteTexts";
import { useRevealObserver } from "../../lib/motion";
import StormLayer from "../storm/StormLayer";
import { cn } from "../../utils/cn";

type RoomClass = "room-work" | "room-worlds" | "room-ai" | "room-sound" | "room-about" | "room-contact";

/** Which rooms are lit by the storm, and how hard the weather hits. */
const WEATHER: Record<RoomClass, { mode: "dark" | "light"; intensity: number; lightning?: boolean }> = {
  "room-work": { mode: "light", intensity: 0.55 },
  "room-worlds": { mode: "dark", intensity: 1.15, lightning: true },
  "room-ai": { mode: "light", intensity: 0.35 },
  "room-sound": { mode: "dark", intensity: 0.7 },
  "room-about": { mode: "dark", intensity: 0.5 },
  "room-contact": { mode: "light", intensity: 0.4 },
};

interface RoomProps {
  /** palette class — each room has its own light */
  tone: RoomClass;
  lang: Lang;
  children: ReactNode;
  /** current room key, used for the next-room footer */
  current?: "work" | "worlds" | "ai" | "sound" | "about" | "contact";
  /** hide the room-to-room footer (e.g. on contact, which has its own) */
  noNext?: boolean;
}

/**
 * Room — the shared frame around every tab.
 *
 * Paints the palette, runs the shared scroll-reveal observer, and
 * closes each room with a doorway into the next one, so the site reads
 * as a walk through a gallery rather than a set of pages.
 */
export default function Room({ tone, lang, children, current, noNext }: RoomProps) {
  const t = SITE_TEXTS[lang];

  // one observer for the whole room; it also picks up filtered-in nodes
  useRevealObserver([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const idx = current ? ROOMS.findIndex((r) => r.key === current) : -1;
  const next = idx >= 0 ? ROOMS[(idx + 1) % ROOMS.length] : null;

  const weather = WEATHER[tone];

  return (
    <div className={cn("relative min-h-screen", tone)}>
      {/* the sky never leaves — every room keeps the storm atmosphere,
          only the light and the density change */}
      <StormLayer mode={weather.mode} intensity={weather.intensity} lightning={weather.lightning ?? false} />

      {/* fine grain over every room — ties the palettes together */}
      <div aria-hidden className="grain-layer pointer-events-none fixed inset-0 z-[1]" />

      <main id="room" className="relative z-[2]">
        {children}
      </main>

      {!noNext && next && (
        <footer className="relative z-[2] border-t" style={{ borderColor: "var(--room-line)" }}>
          <div className="mx-auto max-w-[1680px] px-5 sm:px-8">
            <Link
              to={next.path}
              className="group flex flex-col gap-6 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-20"
            >
              <div>
                <p className="eyebrow mb-3 opacity-45">
                  {t.nextRoom} — {next.number}
                </p>
                <p
                  className={cn(
                    "font-display text-[3rem] leading-[0.95] tracking-tight transition-transform duration-700 group-hover:translate-x-2 sm:text-[5.5rem]",
                    lang === "fa" && "text-[2.4rem] sm:text-[4rem]"
                  )}
                  style={{ color: "var(--room-fg)" }}
                >
                  {roomLabel(next.key, lang)}
                </p>
              </div>
              <motion.span
                className="flex h-14 w-14 items-center justify-center rounded-full border text-lg transition-colors duration-500 sm:h-20 sm:w-20"
                style={{ borderColor: "var(--room-line)", color: "var(--room-fg)" }}
                whileHover={{ scale: 1.08 }}
              >
                {lang === "fa" ? "←" : "→"}
              </motion.span>
            </Link>

            <div
              className="flex flex-col gap-3 border-t py-6 text-[11px] sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--room-line)", color: "var(--room-dim)" }}
            >
              <p className="mono-label">{t.footerCredit.replace("{year}", String(new Date().getFullYear()))}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link to="/journal" className="underline-draw hover:opacity-100">
                  {t.navJournal}
                </Link>
                <a
                  href="https://www.instagram.com/picksawm/"
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="underline-draw"
                >
                  Instagram
                </a>
                <span className="font-mono">{t.footerTagline}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
