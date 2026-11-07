import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

interface VideoScrubProps {
  src: string;
  /** scroll progress 0..1 → currentTime */
  progress: number;
  poster?: string;
  alt: string;
  className?: string;
  /** start offset, so we can skip an encoder's black leader */
  offset?: number;
}

/**
 * VideoScrub — video driven by scroll position, never by playback.
 *
 * The `<video>` is muted, inline and paused for its whole life: we only
 * ever assign `currentTime`. That makes it scrub in both directions and
 * freeze the instant scrolling stops — exactly the required behaviour.
 *
 * Notes:
 *  • iOS needs a `play()` nudge before `currentTime` is honoured, then
 *    we immediately pause. That is handled in `prime()`.
 *  • Seeking is throttled to one assignment per animation frame; setting
 *    currentTime faster than the decoder can serve causes stutter.
 *  • If the browser cannot decode (or the file is missing) we fall back
 *    to the poster image rather than showing a black rectangle.
 */
export default function VideoScrub({
  src,
  progress,
  poster,
  alt,
  className,
  offset = 0,
}: VideoScrubProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const primed = useRef(false);
  const rafPending = useRef(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const prime = () => {
    const v = videoRef.current;
    if (!v || primed.current) return;
    primed.current = true;
    // Safari/iOS will not honour currentTime until the element has played
    v.play()
      .then(() => v.pause())
      .catch(() => {
        /* autoplay blocked — poster stays until user scrolls */
      });
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready || failed) return;
    if (rafPending.current) return;

    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const duration = v.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const target = offset + progress * Math.max(0, duration - offset);
      // small dead-band avoids thrashing the decoder on micro-scrolls
      if (Math.abs(v.currentTime - target) > 0.033) {
        v.currentTime = target;
      }
    });
  }, [progress, ready, failed, offset]);

  if (failed && poster) {
    return <img src={poster} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0b0c0e]", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        onLoadedMetadata={() => {
          setReady(true);
          prime();
        }}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
