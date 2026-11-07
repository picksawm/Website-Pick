/**
 * postbuild-404 — writes a standalone dist/404.html for hosts that serve
 * a real 404 document for unknown URLs (GitHub Pages does).
 *
 * Self-contained on purpose (inline CSS, zero external requests): the
 * site builds with base "./", so a 404 served from a deep mistyped path
 * must not depend on relative asset URLs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#08090b" />
<title>404 — Picksaw</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#08090b;color:#f4f1ea;
    font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:clamp(24px,6vw,72px);min-height:100%;
    -webkit-font-smoothing:antialiased;
  }
  .top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .mark{font-family:Georgia,"Times New Roman",serif;font-size:1.35rem;letter-spacing:-.02em}
  .eyebrow{font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;opacity:.4}
  main{max-width:1100px}
  h1{
    font-family:Georgia,"Times New Roman",serif;font-weight:400;
    font-size:clamp(3rem,13vw,11rem);line-height:.86;letter-spacing:-.035em;
    margin:clamp(24px,5vw,48px) 0 0;
  }
  h1 em{font-style:italic}
  .body{margin-top:clamp(20px,3vw,32px);max-width:26rem;font-size:.9rem;line-height:1.7;opacity:.6}
  .fa{font-family:"Vazirmatn",ui-sans-serif,system-ui,sans-serif;direction:rtl}
  a.home{
    display:inline-flex;align-items:center;gap:10px;margin-top:clamp(24px,4vw,40px);
    padding:.85rem 1.5rem;border:1px solid rgba(244,241,234,.25);text-decoration:none;
    color:#f4f1ea;font-size:13px;letter-spacing:.06em;transition:background .3s,color .3s;
  }
  a.home:hover{background:#f4f1ea;color:#08090b}
  footer{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
    border-top:1px solid rgba(244,241,234,.15);padding-top:16px;margin-top:48px}
  footer span{font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;opacity:.35}
</style>
</head>
<body>
<div class="top">
  <span class="mark">Picksaw</span>
  <span class="eyebrow">Error 404</span>
</div>
<main>
  <h1>This room<br /><em>is dark</em></h1>
  <p class="body">The page you&rsquo;re looking for was never built &mdash; or was taken down. The archive is still open.</p>
  <p class="body fa">صفحه‌ای که دنبالش بودید هرگز ساخته نشد — یا برداشته شد. آرشیو هنوز باز است.</p>
  <a class="home" href="./">Back to the archive &rarr;</a>
</main>
<footer>
  <span>PICKSAW — Amirehsan Ashoori</span>
  <span>Images first.</span>
</footer>
</body>
</html>
`;

mkdirSync(dist, { recursive: true });
writeFileSync(path.join(dist, "404.html"), html);
console.log("postbuild: wrote dist/404.html");
