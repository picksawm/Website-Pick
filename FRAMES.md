# Scroll film — frames that play as you scroll

The site's "video" is not a video. It is a numbered frame sequence painted
to a canvas, and **scroll position is the playhead**. Stop scrolling and the
picture stops. Scroll up and it runs backwards. That is the whole illusion.

## Why frames instead of `<video>`

Seeking an MP4 on every scroll event is unreliable (especially iOS Safari,
where `currentTime` writes are throttled or dropped mid-scrub). A frame
sequence gives exact, instant, frame-accurate positioning with no decoder
fighting the compositor.

## Building a film

Required: `sharp` (already a devDependency). ffmpeg only if your source is
a real video file.

### From a video

```bash
npm run frames -- video --slug my-film --in ~/renders/clip.mp4 --frames 96
```

ffmpeg must be on `PATH`; override with `FFMPEG=/path/to/ffmpeg`.

### From still artwork (no ffmpeg needed)

```bash
npm run frames -- stills --slug opening --frames 96 \
  --in public/art/hero.jpg,public/art/worlds-01.jpg,public/art/ai-01.jpg
```

Each still gets a slow Ken-Burns push-in, and the stills cross-dissolve into
each other. This is how the current opening film was built: it reads as one
continuous camera move through the work rather than a slideshow, because the
push is continuous across the cut.

## What it writes

```
public/art/film/<slug>/
  manifest.json     frames, size, paths — the runtime reads this at build time
  hi/0001.webp…     1200×675 q62  (~50 kB each)
  lo/0001.webp…     400×225 q45   (~8 kB each)
src/config/films.generated.ts   ← regenerated automatically
```

The generated TS file means the app knows the frame count with **zero extra
requests** and full type safety. Commit it along with the frames.

## How it plays

Two lanes, one canvas:

| lane | fetched | purpose |
|---|---|---|
| `lo/` | **all** frames, in order, immediately (~0.8 MB total) | every scroll position has a real image within a second — this is what makes it feel continuous |
| `hi/` | window of ±8 around the playhead | sharpness where you're looking, nowhere else |

Memory: decoded frames are `ImageBitmap`s (~3.2 MB at 1200×675), so the hi
lane is an LRU capped at 18 desktop / 10 mobile, with explicit `.close()` on
eviction (Safari leaks them otherwise). At most ~38 MB decoded, versus ~300 MB
if we held the whole film.

Paints happen inside a `ResizeObserver`-sized canvas using cover-fit, so there
is no layout work and no aspect jump during scrub.

## Using it

```tsx
import { filmFor } from "../config/films.generated";
import ScrollFilmScene from "../animation/ScrollFilmScene";

const film = filmFor("opening");

{film && (
  <ScrollFilmScene
    film={film}
    distance={3.2}                 // viewport heights of scroll = film length
    alt="…"                        // required; the canvas is a role="img"
    overlay={(p) => <MyHeadline progress={p} />}
  />
)}
```

`distance` is the throttle: 2 ≈ brisk, 4 ≈ slow and ceremonial. Six screens of
scroll for a 96-frame film gives roughly 16 px of scroll per frame, which is
about the limit before it starts to feel stepped.

On a `CollectionPage` the film name is the collection slug, so publishing a
film for a direction is a data step, not a code change:

```tsx
const film = filmFor(collection.slug);
```

## Degradation

- `prefers-reduced-motion` → `ScrollScene` creates no trigger at all; the
  frame at 62% of the film is painted once and stays.
- No JS / pre-hydration → the `posterSrc` still is in the prerendered HTML.
- A missing film → `filmFor()` returns `null` and callers fall back to a still.

## Cost, measured

96 frames: **hi 5.0 MB** (windowed, so a normal visit transfers maybe 1–2 MB),
**lo 0.81 MB** (always, in full). Frames are immutable, so they are served with
long cache headers by GitHub Pages and a repeat visit costs ~0 bytes.
