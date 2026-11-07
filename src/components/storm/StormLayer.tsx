import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion";

interface StormLayerProps {
  mode: "dark" | "light";
  /** 0..1 — how hard the weather leans on this room */
  intensity?: number;
  /** lightning strikes (dark rooms only) */
  lightning?: boolean;
}

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

interface Ember {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
}

/**
 * StormLayer — the weather, without a 3D engine.
 *
 * The old site grew its storm out of WebGL: shaders, a city, rain
 * particles in 3D. That cost megabytes and killed first paint. This
 * layer does the same *feeling* with one 2D canvas — rain lines or
 * drifting ash depending on the room's light — plus a decaying
 * lightning flash. No dependencies, no textures, capped DPR.
 *
 * It is fixed above the artwork and below the chrome, so every room
 * keeps the same sky while its palette changes underneath.
 */
export default function StormLayer({ mode, intensity = 1, lightning = true }: StormLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (prefersReducedMotion()) {
      // a still, quiet veil instead of motion
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let drops: Drop[] = [];
    let embers: Ember[] = [];
    let flash = 0;
    let raf = 0;
    let last = 0;

    const isSmall = window.innerWidth < 768;
    const rainCount = Math.round((isSmall ? 55 : 130) * intensity);
    const emberCount = Math.round((isSmall ? 22 : 46) * intensity);

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drops = Array.from({ length: rainCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 12 + Math.random() * 34,
        speed: 320 + Math.random() * 620,
        alpha: 0.05 + Math.random() * 0.22,
      }));

      embers = Array.from({ length: emberCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.8,
        vx: -8 + Math.random() * 16,
        vy: -14 - Math.random() * 26,
        alpha: 0.08 + Math.random() * 0.26,
      }));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      if (mode === "dark") {
        // ── rain: slanted lines, additive-ish so they catch the light ──
        ctx.lineCap = "round";
        for (const d of drops) {
          d.y += d.speed * dt;
          d.x += d.speed * 0.16 * dt;
          if (d.y > h + d.len) {
            d.y = -d.len;
            d.x = Math.random() * w;
          }
          if (d.x > w + 40) d.x = -40;

          const grad = ctx.createLinearGradient(d.x, d.y, d.x + d.len * 0.16, d.y + d.len);
          grad.addColorStop(0, `rgba(198,232,255,0)`);
          grad.addColorStop(0.55, `rgba(198,232,255,${d.alpha})`);
          grad.addColorStop(1, `rgba(232,246,255,${d.alpha * 0.35})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.len * 0.16, d.y + d.len);
          ctx.stroke();
        }

        // ── lightning ──
        if (lightning && Math.random() < 0.0022) flash = 1;
        if (flash > 0.01) {
          ctx.fillStyle = `rgba(186,224,255,${flash * 0.1})`;
          ctx.fillRect(0, 0, w, h);
          flash *= 0.9;
        }
      } else {
        // ── light rooms: dust and ash drifting up, never rain on paper ──
        for (const e of embers) {
          e.x += e.vx * dt;
          e.y += e.vy * dt;
          if (e.y < -10) {
            e.y = h + 10;
            e.x = Math.random() * w;
          }
          if (e.x < -10) e.x = w + 10;
          if (e.x > w + 10) e.x = -10;
          ctx.fillStyle = `rgba(26,24,20,${e.alpha})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;
      draw(dt);
    };

    build();
    raf = requestAnimationFrame(loop);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, intensity, lightning]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[4] overflow-hidden"
      style={{ opacity: mode === "dark" ? 1 : 0.75 }}
    >
      {/* drifting fog banks — pure CSS, sits under the canvas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            mode === "dark"
              ? "radial-gradient(120% 60% at 50% 110%, rgba(127,220,255,0.10) 0%, transparent 60%), radial-gradient(90% 50% at 12% 0%, rgba(90,140,200,0.10) 0%, transparent 70%)"
              : "radial-gradient(120% 60% at 50% 110%, rgba(26,24,20,0.07) 0%, transparent 60%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* vignette keeps the eye in the frame on every palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            mode === "dark"
              ? "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(4,5,8,0.55) 100%)"
              : "radial-gradient(120% 90% at 50% 45%, transparent 62%, rgba(20,18,15,0.16) 100%)",
        }}
      />
    </div>
  );
}
