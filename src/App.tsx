import { useEffect, useState, useCallback, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";

import Nav from "./components/shell/Nav";
import CoverPage from "./pages/CoverPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";
import ArtworkPage from "./pages/ArtworkPage";
import WorldsRoom from "./pages/WorldsRoom";
import AiRoom from "./pages/AiRoom";
import SoundRoom from "./pages/SoundRoom";
import AboutRoom from "./pages/AboutRoom";
import ContactRoom from "./pages/ContactRoom";
import JournalRoom from "./pages/JournalRoom";
import NotFoundPage from "./pages/NotFoundPage";

import Seo from "./components/Seo";
import LoginModal from "./components/LoginModal";
import AdminPanel from "./components/AdminPanel";
import PostModal from "./components/PostModal";

import { setLenis, getLenis } from "./lib/lenis";
import { useAdmin } from "./hooks/useAdmin";
import { useLanguage } from "./hooks/useLanguage";
import { fetchPosts, createPostApi, deletePostApi, AuthError, type NewPostInput } from "./api/posts";
import { type Post } from "./types";

export const GAME_LINK = "https://stormblade.picksaw.ir";

/** Every route change starts at the top of the room. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface AppProps {
  /** language to boot in — the prerenderer passes the route's language */
  initialLang?: "en" | "fa";
  /** true while rendering to static HTML: no effects, no network, no scroll */
  forPrerender?: boolean;
}

/**
 * HashLegacyRedirect — old bookmarks were `/#/worlds`.
 *
 * HashRouter never told the server anything, so those URLs still exist in
 * the wild (and possibly in search results). This quietly forwards them
 * to the real path and replaces history, so the old link keeps working
 * while the canonical URL becomes a single, crawlable one.
 */
function HashLegacyRedirect() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== "/" || !hash) return;
    const target = hash.replace(/^#\/?/, "").split("?")[0];
    if (!target || target.startsWith("fa")) return;
    const legacy: Record<string, string> = {
      "": "/",
      work: "/work",
      collections: "/work",
      worlds: "/worlds",
      ai: "/ai",
      sound: "/sound",
      about: "/about",
      contact: "/contact",
      journal: "/journal",
      feed: "/journal",
    };
    const to = legacy[target];
    if (!to) return;
    window.history.replaceState(null, "", to);
    navigate(to, { replace: true });
  }, [pathname, hash, navigate]);

  return null;
}

export default function App({ initialLang, forPrerender = false }: AppProps = {}) {
  const { lang, toggle } = useLanguage(initialLang);
  const { isAdmin, login, logout } = useAdmin();
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // ── smooth scroll spine ────────────────────────────────────
  useEffect(() => {
    if (forPrerender) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });
    setLenis(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // ── posts ──────────────────────────────────────────────────
  useEffect(() => {
    if (forPrerender) return;
    let cancelled = false;
    (async () => {
      try {
        const loaded = await fetchPosts();
        if (!cancelled) setPosts(loaded);
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddPost = useCallback(
    async (input: NewPostInput) => {
      try {
        const saved = await createPostApi(input);
        setPosts((prev) => [saved, ...prev]);
      } catch (err) {
        if (err instanceof AuthError) logout();
        throw err;
      }
    },
    [logout]
  );

  const handleDeletePost = useCallback(
    async (id: string) => {
      try {
        await deletePostApi(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        if (err instanceof AuthError) logout();
        throw err;
      }
    },
    [logout]
  );

  const handleLogin = useCallback(
    async (password: string) => {
      const ok = await login(password);
      if (ok) setShowLogin(false);
      return ok;
    },
    [login]
  );

  const handleAdminOpen = useCallback(() => {
    if (isAdmin) setShowAdmin(true);
    else setShowLogin(true);
  }, [isAdmin]);

  const content = useMemo(
    () => (
      <Routes location={location}>
        <Route path="/" element={<CoverPage lang={lang} />} />
        <Route path="/work" element={<CollectionsPage lang={lang} />} />
        <Route path="/collections/:slug" element={<CollectionPage lang={lang} />} />
        <Route path="/collections/:slug/:artworkSlug" element={<ArtworkPage lang={lang} />} />
        <Route path="/worlds" element={<WorldsRoom lang={lang} />} />
        <Route path="/ai" element={<AiRoom lang={lang} />} />
        <Route path="/sound" element={<SoundRoom lang={lang} />} />
        <Route path="/about" element={<AboutRoom lang={lang} />} />
        <Route path="/contact" element={<ContactRoom lang={lang} />} />
        <Route
          path="/journal"
          element={
            <JournalRoom
              lang={lang}
              posts={posts}
              isAdmin={isAdmin}
              onPostClick={setSelectedPost}
              onDeletePost={handleDeletePost}
              onAdminOpen={handleAdminOpen}
            />
          }
        />
        <Route path="*" element={<NotFoundPage lang={lang} />} />
      </Routes>
    ),
    [lang, location, posts, isAdmin, handleDeletePost, handleAdminOpen]
  );

  // ── prerender path: static markup only, identical to the client tree ──
  if (forPrerender) {
    return (
      <div dir={lang === "fa" ? "rtl" : "ltr"} className="relative min-h-screen bg-[#08090b] antialiased">
        <Nav lang={lang} onToggleLang={toggle} isAdmin={false} onAdminOpen={() => {}} />
        {content}
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <HashLegacyRedirect />
      <Seo lang={lang} />

      <div
        dir={lang === "fa" ? "rtl" : "ltr"}
        className="relative min-h-screen bg-[#08090b] antialiased"
      >
        <a
          href="#room"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          {lang === "fa" ? "پرش به محتوا" : "Skip to content"}
        </a>

        <Nav lang={lang} onToggleLang={toggle} isAdmin={isAdmin} onAdminOpen={handleAdminOpen} />

        <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </motion.div>
        </AnimatePresence>

        {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
        {showAdmin && isAdmin && (
          <AdminPanel onAddPost={handleAddPost} onClose={() => setShowAdmin(false)} />
        )}
        {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </div>
    </>
  );
}
