/**
 * portfolio.ts — the single source of truth for everything on show.
 *
 * Swap images in public/art/, edit titles here. No component needs
 * touching to add, remove or reorder a piece.
 */
import type { Lang } from "./siteTexts";

export type Localized = Record<Lang, string>;

const L = (en: string, fa: string): Localized => ({ en, fa });
export const t = (value: Localized, lang: Lang) => value[lang] ?? value.en;

/* ─────────────────────────── 01 · WORK ─────────────────────────── */

export type WorkKind = "site" | "identity" | "code";

export interface Project {
  id: string;
  index: string;
  title: Localized;
  kind: WorkKind;
  year: string;
  role: Localized;
  summary: Localized;
  image: string;
  tags: string[];
  /** live URL — omit for private / concept work */
  url?: string;
}

export const WORK_KINDS: { id: WorkKind; label: Localized }[] = [
  { id: "site", label: L("Websites", "وب‌سایت") },
  { id: "identity", label: L("Identity", "هویت بصری") },
  { id: "code", label: L("Creative code", "کد خلاقانه") },
];

export const PROJECTS: Project[] = [
  {
    id: "night-archive",
    index: "01",
    title: L("Night Archive", "آرشیو شب"),
    kind: "site",
    year: "2026",
    role: L("Design, front-end, motion", "طراحی، فرانت‌اند، موشن"),
    summary: L(
      "A dark editorial archive for a photographic body of work — one image per screen, thumbnails that behave like film frames.",
      "آرشیو ادیتوریال تاریک برای مجموعه‌ای عکاسی — یک تصویر در هر صفحه، بندانگشتی‌هایی که مثل فریم فیلم رفتار می‌کنند."
    ),
    image: "/art/hero.jpg",
    tags: ["Editorial", "React", "Scroll"],
  },
  {
    id: "verda",
    index: "02",
    title: L("Verda", "وِردا"),
    kind: "site",
    year: "2025",
    role: L("Design, build, bilingual system", "طراحی، ساخت، سیستم دوزبانه"),
    summary: L(
      "A cinematic bilingual site for a skin studio — slow type, warm light, a booking flow that never breaks the mood.",
      "سایتی سینمایی و دوزبانه برای استودیوی پوست — تایپ آرام، نور گرم، مسیر رزرو که حال‌وهوا را نمی‌شکند."
    ),
    image: "/art/worlds-02.jpg",
    tags: ["Bilingual", "Booking", "RTL"],
  },
  {
    id: "stormblade",
    index: "03",
    title: L("Stormblade", "استورم‌بلید"),
    kind: "code",
    year: "2025",
    role: L("Concept, UI, sound", "مفهوم، رابط کاربری، صدا"),
    summary: L(
      "A browser game world: procedural city blocks, rain, and a lightning system that reads the player's pace.",
      "دنیای یک بازی مرورگری: بلوک‌های شهری رویه‌ای، باران و سیستمی از آذرخش که ریتم بازیکن را می‌خواند."
    ),
    image: "/art/worlds-03.jpg",
    tags: ["WebGL", "Game", "Procedural"],
  },
  {
    id: "persian-futures",
    index: "04",
    title: L("Persian Futures", "آینده‌های ایرانی"),
    kind: "identity",
    year: "2024",
    role: L("Identity, art direction", "هویت، کارگردانی هنری"),
    summary: L(
      "A visual identity built on muqarnas geometry and neon — a system that survives print, screen and 3D.",
      "هویتی بصری بر پایه‌ی هندسه‌ی مقرنس و نئون — سیستمی که در چاپ، نمایشگر و سه‌بعدی زنده می‌ماند."
    ),
    image: "/art/ai-04.jpg",
    tags: ["Identity", "Type", "Geometry"],
  },
  {
    id: "quiet-hours",
    index: "05",
    title: L("Quiet Hours", "ساعت‌های خاموش"),
    kind: "site",
    year: "2024",
    role: L("Design, build", "طراحی، ساخت"),
    summary: L(
      "A listening site for an ambient record label — the page is a single waveform you scroll through.",
      "سایتی برای شنیدن، برای یک لیبل موسیقی امبینت — کل صفحه یک موج صوتی است که در آن اسکرول می‌کنید."
    ),
    image: "/art/ai-05.jpg",
    tags: ["Audio", "Minimal", "Scroll"],
  },
  {
    id: "concrete-garden",
    index: "06",
    title: L("Concrete Garden", "باغ بتنی"),
    kind: "identity",
    year: "2023",
    role: L("Art direction, 3D", "کارگردانی هنری، سه‌بعدی"),
    summary: L(
      "Campaign art for an architecture studio: buildings grown like plants, photographed like specimens.",
      "هنر کمپین برای یک استودیوی معماری: ساختمان‌هایی که مثل گیاه رشد می‌کنند و مثل نمونه‌ی موزه عکاسی می‌شوند."
    ),
    image: "/art/worlds-01.jpg",
    tags: ["Campaign", "3D", "Print"],
  },
];

