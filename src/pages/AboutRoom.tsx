import { useRef, useState } from "react";
import Room from "../components/shell/Room";
import Unfold from "../components/scroll/Unfold";
import { ABOUT, CONTACT, t as tx } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { cn } from "../utils/cn";

/**
 * ABOUT — 05
 * Art direction: a magazine feature. A full-bleed portrait gatefold,
 * asymmetric columns, pull-quotes in display serif, and a ruled
 * timeline. Deliberately quieter than the other rooms — this is the
 * page that has to be readable.
 */
export default function AboutRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const portraitRef = useRef<HTMLDivElement>(null);
  const [imgFailed] = useState(false);

  return (
    <Room tone="room-about" lang={lang} current="about">
      {/* ── name plate ───────────────────────────────────────── */}
      <section className="px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow" style={{ color: "var(--room-accent)" }}>
              05 — {t.navAbout}
            </p>
            <p className="mono-label opacity-40">{t.aboutIdentity}</p>
          </div>

          <h1
            className={cn(
              "display-xl mt-8 max-w-[13ch] text-balance",
              lang === "fa" && "text-[clamp(2rem,7vw,4.8rem)] leading-[1.16]"
            )}
          >
            {lang === "fa" ? t.aboutTitle : "Amirehsan"}
            {lang === "fa" ? "" : <span className="italic"> Ashoori</span>}
          </h1>
          <p className="mono-label mt-4 opacity-45">
            {t.role} · {t.city}
          </p>
        </div>
      </section>

      {/* ── portrait + lead ──────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12 lg:gap-12">
          <div ref={portraitRef} className="lg:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181a1d] sm:aspect-[4/3] lg:aspect-[4/5]">
              {!imgFailed ? (
                /* the portrait opens like a hand: four quadrants splay out */
                <Unfold
                  variant="palms"
                  src={ABOUT.portrait}
                  alt={t.ownerName}
                  priority
                  className="h-full w-full"
                />
              ) : (
                <PortraitPlaceholder lang={lang} />
              )}
              <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.75)]" />
              <p className="absolute bottom-4 left-4 mono-label text-bone/60">
                {lang === "fa" ? "پرتره — تهران" : "Portrait — Tehran"}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-6">
            <p className="reveal text-pretty text-[0.95rem] leading-relaxed opacity-85">{t.aboutLead}</p>
            <p className="reveal mt-5 text-pretty text-[0.95rem] leading-relaxed opacity-60" data-reveal-delay="80">
              {t.aboutLead2}
            </p>

            <div className="mt-9 border-t pt-6" style={{ borderColor: "var(--room-line)" }}>
              <h2 className="mono-label mb-3 opacity-40">{t.aboutMeaningTitle}</h2>
              <p className="text-pretty text-sm leading-relaxed opacity-70">{t.aboutMeaning}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                className="group flex items-center gap-2 border px-4 py-2.5 text-xs transition-colors hover:bg-bone hover:text-[#101113]"
                style={{ borderColor: "var(--room-line)" }}
              >
                {t.aboutFollow}
                <span className="arrow-step">↗</span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mono-label flex items-center px-2 py-2.5 opacity-55 underline-draw hover:opacity-100"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── pull quote ───────────────────────────────────────── */}
      <section className="mt-20 border-y px-5 py-14 sm:px-8 sm:py-20" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto max-w-[1280px] text-center">
          <p className="reveal font-display text-[1.6rem] leading-[1.28] tracking-tight text-balance sm:text-[2.6rem]">
            “{t.aboutStyleNote}”
          </p>
        </div>
      </section>

      {/* ── disciplines ──────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-end justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <h2 className="display-md">{t.aboutDisciplinesTitle}</h2>
            <span className="mono-label opacity-35">{ABOUT.disciplines.length}</span>
          </div>

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--room-line)" }}>
            {ABOUT.disciplines.map((d, i) => (
              <div
                key={tx(d.name, "en")}
                className="reveal p-6 sm:p-7"
                style={{ background: "var(--room-bg)" }}
                data-reveal-delay={String((i % 3) * 70)}
              >
                <p className="mono-label mb-7 opacity-25">{String(i + 1).padStart(2, "0")}</p>
                <h3 className={cn("font-display text-xl leading-tight", lang === "fa" && "text-lg")}>{tx(d.name, lang)}</h3>
                <p className="mt-2 text-xs leading-relaxed opacity-60">{tx(d.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── style + skills ───────────────────────────────────── */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto grid max-w-[1680px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display-md mb-6 max-w-[10ch]">{t.aboutStyleTitle}</h2>
            <ul className="space-y-3">
              {ABOUT.style.map((s, i) => (
                <li key={tx(s, "en")} className="reveal flex items-baseline gap-3 border-b pb-3 text-sm" style={{ borderColor: "var(--room-line)" }} data-reveal-delay={String(i * 45)}>
                  <span className="mono-label shrink-0 opacity-25">{String(i + 1).padStart(2, "0")}</span>
                  <span className="opacity-80">{tx(s, lang)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="mono-label mb-6 opacity-40">{t.aboutSkillsTitle}</h2>
            <div className="flex flex-wrap gap-2">
              {ABOUT.skills.map((s, i) => (
                <span
                  key={tx(s, "en")}
                  className="reveal plate"
                  style={{ borderColor: "var(--room-line)", transitionDelay: `${(i % 8) * 35}ms` }}
                >
                  {tx(s, lang)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── timeline ─────────────────────────────────────────── */}
      <section className="border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto max-w-[1680px]">
          <h2 className="display-md mb-10">{t.aboutTimelineTitle}</h2>
          <ol className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--room-line)" }}>
            {ABOUT.timeline.map((item, i) => (
              <li key={item.year} className="reveal p-6" style={{ background: "var(--room-bg)" }} data-reveal-delay={String(i * 80)}>
                <p className="font-display text-3xl opacity-90">{item.year}</p>
                <h3 className="mt-4 text-sm font-medium">{tx(item.title, lang)}</h3>
                <p className="mt-2 text-xs leading-relaxed opacity-55">{tx(item.body, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Room>
  );
}

function PortraitPlaceholder({ lang }: { lang: Lang }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#141618]">
      <div className="px-8 text-center">
        <div
          className="mx-auto mb-6 h-24 w-24 rounded-full border border-bone/15"
          style={{ background: "radial-gradient(circle at 40% 35%, rgba(244,241,234,0.16), transparent 70%)" }}
        />
        <p className="mono-label text-bone/45">public/art/portrait.jpg</p>
        <p className="mt-2 max-w-[16rem] text-[11px] leading-relaxed text-bone/30">
          {lang === "fa"
            ? "پرتره را در این مسیر بگذارید — چیدمان خودش تطبیق می‌دهد."
            : "Drop your portrait at this path — the layout adapts automatically."}
        </p>
      </div>
    </div>
  );
}
