# PICKSAW — Design System

The rebuild's whole thesis in one line: **images lead, chrome disappears.**

The previous site was a WebGL storm city — a 3D journey, procedural buildings,
GLB models and a weather engine. It was visually ambitious and also heavy,
slow to first paint, and it made every visitor walk the same corridor before
seeing any work. This version throws all of it out and rebuilds around
scroll-driven imagery: six rooms, six art directions, no 3D engine in the
browser at all.

---

## 1. Principles

| Principle | What it means in code |
|---|---|
| **Images lead** | Every room opens with a full-bleed plate before it says anything. Copy is short and set in a serif that gets out of the way. |
| **One idea per screen** | Sections are viewport-scale, not dense grids of cards. |
| **Each tab is its own world** | Palette, type treatment, layout rhythm and image framing change per room — same components, different light. |
| **Motion is slow and quiet** | Reveals are 0.7–1.15s on `cubic-bezier(0.22,1,0.36,1)`. No parallax screaming, no bounce. `transform` + `opacity` only. |
| **Degrade, never break** | Missing artwork → designed placeholder. No audio → labelled placeholder. No WebGL needed → nothing to fall back from. |

---

## 2. Rooms (routes)

Hash routes, so the static host needs no SPA rewrite rules.

| # | Route | Room | Palette | Art direction |
|---|---|---|---|---|
| — | `/` | Cover | ink `#08090b` / bone | Full-bleed hero, framed type, room directory |
| 01 | `/work` | Work | paper `#f2efe9` / ink | Printed monograph — plates, captions, contact sheet, index table |
| 02 | `/worlds` | Worlds | near-black `#0a0d12` / ice `#7fdcff` | Projection room — letterboxed 21:9, film numerals, technical mono |
| 03 | `/ai` | AI Art | white `#fbfaf7` / plum `#6d3bd4` | White-cube gallery — hung frames, museum wall labels, lightbox |
| 04 | `/sound` | Sound | black `#070607` / ember `#ff5a2b` | Listening room — big sleeve, tracklist, CSS waveform |
| 05 | `/about` | About | dark `#101113` / signal `#d8ff3e` | Magazine feature — portrait gatefold, pull quote, ruled timeline |
| 06 | `/contact` | Contact | bone `#e8e4db` / ink | Letterpress — oversized email, big channels, order-slip form |
| 07 | `/journal` | Journal | black / ember | Studio wall of pinned fragments (the old Feed, restyled) |

The room shell lives in `src/components/shell/Room.tsx`: it paints the palette
(`.room-*`), runs the shared reveal observer, and closes each room with a
doorway into the next one.

---

## 3. Type

| Role | Family | Notes |
|---|---|---|
| Display | **Instrument Serif** | Fluid `clamp()` sizing via `.display-xl/-lg/-md`. Italic used for emphasis words only. |
| Body / UI | **Inter Variable** | `ss01` feature on. |
| Labels / data | **JetBrains Mono Variable** | `.eyebrow` (wide-tracked caps) and `.mono-label`. |
| Persian | **Vazirmatn Variable** | Applied on `[dir="rtl"]`; display weights forced to 700, letterspacing reset to 0, italics suppressed. |

Every tab uses the same families — the differentiation comes from scale,
colour, letterspacing and composition, not from font soup.

---

## 4. Colour tokens

Base tokens live in `@theme` (`src/index.css`); room palettes are CSS
variables on the room class, so any component can read `var(--room-fg)`,
`var(--room-dim)`, `var(--room-line)`, `var(--room-accent)` and stay correct
in all six rooms.

```css
.room-work    { --room-bg:#f2efe9; --room-fg:#14130f; --room-accent:#14130f }
.room-worlds  { --room-bg:#0a0d12; --room-fg:#e7edf3; --room-accent:#7fdcff }
.room-ai      { --room-bg:#fbfaf7; --room-fg:#16151a; --room-accent:#6d3bd4 }
.room-sound   { --room-bg:#070607; --room-fg:#f2ede6; --room-accent:#ff5a2b }
.room-about   { --room-bg:#101113; --room-fg:#f4f1ea; --room-accent:#d8ff3e }
.room-contact { --room-bg:#e8e4db; --room-fg:#121110; --room-accent:#121110 }
```

The nav reads `DARK_ROOMS` to know when its ink must flip.

---

## 5. Motion primitives (`src/lib/motion.ts`)

| Hook | Use |
|---|---|
| `usePageProgress()` | 0–1 document scroll → nav hairline. |
| `useScrollY()` | rAF-batched raw scroll. |
| `useElementProgress()` | An element's travel through the viewport → in-plate drift (Worlds), hero scale (Work). |
| `usePointer()` | Normalised −1…1 pointer, disabled on coarse pointers → the Worlds tilt. |
| `useRevealObserver()` | IntersectionObserver for `.reveal` / `.clip-reveal`, plus a **MutationObserver** so filtered-in or language-switched nodes still appear. |

Scroll CSS classes: `.reveal`, `.clip-reveal`, `.ken-burns`, `.marquee-track`,
`.arrow-step`, `.underline-draw`, `.link-slide`.

`prefers-reduced-motion` collapses all durations globally in `index.css`.

---

## 6. Performance budget

No `viteSingleFile()` any more — the old build base64-inlined every font
subset and image into one HTML file, which is exactly the weight this rebuild
escapes. Fonts and art are separate, cacheable, immutable files.

| Asset | Size (gzip) |
|---|---|
| CSS | ~16 kB |
| App JS | ~115 kB |
| React chunk | ~15 kB |
| Motion chunk | ~34 kB |
| Cover image | ~150 kB (preloaded) |

Total shipped 3D payload: **0 bytes.**

Images are served from `public/art/` at their generated resolution and use
native lazy loading (`loading="lazy"` except the first plate in each room).

---

## 7. Accessibility

- Skip link on every route.
- Visible `:focus-visible` ring in the signal colour, on every palette.
- Nav is a real `<header>` + fullscreen `<nav>` with `aria-expanded`; Escape closes it.
- Lightbox and modals: `role="dialog"`, `aria-modal`, Escape to close, arrow keys to browse, body scroll locked.
- Decorative art carries empty `alt`; meaningful plates carry the title.
- `prefers-reduced-motion` respects the OS setting everywhere.
- 44px minimum on all interactive controls; coarse-pointer inputs pinned to 16px to stop iOS zoom.
