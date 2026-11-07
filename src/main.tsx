import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
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
