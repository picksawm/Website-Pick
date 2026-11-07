import { type ReactNode, useState } from "react";
import { cn } from "../../utils/cn";

/** One tiny inline placeholder — a geometric mark, never a broken image. */
const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <rect width="12" height="12" fill="#15171a"/>
      <circle cx="6" cy="6" r="2.2" fill="none" stroke="rgba(244,241,234,.22)" stroke-width="0.6"/>
      <path d="M0 12L12 0" stroke="rgba(244,241,234,.07)" stroke-width="0.5"/>
    </svg>`
  );

interface ArtProps {
  src: string;
  alt: string;
  className?: string;
  /** wrapper classes — the wrapper carries the aspect ratio */
  wrapperClassName?: string;
  priority?: boolean;
  /** what to render instead of the geometric placeholder */
  fallback?: ReactNode;
}

/**
 * Art — every image on the site goes through this.
 *
 * If a file is missing (a new project added to portfolio.ts before its
 * plate was dropped into public/art/), it degrades to a quiet geometric
 * placeholder instead of a browser broken-image icon. That keeps the
 * gallery-wall illusion intact while you're swapping in real work.
 */
export default function Art({
  src,
  alt,
  className,
  wrapperClassName,
  priority,
  fallback,
}: ArtProps) {
  const [failed, setFailed] = useState(false);

  if (failed && fallback)
    return (
      <span className={cn("relative block h-full w-full overflow-hidden", wrapperClassName)}>
        {fallback}
      </span>
    );

  return (
    <span className={cn("relative block h-full w-full overflow-hidden", wrapperClassName)}>
      <img
        src={failed ? PLACEHOLDER : src}
        alt={failed ? "" : alt}
        aria-hidden={failed || undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    </span>
  );
}

export { PLACEHOLDER as ART_PLACEHOLDER };
