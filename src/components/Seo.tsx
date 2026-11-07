import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Lang } from "../config/siteTexts";

/**
 * Seo — runtime companion to the static head in index.html.
 * Keeps <html lang/dir>, the document title, description and canonical
 * URL correct as the visitor walks between rooms.
 */

const SITE = "https://picksaw.ir";

const ROUTES: Record<Lang, Record<string, { title: string; desc: string }>> = {
  en: {
    "/": {
      title: "PICKSAW — Amirehsan Ashoori · Portfolio",
      desc: "The working archive of Amirehsan Ashoori: websites, 3D environments, AI art and music. An image-first portfolio in six rooms.",
    },
    "/work": {
      title: "Work — Websites, identity & creative code · PICKSAW",
      desc: "Selected websites, visual identities and creative-code projects by Amirehsan Ashoori, built as editorial, image-first experiences.",
    },
    "/worlds": {
      title: "Worlds — 3D environments & Unreal Engine · PICKSAW",
      desc: "Cinematic 3D environments, procedural architecture and real-time scenes built in Unreal Engine by Amirehsan Ashoori.",
    },
    "/ai": {
      title: "AI Art — Generative images & concepts · PICKSAW",
      desc: "Generative images and concept work by Amirehsan Ashoori — Persian miniature meets chrome, machine dreams edited by hand.",
    },
    "/sound": {
      title: "Sound — Music, rap & score · PICKSAW",
      desc: "Music production, rap writing and sound design for trailers, games and brand films by Amirehsan Ashoori.",
    },
    "/about": {
      title: "About Amirehsan Ashoori — Founder of PICKSAW",
      desc: "Amirehsan Ashoori is the founder, creative developer, designer and multidisciplinary artist behind PICKSAW — web, 3D/Unreal, AI art, music, creative coding and branding.",
    },
    "/contact": {
      title: "Contact — Start a project · PICKSAW",
      desc: "Work with Amirehsan Ashoori (PICKSAW) on websites, 3D environments, AI art or music. WhatsApp, phone, email and Instagram.",
    },
    "/journal": {
      title: "Journal — Notes & uploads · PICKSAW",
      desc: "Latest uploads and studio notes from PICKSAW by Amirehsan Ashoori.",
    },
  },
  fa: {
    "/": {
      title: "پیکساو — امیراحسان عاشوری · نمونه‌کارها",
      desc: "آرشیو کاری امیراحسان عاشوری: وب‌سایت، محیط سه‌بعدی، هنر هوش مصنوعی و موسیقی. نمونه‌کاری تصویرمحور در شش اتاق.",
    },
    "/work": {
      title: "کارها — وب‌سایت، هویت بصری و کد خلاقانه · پیکساو",
      desc: "گزیده‌ی وب‌سایت‌ها، هویت‌های بصری و پروژه‌های کد خلاقانه‌ی امیراحسان عاشوری، ساخته‌شده به‌صورت تجربه‌های ادیتوریال و تصویرمحور.",
    },
    "/worlds": {
      title: "دنیاها — محیط سه‌بعدی و Unreal Engine · پیکساو",
      desc: "محیط‌های سینمایی سه‌بعدی، معماری رویه‌ای و صحنه‌های بلادرنگ ساخته‌شده در Unreal Engine توسط امیراحسان عاشوری.",
    },
    "/ai": {
      title: "هنر هوش مصنوعی — تصاویر مولد و مفاهیم · پیکساو",
      desc: "تصاویر مولد و کارهای مفهومی امیراحسان عاشوری — نگارگری ایرانی در کنار کروم، رؤیای ماشین با تدوین انسانی.",
    },
    "/sound": {
      title: "صدا — موسیقی، رپ و موسیقی متن · پیکساو",
      desc: "تولید موسیقی، ترانه‌نویسی رپ و طراحی صدا برای تیزر، بازی و فیلم برند توسط امیراحسان عاشوری.",
    },
    "/about": {
      title: "درباره امیراحسان عاشوری — بنیان‌گذار پیکساو",
      desc: "امیراحسان عاشوری بنیان‌گذار، توسعه‌دهنده خلاق، طراح و هنرمند چندرشته‌ای پشت پیکساو است؛ وب، سه‌بعدی/Unreal، هنر هوش مصنوعی، موسیقی، کدنویسی خلاقانه و برندینگ.",
    },
    "/contact": {
      title: "تماس — شروع یک پروژه · پیکساو",
      desc: "همکاری با امیراحسان عاشوری (پیکساو) برای وب‌سایت، محیط سه‌بعدی، هنر هوش مصنوعی یا موسیقی. واتس‌اپ، تماس، ایمیل و اینستاگرام.",
    },
    "/journal": {
      title: "ژورنال — یادداشت‌ها و آپلودها · پیکساو",
      desc: "آخرین آپلودها و یادداشت‌های استودیو از پیکساو، امیراحسان عاشوری.",
    },
  },
};

export default function Seo({ lang }: { lang: Lang }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    const meta = ROUTES[lang][pathname] ?? ROUTES[lang]["/"];
    document.title = meta.title;

    const setMeta = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', "name", "description", meta.desc);
    setMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    setMeta('meta[property="og:description"]', "property", "og:description", meta.desc);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.desc);

    const url = pathname === "/" ? `${SITE}/` : `${SITE}/#${pathname}`;
    setMeta('meta[property="og:url"]', "property", "og:url", url);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [lang, pathname]);

  return null;
}