/* ────────────────────────── 02 · WORLDS ────────────────────────── */

export interface World {
  id: string;
  index: string;
  title: Localized;
  place: Localized;
  year: string;
  image: string;
  caption: Localized;
  stack: string[];
}

export const WORLDS: World[] = [
  {
    id: "iwan",
    index: "I",
    title: L("The Iwan", "ایوان"),
    place: L("Blue hour, unbuilt", "ساعت آبی، ساخته‌نشده"),
    year: "2026",
    image: "/art/worlds-01.jpg",
    caption: L(
      "A monolithic arch scaled past human comfort — the fog does the depth cueing.",
      "طاقی یکپارچه، بزرگ‌تر از مقیاس انسانی — مه کار عمق را انجام می‌دهد."
    ),
    stack: ["Unreal Engine 5", "Lumen", "Substance"],
  },
  {
    id: "reservoir",
    index: "II",
    title: L("Reservoir", "مخزن"),
    place: L("Interior study", "مطالعه‌ی داخلی"),
    year: "2025",
    image: "/art/worlds-02.jpg",
    caption: L(
      "One skylight, one beam. Everything else in the frame is there to measure it.",
      "یک نورگیر، یک پرتو. هر چیز دیگر در کادر برای اندازه‌گیری آن است."
    ),
    stack: ["Unreal Engine 5", "Nanite", "Houdini"],
  },
  {
    id: "salt-tower",
    index: "III",
    title: L("Salt Tower", "برج نمک"),
    place: L("Exterior, night", "نمای بیرونی، شب"),
    year: "2025",
    image: "/art/worlds-03.jpg",
    caption: L(
      "A landmark with nothing around it — the loneliness is the composition.",
      "نشانه‌ای بدون هیچ چیز در اطرافش — تنهایی همان ترکیب‌بندی است."
    ),
    stack: ["Blender", "Unreal", "DaVinci"],
  },
  {
    id: "reading-room",
    index: "IV",
    title: L("Reading Room", "اتاق مطالعه"),
    place: L("Interior, day", "داخلی، روز"),
    year: "2024",
    image: "/art/worlds-04.jpg",
    caption: L(
      "Books stacked into architecture. A single blade of light to hold the dust.",
      "کتاب‌هایی که به معماری تبدیل شده‌اند. یک تیغه نور که غبار را نگه دارد."
    ),
    stack: ["Unreal Engine 5", "Quixel", "Nuke"],
  },
];

/* ────────────────────────── 03 · AI ART ────────────────────────── */

export interface AiPiece {
  id: string;
  index: string;
  title: Localized;
  medium: Localized;
  year: string;
  image: string;
  /** vertical images span two gallery rows */
  tall?: boolean;
  note: Localized;
}

