import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Image-first build: no single-file inlining. Fonts and artwork stay as
 * separate, cacheable files — the old `viteSingleFile()` setup
 * base64-inlined every font subset and image into one huge HTML
 * document, which is exactly the weight this rebuild escapes.
 */
export default defineConfig({
  /**
   * base "/" — NOT "./".
   *
   * Relative asset URLs only resolve correctly at the site root. With
   * directory-index routes (/worlds/index.html) a "./assets/..." path
   * would resolve to /worlds/assets/... and 404. Absolute paths are
   * required for the clean URLs the SEO work depends on.
   */
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2020",
    cssMinify: "lightningcss",
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["motion"],
        },
      },
    },
  },
});
