import { useId } from "react";
import { WORDMARK } from "./wordmark.generated";

/**
 * Wordmark — the Picksaw mark, inline.
 *
 * Not type. The letters are Cormorant Garamond capitals, hand-tracked,
 * cut along a single blade, the upper fragment slipped out of place.
 * Geometry is generated at build time by scripts/build-wordmark.mjs and
 * inlined here, so the mark costs zero requests and inherits
 * `currentColor` — equally usable on ivory paper and on near-black.
 */
export default function Wordmark({
  className,
  title = "Picksaw",
  /** the sliced mark, or the intact word */
  cut = true,
}: {
  className?: string;
  title?: string;
  cut?: boolean;
}) {
  // ids must be unique: the mark appears in the nav and the footer at once
  const uid = useId().replace(/[:]/g, "");
  const above = `wm-a-${uid}`;
  const below = `wm-b-${uid}`;

  const { viewBox, group, groupSlipped, cut: blade, letters } = WORDMARK;

  const Letters = () => (
    <>
      {letters.map((l, i) => (
        <path key={i} d={l.d} transform={`translate(${l.x} 0)`} />
      ))}
    </>
  );

  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      {cut ? (
        <>
          <defs>
            <clipPath id={above} clipPathUnits="userSpaceOnUse">
              <polygon points={blade.above} />
            </clipPath>
            <clipPath id={below} clipPathUnits="userSpaceOnUse">
              <polygon points={blade.below} />
            </clipPath>
          </defs>

          {/* lower fragment, undisturbed */}
          <g transform={group}>
            <g clipPath={`url(#${below})`}>
              <Letters />
            </g>
          </g>

          {/* upper fragment, slipped */}
          <g transform={groupSlipped}>
            <g clipPath={`url(#${above})`}>
              <Letters />
            </g>
          </g>
        </>
      ) : (
        <g transform={group}>
          <Letters />
        </g>
      )}
    </svg>
  );
}