export const AI_PIECES: AiPiece[] = [
  {
    id: "two-faces",
    index: "A1",
    title: L("Two Faces of the Same Mother", "دو چهره از یک مادر"),
    medium: L("Image — generative + retouch", "تصویر — مولد + رتوش"),
    year: "2026",
    image: "/art/ai-01.jpg",
    tall: true,
    note: L(
      "Persian miniature on one side, chrome optics on the other. Twenty-two passes to keep the seam honest.",
      "یک سو نگارگری ایرانی، سوی دیگر اپتیک کروم. بیست‌ودو پاس تا درز صادق بماند."
    ),
  },
  {
    id: "offering",
    index: "A2",
    title: L("The Offering", "پیشکش"),
    medium: L("Image — concept", "تصویر — مفهوم"),
    year: "2026",
    image: "/art/ai-02.jpg",
    note: L(
      "A hand holding a flower made of light. Everything scaled up until it feels religious.",
      "دستی که گلی از نور نگه داشته. همه‌چیز بزرگ شده تا حس آیینی بگیرد."
    ),
  },
  {
    id: "doors",
    index: "A3",
    title: L("Every Door Opens Somewhere", "هر دری جایی باز می‌شود"),
    medium: L("Image — sequence", "تصویر — سکانس"),
    year: "2025",
    image: "/art/ai-03.jpg",
    note: L(
      "Recursive exits. Built as a five-frame sequence, this is the frame that holds.",
      "خروج‌های بازگشتی. به‌صورت سکانس پنج‌فریمی ساخته شد؛ این فریم می‌ماند."
    ),
  },
  {
    id: "dissolve",
    index: "A4",
    title: L("Dissolve", "تحلیل"),
    medium: L("Image — study", "تصویر — مطالعه"),
    year: "2025",
    image: "/art/ai-04.jpg",
    note: L(
      "A bust coming apart into embers. The particles were painted back in by hand.",
      "نیم‌تنه‌ای که به اخگر تبدیل می‌شود. ذره‌ها با دست بازنقاشی شدند."
    ),
  },
  {
    id: "portal",
    index: "A5",
    title: L("Portal Study", "مطالعه‌ی دروازه"),
    medium: L("Image — vertical", "تصویر — عمودی"),
    year: "2024",
    image: "/art/ai-05.jpg",
    tall: true,
    note: L(
      "Muqarnas as a light source. The first frame of a longer motion test.",
      "مقرنس به‌عنوان منبع نور. اولین فریم از تست حرکتی بلندتر."
    ),
  },
  {
    id: "harbor",
    index: "A6",
    title: L("Harbor, No Ships", "بندر، بدون کشتی"),
    medium: L("Image — location", "تصویر — مکان"),
    year: "2024",
    image: "/art/hero.jpg",
    note: L(
      "The cover frame, extended. Rain, concrete, and a lens that never quite focuses.",
      "فریم روی جلد، ادامه‌یافته. باران، بتن و لنزی که هیچ‌وقت کامل فوکوس نمی‌شود."
    ),
  },
];

/* ─────────────────────────── 04 · SOUND ────────────────────────── */

export interface Track {
  id: string;
  index: string;
  title: Localized;
  year: string;
  length: string;
  /** optional audio file in public/audio/ — leave undefined for a designed placeholder */
  src?: string;
}

export interface Album {
  id: string;
  title: Localized;
  kind: Localized;
  year: string;
  image: string;
  note: Localized;
  tracks: Track[];
}

export const ALBUMS: Album[] = [
  {
    id: "night-drive",
    title: L("Night Drive", "رانندگی شبانه"),
    kind: L("EP — 5 tracks", "ای‌پی — ۵ قطعه"),
    year: "2026",
    image: "/art/ai-05.jpg",
    note: L(
      "Recorded between 2 and 5 a.m. Slow kicks, tape hiss, one voice.",
      "ضبط‌شده بین ساعت ۲ تا ۵ صبح. کیک آرام، خش نوار، یک صدا."
    ),
    tracks: [
      { id: "nd-1", index: "01", title: L("Ring Road", "جاده‌ی کمربندی"), year: "2026", length: "4:12" },
      { id: "nd-2", index: "02", title: L("Headlights", "چراغ‌ها"), year: "2026", length: "3:38" },
      { id: "nd-3", index: "03", title: L("No Exit", "بدون خروج"), year: "2026", length: "5:02" },
      { id: "nd-4", index: "04", title: L("Tunnel Hum", "زمزمه‌ی تونل"), year: "2026", length: "2:56" },
      { id: "nd-5", index: "05", title: L("Morning Static", "استاتیک صبح"), year: "2026", length: "6:20" },
    ],
  },
  {
    id: "mask-songs",
    title: L("Mask Songs", "ترانه‌های نقاب"),
    kind: L("Album — 4 tracks", "آلبوم — ۴ قطعه"),
    year: "2025",
    image: "/art/worlds-04.jpg",
    note: L(
      "Rap written in Persian, over arrangements that never quite resolve.",
      "رپ فارسی، روی تنظیم‌هایی که هیچ‌وقت کامل حل نمی‌شوند."
    ),
    tracks: [
      { id: "ms-1", index: "01", title: L("Narcissus", "نارسیس"), year: "2025", length: "3:44" },
      { id: "ms-2", index: "02", title: L("Salt", "نمک"), year: "2025", length: "4:18" },
      { id: "ms-3", index: "03", title: L("Mirror Work", "کار آینه"), year: "2025", length: "3:02" },
      { id: "ms-4", index: "04", title: L("Take It Off Slow", "آرام درش بیار"), year: "2025", length: "5:30" },
    ],
  },
  {
    id: "scores",
    title: L("Scores", "موسیقی متن"),
    kind: L("Selected cues", "گزیده"),
    year: "2024 — 2026",
    image: "/art/ai-02.jpg",
    note: L(
      "Trailers, game atmospheres and brand films, scored to picture.",
      "تیزر، فضای بازی و فیلم برند، هم‌زمان با تصویر."
    ),
    tracks: [
      { id: "sc-1", index: "01", title: L("Stormblade — Main Theme", "استورم‌بلید — تم اصلی"), year: "2025", length: "2:48" },
      { id: "sc-2", index: "02", title: L("Iwan — Trailer", "ایوان — تیزر"), year: "2026", length: "1:36" },
      { id: "sc-3", index: "03", title: L("Concrete Garden", "باغ بتنی"), year: "2024", length: "3:10" },
    ],
  },
];

