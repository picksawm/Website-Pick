import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Room from "../components/shell/Room";
import { ALBUMS, t as tx, type Album, type Track } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import Unfold from "../components/scroll/Unfold";
import { cn } from "../utils/cn";

/**
 * SOUND — 04
 * Art direction: a listening room at 3 a.m. Pure black, ember accent,
 * one album at a time on a large sleeve, a real tracklist, and a
 * waveform built from CSS only. Missing audio degrades to a designed,
 * obviously-intentional placeholder instead of a broken control.
 */
export default function SoundRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [albumIndex, setAlbumIndex] = useState(0);
  const album = ALBUMS[albumIndex];

  return (
    <Room tone="room-sound" lang={lang} current="sound">
      {/* ── room header ──────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow" style={{ color: "var(--room-accent)" }}>
              04 — {t.navSound}
            </p>
            <p className="mono-label opacity-40">
              {ALBUMS.length} {lang === "fa" ? "آلبوم" : "releases"} · {ALBUMS.reduce((n, a) => n + a.tracks.length, 0)}{" "}
              {lang === "fa" ? "قطعه" : "tracks"}
            </p>
          </div>

          <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:items-end">
            <h1
              className={cn(
                "display-lg max-w-[14ch] text-balance lg:col-span-8",
                lang === "fa" && "text-[clamp(1.9rem,6vw,4.4rem)] leading-[1.16]"
              )}
            >
              {t.soundTitle}
            </h1>
            <p className="text-pretty text-sm leading-relaxed opacity-65 lg:col-span-4">{t.soundLead}</p>
          </div>
        </div>
      </section>

      {/* ── sleeve + tracklist ───────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12 lg:gap-14">
          {/* left: sleeves */}
          <div className="lg:col-span-5">
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <Sleeve album={album} lang={lang} />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className={cn("font-display text-2xl leading-tight sm:text-3xl", lang === "fa" && "text-xl")}>
                    {tx(album.title, lang)}
                  </h2>
                  <p className="mono-label mt-1 opacity-45">
                    {tx(album.kind, lang)} · {album.year}
                  </p>
                </div>
                <span className="mono-label shrink-0 opacity-30">
                  {String(albumIndex + 1).padStart(2, "0")}/{String(ALBUMS.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 max-w-md text-xs leading-relaxed opacity-55">{tx(album.note, lang)}</p>
            </motion.div>

            {/* album switcher */}
            <div className="mt-8 flex flex-wrap gap-2">
              {ALBUMS.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAlbumIndex(i)}
                  className={cn(
                    "mono-label border-b px-0.5 py-1 transition-colors duration-300",
                    i === albumIndex
                      ? "border-[color:var(--room-accent)] text-[color:var(--room-accent)]"
                      : "opacity-45 hover:opacity-90"
                  )}
                  style={i === albumIndex ? undefined : { borderColor: "var(--room-line)" }}
                >
                  {tx(a.title, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* right: player + tracklist */}
          <div className="lg:col-span-7">
            <Player key={album.id} album={album} lang={lang} />
          </div>
        </div>
      </section>

      {/* ── sound design ─────────────────────────────────────── */}
      <section className="mt-20 border-t px-5 py-16 sm:px-8 sm:py-24" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display-md max-w-[14ch]">{t.soundSoundDesignTitle}</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-xl text-pretty text-sm leading-relaxed opacity-65">{t.soundSoundDesignBody}</p>
            <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {[
                ["Stormblade", "Game — main theme, ambience"],
                ["The Iwan", "Trailer — 90s cut"],
                ["Concrete Garden", "Brand film — score"],
                ["Night Archive", "Exhibition — sound design"],
              ].map(([name, detail], i) => (
                <div key={name} className="reveal flex items-baseline justify-between gap-3 border-b pb-2" style={{ borderColor: "var(--room-line)" }} data-reveal-delay={String(i * 70)}>
                  <span className="text-sm">{name}</span>
                  <span className="mono-label text-right opacity-40">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Room>
  );
}

/* ───────────────────────── sleeve ───────────────────────── */

function Sleeve({ album, lang }: { album: Album; lang: Lang }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <Unfold
        variant="curtain"
        src={album.image}
        alt={tx(album.title, lang)}
        priority
        className="h-full w-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
      {/* vinyl peeking out */}
      <div
        aria-hidden
        className="absolute -right-3 top-1/2 hidden h-[86%] w-[86%] -translate-y-1/2 rounded-full border border-white/10 sm:block"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px), radial-gradient(circle at 50% 50%, #14100e 0 30%, #080706 60%)",
          zIndex: -1,
        }}
      />
    </div>
  );
}

/* ───────────────────────── player ───────────────────────── */

function Player({ album, lang }: { album: Album; lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track: Track = album.tracks[trackIndex];
  const hasAudio = Boolean(track.src);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [track.id]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, track.id]);

  const toggle = () => {
    if (!hasAudio) return;
    setPlaying((p) => !p);
  };

  /** the decorative waveform — same bars, active ones scale with progress */
  const bars = Array.from({ length: 72 }, (_, i) => {
    const seed = Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.43) * 0.5;
    return 0.22 + Math.abs(seed) * 0.78;
  });

  return (
    <div className="border" style={{ borderColor: "var(--room-line)" }}>
      {/* now playing */}
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5" style={{ borderColor: "var(--room-line)" }}>
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            disabled={!hasAudio}
            aria-label={playing ? t.soundPause : t.soundPlay}
            className={cn(
              "flex h-11 w-9 shrink-0 items-center justify-center border-b transition-all",
              hasAudio
                ? "border-[color:var(--room-accent)] text-[color:var(--room-accent)] hover:bg-[color:var(--room-accent)] hover:text-black"
                : "cursor-not-allowed border-white/15 text-white/25"
            )}
          >
            {playing ? (
              <span className="flex gap-1">
                <span className="block h-3 w-[3px] bg-current" />
                <span className="block h-3 w-[3px] bg-current" />
              </span>
            ) : (
              <span
                className="ml-0.5 block h-0 w-0"
                style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid currentColor" }}
              />
            )}
          </button>
          <div className="min-w-0">
            <p className="mono-label opacity-35">{t.soundNowPlaying}</p>
            <p className="truncate text-sm font-medium">{tx(track.title, lang)}</p>
          </div>
        </div>
        <div className="mono-label shrink-0 text-right opacity-40">
          {hasAudio ? track.length : "—:—"}
        </div>
      </div>

      {/* waveform */}
      <div className="relative px-4 py-5 sm:px-5">
        <div className="flex h-16 items-center gap-[2px] sm:h-20 sm:gap-[3px]">
          {bars.map((h, i) => {
            const active = i / bars.length <= progress || (!hasAudio && i / bars.length <= 0.45);
            return (
              <span
                key={i}
                className="flex-1 rounded-full transition-colors duration-500"
                style={{
                  height: `${h * 100}%`,
                  background: active ? "var(--room-accent)" : "rgba(242,237,230,0.16)",
                  opacity: active ? (playing ? 0.95 : 0.65) : 1,
                }}
              />
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={progress * 100}
          onChange={(e) => {
            const v = Number(e.target.value) / 100;
            setProgress(v);
            if (audioRef.current && audioRef.current.duration) {
              audioRef.current.currentTime = audioRef.current.duration * v;
            }
          }}
          disabled={!hasAudio}
          aria-label="Seek"
          className="absolute inset-x-4 bottom-0 h-8 cursor-pointer opacity-0 disabled:cursor-not-allowed sm:inset-x-5"
        />
        {!hasAudio && (
          <p className="mono-label mt-3 opacity-30">{t.soundPlaceholderNote}</p>
        )}
        {hasAudio && (
          <audio
            ref={audioRef}
            src={track.src}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration) setProgress(el.currentTime / el.duration);
            }}
            onEnded={() => {
              setPlaying(false);
              setTrackIndex((i) => (i + 1) % album.tracks.length);
            }}
          />
        )}
      </div>

      {/* tracklist */}
      <div className="border-t" style={{ borderColor: "var(--room-line)" }}>
        <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
          <p className="mono-label opacity-40">{t.soundTracklist}</p>
          <p className="mono-label opacity-30">{album.tracks.length}</p>
        </div>
        <ul>
          {album.tracks.map((tr, i) => {
            const active = i === trackIndex;
            return (
              <li key={tr.id}>
                <button
                  type="button"
                  onClick={() => setTrackIndex(i)}
                  className={cn(
                    "group flex w-full items-center gap-3 border-t px-4 py-3 text-left transition-colors sm:px-5",
                    active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  )}
                  style={{ borderColor: "var(--room-line)" }}
                >
                  <span className={cn("mono-label w-6 shrink-0", active ? "text-[color:var(--room-accent)]" : "opacity-30")}>
                    {active && playing ? "▮▮" : tr.index}
                  </span>
                  <span className={cn("flex-1 text-sm", active ? "text-[color:var(--room-fg)]" : "opacity-70")}>
                    {tx(tr.title, lang)}
                  </span>
                  <span className="mono-label shrink-0 opacity-35">{tr.year}</span>
                  <span className="mono-label w-10 shrink-0 text-right opacity-45">{tr.length}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
