import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Room from "../components/shell/Room";
import { AI_PIECES, t as tx } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import Art from "../components/ui/Art";
import { cn } from "../utils/cn";

/**
 * AI ART — 03
 * Art direction: a white-cube gallery. Bright paper, wide gutters,
 * hung frames of different heights, museum wall labels. The lightbox
 * is the only place the interface gets out of the way completely.
 */
export default function AiRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % AI_PIECES.length));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + AI_PIECES.length) % AI_PIECES.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Room tone="room-ai" lang={lang} current="ai">
      {/* ── wall text ────────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow" style={{ color: "var(--room-accent)" }}>
              03 — {t.navAi}
            </p>
            <p className="mono-label opacity-45">
              {AI_PIECES.length} {lang === "fa" ? "اثر" : "works"} · 2024 — 2026
            </p>
          </div>

          <div className="grid gap-10 pt-9 lg:grid-cols-12 lg:items-end">
            <h1
              className={cn(
                "display-lg max-w-[14ch] text-balance lg:col-span-7",
                lang === "fa" && "text-[clamp(1.9rem,6vw,4.4rem)] leading-[1.16]"
              )}
            >
              {t.aiTitle}
            </h1>
            <div className="lg:col-span-5">
              <p className="text-pretty text-sm leading-relaxed opacity-70">{t.aiLead}</p>
              <p className="mono-label mt-5 opacity-40">{t.aiCaptionNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── hung works ───────────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8">
            {AI_PIECES.map((piece, i) => (
              <motion.button
                type="button"
                key={piece.id}
                onClick={() => setOpen(i)}
                className={cn("group block text-left", piece.tall && "sm:row-span-2")}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={cn(
                    "relative overflow-hidden bg-[#eceae4] p-3 sm:p-4",
                    "transition-shadow duration-500 group-hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]"
                  )}
                >
                  <div className={cn("overflow-hidden", piece.tall ? "aspect-[3/4]" : "aspect-[4/3]")}>
                    <Art
                      src={piece.image}
                      alt={tx(piece.title, lang)}
                      priority={i < 3}
                      className="ken-burns"
                    />
                  </div>
                  <span className="absolute right-5 top-5 flex h-7 items-center bg-white/85 px-2 text-[10px] font-medium tracking-wide text-[#16151a] backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {lang === "fa" ? "بزرگ‌نمایی" : "View"}
                  </span>
                </div>

                {/* museum wall label */}
                <div className="mt-3 border-t pt-2.5" style={{ borderColor: "var(--room-line)" }}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className={cn("text-sm font-medium leading-snug", lang === "fa" && "text-[0.9rem]")}>
                      {tx(piece.title, lang)}
                    </h2>
                    <span className="mono-label shrink-0 opacity-35">{piece.index}</span>
                  </div>
                  <p className="mono-label mt-1 opacity-45">
                    {tx(piece.medium, lang)} · {piece.year}
                  </p>
                  <p className="mt-2 hidden text-[11px] leading-relaxed opacity-55 sm:block">
                    {tx(piece.note, lang)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── method ───────────────────────────────────────────── */}
      <section className="mt-20 border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-md max-w-[12ch]">{t.aiMethodTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <ol className="grid gap-8 sm:grid-cols-3">
              {[
                [t.aiMethod1, t.aiMethod1Body],
                [t.aiMethod2, t.aiMethod2Body],
                [t.aiMethod3, t.aiMethod3Body],
              ].map(([title, body], i) => (
                <li key={title} className="reveal border-t pt-4" style={{ borderColor: "var(--room-line)" }} data-reveal-delay={String(i * 90)}>
                  <p className="mono-label mb-4" style={{ color: "var(--room-accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-xl">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-60">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-[#fbfaf7]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={tx(AI_PIECES[open].title, lang)}
          >
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-8" style={{ borderColor: "rgba(22,21,26,0.14)" }}>
              <p className="mono-label text-[#16151a]/60">
                {AI_PIECES[open].index} / {String(AI_PIECES.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="mono-label flex items-center gap-2 text-[#16151a]/70 transition-colors hover:text-[#16151a]"
              >
                {t.closeLabel}
                <span className="text-base leading-none">×</span>
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={AI_PIECES[open].id}
                  src={AI_PIECES[open].image}
                  alt={tx(AI_PIECES[open].title, lang)}
                  className="max-h-full max-w-full object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-8" style={{ borderColor: "rgba(22,21,26,0.14)" }}>
              <div>
                <h2 className="font-display text-2xl text-[#16151a]">{tx(AI_PIECES[open].title, lang)}</h2>
                <p className="mono-label mt-1 text-[#16151a]/50">
                  {tx(AI_PIECES[open].medium, lang)} · {AI_PIECES[open].year}
                </p>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#16151a]/60">
                  {tx(AI_PIECES[open].note, lang)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen((v) => (v === null ? v : (v - 1 + AI_PIECES.length) % AI_PIECES.length))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border text-[#16151a]"
                  style={{ borderColor: "rgba(22,21,26,0.2)" }}
                  aria-label={t.prevRoom}
                >
                  {lang === "fa" ? "→" : "←"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((v) => (v === null ? v : (v + 1) % AI_PIECES.length))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border text-[#16151a]"
                  style={{ borderColor: "rgba(22,21,26,0.2)" }}
                  aria-label={t.nextRoom}
                >
                  {lang === "fa" ? "←" : "→"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Room>
  );
}