/* ─────────────────────────── 05 · ABOUT ────────────────────────── */

export const ABOUT = {
  portrait: "/art/ai-01.jpg",
  portraitSquare: "/art/worlds-04.jpg",
  style: [
    L("Cyberpunk and futuristic worlds", "دنیاهای سایبرپانک و آینده‌نگر"),
    L("Persian art and cultural influences", "هنر و فرهنگ ایرانی"),
    L("Cinematic lighting and atmosphere", "نورپردازی و فضای سینمایی"),
    L("Architecture and minimalism", "معماری و مینیمالیسم"),
    L("Mystery, masks and symbolic storytelling", "راز، ماسک‌ها و روایت نمادین"),
    L("Black-and-white contrast with selective colour", "تضاد سیاه‌وسفید با رنگ انتخابی"),
    L("Nature mixed with technology", "طبیعت درآمیخته با فناوری"),
  ],
  disciplines: [
    {
      name: L("Web Design & Development", "طراحی و توسعه وب"),
      desc: L(
        "Modern websites, interactive landing pages and premium templates with visual storytelling, smooth UX and cinematic presentation.",
        "وب‌سایت‌های مدرن، لندینگ‌پیج‌های تعاملی و قالب‌های پریمیوم با تمرکز بر روایت بصری، تجربه‌ی روان و ارائه‌ی سینمایی."
      ),
    },
    {
      name: L("3D Art & Unreal Engine", "هنر سه‌بعدی و Unreal"),
      desc: L(
        "Environments, experiments and cinematic scenes — procedural generation, lighting, world-building and real-time rendering.",
        "محیط‌ها، تجربه‌ها و صحنه‌های سینمایی؛ تولید رویه‌ای، نورپردازی، جهان‌سازی و رندر بلادرنگ."
      ),
    },
    {
      name: L("AI Art & Video", "هنر و ویدیوی هوش مصنوعی"),
      desc: L(
        "Original artwork, animated concepts, character designs and visual experiments blending imagination with technical workflows.",
        "آرت‌ورک اصلی، مفاهیم متحرک، طراحی کاراکتر و آزمایش‌های بصری با ترکیب تخیل و گردش‌کار فنی."
      ),
    },
    {
      name: L("Music & Sound", "موسیقی و صدا"),
      desc: L(
        "Music production, rap writing, atmosphere-driven composition and sound design — stories told beyond the visual.",
        "تولید موسیقی، ترانه‌نویسی رپ، آهنگسازی جوی و طراحی صدا؛ روایت داستان فراتر از تصویر."
      ),
    },
    {
      name: L("Creative Coding", "کدنویسی خلاقانه"),
      desc: L(
        "Interactive experiences where programming becomes part of the art — animation, motion, effects and experimental interfaces.",
        "تجربه‌های تعاملی که در آن‌ها برنامه‌نویسی بخشی از هنر است؛ انیمیشن، حرکت، افکت‌ها و رابط‌های تجربی."
      ),
    },
    {
      name: L("Branding & Visual Identity", "برندینگ و هویت بصری"),
      desc: L(
        "Visual identities, concepts and creative systems that make projects feel distinctive rather than generic.",
        "هویت‌های بصری، مفاهیم و سیستم‌های خلاقانه که پروژه‌ها را متمایز و غیرکلیشه‌ای می‌کنند."
      ),
    },
  ],
  skills: [
    L("Web Design", "طراحی وب"),
    L("Front-End Development", "توسعه فرانت‌اند"),
    L("UI/UX Design", "طراحی UI/UX"),
    L("3D Environment Creation", "ساخت محیط سه‌بعدی"),
    L("Unreal Engine", "موتور Unreal"),
    L("Creative Coding", "کدنویسی خلاقانه"),
    L("AI Art", "هنر هوش مصنوعی"),
    L("AI Video", "ویدیوی هوش مصنوعی"),
    L("Digital Illustration", "تصویرسازی دیجیتال"),
    L("Motion Design", "طراحی حرکت"),
    L("Music Production", "تولید موسیقی"),
    L("Rap & Lyric Writing", "رپ و ترانه‌نویسی"),
    L("Sound Design", "طراحی صدا"),
    L("Visual Branding", "برندینگ بصری"),
    L("Concept Development", "توسعه‌ی مفهوم"),
    L("Digital Storytelling", "روایت دیجیتال"),
  ],
  timeline: [
    {
      year: "2020",
      title: L("First frames", "اولین فریم‌ها"),
      body: L(
        "Started with illustration and digital art, learning composition the slow way.",
        "با تصویرسازی و هنر دیجیتال شروع کردم؛ ترکیب‌بندی را آرام و سخت یاد گرفتم."
      ),
    },
    {
      year: "2022",
      title: L("Into the browser", "ورود به مرورگر"),
      body: L(
        "Moved from static images to interactive web — first shaders, first scroll stories.",
        "از تصویر ثابت به وب تعاملی رسیدم — اولین شیدرها، اولین روایت‌های اسکرولی."
      ),
    },
    {
      year: "2024",
      title: L("Worlds and sound", "دنیاها و صدا"),
      body: L(
        "Unreal environments and a first record. Two ways of building atmosphere.",
        "محیط‌های Unreal و اولین رکورد. دو راه برای ساختن فضا."
      ),
    },
    {
      year: "2026",
      title: L("The archive", "آرشیو"),
      body: L(
        "PICKSAW becomes one place for all of it — image-first, quiet, built to last.",
        "پیکساو یک جای واحد برای همه‌ی این‌ها می‌شود — تصویرمحور، آرام، ساخته‌شده برای ماندن."
      ),
    },
  ],
};

