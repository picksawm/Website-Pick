# Picksaw — SEO & AI-discoverability setup

## Rendering model (read this first)

The site is a client-rendered React SPA, but **every route is prerendered to
static HTML at build time** by `scripts/prerender.mjs`. GitHub Pages serves
`/worlds/index.html` at `/worlds`, so each tab is a real, crawlable document
with its own title, description, canonical, OG tags and JSON-LD — not a
client-side filter behind a fragment.

Two rules follow from this and must not be broken:

1. **No hash routes.** `HashRouter` was removed; `/#/work` style URLs collapse
   every page into one crawlable URL. Old hash bookmarks are forwarded to real
   paths by `HashLegacyRedirect` in `src/App.tsx`.
2. **`base` must stay `/`.** Relative (`./`) asset paths break at
   `/worlds/`, because `./assets/…` resolves to `/worlds/assets/…`.

Adding a page means adding it to `ROUTES_EN` **and** `ROUTES_FA` in
`src/seo/meta.ts`; the sitemap, prerender and runtime head all follow
automatically.

Everything in the repo is already in place; the remaining steps are
one-time verifications on external services (they require domain
ownership access).

## What ships with the site

| File | Purpose |
|---|---|
| `src/seo/meta.ts` | **Single source of truth** for per-route title/description/canonical/OG/JSON-LD (EN + FA) |
| `src/seo/head.ts` | Turns a route's meta into tags — used by both the prerenderer and the browser |
| `scripts/prerender.mjs` | Renders all 8 routes to real static HTML with route-specific `<head>` at build time |
| `index.html` `<head>` | Neutral shell + `<!--SEO_HEAD-->` marker that the prerenderer replaces per route |
| `index.html` JSON-LD `@graph` | Organization + **Person (Amirehsan Ashoori)** linked via `founder`, WebSite, CollectionPage listing the six rooms, Stormblade VideoGame |
| `public/og-image.png` | 1200×630 social/share card (brand mark, tagline, founder) |
| `public/favicon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Favicons + app icons |
| `public/site.webmanifest` | PWA manifest (name, brand, icons, colors) |
| `public/robots.txt` | Allows crawling, points to the sitemap |
| `dist/sitemap.xml` | **Generated** at build from the same route list — real paths, no hash URLs, hreflang pairs |
| `public/llms.txt`, `public/llms-full.txt` | Plain-language briefs for LLM crawlers (who Amirehsan Ashoori / PICKSAW is, every product and verified profile) |
| `public/humans.txt` | Human-readable credits |
| `public/.nojekyll` | Ensures GitHub Pages serves every file (incl. dotfiles/txt) |
| Footer | "© … PICKSAW · Amirehsan Ashoori (امیراحسان عاشوری)" (en + fa) |

Regenerate the social/icons artwork if branding changes:
`node scripts/seo-assets/render-seo-assets.mjs` (needs the local headless
Chromium setup used by the QA scripts).

## One-time external steps (do these after deploy, in order)

1. **Google Search Console** — https://search.google.com/search-console
   - Add property `https://picksaw.ir` (Domain property preferred:
     DNS TXT record; or URL-prefix with the HTML-file method).
   - Paste the token into `index.html` where the
     `google-site-verification` placeholder comment is, redeploy.
   - Submit **Sitemaps → `sitemap.xml`** and request indexing of `/`.
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   (feeds Bing, DuckDuckGo, Copilot): import from Search Console, submit
   the sitemap, add the `msvalidate.01` token the same way.
3. **Test structured data**: paste `https://picksaw.ir/` into
   https://search.google.com/test/rich-results — expect zero errors.
4. **Social cards**: debug/re-scrape after deploy so Facebook/LinkedIn/X
   cache `og-image.png`:
   - https://developers.facebook.com/tools/debug/
   - https://www.linkedin.com/post-inspector/
5. **AI-knowledge profiles** (these are the "sameAs" identity anchors AI
   assistants trust — create the ones you use, they don't all need
   content yet): a public GitHub and/or LinkedIn, an X profile, a
   YouTube/Google Business Profile if applicable. Then:
   - add each URL to **both** `sameAs` arrays in the JSON-LD graph in
     `index.html`,
   - add them under Identity/Products in `public/llms.txt` and
     `public/llms-full.txt`,
   - list them in `public/sitemap.xml` only if they are pages on
     picksaw.ir (external profiles do not belong in the sitemap).
6. **Consistency across the web** matters for ranking and for AI
   answers: use the exact name "Amirehsan Ashoori" /
   "امیراحسان عاشوری" and link back to picksaw.ir from every profile
   bio (Instagram @picksawm, WhatsApp business profile, template site
   footers).

## What to expect

- Technical eligibility is immediate after indexing; ranking #1 for the
  branded query **"picksaw"** typically follows within days/weeks once
  the domain is verified and there are a handful of external mentions.
- AI assistants refresh their indexes on different cycles (weeks to a
  few months). The JSON-LD founder link + llms.txt + consistent sameAs
  profiles are what make "who is Amirehsan Ashoori / who made PICKSAW"
  answerable; they cannot be forced, only signalled clearly — which the
  site now does.
- Keep the site reachable at exactly one canonical URL (redirect
  `www` → apex or vice-versa) and serve HTTPS — the GitHub Pages custom
  domain config handles HTTPS automatically.
