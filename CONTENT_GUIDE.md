# Swapping in your own work

Everything visible on the site is driven by **two files**. You do not need to
touch a component to add, remove, reorder, retitle or translate a piece.

- `src/config/portfolio.ts` — projects, worlds, AI pieces, albums, tracks, bio, contact links
- `src/config/siteTexts.ts` — every other string (nav, labels, headings, form copy), EN + FA

---

## 1. Drop images in `public/art/`

Put files here and reference them as `/art/<name>.jpg` in the config.

Current art set:

| File | Used by | Notes |
|---|---|---|
| `hero.jpg` | Cover, Journal | The opening plate. Preloaded in `index.html`. |
| `worlds-01…04.jpg` | Worlds, Work, Album 2 | 3D environment plates. |
| `ai-01…05.jpg` | AI Art, Work, Album 1 & 3 | Generative works. |
| `portrait.jpg` | About | **Not yet supplied** — the About room renders a designed placeholder at this path. |

Recommended: JPEG/WebP, long edge 2000–2400 px, quality ~80, under 400 kB.
Every image is rendered through `src/components/ui/Art.tsx`, which falls back
to a quiet geometric placeholder if a file is missing — so you can wire a new
project into the config before the plate exists and nothing looks broken.

---

## 2. Add a project (Work room)

```ts
{
  id: "new-thing",              // unique, stable
  index: "07",                  // the printed numeral
  title: { en: "New Thing", fa: "چیز تازه" },
  kind: "site",                 // "site" | "identity" | "code"
  year: "2026",
  role: { en: "Design, build", fa: "طراحی، ساخت" },
  summary: { en: "One sentence.", fa: "یک جمله." },
  image: "/art/work-07.jpg",
  tags: ["Editorial", "React"],
  // url: "https://...",        // optional, for live work
}
```

It appears automatically in the contact sheet **and** the index table, and
participates in the filter chips.

---

## 3. Add a world / AI piece / album

- **World** → push to `WORLDS` (title, place, caption, stack, image).
- **AI piece** → push to `AI_PIECES`; set `tall: true` for a vertical work so
  it spans two gallery rows.
- **Album** → push to `ALBUMS` with its `tracks[]`.

---

## 4. Wire real audio (Sound room)

Tracks are defined with an optional `src`:

```ts
{ id: "nd-1", index: "01", title: {…}, year: "2026", length: "4:12",
  src: "/audio/ring-road.mp3" }
```

1. Put the file in `public/audio/`.
2. Add `src` to the track.

Without `src`, the player shows a disabled transport and an explanatory
placeholder line — intentional, not broken. With `src`, play/pause, seek and
auto-advance to the next track all work.

---

## 5. Swap the portrait

Save a photo to `public/art/portrait.jpg` (4:5 portrait crops best). The About
room's parallax gatefold picks it up; nothing else to change.

---

## 6. Copy and languages

`siteTexts.ts` is a flat `Record<Lang, Record<string, string>>` for both `en`
and `fa`. **Both objects must keep the same keys** — TypeScript won't catch a
missing key because the value type is `string` for any key, so if you add a
string to `en`, add it to `fa` in the same edit.

Persian specifics already handled in CSS: display faces switch to Vazirmatn at
weight 700, letterspacing is reset, italics suppressed, and the whole document
flips `dir="rtl"`.

---

## 7. Journal / admin

The Journal tab keeps the existing Cloudflare Worker + D1 backend unchanged
(`worker/`, `src/api/posts.ts`, `src/config/adminConfig.ts`). See
`ADMIN_SETUP.md`. Posts are created with a media URL; the journal grid renders
image, video or audio, and falls back to a designed tile when a URL is missing
or dies.

---

## 8. Deleting the six old clinic templates

Already done. `Templates/` (Verda, Lumina, Clarity, Pulse, Aurora, Lumen — all
clinic sites), `scripts/build-templates.mjs`, and every reference in the
sitemap, `llms.txt`, `humans.txt`, manifest and JSON-LD have been removed.
They are recoverable from git history if you ever want them back.
