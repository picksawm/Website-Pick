import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ROOMS, roomLabel } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import StormLayer from "../components/storm/StormLayer";
import { cn } from "../utils/cn";

/**
 * CoverPage — the threshold, and the first "opening palm".
 *
 * Scroll behaviour: the cover starts as a narrow vertical slit of light
 * in the storm. As you scroll, the slit widens until the night avenue
 * fills the frame, the type recedes into the rain, and the room
 * directory rises out of the dark. The image is never static — it is
 * being opened, not scrolled past.
 */
export default function CoverPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const stage = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });

  // ── the opening ──────────────────────────────────────────────
  const slit = useTransform(scrollYProgress, [0, 0.62], ["47%", "0%"]);
  const clip = useTransform(slit, (v) => `inset(0% ${v} 0% ${v})`);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-4%", "6%"]);

  // ── weather pressure builds as you descend ───────────────────
  const veil = useTransform(scrollYProgress, [0, 0.75], [0.72, 0.18]);

  // ── type: survives the contraction, then rises into the rain ──
  const titleScale = useTransform(scrollYProgress, [0, 0.62], [1, 0.82]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const titleOpacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/art/hero.jpg";
    if (img.complete) setLoaded(true);
    else img.onload = () => setLoaded(true);
  }, []);

  const lines = [t.coverLine1, t.coverLine2, t.coverLine3];

  return (
    <div id="room" className="relative bg-[#06070a] text-bone">
      <StormLayer mode="dark" intensity={1.3} lightning />

      {/* ── the unfolding cover ─────────────────────────────────── */}
      <section ref={stage} className="relative h-[190svh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {/* image, revealed through a widening slit */}
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            <motion.img
              src="/art/hero.jpg"
              alt="Rain-soaked night avenue between brutalist towers, lit by Persian geometric neon"
              className="h-full w-full object-cover"
              style={{ scale: imgScale, y: imgY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              fetchPriority="high"
              draggable={false}
            />

            {/* the light that escapes the slit */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 50%, rgba(127,220,255,0.18) 0%, transparent 65%)",
              }}
            />
          </motion.div>

          {/* the dark that gets pushed aside */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#06070a]"
            style={{ opacity: veil }}
          />

          {/* slit edges — two cold blades of light */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0"
            style={{ left: useTransform(slit, (v) => `calc(${v} - 1px)`), opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
          >
            <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#c8e8ff] to-transparent shadow-[0_0_28px_rgba(127,220,255,0.9)]" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0"
            style={{ right: useTransform(slit, (v) => `calc(${v} - 1px)`), opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
          >
            <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#c8e8ff] to-transparent shadow-[0_0_28px_rgba(127,220,255,0.9)]" />
          </motion.div>

          {/* frame furniture + headline */}
          <div className="absolute inset-0 z-[6] flex flex-col justify-between px-5 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28">
            <motion.div className="flex items-start justify-between gap-6" style={{ opacity: kickerOpacity }}>
              <p className="mono-label max-w-[13rem] text-bone/55 sm:max-w-xs">{t.coverEyebrow}</p>
              <p className="mono-label hidden text-right text-bone/45 sm:block">
                {t.ownerName}
                <br />
                {t.city}
              </p>
            </motion.div>

            <motion.div
              style={{ y: titleY, scale: titleScale, opacity: titleOpacity, transformOrigin: "left bottom" }}
              className="pb-6"
            >
              <motion.h1
                className={cn(
                  "display-xl max-w-[15ch] text-balance",
                  lang === "fa" && "max-w-[14ch] text-[clamp(2.2rem,8.4vw,6.4rem)] leading-[1.1]"
                )}
              >
                {lines.map((line, i) => (
                  <span key={line} className="block pb-[0.06em] last:pb-0">
                    <motion.span
                      className={cn("inline-block", i === 2 && "italic")}
                      initial={{ y: "112%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </motion.div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-bone/15 pt-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* ── statement ──────────────────────────────────────────── */}
      <section className="relative border-t border-bone/10 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <p className="mono-label text-bone/35 lg:col-span-2">(01)</p>
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
              <Link to="/journal" className="mono-label text-bone/50 underline-draw hover:text-bone">
                {t.navJournal}
              </Link>
            </div>
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

                  <span className="relative hidden h-14 w-20 shrink-0 overflow-hidden sm:block">
                    <img
                      src={ROOM_IMAGES[i]}
                      alt=""
                      loading="lazy"
                      className="h-full w-full scale-110 object-cover opacity-0 grayscale transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0"
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

      {/* ── colophon ───────────────────────────────────────────── */}
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
