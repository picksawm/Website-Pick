/**
 * entry-server.tsx — build-time only. Never shipped to the browser.
 *
 * The prerenderer imports this one module and gets everything it needs:
 * the renderer, the route list, and the head renderer. One bundle, one
 * contract, no cross-bundle guessing.
 *
 * Keep this file free of browser globals: it runs in Node.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import type { Lang } from "./config/siteTexts";

export { ALL_PATHS, metaFor, indexablePaths } from "./seo/meta";
export { renderHeadHtml } from "./seo/head";

export function render(path: string, lang: Lang = "en"): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App initialLang={lang} forPrerender />
      </StaticRouter>
    </StrictMode>
  );
}
