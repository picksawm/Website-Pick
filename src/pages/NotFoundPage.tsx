import { Link } from "react-router-dom";
import { ROOMS, roomLabel } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { cn } from "../utils/cn";

export default function NotFoundPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];

  return (
    <div id="room" className="room-sound relative flex min-h-[100svh] flex-col justify-between px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
      <div aria-hidden className="grain-layer pointer-events-none fixed inset-0 z-[1]" />

      <div className="relative z-[2] mx-auto w-full max-w-[1680px]">
        <p className="eyebrow opacity-40">{t.notFoundHint}</p>
        <h1
          className={cn(
            "display-xl mt-6 max-w-[12ch] text-balance",
            lang === "fa" && "text-[clamp(2rem,7vw,4.8rem)] leading-[1.14]"
          )}
        >
          {t.notFoundTitle}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed opacity-60">{t.notFoundBody}</p>

        <Link
          to="/"
          className="group mt-9 inline-flex items-center gap-3 border px-5 py-3 transition-colors hover:bg-bone hover:text-[#070607]"
          style={{ borderColor: "var(--room-line)" }}
        >
          <span className="mono-label">{t.notFoundHome}</span>
          <span className="arrow-step text-xs">{lang === "fa" ? "←" : "→"}</span>
        </Link>
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-[1680px]">
        <ul className="grid grid-cols-2 gap-x-8 border-t pt-4 sm:grid-cols-3" style={{ borderColor: "var(--room-line)" }}>
          {ROOMS.map((r) => (
            <li key={r.path} className="py-2">
              <Link to={r.path} className="group flex items-baseline justify-between gap-3 text-sm">
                <span className="opacity-65 transition-opacity group-hover:opacity-100">
                  {roomLabel(r.key, lang)}
                </span>
                <span className="mono-label opacity-25">{r.number}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
