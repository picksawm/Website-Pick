import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Room from "../components/shell/Room";
import {
  collectionsSorted,
  collectionCount,
  totalPublished,
  collectionPillars,
  tx,
} from "../config/collections";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { cn } from "../utils/cn";

/**
 * CollectionsPage — /work
 *
 * The index of the six Articksaw directions. Counts come from published
 * artwork data, so a collection with nothing published says so honestly
 * instead of showing fake thumbnails.
 */
export default function CollectionsPage({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const collections = collectionsSorted();
  const published = totalPublished();

  return (
    <Room tone="room-work" lang={lang} current="work">
      <section className="px-5 pb-10 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div
            className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
            style={{ borderColor: "var(--room-line)" }}
          >
            <p className="eyebrow opacity-60">Articksaw — {t.navWork}</p>
            <p className="mono-label opacity-45">
              {collections.length} {lang === "fa" ? "مجموعه" : "collections"} ·{" "}
              {published} {lang === "fa" ? "اثر منتشرشده" : "published works"}
            </p>
          </div>

          <h1 className="display-xl mt-8 max-w-[13ch] text-balance">
            {lang === "fa" ? "شش جهتِ یک هویت" : "Six directions, one hand"}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed opacity-70">
            {lang === "fa"
              ? "هر مجموعه یک جهت خلاقانه است، نه یک قالب بصری. هر اثر هویت خودش را نگه می‌دارد."
              : "Each collection is a creative direction, not a visual template. Every artwork keeps its own identity."}
          </p>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <ul className="border-t" style={{ borderColor: "var(--room-line)" }}>
            {collections.map((c, i) => {
              const count = collectionCount(c.id);
              const live = count > 0;
              return (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6%" }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b"
                  style={{ borderColor: "var(--room-line)" }}
                >
                  <Link
                    to={`/collections/${c.slug}`}
                    className="group grid grid-cols-12 items-baseline gap-3 py-6 sm:py-8"
                  >
                    <span className="mono-label col-span-2 opacity-30 sm:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="col-span-10 sm:col-span-5">
                      <h2
                        className={cn(
                          "font-display text-[1.7rem] leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 sm:text-[2.6rem]",
                          lang === "fa" && "text-xl sm:text-2xl"
                        )}
                      >
                        {tx(c.name, lang)}
                      </h2>
                      <p className="mono-label mt-2 opacity-45">{tx(c.tagline, lang)}</p>
                    </div>

                    <p className="col-span-12 mt-2 text-xs leading-relaxed opacity-55 sm:col-span-4 sm:mt-0">
                      {tx(c.character, lang)}
                    </p>

                    <div className="col-span-9 mt-2 flex flex-wrap gap-1.5 sm:col-span-1 sm:mt-0 sm:justify-end">
                      {collectionPillars(c)
                        .slice(0, 2)
                        .map((p) => (
                          <span
                            key={p.id}
                            className="mono-label rounded-full border px-2 py-0.5 text-[9px] opacity-45"
                            style={{ borderColor: "var(--room-line)" }}
                          >
                            {p.name.en.split(" ")[0]}
                          </span>
                        ))}
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2 sm:col-span-1">
                      <span className="mono-label opacity-40">
                        {live ? `${count}` : lang === "fa" ? "به‌زودی" : "soon"}
                      </span>
                      <span className="text-xs opacity-30 transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </Room>
  );
}
