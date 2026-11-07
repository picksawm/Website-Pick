# Articksaw — design system

The site is an exhibition, not a portfolio and not an application. One dark
room holds everything; the work supplies the colour. Nothing on the interface
glows on its own.

---

## Part 1 — Three directions

All three were specified before any of them was built, then measured against
the real font metrics (cap height, x-height, advance widths) rather than
chosen by eye, because the deciding factor is how each pairing performs at
both 200px and 11px.

### Direction A — *The Salon*

| | |
|---|---|
| **Display** | Cormorant Garamond 300, tightened −0.045em |
| **Interface** | Manrope, 300–500 |
| **Accent** | Cormorant italic |
| **Palette** | `#0a0a0b` ground · `#efe9dd` ivory · `#4d8fff` blue · no metallics |
| **Scale** | 200 / 96 / 40 / 20 px display; 15 / 13 / 10 px interface |
| **Nav** | Single line, letterspaced caps, no rules |
| **Gallery** | Full-bleed plates at varied widths, each with a printed caption below |
| **Collection page** | One enormous statement, then works as a single column |
| **Hover** | Opacity and a 1px rule only — nothing moves |
| **Opening** | The film sits behind the wordmark and the type never leaves |

**Strengths.** Genuinely luxurious; reads as a gallery catalogue or an
architecture monograph. Enormous negative space. Cormorant's 0.386 x-height
makes body text whisper, which is exactly the intended effect.

**Weaknesses — measured, not aesthetic.** That same 0.386 x-height is the
problem: at 11px, metadata in Cormorant is illegible, so *all* small text has
to fall back to the sans, and the display face loses its authority at display
sizes because its thin strokes vanish on dark grounds. Also the least
"Articksaw": nothing about it is electric or accidental. It is calm to the
point of being anonymous.

### Direction B — *Guild Hall* ✅ **chosen**

| | |
|---|---|
| **Display** | Bodoni Moda 400 (+ italic), tightened −0.035em |
| **Interface** | Space Grotesk, 400–500 |
| **Accent** | Cormorant italic — one line per page, no more |
| **Palette** | `#0b0b0e` · `#101116` · `#16181e` graphite · `#efe9dc` ivory · `#b5afa2` muted · `#7c776c` chalk · `#3d7dff` electric blue (links/focus only) · `#a8353c` metallic red (artwork-dependent) · `#a08a5e` brass (numerals) |
| **Scale** | 208 / 128 / 62 / 34 px display; 19 / 15 / 11 / 10 px interface |
| **Nav** | Wordmark left, one text toggle right; menu is a *contents page* |
| **Gallery** | Asymmetric 12-column hanging — lead work full-width, then tall/wide alternation |
| **Collection page** | Plate mark + display name, statement in a narrow measure, works hung asymmetrically |
| **Hover** | Letters step 8px, a caption fades up, a hairline draws. No fills, no pills |
| **Opening** | The film plays behind the type; on exit the mark appears *cut*, as if the blade that scored the film also struck the logo |

**Strengths.** Bodoni has a 0.75 cap height and 1.125 ascender — the most
dramatic contrast available, which is what makes it read as *fashion editorial*
rather than *book*. Set at 0.82 line-height it stacks into a solid typographic
block, so the display type itself becomes the composition even with no image
on screen. Space Grotesk at 11px is clean but has odd terminals (the `a`, the
`t`), which keeps the interface from feeling like a default. The didone/neo-
grotesque tension is the historically correct pairing for a gallery, and it
gives the "carefully composed, never predictable" balance the brief asked for.

**Weaknesses.** Bodoni is high-maintenance: optical sizing matters, italics
must be used sparingly, and it can tip into pastiche if overused. Two heavy
faces (Bodoni display + Space Grotesk nav) need a strict rule about which one
owns what — solved here by never letting Space Grotesk exceed 19px.

### Direction C — *Signal Study*

| | |
|---|---|
| **Display** | Space Grotesk 500 at 132px, −0.055em |
| **Interface** | JetBrains Mono for every label |
| **Accent** | Cormorant italic as a single counterpoint line |
| **Palette** | `#0a0b0d` · `#2f7fff` · 4-column data grid |
| **Nav** | Persistent top bar with a live index |
| **Gallery** | Data-driven grid with visible counts and dimensions |
| **Collection page** | Numbered works, each with measurements |
| **Hover** | Cell highlight, cursor label |
| **Opening** | Film plays inside a framed viewport with a running timecode |

