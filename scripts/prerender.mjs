/**
 * prerender.mjs — static HTML for every crawlable route.
 *
 * Why this exists: the site is a client-rendered SPA. Without this step
 * every URL serves the same empty `<div id="root">` and one generic
 * <head>, so search engines see one page, not eight. GitHub Pages
 * cannot run SSR, so we render at build time instead.
 *
 * Per route it:
 *   1. renders the real component tree to HTML (renderToString)
 *   2. writes a route-specific <head> (unique title/description/
 *      canonical/OG/JSON-LD) using the same module the app uses
 *   3. emits directory-index files, so GitHub Pages serves clean URLs:
 *        dist/worlds/index.html  →  https://picksaw.ir/worlds
 *      the same way the old /verda/ template folders worked.
 *
 * The client bundle still hydrates on top, so interactivity is unchanged
 * and the deployed artefact stays fully static.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const log = (...a) => console.log("[prerender]", ...a);

async function main() {
  if (!existsSync(path.join(dist, "index.html"))) {
    throw new Error("prerender: run `vite build` first (dist/index.html is missing)");
  }

  // ── 1. one SSR bundle: renderer + routes + head, all from src ──────
  log("bundling SSR entry…");
  rmSync(ssrDir, { recursive: true, force: true });
  await build({
    root,
    configFile: false,
    logLevel: "warn",
    resolve: { alias: { "@": path.join(root, "src") } },
    plugins: [react()],
    build: {
      ssr: path.join(root, "src/entry-server.tsx"),
      outDir: "dist-ssr",
      emptyOutDir: true,
      write: true,
      target: "node20",
      minify: false,
      rollupOptions: { output: { format: "es", entryFileNames: "entry-server.mjs" } },
    },
  });

  const entryFile = path.join(ssrDir, "entry-server.mjs");
  if (!existsSync(entryFile)) throw new Error("prerender: SSR entry was not emitted");

  const { render, renderHeadHtml, ALL_PATHS } = await import(pathToFileURL(entryFile).href);

  // ── 2. splice each route into the built index.html ────────────────
  const template = readFileSync(path.join(dist, "index.html"), "utf8");
  const HEAD = /<!--SEO_HEAD-->[\s\S]*?<!--\/SEO_HEAD-->/;
  const ROOT = '<div id="root"></div>';

  if (!HEAD.test(template)) throw new Error("prerender: <!--SEO_HEAD--> marker missing from index.html");
  if (!template.includes(ROOT)) throw new Error("prerender: empty #root container not found in index.html");

  log(`${ALL_PATHS.length} routes`);
  let written = 0;

  for (const routePath of ALL_PATHS) {
    const html = template
      .replace(HEAD, renderHeadHtml("en", routePath))
      .replace(ROOT, `<div id="root">${render(routePath, "en")}</div>`);

    const dir = routePath === "/" ? dist : path.join(dist, routePath.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), html);

    const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
    log(`  ✓ ${routePath.padEnd(10)} ${kb} kB`);
    written++;
  }

  // ── 3. clean up the build-time bundle ─────────────────────────────
  rmSync(ssrDir, { recursive: true, force: true });

  // ── 4. sitemap generated from the same route list ─────────────────
  const today = new Date().toISOString().slice(0, 10);
  const priority = (p) => (p === "/" ? "1.0" : p === "/about" || p === "/contact" ? "0.6" : "0.8");
  const changefreq = (p) => (p === "/" || p === "/journal" ? "weekly" : "monthly");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ALL_PATHS.map(
  (p) => `  <url>
    <loc>https://picksaw.ir${p === "/" ? "/" : p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq(p)}</changefreq>
    <priority>${priority(p)}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://picksaw.ir${p}"/>
    <xhtml:link rel="alternate" hreflang="fa-IR" href="https://picksaw.ir${p}#fa"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://picksaw.ir${p}"/>
  </url>`
).join("\n")}
</urlset>
`;
  writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  log(`sitemap.xml — ${ALL_PATHS.length} urls (no hash routes)`);

  // ── 5. a real 404 document for unknown paths ──────────────────────
  const notFound = template
    .replace(HEAD, '<title>Not found — Picksaw</title>\n    <meta name="robots" content="noindex, follow" />')
    .replace(ROOT, `<div id="root">${render("/__not_found__", "en")}</div>`);
  writeFileSync(path.join(dist, "404.html"), notFound);

  log(`done — ${written} pages + 404.html`);
}

main().catch((err) => {
  console.error("[prerender] FAILED\n", err);
  process.exit(1);
});
