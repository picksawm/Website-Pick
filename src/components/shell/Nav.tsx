import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ROOMS, roomLabel } from "../../config/portfolio";
import { SITE_TEXTS, type Lang } from "../../config/siteTexts";
import { usePageProgress } from "../../lib/motion";
import { cn } from "../../utils/cn";
import Wordmark from "../brand/Wordmark";

interface NavProps {
  lang: Lang;
  onToggleLang: () => void;
  isAdmin: boolean;
  onAdminOpen: () => void;
}

/** Which rooms are dark? Drives the nav ink so it never disappears. */
/* The exhibition is dark end to end now, so the nav is always set in
   ivory — except over the one room that inverts (contact). */
const LIGHT_ROOMS = ["/contact"];

export default function Nav({ lang, onToggleLang, isAdmin, onAdminOpen }: NavProps) {
  const t = SITE_TEXTS[lang];
  const location = useLocation();
  const progress = usePageProgress();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const dark = !LIGHT_ROOMS.some((p) => location.pathname.startsWith(p));

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* scroll progress hairline */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left"
        style={{
          transform: `scaleX(${progress})`,
          background: dark ? "rgba(244,241,234,0.75)" : "rgba(20,19,15,0.7)",
          transition: "background 0.6s ease",
        }}
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[65] transition-colors duration-500 safe-top",
          !open && scrolled && (dark ? "bg-[#08090b]/72 backdrop-blur-md" : "bg-[#f2efe9]/78 backdrop-blur-md")
        )}
      >
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
          {/* brand */}
          <Link
            to="/"
            className={cn(
              "group flex items-baseline gap-2 transition-colors duration-500",
              open || dark ? "text-bone" : "text-[#12110f]"
            )}
            aria-label="Picksaw — home"
          >
            {/* the mark, not the word set in a font */}
            <Wordmark className="h-[0.62rem] w-auto shrink-0 sm:h-[0.72rem]" />
            <span
              className={cn(
                "plate hidden pb-0.5 opacity-45 transition-opacity group-hover:opacity-90 sm:inline",
                lang === "fa" && "hidden"
              )}
            >
              ir
            </span>
          </Link>

          {/* right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={onToggleLang}
              className={cn(
                "mono-label px-1 py-1 transition-colors duration-300 border-b",
                open || dark
                  ? "border-bone/25 text-bone/60 hover:border-bone/60 hover:text-bone"
                  : "border-[#12110f]/25 text-[#12110f]/55 hover:border-[#12110f]/60 hover:text-[#12110f]"
              )}
              aria-label="Switch language"
            >
              {t.langButton}
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={onAdminOpen}
                className={cn(
                  "mono-label hidden rounded-full border px-3 py-1.5 transition-all sm:block",
                  open || dark
                    ? "border-signal/40 text-signal hover:bg-signal/10"
                    : "border-[#12110f]/25 text-[#12110f] hover:bg-[#12110f]/5"
                )}
              >
                +
              </button>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 sm:px-4",
                open || dark
                  ? "border-bone/20 text-bone hover:border-bone/45"
                  : "border-[#12110f]/20 text-[#12110f] hover:border-[#12110f]/45"
              )}
              aria-expanded={open}
              aria-label={open ? t.closeLabel : t.menuLabel}
            >
              <span className="mono-label leading-none">{open ? t.closeLabel : t.menuLabel}</span>
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span
                  className={cn(
                    "h-px w-full origin-right bg-current transition-transform duration-300",
                    open && "translate-y-[5.5px] rotate-45"
                  )}
                />
                <span className={cn("h-px w-full bg-current transition-opacity duration-200", open && "opacity-0")} />
                <span
                  className={cn(
                    "h-px w-full origin-right bg-current transition-transform duration-300",
                    open && "-translate-y-[5.5px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── fullscreen room directory ───────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            dir={lang === "fa" ? "rtl" : "ltr"}
            className="fixed inset-0 z-[64] overflow-y-auto bg-[var(--color-void)]"
          >
            {/* hovered room backdrop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <AnimatePresence>
                {hovered !== null && (
                  <motion.div
                    key={hovered}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={ROOM_IMAGES[hovered]}
                      alt=""
                      className="h-full w-full object-cover grayscale"
                      onError={(e) => (e.currentTarget.style.opacity = "0")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/70 to-[#08090b]/40" />
            </div>

            <div className="page-shell relative flex min-h-full flex-col justify-between pb-10 pt-28 sm:pt-32">
              <nav className="w-full" aria-label="Rooms">
                <p className="eyebrow mb-6">{lang === "fa" ? "فهرست" : "Contents"}</p>
                <ul>
                  {ROOMS.map((room, i) => {
                    const active = location.pathname === room.path;
                    return (
                      <motion.li
                        key={room.key}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b"
                        style={{ borderColor: "var(--hair)" }}
                        onPointerEnter={() => setHovered(i)}
                        onPointerLeave={() => setHovered(null)}
                      >
                        <Link
                          to={room.path}
                          className="group flex items-baseline gap-4 py-4 sm:gap-10 sm:py-6"
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="plate w-8 shrink-0">{room.number}</span>
                          <span
                            className={cn(
                              "font-display text-[clamp(1.9rem,7vw,3.4rem)] leading-[0.95] tracking-[-0.03em] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-2",
                              active ? "text-[var(--color-volt)]" : "text-bone",
                              lang === "fa" && "text-[clamp(1.5rem,5.5vw,2.4rem)] leading-[1.2]"
                            )}
                          >
                            {roomLabel(room.key, lang)}
                          </span>
                          <span
                            aria-hidden
                            className="ml-auto hidden shrink-0 self-center text-[0.7rem] text-bone/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block"
                          >
                            {lang === "fa" ? "←" : "→"}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                  <motion.li
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42, duration: 0.6 }}
                    className="border-b"
                    style={{ borderColor: "var(--hair)" }}
                  >
                    <Link
                      to="/journal"
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-4 sm:gap-10 sm:py-6"
                    >
                      <span className="plate w-8 shrink-0">07</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.9rem,7vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-bone/60 transition-colors duration-500 group-hover:text-bone",
                          lang === "fa" && "text-[clamp(1.5rem,5.5vw,2.4rem)] leading-[1.2]"
                        )}
                      >
                        {t.navJournal}
                      </span>
                    </Link>
                  </motion.li>
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-14 flex w-full flex-col gap-4 border-t pt-6 sm:flex-row sm:items-baseline sm:justify-between"
                style={{ borderColor: "var(--hair)" }}
              >
                <p className="voice max-w-[34ch] text-base text-[var(--color-bone-dim)]">
                  {t.footerTagline}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href="https://www.instagram.com/picksawm/"
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="underline-draw hover:text-bone"
                  >
                    Instagram
                  </a>
                  <a href="mailto:hello@picksaw.ir" className="underline-draw hover:text-bone">
                    hello@picksaw.ir
                  </a>
                  <span className="font-mono">{t.city}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const ROOM_IMAGES: Record<number, string> = {
  0: "/art/hero.jpg",
  1: "/art/worlds-01.jpg",
  2: "/art/ai-01.jpg",
  3: "/art/ai-05.jpg",
  4: "/art/worlds-04.jpg",
  5: "/art/hero.jpg",
};
