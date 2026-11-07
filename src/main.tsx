import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
/* ── Articksaw typefaces ──────────────────────────────────────────
   Bodoni Moda  : display. Didone contrast, high-fashion drama.
   Space Grotesk: interface. Precise, faintly odd, never generic.
   Cormorant    : the accent voice, italic only, at most once a page.
   JetBrains    : plate marks and catalogue numbers.
   Vazirmatn    : Persian, across the whole system.                    */
/* latin subsets only — the site is EN + FA, nothing else is worth the
   bytes. Each file below is 14–46 kB and self-hosted.                   */
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-400-italic.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "./styles/cormorant.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource-variable/vazirmatn/wght.css";
import "./index.css";
import App from "./App";

/**
 * BrowserRouter, not HashRouter.
 *
 * Hash routes (`/#/work`) never send their fragment to the server, so
 * every page collapses into one URL for crawlers and cannot carry its
 * own canonical or OG tags. Real paths + build-time prerendering is what
 * makes each tab an indexable destination.
 *
 * Legacy hash bookmarks are handled in App's HashLegacyRedirect.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
