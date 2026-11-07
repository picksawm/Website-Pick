import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Room from "../components/shell/Room";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { type Post } from "../types";
import { cn } from "../utils/cn";

/** post.color holds Tailwind gradient classes (server-derived) — unusable
 *  inside a raw CSS gradient, so fallbacks use a fixed tint per type. */
const tint = (type: Post["type"]) =>
  type === "video" ? "rgba(127,220,255,0.30)" : type === "music" ? "rgba(216,255,62,0.22)" : "rgba(255,90,43,0.30)";

type Filter = "all" | Post["type"];

interface JournalRoomProps {
  lang: Lang;
  posts: Post[];
  isAdmin: boolean;
  onPostClick: (post: Post) => void;
  onDeletePost: (id: string) => void | Promise<void>;
  onAdminOpen: () => void;
}

/**
 * JOURNAL — 07 (the old Feed, rebuilt)
 * Art direction: a studio wall of pinned fragments — mixed sizes, a
 * warm near-black ground, typewriter metadata. Keeps the existing
 * Worker/D1 posts API and admin CRUD exactly as they were.
 */
export default function JournalRoom({
  lang,
  posts,
  isAdmin,
  onPostClick,
  onDeletePost,
  onAdminOpen,
}: JournalRoomProps) {
  const t = SITE_TEXTS[lang];
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.journalFilterAll },
    { id: "image", label: t.journalFilterImage },
    { id: "video", label: t.journalFilterVideo },
    { id: "music", label: t.journalFilterMusic },
  ];

  return (
    <Room tone="room-sound" lang={lang}>
      {/* ── masthead ─────────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow" style={{ color: "var(--room-accent)" }}>
              {t.journalEyebrow}
            </p>
            <div className="flex items-center gap-4">
              <p className="mono-label opacity-40">
                {posts.length} {lang === "fa" ? "مورد" : "entries"}
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onAdminOpen}
                  className="mono-label rounded-full border px-3 py-1.5 transition-colors"
                  style={{ borderColor: "var(--room-accent)", color: "var(--room-accent)" }}
                >
                  + {t.journalAdminAdd}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-8 pt-9 lg:grid-cols-12 lg:items-end">
            <h1
              className={cn(
                "display-lg max-w-[14ch] text-balance lg:col-span-8",
                lang === "fa" && "text-[clamp(1.9rem,6vw,4.4rem)] leading-[1.16]"
              )}
            >
              {t.journalTitle}
            </h1>
            <p className="text-pretty text-sm leading-relaxed opacity-60 lg:col-span-4">
              {t.journalSubtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "mono-label rounded-full border px-3.5 py-1.5 transition-all duration-300",
                  filter === f.id
                    ? "border-[color:var(--room-accent)] text-[color:var(--room-accent)]"
                    : "opacity-45 hover:opacity-90"
                )}
                style={filter === f.id ? undefined : { borderColor: "var(--room-line)" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── the wall ─────────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          {filtered.length === 0 ? (
            <div className="flex min-h-[38vh] flex-col items-center justify-center border text-center" style={{ borderColor: "var(--room-line)" }}>
              <p className="mono-label opacity-35">{t.journalEmpty}</p>
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("group relative", i % 5 === 0 && "sm:col-span-2")}
                >
                  <button
                    type="button"
                    onClick={() => onPostClick(post)}
                    className="block w-full text-left"
                  >
                    <div className="relative overflow-hidden bg-white/[0.04]">
                      <div className={cn("overflow-hidden", i % 5 === 0 ? "aspect-[16/10]" : "aspect-[4/5]")}>
                        <PostMedia post={post} eager={i < 2} />
                      </div>
                      <span
                        className="absolute left-3 top-3 flex h-6 items-center px-2 text-[9px] tracking-wider"
                        style={{ background: "rgba(8,7,6,0.72)", color: "var(--room-accent)", backdropFilter: "blur(4px)" }}
                      >
                        {post.type === "image" ? "IMG" : post.type === "video" ? "VID" : "AUD"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h2 className="text-sm font-medium leading-snug opacity-90">{post.title}</h2>
                      {post.description && (
                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed opacity-45">
                          {post.description}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center gap-3 text-[10px] opacity-35">
                        <span className="font-mono">{new Date(post.timestamp).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-GB")}</span>
                        <span>·</span>
                        <span>♥ {post.likes}</span>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full border px-1.5 py-0.5" style={{ borderColor: "var(--room-line)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      className="absolute right-2 top-2 hidden h-7 items-center rounded-full bg-black/70 px-2.5 text-[10px] text-white/80 backdrop-blur transition-colors hover:bg-red-600 hover:text-white group-hover:flex"
                    >
                      {t.journalAdminDelete}
                    </button>
                  )}
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: "var(--room-line)" }}>
            <Link to="/" className="mono-label opacity-40 underline-draw hover:opacity-90">
              ← {t.journalBackHome}
            </Link>
            <a
              href="https://www.instagram.com/picksawm/"
              target="_blank"
              rel="noopener noreferrer me"
              className="mono-label opacity-40 underline-draw hover:opacity-90"
            >
              Instagram @picksawm
            </a>
          </div>
        </div>
      </section>
    </Room>
  );
}

function PostMedia({ post, eager }: { post: Post; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  if (post.type === "video" && post.mediaUrl) {
    return (
      <video
        src={post.mediaUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
        onMouseLeave={(e) => e.currentTarget.pause()}
      />
    );
  }
  if (post.mediaUrl && !failed) {
    return (
      <img
        src={post.mediaUrl}
        alt={post.title}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={() => setFailed(true)}
      />
    );
  }
  // designed fallback — no broken image icon, ever
  return (
    <div
      className="flex h-full w-full items-end p-4"
      style={{
        background: `radial-gradient(120% 90% at 25% 15%, ${tint(post.type)} 0%, transparent 65%), #0b0a09`,
      }}
    >
      <p className="font-display text-2xl leading-tight opacity-85">{post.title}</p>
    </div>
  );
}
