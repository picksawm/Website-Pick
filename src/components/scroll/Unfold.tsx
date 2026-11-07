import { type ReactNode, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { usePointer } from "../../lib/motion";
import { cn } from "../../utils/cn";

export type UnfoldVariant = "cover" | "pages" | "aperture" | "palms" | "folds" | "bloom" | "curtain";

interface UnfoldProps {
  src: string;
  alt: string;
  variant: UnfoldVariant;
  /** falls back to the element's own travel through the viewport */
  progress?: MotionValue<number>;
  className?: string;
  /** layers drawn above the image (captions, titles) */
  children?: ReactNode;
  priority?: boolean;
}

/**
 * Unfold — the "opening palm" mechanic.
 *
 * A still image should not sit there; it should *evolve* as you scroll,
 * like a hand opening. One scroll progress value drives a different
 * physical story per room:
 *
 *   cover    — a vertical slit widens into the full frame
 *   pages    — horizontal blinds part from the spine outward
 *   aperture — a projector shutter opens from a point
 *   palms    — four quadrants splay away from the centre (the literal palm)
 *   folds    — the plate folds open around its leading edges, in 3D
 *   bloom    — a radial iris opens plus a scale-through
 *   curtain  — two panels draw apart like stage curtains
 *
 * Every mechanism is its own component so hook order is stable. All
 * work is `transform` / `clip-path` / `opacity` on the compositor — no
 * layout thrash, no WebGL, same 150 kB artwork.
 */
export default function Unfold({
  src,
  alt,
  variant,
  progress,
  className,
  children,
  priority,
}: UnfoldProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });
  const p = progress ?? scrollYProgress;

  // the image always breathes a little, so even a crop feels alive
  const imgScale = useTransform(p, [0, 1], [1.16, 1]);
  const imgShift = useTransform(p, [0, 1], ["3.5%", "-3.5%"]);

  // the opening itself: 0 shut → 1 fully open
  const open = useTransform(p, [0, variant === "cover" ? 0.72 : 0.58], [0, 1]);

  const Mechanism = MECHANISMS[variant];

  // the frame leans toward the pointer — every plate is interactive
  const pointer = usePointer();
  const tiltX = useSpring(pointer.y * -2.2, { stiffness: 90, damping: 22 });
  const tiltY = useSpring(pointer.x * 2.6, { stiffness: 90, damping: 22 });

  return (
    <div
      ref={localRef}
      className={cn("relative overflow-hidden [perspective:1400px]", className)}
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: imgScale, y: imgShift, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      <Mechanism open={open} />

      {children}
    </div>
  );
}

interface MechanismProps {
  open: MotionValue<number>;
}

/* ── COVER: a slit widens to the whole frame ───────────────────── */
function M_Cover({ open }: MechanismProps) {
  const edge = useTransform(open, [0, 1], ["46%", "0%"]);
  const clip = useTransform(edge, (v) => `inset(0% ${v} 0% ${v})`);
  const bladeOpacity = useTransform(open, [0, 0.9], [1, 0]);
  const glow = useTransform(open, [0, 0.6, 1], [0.9, 0.45, 0]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#06070a]"
        style={{ clipPath: clip }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 right-0"
        style={{ opacity: bladeOpacity }}
      >
        <motion.div
          className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#c8e8ff] to-transparent"
          style={{
            left: useTransform(edge, (v) => `calc(${v} - 1px)`),
            opacity: glow,
            boxShadow: "0 0 28px rgba(127,220,255,0.9)",
          }}
        />
        <motion.div
          className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#c8e8ff] to-transparent"
          style={{
            right: useTransform(edge, (v) => `calc(${v} - 1px)`),
            opacity: glow,
            boxShadow: "0 0 28px rgba(127,220,255,0.9)",
          }}
        />
      </motion.div>
    </>
  );
}

/* ── PAGES: blinds part from the spine ─────────────────────────── */
function M_Pages({ open }: MechanismProps) {
  const scale = useTransform(open, [0, 1], [1, 0.001]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 bg-[color:var(--room-bg,#08090b)]"
          style={{
            top: `${(i / 9) * 100}%`,
            height: `${100 / 9 + 0.2}%`,
            transformOrigin: i < 4.5 ? "top" : "bottom",
            scaleY: scale,
          }}
        />
      ))}
    </div>
  );
}

/* ── APERTURE: projector shutter ───────────────────────────────── */
function M_Aperture({ open }: MechanismProps) {
  const clip = useTransform(open, (v) => {
    const c = Math.max(0, (1 - v) * 50);
    return `polygon(${c}% ${c}%, ${100 - c}% ${c}%, ${100 - c}% ${100 - c}%, ${c}% ${100 - c}%)`;
  });
  const raysOpacity = useTransform(open, [0, 0.55, 1], [1, 0.5, 0]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#0a0d12]"
        style={{ clipPath: clip }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: raysOpacity,
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(127,220,255,0.42) 0deg 5deg, transparent 5deg 45deg)",
          clipPath: clip,
        }}
      />
    </>
  );
}

