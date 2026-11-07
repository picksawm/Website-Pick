import { useRef, useState } from "react";
import { motion } from "motion/react";
import Room from "../components/shell/Room";
import { WORLDS, t as tx } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { usePointer, useElementProgress } from "../lib/motion";
import Unfold from "../components/scroll/Unfold";
import { cn } from "../utils/cn";

/**
 * WORLDS — 02
 * Art direction: a projection room. Near-black, letterboxed 21:9
 * plates, film-leader numerals, everything monospaced and technical.
 * Plates drift against scroll and lean with the pointer, so the page
 * feels like a camera move rather than a document.
 */
export default function WorldsRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const pointer = usePointer();

  return (
    <Room tone="room-worlds" lang={lang} current="worlds">
      {/* ── opening slate ────────────────────────────────────── */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow text-[color:var(--room-accent)]">02 — {t.navWorlds}</p>
            <p className="mono-label opacity-40">
              {WORLDS.length} {t.worldsCount} · 4K · 24 fps
            </p>
          </div>

          <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:items-end">
            <h1
              className={cn(
                "display-lg max-w-[15ch] text-balance lg:col-span-8",
                lang === "fa" && "text-[clamp(1.9rem,6vw,4.4rem)] leading-[1.15]"
              )}
            >
              {t.worldsTitle}
            </h1>
            <div className="lg:col-span-4">
              <p className="text-pretty text-sm leading-relaxed opacity-65">{t.worldsLead}</p>
              <p className="mono-label mt-6 flex items-center gap-2 opacity-35">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--room-accent)] animate-blink" />
                {t.worldsHint}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── plates ───────────────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1680px] space-y-16 sm:space-y-24">
          {WORLDS.map((world, i) => (
            <WorldPlate key={world.id} world={world} lang={lang} index={i} pointer={pointer} />
          ))}
        </div>
      </section>

      {/* ── pipeline strip ───────────────────────────────────── */}
      <section className="border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="eyebrow opacity-45">{t.worldsStackLabel}</p>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            {[
              ["Unreal Engine 5", "Lumen · Nanite · Sequencer"],
              ["Blender / Houdini", "Modelling · procedural scatter"],
              ["Substance / Quixel", "Materials at scale"],
              ["DaVinci / Nuke", "Grade · composite"],
              ["Realtime exports", "WebGL · video · print"],
              ["Sound pass", "Ambience scored to picture"],
            ].map(([name, detail], i) => (
              <div key={name} className="reveal border-t pt-3" style={{ borderColor: "var(--room-line)" }} data-reveal-delay={String(i * 60)}>
                <p className="text-sm font-medium">{name}</p>
                <p className="mono-label mt-1 opacity-40">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Room>
  );
}

function WorldPlate({
  world,
  lang,
  index,
  pointer,
}: {
  world: (typeof WORLDS)[number];
  lang: Lang;
  index: number;
  pointer: { x: number; y: number };
}) {
  const { ref, progress } = useElementProgress<HTMLDivElement>();
  const imgRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // subtle counter-scroll inside the letterbox, folded into the <Art> wrapper
  const shift = (progress - 0.5) * 12;
  const tiltX = pointer.y * (hover ? 1.4 : 0.7);
  const tiltY = pointer.x * (hover ? 1.4 : 0.7);
  const wide = index % 2 === 0;

  return (
    <div ref={ref} className="group">
      <div
        className={cn("relative mx-auto", wide ? "w-full" : "w-full sm:w-[84%]")}
        style={{ perspective: "1400px" }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <motion.div
          ref={imgRef}
          className="relative overflow-hidden"
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* the projector's shutter opens as the plate comes up */}
          <div
            className="w-full"
            style={{ transform: `translateY(${shift.toFixed(2)}px)` }}
          >
            <Unfold
              variant="aperture"
              src={world.image}
              alt={tx(world.title, lang)}
              priority={index === 0}
              className="aspect-[21/10] w-full sm:aspect-[21/9]"
            />
          </div>

          {/* vignette + film edge */}
          <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* film-leader numeral */}
          <span
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border text-[11px] font-medium tracking-wider"
            style={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.85)" }}
          >
            {world.index}
          </span>
        </motion.div>

        {/* caption row */}
        <div
          className="mt-4 grid gap-3 border-b pb-3 sm:grid-cols-12"
          style={{ borderColor: "var(--room-line)" }}
        >
          <h2
            className={cn(
              "font-display text-2xl leading-none tracking-tight sm:col-span-4 sm:text-[2.2rem]",
              lang === "fa" && "text-xl sm:text-2xl"
            )}
          >
            {tx(world.title, lang)}
          </h2>
          <p className="text-xs leading-relaxed opacity-60 sm:col-span-5">{tx(world.caption, lang)}</p>
          <div className="flex flex-wrap items-start justify-between gap-2 sm:col-span-3 sm:justify-end">
            <span className="mono-label opacity-40">{tx(world.place, lang)}</span>
            <span className="mono-label opacity-40">{world.year}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {world.stack.map((s) => (
            <span
              key={s}
              className="mono-label rounded-full border px-2.5 py-1 text-[9px]"
              style={{ borderColor: "var(--room-line)", color: "var(--room-accent)", opacity: 0.75 }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
