import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { type Post, typeLabels } from "../types";

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

/**
 * PostModal — the journal's lightbox. Rebuilt for the new art direction:
 * bone paper, display serif, native media controls (no custom player),
 * and an obvious designed fallback when a post has no media attached.
 */
export default function PostModal({ post, onClose }: PostModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden bg-[#f4f1ea] text-[#121110] md:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/80 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {/* media */}
        <div className="relative flex min-h-[42svh] items-center justify-center bg-[#0d0c0b] md:w-[52%]">
          {post.mediaUrl && !mediaFailed ? (
            post.type === "image" ? (
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="max-h-[92svh] w-full object-contain"
                onError={() => setMediaFailed(true)}
              />
            ) : post.type === "video" ? (
              <video
                src={post.mediaUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[92svh] w-full"
                onError={() => setMediaFailed(true)}
              />
            ) : (
              <div className="w-full p-8">
                <p className="mono-label mb-4 text-[#f4f1ea]/45">AUDIO</p>
                <audio src={post.mediaUrl} controls className="w-full" onError={() => setMediaFailed(true)} />
                <p className="mt-4 font-display text-2xl text-[#f4f1ea]">{post.title}</p>
              </div>
            )
          ) : (
            <div
              className="flex h-full min-h-[42svh] w-full items-end p-7"
              style={{
                background: `radial-gradient(120% 90% at 25% 15%, ${
                  post.type === "video"
                    ? "rgba(127,220,255,0.30)"
                    : post.type === "music"
                      ? "rgba(216,255,62,0.22)"
                      : "rgba(255,90,43,0.30)"
                } 0%, transparent 65%), #0d0c0b`,
              }}
            >
              <p className="font-display text-3xl leading-tight text-[#f4f1ea]">{post.title}</p>
            </div>
          )}

          <span className="mono-label absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-[9px] text-white/85 backdrop-blur">
            {typeLabels[post.type]}
          </span>
        </div>

        {/* details */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
          <p className="mono-label opacity-45">
            {new Date(post.timestamp).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h2>

          {post.description && (
            <p className="mt-5 text-sm leading-relaxed opacity-70">{post.description}</p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono-label rounded-full border border-black/15 px-2.5 py-1 text-[9px] opacity-60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-3 border-t border-black/12 pt-5">
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className={`flex items-center gap-2 border px-4 py-2.5 text-xs font-medium transition-colors ${
                liked
                  ? "border-[#121110] bg-[#121110] text-[#f4f1ea]"
                  : "border-black/20 text-[#121110]/75 hover:border-black/45"
              }`}
            >
              <span aria-hidden>{liked ? "♥" : "♡"}</span>
              {(post.likes ?? 0) + (liked ? 1 : 0)}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto mono-label opacity-45 underline-draw hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
