import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import Room from "../components/shell/Room";
import { PROJECTS, WORK_KINDS, t as tx, type WorkKind } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import Art from "../components/ui/Art";
import Unfold from "../components/scroll/Unfold";
import { cn } from "../utils/cn";

/**
 * WORK — 01
 * Art direction: a printed monograph. Warm paper, ink text, hairline
 * rules, a numbered index. Images are treated as plates with captions,
 * and the "selected work" strip is a physical contact sheet you drag.
 */
export default function WorkRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [filter, setFilter] = useState<WorkKind | "all">("all");
  const stripRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const projects = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.kind === filter);

  const dragTo = (dir: 1 | -1) => {
    stripRef.current?.scrollBy({ left: dir * Math.min(window.innerWidth * 0.72, 720), behavior: "smooth" });
  };

  return (
    <Room tone="room-work" lang={lang} current="work">
      {/* ── masthead ─────────────────────────────────────────── */}
      <section ref={heroRef} className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow opacity-60">01 — {t.navWork}</p>
            <p className="mono-label opacity-45">
              {PROJECTS.length} {lang === "fa" ? "پروژه" : "projects"} · 2023 — 2026
            </p>
          </div>

          <h1
            className={cn(
              "display-xl mt-8 max-w-[13ch] text-balance",
              lang === "fa" && "text-[clamp(2.2rem,7.6vw,5.4rem)] leading-[1.1]"
            )}
          >
            {t.workTitle}
          </h1>

          <div className="mt-10 grid gap-8 border-t pt-6 sm:grid-cols-12" style={{ borderColor: "var(--room-line)" }}>
            <p className="reveal text-pretty text-sm leading-relaxed opacity-70 sm:col-span-5 sm:text-[0.95rem]">
              {t.workLead}
            </p>
            <p className="reveal font-display text-lg leading-snug text-balance opacity-90 sm:col-span-5 sm:text-2xl" data-reveal-delay="90">
              “{t.workStatement}”
            </p>
            <div className="mono-label hidden flex-col gap-1 text-right opacity-40 sm:col-span-2 sm:flex">
              <span>الوان</span>
              <span>Ink / paper</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── hero plate ───────────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <motion.figure className="group relative overflow-hidden" style={{ y: plateY }}>
            {/* the monograph opens like a spread — blinds part from the spine */}
            <Unfold
              variant="pages"
              src="/art/hero.jpg"
              alt={tx(PROJECTS[0].title, lang)}
              priority
              className="aspect-[16/10] w-full sm:aspect-[21/9]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 60%, rgba(20,19,15,0.35) 100%)" }}
              />
            </Unfold>
            <figcaption
              className="flex flex-wrap items-baseline justify-between gap-3 border-b py-3 text-[11px]"
              style={{ borderColor: "var(--room-line)", color: "var(--room-dim)" }}
            >
              <span className="mono-label">Fig. 01 — {tx(PROJECTS[0].title, lang)}</span>
              <span>{tx(PROJECTS[0].summary, lang)}</span>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ── contact sheet (draggable strip) ──────────────────── */}
      <section className="overflow-hidden py-16 sm:py-24">
        <div className="mx-auto mb-6 flex max-w-[1680px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8">
          <div>
            <h2 className="display-md">{t.workSelected}</h2>
            <p className="mono-label mt-3 opacity-45">{t.workScrollNote}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dragTo(-1)}
              aria-label={t.prevRoom}
              className="flex h-11 w-8 items-center justify-center border-b transition-colors hover:border-[color:var(--room-fg)]"
              style={{ borderColor: "var(--room-line)" }}
            >
              {lang === "fa" ? "→" : "←"}
            </button>
            <button
              type="button"
              onClick={() => dragTo(1)}
              aria-label={t.nextRoom}
              className="flex h-11 w-8 items-center justify-center border-b transition-colors hover:border-[color:var(--room-fg)]"
              style={{ borderColor: "var(--room-line)" }}
            >
              {lang === "fa" ? "←" : "→"}
            </button>
          </div>
        </div>

        <div
          ref={stripRef}
          className="no-scrollbar drag-cursor flex gap-4 overflow-x-auto px-5 pb-4 sm:gap-6 sm:px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="group relative w-[76vw] shrink-0 sm:w-[42vw] lg:w-[31vw]"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <Art
                    src={p.image}
                    alt={tx(p.title, lang)}
                    priority={i < 2}
                    className="ken-burns"
                  />
                </div>
                <span
                  className="pointer-events-none absolute left-3 top-3 flex h-7 items-center bg-[color:var(--room-bg)] px-2 text-[10px] font-medium"
                  style={{ color: "var(--room-fg)" }}
                >
                  {p.index}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-3 border-b pb-2" style={{ borderColor: "var(--room-line)" }}>
                <h3 className="font-display text-xl leading-tight sm:text-2xl">{tx(p.title, lang)}</h3>
                <span className="mono-label shrink-0 opacity-45">{p.year}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed opacity-60">{tx(p.summary, lang)}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="plate"
                    style={{ borderColor: "var(--room-line)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </section>

      {/* ── index table ──────────────────────────────────────── */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <h2 className="display-md">{lang === "fa" ? "فهرست" : "Index"}</h2>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                {t.workFilterAll}
              </FilterChip>
              {WORK_KINDS.map((k) => (
                <FilterChip key={k.id} active={filter === k.id} onClick={() => setFilter(k.id)}>
                  {tx(k.label, lang)}
                </FilterChip>
              ))}
            </div>
          </div>

          <ul>
            {projects.map((p) => (
              <li key={p.id} className="reveal border-b" style={{ borderColor: "var(--room-line)" }}>
                <div className="group grid grid-cols-12 items-center gap-3 py-4 sm:py-5">
                  <span className="mono-label col-span-2 opacity-35 sm:col-span-1">{p.index}</span>
                  <div className="col-span-10 sm:col-span-4">
                    <h3 className="font-display text-xl leading-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-[1.7rem]">
                      {tx(p.title, lang)}
                    </h3>
                  </div>
                  <p className="col-span-12 text-xs opacity-55 sm:col-span-3 sm:text-[0.8rem]">
                    {tx(p.role, lang)}
                  </p>
                  <p className="mono-label col-span-6 opacity-45 sm:col-span-2">{p.tags[0]}</p>
                  <p className="mono-label col-span-3 text-right opacity-45 sm:col-span-1">{p.year}</p>
                  <div className="col-span-3 flex justify-end sm:col-span-1">
                    <span className="plate opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      ↗
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── process ──────────────────────────────────────────── */}
      <section className="border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto max-w-[1680px]">
          <h2 className="display-md mb-10 max-w-[18ch]">{t.workProcessTitle}</h2>
          <ol className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--room-line)" }}>
            {[
              [t.workProcess1Title, t.workProcess1Body],
              [t.workProcess2Title, t.workProcess2Body],
              [t.workProcess3Title, t.workProcess3Body],
              [t.workProcess4Title, t.workProcess4Body],
            ].map(([title, body], i) => (
              <li key={title} className="reveal p-6 sm:p-7" style={{ background: "var(--room-bg)" }} data-reveal-delay={String(i * 80)}>
                <p className="mono-label mb-8 opacity-30">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-xl leading-tight">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed opacity-60">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-8 sm:px-8">
        <div className="mx-auto max-w-[1680px] text-right">
          <Link to="/worlds" className="mono-label opacity-40 underline-draw hover:opacity-100">
            {lang === "fa" ? "بعدی — دنیاها" : "Next — Worlds"} ↗
          </Link>
        </div>
      </section>
    </Room>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mono-label border-b px-0.5 py-1 transition-colors duration-300",
        active ? "border-transparent bg-[color:var(--room-fg)] text-[color:var(--room-bg)]" : "opacity-55 hover:opacity-100"
      )}
      style={active ? undefined : { borderColor: "var(--room-line)" }}
    >
      {children}
    </button>
  );
}
