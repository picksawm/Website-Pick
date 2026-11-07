/**
 * legacy-redirects.mjs — safety net for retired URLs.
 *
 * The old template marketplace published six standalone sub-sites
 * (/verda/ /lumina/ /clarity/ /pulse/ /aurora/ /lumen/). They are gone.
 * If any of them were ever indexed, a hard 404 leaks whatever authority
 * they earned — so each gets a stub document that points search engines
 * at a real, relevant destination.
 *
 * IMPORTANT: GitHub Pages cannot issue HTTP 301s. This is a *soft*
 * redirect (canonical + meta refresh + JS). For true 301s, add Cloudflare
 * Redirect Rules at the edge:
 *
 *   /verda/*   → https://picksaw.ir/work    301
 *   /lumina/*  → https://picksaw.ir/work    301
 *   /clarity/* → https://picksaw.ir/work    301
 *   /pulse/*   → https://picksaw.ir/work    301
 *   /aurora/*  → https://picksaw.ir/ai      301
 *   /lumen/*   → https://picksaw.ir/ai      301
 *
 * Once the edge rules are live this script can be deleted.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ORIGIN = "https://picksaw.ir";

/** retired path → best current destination */
export const LEGACY_MAP = {
  "/verda": "/work",
  "/lumina": "/work",
  "/clarity": "/work",
  "/pulse": "/work",
  "/aurora": "/ai",
  "/lumen": "/ai",
};

const stub = (from, to) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="${ORIGIN}${to}" />
<meta http-equiv="refresh" content="0; url=${to}" />
<title>This page has moved — Picksaw</title>
<style>
  html,body{height:100%;margin:0;background:#08090b;color:#f4f1ea;
    font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
  a{color:#f4f1ea}
  p{max-width:26rem;line-height:1.7;font-size:.9rem;opacity:.7}
</style>
</head>
<body>
  <div>
    <p>This page has moved to the current Picksaw archive.</p>
    <p><a href="${to}">Continue to ${ORIGIN}${to} &rarr;</a></p>
  </div>
  <script>location.replace(${JSON.stringify(to)});</script>
</body>
</html>
`;

let count = 0;
for (const [from, to] of Object.entries(LEGACY_MAP)) {
  const dir = path.join(dist, from.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), stub(from, to));
  count++;
}
console.log(`[redirects] wrote ${count} legacy stubs (${Object.keys(LEGACY_MAP).join(", ")})`);