**Strengths.** The most contemporary and the most *engineered*. Everything is
legible at every size. Excellent for a large archive, and the typographic
rigour is genuinely beautiful in the way a technical drawing is.

**Weaknesses.** It reads as a research archive or a design studio, not an art
exhibition. The grid flattens every artwork into a specimen, and the mono
interface makes the site feel like an instrument. It fails the brief's core
requirement — "the interface should know when to disappear" — because a
measurement grid never disappears. Also the least Persian, which matters here.

---

## Part 2 — Recommendation

**Direction B.** It is the only one where the display typography is strong
enough to carry a page on its own, which is what lets the interface recede to
hairlines and 10px plate marks. A and C both require the interface to do work
that B gives to the type.

The system borrows one thing from each of the others: C's discipline about
measurements and counts (every number on this site is data, never written by
hand), and A's willingness to leave a column almost entirely empty.

---

## Part 3 — The system as built

### Files

| File | Holds |
|---|---|
| `src/index.css` | Tokens, typographic scale, components, room palettes |
| `src/components/brand/Wordmark.tsx` | The mark, inline |
| `src/components/brand/wordmark.generated.ts` | Mark geometry (generated) |
| `scripts/build-wordmark.mjs` | Builds the mark from font outlines |
| `src/styles/cormorant.css` | Latin-only accent face |

### Colour

Never a flat black everywhere. Four surfaces step up from the page:

```
--color-void    #08080a   the page
--color-ink     #0b0b0e   primary background
--color-ink-2   #101116   raised surface
--color-ink-3   #16181e   graphite
--color-ink-4   #1e2028   dark metallic grey
--color-graphite #2a2d36  borders on dark
```

Text: `--color-bone #efe9dc` (warm ivory, never pure white), `--color-bone-dim
#b5afa2`, `--color-chalk #7c776c`, `--color-faint #4a4741`.

Accents: electric blue `#3d7dff` is **interface only** — links, focus rings,
the current page. It never decorates. Metallic red `#a8353c` is
**artwork-dependent** — it belongs to a work, not to the shell. Brass
`#a08a5e` appears only in numerals, like gilt on a catalogue plate.

### Type

Five display steps (`.display-xl` → `.display-sm`), four interface steps
(`.lede`, `.prose-body`, `.mono-label`, `.plate`), and one accent voice
(`.voice`, italic Cormorant — used at most once per page).

The Persian system does not fall back to the Latin faces: `[dir="rtl"]` swaps
to Vazirmatn, kills all letterspacing (it reads as broken word spacing in
Arabic script), and forces `font-style: normal` on the accent face, because
faux-italic Persian is a rendering bug, not a style.

### The wordmark

Not type. `scripts/build-wordmark.mjs` pulls Cormorant's capitals as raw
outlines, tracks each pair by hand (the `I` gets air, the `A` and `W` take a
squeeze), cuts the mark along a single blade on a −3.8° slant, and slips the
upper fragment 16/26 units up and right. The gap is real transparency, so the
mark works on ivory as well as on near-black, and it inherits `currentColor`.

Geometry is emitted to a generated TS file so the React component draws the
same numbers — no second request, no lookalike.

### Components

Small and composable, all in `@layer utilities`:

- `.plate` — the smallest voice: catalogue numbers, plate marks
- `.voice` — italic Cormorant, the one line that should be read as handwriting
- `.index-row` — a printed index row: `number · title · tally`
- `.blade` — a hairline that enters and stops short, opening a section
- `.artwork-frame` — a border that appears only on hover (the interface arriving)
- `.btn-quiet` — an underline and a space, never a pill
- `.lure` — a hover that moves the letters, not the box

### What was deliberately removed

- **Pill buttons.** Every `rounded-full` used as UI chrome is now a hairline or
  a bare arrow. The only remaining round shapes are a waveform and a status dot,
  where round is the literal correct form.
- **Per-tab light backgrounds.** `/work` and `/ai` were paper-white, `/contact`
  bone. Five different background colours is what made the site read as five
  designs. Only `/contact` still inverts — the back cover.
- **Glow.** No `box-shadow` in an accent colour anywhere.

---

## Verification

```
tsc --noEmit            clean
build                   14 routes + 404 + sitemap; 15 font files, 364 kB total
h1 per page             exactly 1, on all 9 checked pages
pills remaining         0 except waveform/status dot
```

Fonts are trimmed to the Latin and Arabic subsets actually rendered:
`wght.css` for Cormorant shipped cyrillic and vietnamese, so a 77 kB latin-only
face replaced ~180 kB of unused weights. Total font payload is 364 kB for five
families across two scripts.