/* ─────────────────────────── CONTACT ─────────────────────────── */

export const CONTACT = {
  whatsapp: "https://wa.me/989380215823",
  phone: "+989380215823",
  phoneLabel: "+98 938 021 5823",
  instagram: "https://www.instagram.com/picksawm/",
  instagramLabel: "@picksawm",
  email: "hello@picksaw.ir",
  game: "https://stormblade.picksaw.ir",
};

/* ─────────────────────────── ROOMS ─────────────────────────── */

export const ROOMS = [
  { key: "work", path: "/work", number: "01" },
  { key: "worlds", path: "/worlds", number: "02" },
  { key: "ai", path: "/ai", number: "03" },
  { key: "sound", path: "/sound", number: "04" },
  { key: "about", path: "/about", number: "05" },
  { key: "contact", path: "/contact", number: "06" },
] as const;

export type RoomKey = (typeof ROOMS)[number]["key"];

export const roomLabel = (key: RoomKey, lang: Lang): string => {
  const map: Record<RoomKey, Localized> = {
    work: L("Work", "کارها"),
    worlds: L("Worlds", "دنیاها"),
    ai: L("AI Art", "هنر هوش مصنوعی"),
    sound: L("Sound", "صدا"),
    about: L("About", "درباره من"),
    contact: L("Contact", "تماس"),
  };
  return t(map[key], lang);
};

export const roomEyebrow = (key: RoomKey, lang: Lang): string => {
  const map: Record<RoomKey, Localized> = {
    work: L("01 — Work", "۰۱ — کارها"),
    worlds: L("02 — Worlds", "۰۲ — دنیاها"),
    ai: L("03 — AI Art", "۰۳ — هنر هوش مصنوعی"),
    sound: L("04 — Sound", "۰۴ — صدا"),
    about: L("05 — About", "۰۵ — درباره من"),
    contact: L("06 — Contact", "۰۶ — تماس"),
  };
  return t(map[key], lang);
};
