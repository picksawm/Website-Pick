#!/usr/bin/env node
/**
 * build-frames.mjs — turns a film into a scrollable frame sequence.
 *
 * The site scrubs JPEG/WebP frames from canvas as you scroll, so a
 * "video" here is really a folder of stills. This script is the only
 * thing that produces them.
 *
 * Two sources:
 *
 *   1. a real video (needs ffmpeg on PATH)
 *        node scripts/build-frames.mjs film \
 *          --in path/to/clip.mp4 --slug opening --frames 96
 *
 *   2. stills, assembled into a slow push-in with cross-dissolves
 *      (needs no ffmpeg — this is how the current opening was built)
 *        node scripts/build-frames.mjs stills \
 *          --slug opening --frames 96 --in public/art/hero.jpg,...
 *
 * Either way it writes, into public/art/film/<slug>/:
 *
 *   manifest.json   what the runtime needs to know, nothing more
 *   hi/0001.webp…   full-size frames (lazy, windowed at runtime)
 *   lo/0001.webp…   tiny frames, all of them, for instant scrub feedback
 *
 * The `lo` tier is the trick that makes this feel like video rather than
 * a slideshow: the whole film is ~600 kB, so every frame position has
 * *something* to show within a second, and the sharp frame fades in
 * over it as it arrives.
 *
 * Design rules baked in here:
 *   • deterministic frame count — rerunning produces identical indices
 *   • fixed aspect for every frame so the canvas never changes size
 *   • quality tuned for photographs, not screenshots
 */
import { mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── output geometry ─────────────────────────────────────────────────
   ㎡ 1200×675 is 16:9 at a size that survives a 2× DPR laptop without
   looking soft, while keeping a full film under ~4 MB. */
const HI = { width: 1200, height: 675 };
const LO = { width: 400, height: 225 };
const HI_QUALITY = 62;
const LO_QUALITY = 45;

const args = process.argv.slice(2);
const mode = args[0];
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const slug = flag("slug", "opening");
const frameCount = Number(flag("frames", 96));
const outDir = path.join(root, "public/art/film", slug);

function bail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

/** Ken-burns crop: a window that pushes in slowly across the still. */
function kenBurns(img, src, out, t) {
  // cover the target aspect first, so the crop window below is always
  // measured against an image that already fills the frame
  const cover = Math.max(out.width / src.width, out.height / src.height);

  const scale = 1.06 + 0.1 * t; // 6% → 16% overscan
  // crop window, expressed in SOURCE pixels (extract can only address the
  // original image, so cover-space distances must be divided back out)
  const cw = Math.floor(src.width / scale);
  const ch = Math.floor(src.height / scale);
  const slackX = src.width - cw;
  const slackY = src.height - ch;

  // drift the window toward the upper third, which is where faces and
  // horizons sit in this body of work
  const left = Math.min(slackX, Math.max(0, Math.round(slackX * (0.5 - 0.18 * t))));
  const top = Math.min(slackY, Math.max(0, Math.round(slackY * (0.42 - 0.14 * t))));

  // cover-fit happens in the resize: crop the window first, then let
  // sharp fill the frame (it may crop a hair more, which is invisible)
  return img
    .extract({ left, top, width: cw, height: ch })
    .resize(out.width, out.height, { fit: "cover", kernel: "lanczos3" })
    .toColourspace("srgb");
}

/** Raw RGB bytes for one still at a given crop — used to cross-dissolve. */
async function stillAt(sharp, src, out, t) {
  const img = sharp(src).rotate();
  // rotate() is lazy — metadata() gives the post-rotation size
  const meta = await sharp(src).rotate().metadata();
  const { data } = await kenBurns(img, meta, out, t)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data; // RGB, out.width * out.height * 3
}

function mix(a, b, k) {
  const out = Buffer.allocUnsafe(a.length);
  const ik = 1 - k;
  for (let i = 0; i < a.length; i++) out[i] = a[i] * ik + b[i] * k;
  return out;
}

async function buildFromStills(sharp, sources) {
  const n = sources.length;
  const transitions = Math.max(1, n - 1);
  const perTransition = Math.round(frameCount * 0.22) / transitions;
  const hold = (frameCount - (n - 1) * perTransition) / n;

  console.log(
    `  ${n} stills → ${frameCount} frames (${hold.toFixed(1)} hold, ${perTransition.toFixed(1)} dissolve each)`
  );

  // Pre-render each still at every crop we will need, both tiers.
  // Caching by (index, step) keeps this from re-decoding 96 times.
  const hi = [], lo = [];

  for (let f = 0; f < frameCount; f++) {
    // which still are we in, and how far through it
    const travelled = f / frameCount * n;
    const idx = Math.min(n - 1, Math.floor(travelled));
    const local = travelled - idx;

    const tA = Math.min(1, Math.max(0, local));
    const a = await stillAt(sharp, sources[idx], HI, tA);
    const aLo = await stillAt(sharp, sources[idx], LO, tA);

    // dissolve into the next still near the end of this one's window
    const fadeStart = 1 - Math.min(0.35, perTransition / frameCount * n);
    if (idx < n - 1 && local > fadeStart) {
      const k = (local - fadeStart) / (1 - fadeStart);
      const b = await stillAt(sharp, sources[idx + 1], HI, 0);
      const bLo = await stillAt(sharp, sources[idx + 1], LO, 0);
      hi.push(mix(a, b, k));
      lo.push(mix(aLo, bLo, k));
    } else {
      hi.push(a);
      lo.push(aLo);
    }

    if (f % 12 === 0) process.stdout.write(`\r  rendering ${f}/${frameCount}`);
  }
  process.stdout.write(`\r  rendering ${frameCount}/${frameCount}\n`);
  return { hi, lo };
}

async function buildFromVideo(sharp, input) {
  const ffmpeg = process.env.FFMPEG || "ffmpeg";
  const tmp = path.join(root, ".frames-tmp");
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  // one pass: constant frame count, fixed size, no audio
  try {
    execFileSync(
      ffmpeg,
      [
        "-y", "-i", input,
        "-vf", `fps=${frameCount}/60,scale=${HI.width}:${HI.height}:force_original_aspect_ratio=increase,crop=${HI.width}:${HI.height}`,
        "-frames:v", String(frameCount),
        "-an",
        path.join(tmp, "%04d.png"),
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
  } catch (e) {
    bail(`${ffmpeg} failed — install ffmpeg or pass FFMPEG=/path/to/ffmpeg\n${e.stderr?.toString?.() ?? e.message}`);
  }

  const files = readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
  if (!files.length) bail("ffmpeg produced no frames");
  console.log(`  extracted ${files.length} video frames`);

  const hi = [], lo = [];
  for (const [i, f] of files.entries()) {
    const p = path.join(tmp, f);
    const a = await sharp(p).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(p).resize(LO.width, LO.height, { fit: "cover" }).removeAlpha().raw().toBuffer();
    hi.push(a.data);
    lo.push(b);
    if (i % 12 === 0) process.stdout.write(`\r  resizing ${i}/${files.length}`);
  }
  process.stdout.write(`\r  resizing ${files.length}/${files.length}\n`);
  rmSync(tmp, { recursive: true, force: true });
  return { hi, lo };
}

/** Rebuild src/config/films.generated.ts from every manifest on disk. */
function writeFilmsIndex() {
  const filmRoot = path.join(root, "public/art/film");
  const entries = [];
  try {
    for (const name of readdirSync(filmRoot, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      try {
        const m = JSON.parse(readFileSync(path.join(filmRoot, name.name, "manifest.json"), "utf8"));
        entries.push(m);
      } catch {
        /* a folder without a manifest is not a film */
      }
    }
  } catch {
    /* no films yet */
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  const body = entries
    .map(
      (m) => `  ${JSON.stringify(m.slug)}: {
    slug: ${JSON.stringify(m.slug)},
    frames: ${m.frames},
    width: ${m.width},
    height: ${m.height},
    ext: ${JSON.stringify(m.ext)},
    dir: ${JSON.stringify(m.dir)},
    tiers: ${JSON.stringify(m.tiers)},
  },`
    )
    .join("\n");

  const ts = `/* GENERATED by scripts/build-frames.mjs — do not edit by hand.
   Rebuild with: npm run frames -- ... */

export interface FilmManifest {
  slug: string;
  /** total frames in the sequence */
  frames: number;
  width: number;
  height: number;
  ext: string;
  /** directory holding hi/ and lo/ */
  dir: string;
  /** subfolders: lo = instant preview, hi = sharp pass */
  tiers: { lo: string; hi: string };
}

export const FILMS: Record<string, FilmManifest> = {
${body}
};

export const filmFor = (slug: string): FilmManifest | null => FILMS[slug] ?? null;

export const FILM_SLUGS = Object.keys(FILMS);
`;
  writeFileSync(path.join(root, "src/config/films.generated.ts"), ts);
}

async function main() {
  if (!mode || !["stills", "video"].includes(mode)) {
    bail("usage: build-frames.mjs stills|video --slug <name> --frames <n> [--in <paths>]");
  }

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    bail("sharp is required: npm i -D sharp");
  }

  const input = flag("in", "");
  if (!input) bail("--in is required");

  console.log(`\n  film: ${slug} → public/art/film/${slug}/`);

  let frames;
  if (mode === "stills") {
    frames = await buildFromStills(sharp, input.split(",").filter(Boolean));
  } else {
    frames = await buildFromVideo(sharp, input);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(path.join(outDir, "hi"), { recursive: true });
  mkdirSync(path.join(outDir, "lo"), { recursive: true });

  let hiBytes = 0, loBytes = 0;

  for (let i = 0; i < frames.hi.length; i++) {
    const name = `${String(i + 1).padStart(4, "0")}.webp`;

    const hiBuf = await sharp(frames.hi[i], {
      raw: { width: HI.width, height: HI.height, channels: 3 },
    })
      .webp({ quality: HI_QUALITY, effort: 5 })
      .toBuffer();

    const loBuf = await sharp(frames.lo[i], {
      raw: { width: LO.width, height: LO.height, channels: 3 },
    })
      .webp({ quality: LO_QUALITY, effort: 5 })
      .toBuffer();

    writeFileSync(path.join(outDir, "hi", name), hiBuf);
    writeFileSync(path.join(outDir, "lo", name), loBuf);
    hiBytes += hiBuf.length;
    loBytes += loBuf.length;
  }

  const manifest = {
    slug,
    frames: frames.hi.length,
    width: HI.width,
    height: HI.height,
    ext: "webp",
    dir: `/art/film/${slug}`,
    source: mode,
    // the runtime shows lo/ instantly, then swaps in hi/
    tiers: { lo: "lo", hi: "hi" },
    bytes: { hi: hiBytes, lo: loBytes },
  };

  writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  // the app imports this at build time, so it knows the frame count with
  // zero extra requests and full type safety
  writeFilmsIndex();

  const mb = (b) => (b / 1024 / 1024).toFixed(2) + " MB";
  console.log(`  ✓ ${manifest.frames} frames`);
  console.log(`    hi  ${mb(hiBytes)}  (${(hiBytes / manifest.frames / 1024).toFixed(0)} kB each, loaded in a window)`);
  console.log(`    lo  ${mb(loBytes)}  (loaded in full for instant scrub)\n`);
}

main().catch((e) => bail(e.stack ?? String(e)));
