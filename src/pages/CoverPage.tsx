import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ROOMS, roomLabel } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { usePageProgress } from "../lib/motion";
import { cn } from "../utils/cn";

/**
 * CoverPage — the threshold.
 *
 * A single full-bleed image that holds still while you scroll; the
 * type steps out of the frame, then the room directory rises. No
 * canvas, no WebGL — just one 150 kB image and transform-only motion,
 * which is the whole point of the rebuild.
 */
export default function CoverPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const progress = usePageProgress();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const veil = useTransform(scrollYProgress, [0, 0.85], [0.44, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/art/hero.jpg";
    if (img.complete) setLoaded(true);
    else img.onload = () => setLoaded(true);
  }, []);

  const lines = [t.coverLine1, t.coverLine2, t.coverLine3];

  return (
    <div id="room" className="relative bg-[#08090b] text-bone">
      {/* ── hero plate ─────────────────────────────────────────── */}
      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imgScale, y: imgY }}>
          <motion.img
            src="/art/hero.jpg"
            alt="Rain-soaked night avenue between brutalist towers, lit by Persian geometric neon"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            fetchPriority="high"
          />
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[#08090b]"
          style={{ opacity: veil }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-[#08090b]/55"
        />

        {/* frame furniture */}
        <div className="absolute inset-0 z-[3] flex flex-col justify-between px-5 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28">
          <div className="flex items-start justify-between gap-6">
            <motion.p
              className="mono-label max-w-[13rem] text-bone/55 sm:max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              {t.coverEyebrow}
            </motion.p>
            <motion.p
              className="mono-label hidden text-right text-bone/45 sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              {t.ownerName}
              <br />
              {t.city}
            </motion.p>
          </div>

          {/* the headline */}
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="pb-8">
            <h1
              className={cn(
                "display-xl max-w-[16ch] text-balance",
                lang === "fa" && "max-w-[14ch] text-[clamp(2.4rem,9vw,7rem)] leading-[1.08]"
              )}
            >
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em] last:pb-0">
                  <motion.span
                    className={cn("inline-block", i === 2 && "italic")}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.11, duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </motion.div>

          {/* meta strip */}
          <motion.div
            className="flex flex-wrap items-end justify-between gap-4 border-t border-bone/15 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.span
                className="block h-8 w-px bg-bone/40"
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ originY: 0 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── statement ──────────────────────────────────────────── */}
      <section className="relative border-t border-bone/10 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <p className="mono-label lg:col-span-2 text-bone/35">(01)</p>
          <div className="lg:col-span-8">
            <motion.p
              className="font-display text-[1.5rem] leading-[1.35] tracking-tight text-balance text-bone/90 sm:text-[2.15rem]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.coverIntro}
            </motion.p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 border border-bone/25 px-5 py-3 transition-colors hover:border-bone/60"
              >
                <span className="mono-label">{t.coverEnter}</span>
                <span className="arrow-step text-sm">{lang === "fa" ? "←" : "→"}</span>
              </Link>
              <Link
                to="/journal"
                className="mono-label text-bone/50 underline-draw hover:text-bone"
              >
                {t.navJournal}
              </Link>
            </div>
          </div>
          <div className="hidden lg:col-span-2 lg:block">
            <p className="mono-label text-right text-bone/30">
              {String(Math.round(progress * 100)).padStart(3, "0")}
            </p>
          </div>
        </div>
      </section>

      {/* ── room directory ─────────────────────────────────────── */}
      <section className="relative border-t border-bone/10 px-5 pb-24 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="display-md">{t.indexTitle}</h2>
            <p className="hidden max-w-xs text-right text-xs leading-relaxed text-bone/45 sm:block">
              {t.indexSubtitle}
            </p>
          </div>

          <ul className="border-t border-bone/12">
            {ROOMS.map((room, i) => (
              <motion.li
                key={room.key}
                className="group border-b border-bone/12"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={room.path} className="flex items-center gap-4 py-5 sm:gap-8 sm:py-6">
                  <span className="mono-label w-7 shrink-0 text-bone/30">{room.number}</span>

                  {/* hover thumbnail */}
                  <span className="relative hidden h-14 w-20 shrink-0 overflow-hidden sm:block">
                    <img
                      src={ROOM_IMAGES[i]}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover opacity-0 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </span>

                  <span
                    className={cn(
                      "font-display text-[1.9rem] leading-none tracking-tight transition-all duration-500 group-hover:translate-x-1.5 sm:text-[3.1rem]",
                      lang === "fa" && "text-[1.5rem] sm:text-[2.4rem]"
                    )}
                  >
                    {roomLabel(room.key, lang)}
                  </span>

                  <span className="mono-label ml-auto hidden shrink-0 text-bone/30 sm:block">
                    {ROOM_META[i][lang]}
                  </span>
                  <span className="ml-auto text-bone/30 transition-transform duration-500 group-hover:translate-x-1 sm:ml-6">
                    {lang === "fa" ? "←" : "→"}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── colophon strip ─────────────────────────────────────── */}
      <section className="border-t border-bone/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-2 text-[11px] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label">{t.footerCredit.replace("{year}", String(new Date().getFullYear()))}</p>
          <p className="mono-label">{t.footerTagline}</p>
        </div>
      </section>
    </div>
  );
}

const ROOM_IMAGES = [
  "/art/hero.jpg",
  "/art/worlds-01.jpg",
  "/art/ai-01.jpg",
  "/art/ai-05.jpg",
  "/art/worlds-04.jpg",
  "/art/hero.jpg",
];

const ROOM_META: Record<Lang, string>[] = [
  { en: "Websites · identity · code", fa: "وب‌سایت · هویت · کد" },
  { en: "3D · Unreal · real-time", fa: "سه‌بعدی · Unreal · بلادرنگ" },
  { en: "Generative images", fa: "تصویر مولد" },
  { en: "Music · score · sound", fa: "موسیقی · متن · صدا" },
  { en: "The person behind it", fa: "آدمِ پشت آن" },
  { en: "Say hello", fa: "سلام کنید" },
];