/* ── PALMS: four quadrants splay from the centre ───────────────── */
function M_Palms({ open }: MechanismProps) {
  const dist = useTransform(open, [0, 1], [0, 104]);
  const rotate = useTransform(open, [0, 1], [0, 9]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <PalmQuad open={open} dist={dist} rotate={rotate} corner="tl" />
      <PalmQuad open={open} dist={dist} rotate={rotate} corner="tr" />
      <PalmQuad open={open} dist={dist} rotate={rotate} corner="bl" />
      <PalmQuad open={open} dist={dist} rotate={rotate} corner="br" />
    </div>
  );
}

function PalmQuad({
  dist,
  rotate,
  corner,
}: MechanismProps & { dist: MotionValue<number>; rotate: MotionValue<number>; corner: "tl" | "tr" | "bl" | "br" }) {
  const sx = corner === "tl" || corner === "bl" ? -1 : 1;
  const sy = corner === "tl" || corner === "tr" ? -1 : 1;

  const x = useTransform(dist, (v) => `${v * sx}%`);
  const y = useTransform(dist, (v) => `${v * sy}%`);
  const r = useTransform(rotate, (v) => v * sx * sy);

  return (
    <motion.div
      className={cn(
        "absolute h-1/2 w-1/2 bg-[color:var(--room-bg,#08090b)]",
        corner === "tl" && "left-0 top-0",
        corner === "tr" && "right-0 top-0",
        corner === "bl" && "left-0 bottom-0",
        corner === "br" && "right-0 bottom-0"
      )}
      style={{ x, y, rotate: r }}
    >
      <div
        className={cn(
          "absolute h-px w-full bg-[color:var(--room-accent,#d8ff3e)] opacity-30",
          sy === 1 ? "top-0" : "bottom-0"
        )}
      />
    </motion.div>
  );
}

/* ── FOLDS: the plate hinges open in 3D ────────────────────────── */
function M_Folds({ open }: MechanismProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1200px]">
      <FoldPanel open={open} side="left" />
      <FoldPanel open={open} side="right" />
      <FoldPanel open={open} side="top" />
      <FoldPanel open={open} side="bottom" />
    </div>
  );
}

function FoldPanel({ open, side }: MechanismProps & { side: "left" | "right" | "top" | "bottom" }) {
  const angle = useTransform(open, [0, 1], [side === "left" || side === "top" ? -96 : 96, 0]);
  const opacity = useTransform(open, [0, 0.9], [1, 0]);
  const isHorizontal = side === "left" || side === "right";

  return (
    <motion.div
      className="absolute inset-0 bg-[color:var(--room-bg,#08090b)]"
      style={{
        transformOrigin:
          side === "left" ? "left center" : side === "right" ? "right center" : side === "top" ? "top center" : "bottom center",
        rotateY: isHorizontal ? angle : 0,
        rotateX: isHorizontal ? 0 : angle,
        opacity,
      }}
    />
  );
}

/* ── BLOOM: iris plus scale-through ────────────────────────────── */
function M_Bloom({ open }: MechanismProps) {
  const mask = useTransform(open, (v) => {
    const r = v * 80;
    return `radial-gradient(circle at 50% 50%, transparent ${r}%, black ${r + 1}%)`;
  });
  const ringSize = useTransform(open, [0, 1], ["8vw", "130vw"]);
  const ringOpacity = useTransform(open, [0, 0.9], [0.55, 0]);

  return (
    <>
      {/* the paper mask that retreats from the centre outward */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#fbfaf7]"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: ringOpacity,
          borderColor: "rgba(109,59,212,0.5)",
        }}
      />
    </>
  );
}

/* ── CURTAIN: two panels draw apart ────────────────────────────── */
function M_Curtain({ open }: MechanismProps) {
  const xLeft = useTransform(open, [0, 1], ["0%", "-101%"]);
  const xRight = useTransform(open, [0, 1], ["0%", "101%"]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div className="absolute inset-y-0 left-0 w-1/2 bg-[color:var(--room-bg,#070607)]" style={{ x: xLeft }}>
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[color:var(--room-accent,#ff5a2b)]/25 to-transparent" />
      </motion.div>
      <motion.div className="absolute inset-y-0 right-0 w-1/2 bg-[color:var(--room-bg,#070607)]" style={{ x: xRight }}>
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[color:var(--room-accent,#ff5a2b)]/25 to-transparent" />
      </motion.div>
    </div>
  );
}

const MECHANISMS: Record<UnfoldVariant, (props: MechanismProps) => ReactNode> = {
  cover: M_Cover,
  pages: M_Pages,
  aperture: M_Aperture,
  palms: M_Palms,
  folds: M_Folds,
  bloom: M_Bloom,
  curtain: M_Curtain,
};
