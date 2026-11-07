/**
 * All site text in English and Farsi.
 * One key set, two voices. Anything a visitor reads lives here.
 */
export type Lang = "en" | "fa";

export const SITE_TEXTS: Record<Lang, Record<string, string>> = {
  en: {
    siteName: "Picksaw",
    skipLink: "Skip to content",
    ownerName: "Amirehsan Ashoori",
    ownerNameFa: "امیراحسان عاشوری",
    role: "Creative developer · 3D artist · musician",
    city: "Tehran, Iran",

    // ── nav / rooms ──────────────────────────────────────────
    navWork: "Work",
    navWorlds: "Worlds",
    navAi: "AI Art",
    navSound: "Sound",
    navAbout: "About",
    navContact: "Contact",
    navJournal: "Journal",
    menuLabel: "Menu",
    closeLabel: "Close",
    nextRoom: "Next room",
    prevRoom: "Previous room",
    scrollHint: "Scroll",
    langButton: "فارسی",
    langButtonShort: "FA",

    // ── cover ────────────────────────────────────────────────
    coverEyebrow: "Portfolio — 2020 / 2026",
    coverLine1: "Images that",
    coverLine2: "hold their",
    coverLine3: "breath",
    coverIntro:
      "PICKSAW is the working archive of Amirehsan Ashoori — websites, environments, AI images and sound, made between the night city and the Persian garden.",
    coverMetaLeft: "Six rooms",
    coverMetaMid: "Persian + English",
    coverMetaRight: "Made in Tehran",
    coverEnter: "Enter the archive",
    coverScroll: "Scroll to enter",

    // ── index (room directory) ───────────────────────────────
    indexTitle: "The rooms",
    indexSubtitle: "Six disciplines, six different rooms. Each one keeps its own light.",

    // ── room 01 · work ───────────────────────────────────────
    workEyebrow: "01 — Work",
    workTitle: "Sites built like films",
    workLead:
      "Interactive websites, editorial landing pages and interfaces. Shot first on paper, then in code — slow reveals, one idea per screen, nothing borrowed.",
    workStatement:
      "A website should behave like a room you walk into: the light changes as you move, and you leave knowing where you were.",
    workSelected: "Selected work",
    workScrollNote: "Drag the strip — or use the arrows",
    workFilterAll: "All",
    workFilterSites: "Websites",
    workFilterIdentity: "Identity",
    workFilterCode: "Creative code",
    workDiscipline: "Discipline",
    workYear: "Year",
    workRole: "Role",
    workOpen: "Open case",
    workProcessTitle: "How a room gets built",
    workProcess1Title: "Read the brief out loud",
    workProcess1Body: "Goals, audience and content are settled before a single pixel moves.",
    workProcess2Title: "Draw the light",
    workProcess2Body: "Palette, type scale and motion language, tested on the real content.",
    workProcess3Title: "Build the spine",
    workProcess3Body: "Layout, scroll physics and performance budget — the invisible work.",
    workProcess4Title: "Tune until it breathes",
    workProcess4Body: "Rhythm passes, mobile passes, then launch.",

    // ── room 02 · worlds ─────────────────────────────────────
    worldsEyebrow: "02 — Worlds",
    worldsTitle: "Places that only exist after render",
    worldsLead:
      "3D environments, procedural architecture and cinematic scenes built in Unreal Engine and real-time pipelines — concrete, fog and a single light source doing the storytelling.",
    worldsStackLabel: "Pipeline",
    worldsCount: "environments",
    worldsHint: "Move the pointer — the room leans with you",

    // ── room 03 · AI art ─────────────────────────────────────
    aiEyebrow: "03 — AI Art",
    aiTitle: "Machine dreams, human editing",
    aiLead:
      "Images and motion studies made with generative models, then cut, graded and sequenced by hand. The machine proposes; the edit decides.",
    aiCaptionNote: "Prompt, iteration and edit notes on every piece",
    aiMethodTitle: "The method",
    aiMethod1: "Prompt",
    aiMethod1Body: "Structure the scene in words — light, lens, material, mood.",
    aiMethod2: "Iterate",
    aiMethod2Body: "Dozens of passes; only the frame that carries tension survives.",
    aiMethod3: "Edit",
    aiMethod3Body: "Grade, composite, retouch. The machine never ships alone.",

    // ── room 04 · sound ──────────────────────────────────────
    soundEyebrow: "04 — Sound",
    soundTitle: "Nine records of night driving",
    soundLead:
      "Music production, rap writing and sound design. Atmosphere-first: tape hiss, a slow kick, a voice half-buried in reverb.",
    soundNowPlaying: "Now playing",
    soundPlay: "Play",
    soundPause: "Pause",
    soundTracklist: "Tracklist",
    soundPlaceholderNote:
      "Audio files are swap-in ready — drop them in public/audio and list them in one config file.",
    soundSoundDesignTitle: "Sound design & score",
    soundSoundDesignBody:
      "Trailers, game atmospheres and brand films scored to picture — from a single sustained tone to a full arrangement.",

    // ── room 05 · about ──────────────────────────────────────
    aboutEyebrow: "05 — About",
    aboutTitle: "Amirehsan Ashoori",
    aboutIdentity: "Creator behind PICKSAW",
    aboutLead:
      "My name is Amirehsan Ashoori, and I'm the creator behind PICKSAW — a creative identity that brings together technology, design, art, music and storytelling. I don't focus on a single medium. I build across whatever helps an idea come to life, whether that's a website, a 3D world, a cinematic edit, a piece of music, or an AI-generated concept.",
    aboutLead2:
      "I see creativity as one connected ecosystem where code, visuals, sound and atmosphere work together.",
    aboutMeaningTitle: "The meaning of PICKSAW",
    aboutMeaning:
      "PICKSAW is my creative brand — a place where different disciplines meet. Some projects become websites, others become 3D scenes, AI films, music or experimental concepts. The medium changes, but the goal stays the same: build something that leaves an impression.",
    aboutStyleTitle: "Creative style",
    aboutStyleNote:
      "Rather than following trends, I'm interested in experiences that feel memorable and emotionally atmospheric.",
    aboutDisciplinesTitle: "What I create",
    aboutSkillsTitle: "Skills",
    aboutTimelineTitle: "Working years",
    aboutFollow: "Instagram @picksawm",
    aboutNoteCrawlable: "",

    // ── room 06 · contact ────────────────────────────────────
    contactEyebrow: "06 — Contact",
    contactTitle: "Let's make something that stays",
    contactLead:
      "Tell me what you're building. Websites, environments, images, scores — or something that doesn't have a name yet.",
    contactAvailable: "Available for projects",
    contactWhatsapp: "WhatsApp",
    contactCall: "Call",
    contactInstagram: "Instagram",
    contactEmail: "Email",
    contactFormTitle: "Or write it down",
    formName: "Your name",
    formContact: "Email or phone",
    formMessage: "Tell me about the project",
    formSubmit: "Send",
    formSending: "Sending…",
    formSuccess: "Message received — I'll get back to you soon.",
    formNote: "No forms in triplicate, no waiting room. A human answers.",
    contactColophon: "Colophon",
    contactColophonBody:
      "Set in Instrument Serif and Inter. Persian in Vazirmatn. Built with React, Tailwind and Lenis — no 3D engines, no tracking scripts.",

    // ── journal / feed ───────────────────────────────────────
    journalEyebrow: "Journal",
    journalTitle: "Notes, uploads, fragments",
    journalSubtitle: "Latest from the studio — images, video and sound, posted as they happen.",
    journalEmpty: "Nothing posted yet. The first fragment is coming.",
    journalFilterAll: "All",
    journalFilterVideo: "Video",
    journalFilterImage: "Images",
    journalFilterMusic: "Sound",
    journalLike: "Like",
    journalAdminAdd: "New post",
    journalAdminDelete: "Delete",
    journalBackHome: "Back to the archive",

    // ── footer ───────────────────────────────────────────────
    footerCredit: "© {year} PICKSAW — Amirehsan Ashoori",
    footerTagline: "Images first. Everything else follows.",
    footerRights: "All work shown is original.",

    // ── 404 ──────────────────────────────────────────────────
    notFoundTitle: "This room is dark",
    notFoundBody:
      "The page you're looking for was never built — or was taken down. The archive is still open.",
    notFoundHome: "Back to the archive",
    notFoundHint: "Error 404",
  },

  fa: {
    siteName: "پیکساو",
    skipLink: "پرش به محتوا",
    ownerName: "امیراحسان عاشوری",
    ownerNameFa: "امیراحسان عاشوری",
    role: "توسعه‌دهنده خلاق · هنرمند سه‌بعدی · موزیسین",
    city: "تهران، ایران",

    navWork: "کارها",
    navWorlds: "دنیاها",
    navAi: "هنر هوش مصنوعی",
    navSound: "صدا",
    navAbout: "درباره من",
    navContact: "تماس",
    navJournal: "ژورنال",
    menuLabel: "منو",
    closeLabel: "بستن",
    nextRoom: "اتاق بعدی",
    prevRoom: "اتاق قبلی",
    scrollHint: "اسکرول",
    langButton: "English",
    langButtonShort: "EN",

    coverEyebrow: "نمونه‌کارها — ۱۳۹۹ تا ۱۴۰۵",
    coverLine1: "تصویرهایی که",
    coverLine2: "نفسشان را",
    coverLine3: "نگه می‌دارند",
    coverIntro:
      "پیکساو آرشیو کاری امیراحسان عاشوری است — وب‌سایت، محیط سه‌بعدی، تصویر هوش مصنوعی و صدا؛ ساخته‌شده میان شهر شب و باغ ایرانی.",
    coverMetaLeft: "شش اتاق",
    coverMetaMid: "فارسی + انگلیسی",
    coverMetaRight: "ساخته‌شده در تهران",
    coverEnter: "ورود به آرشیو",
    coverScroll: "برای ورود اسکرول کنید",

    indexTitle: "اتاق‌ها",
    indexSubtitle: "شش رشته، شش اتاق متفاوت. هر اتاق نور خودش را دارد.",

    workEyebrow: "۰۱ — کارها",
    workTitle: "سایت‌هایی که مثل فیلم ساخته می‌شوند",
    workLead:
      "وب‌سایت‌های تعاملی، لندینگ‌پیج‌های ادیتوریال و رابط‌های کاربری. اول روی کاغذ، بعد در کد — ظهور آرام، یک ایده در هر صفحه، بدون قرض گرفتن.",
    workStatement:
      "وب‌سایت باید مثل اتاقی باشد که واردش می‌شوی: نور با حرکت تو تغییر می‌کند و وقتی بیرون می‌آیی می‌دانی کجا بودی.",
    workSelected: "کارهای انتخابی",
    workScrollNote: "نوار را بکشید — یا از فلش‌ها استفاده کنید",
    workFilterAll: "همه",
    workFilterSites: "وب‌سایت",
    workFilterIdentity: "هویت بصری",
    workFilterCode: "کد خلاقانه",
    workDiscipline: "رشته",
    workYear: "سال",
    workRole: "نقش",
    workOpen: "دیدن پروژه",
    workProcessTitle: "یک اتاق چطور ساخته می‌شود",
    workProcess1Title: "خواندن بریف با صدای بلند",
    workProcess1Body: "هدف، مخاطب و محتوا قبل از حرکت اولین پیکسل مشخص می‌شود.",
    workProcess2Title: "کشیدن نور",
    workProcess2Body: "پالت، مقیاس تایپوگرافی و زبان حرکت، روی محتوای واقعی آزمایش می‌شود.",
    workProcess3Title: "ساختن ستون فقرات",
    workProcess3Body: "چیدمان، فیزیک اسکرول و بودجه‌ی سرعت — کارِ نامرئی.",
    workProcess4Title: "تنظیم تا وقتی نفس بکشد",
    workProcess4Body: "پاس‌های ریتم، پاس‌های موبایل، بعد انتشار.",

    worldsEyebrow: "۰۲ — دنیاها",
    worldsTitle: "جاهایی که فقط بعد از رندر وجود دارند",
    worldsLead:
      "محیط‌های سه‌بعدی، معماری رویه‌ای و صحنه‌های سینمایی در Unreal Engine و پایپ‌لاین بلادرنگ — بتن، مه و یک منبع نور که همه‌ی روایت را انجام می‌دهد.",
    worldsStackLabel: "پایپ‌لاین",
    worldsCount: "محیط",
    worldsHint: "نشانگر را حرکت بدهید — اتاق با شما خم می‌شود",

    aiEyebrow: "۰۳ — هنر هوش مصنوعی",
    aiTitle: "رؤیای ماشین، تدوین انسان",
    aiLead:
      "تصویرها و مطالعات حرکتی که با مدل‌های مولد ساخته و بعد با دست تدوین، رنگ‌بندی و مرتب شده‌اند. ماشین پیشنهاد می‌دهد؛ تدوین تصمیم می‌گیرد.",
    aiCaptionNote: "پرامپت، تکرار و یادداشت تدوین برای هر اثر",
    aiMethodTitle: "روش کار",
    aiMethod1: "پرامپت",
    aiMethod1Body: "ساختن صحنه با کلمه — نور، لنز، جنس، حال‌وهوا.",
    aiMethod2: "تکرار",
    aiMethod2Body: "ده‌ها پاس؛ فقط کادری که تنش دارد زنده می‌ماند.",
    aiMethod3: "تدوین",
    aiMethod3Body: "رنگ، ترکیب و رتوش. ماشین هیچ‌وقت تنها تحویل نمی‌دهد.",

    soundEyebrow: "۰۴ — صدا",
    soundTitle: "نه رکورد برای رانندگی شبانه",
    soundLead:
      "تولید موسیقی، ترانه‌نویسی رپ و طراحی صدا. اول فضا: خش‌خش نوار، کیک آرام، صدایی نیمه‌فرورفته در ریورب.",
    soundNowPlaying: "در حال پخش",
    soundPlay: "پخش",
    soundPause: "توقف",
    soundTracklist: "فهرست قطعات",
    soundPlaceholderNote:
      "فایل‌های صوتی آماده‌ی جای‌گذاری هستند — در public/audio بگذارید و در یک فایل کانفیگ فهرست کنید.",
    soundSoundDesignTitle: "طراحی صدا و موسیقی متن",
    soundSoundDesignBody:
      "تیزرها، فضای بازی و فیلم‌های برند، هم‌زمان با تصویر ساخته می‌شوند — از یک تُن کشیده تا یک تنظیم کامل.",

    aboutEyebrow: "۰۵ — درباره من",
    aboutTitle: "امیراحسان عاشوری",
    aboutIdentity: "خالق پیکساو",
    aboutLead:
      "من امیراحسان عاشوری هستم، خالق پیکساو — یک هویت خلاق که فناوری، طراحی، هنر، موسیقی و روایت را کنار هم می‌آورد. من به یک مدیوم محدود نیستم؛ هر چیزی که به جان گرفتن یک ایده کمک کند می‌سازم؛ چه یک وب‌سایت، یک دنیای سه‌بعدی، یک تدوین سینمایی، یک قطعه موسیقی یا یک مفهوم ساخته‌شده با هوش مصنوعی.",
    aboutLead2:
      "خلاقیت را به‌عنوان یک اکوسیستم به‌هم‌پیوسته می‌بینم که در آن کد، تصویر، صدا و فضا با هم کار می‌کنند.",
    aboutMeaningTitle: "معنای پیکساو",
    aboutMeaning:
      "پیکساو برند خلاقانه من است؛ جایی که رشته‌های گوناگون به هم می‌رسند. بعضی پروژه‌ها وب‌سایت می‌شوند، بعضی صحنه‌های سه‌بعدی، فیلم‌های هوش مصنوعی، موسیقی یا مفاهیم تجربی. مدیوم عوض می‌شود، اما هدف یکی است: ساختن چیزی که اثری ماندگار بگذارد.",
    aboutStyleTitle: "سبک خلاقانه",
    aboutStyleNote:
      "به‌جای دنبال‌کردن ترندها، به دنبال تجربه‌هایی هستم که به‌یادماندنی و از نظر احساسی جوی باشند.",
    aboutDisciplinesTitle: "چه چیزی می‌سازم",
    aboutSkillsTitle: "مهارت‌ها",
    aboutTimelineTitle: "سال‌های کار",
    aboutFollow: "اینستاگرام @picksawm",
    aboutNoteCrawlable: "",

    contactEyebrow: "۰۶ — تماس",
    contactTitle: "بیایید چیزی بسازیم که بماند",
    contactLead:
      "بگویید چه می‌سازید. وب‌سایت، محیط، تصویر، موسیقی — یا چیزی که هنوز اسمی ندارد.",
    contactAvailable: "آماده‌ی پروژه‌ی جدید",
    contactWhatsapp: "واتس‌اپ",
    contactCall: "تماس",
    contactInstagram: "اینستاگرام",
    contactEmail: "ایمیل",
    contactFormTitle: "یا اینجا بنویسید",
    formName: "نام شما",
    formContact: "ایمیل یا شماره تماس",
    formMessage: "درباره‌ی پروژه بگویید",
    formSubmit: "ارسال",
    formSending: "در حال ارسال…",
    formSuccess: "پیام دریافت شد — به‌زودی پاسخ می‌دهم.",
    formNote: "بدون فرم‌های تکراری و اتاق انتظار. یک انسان جواب می‌دهد.",
    contactColophon: "درباره‌ی ساخت",
    contactColophonBody:
      "با فونت‌های Instrument Serif و Inter؛ فارسی با وزیرمتن. ساخته‌شده با React، Tailwind و Lenis — بدون موتور سه‌بعدی و بدون اسکریپت ردیابی.",

    journalEyebrow: "ژورنال",
    journalTitle: "یادداشت‌ها، آپلودها، تکه‌ها",
    journalSubtitle: "آخرین چیزها از استودیو — تصویر، ویدیو و صدا، همان‌طور که اتفاق می‌افتند.",
    journalEmpty: "هنوز چیزی منتشر نشده. اولین تکه در راه است.",
    journalFilterAll: "همه",
    journalFilterVideo: "ویدیو",
    journalFilterImage: "تصاویر",
    journalFilterMusic: "صدا",
    journalLike: "پسندیدن",
    journalAdminAdd: "نوشته‌ی جدید",
    journalAdminDelete: "حذف",
    journalBackHome: "بازگشت به آرشیو",

    footerCredit: "© {year} پیکساو — امیراحسان عاشوری",
    footerTagline: "اول تصویر. بقیه‌اش می‌آید.",
    footerRights: "تمام کارهای نمایش‌داده‌شده اصل هستند.",

    notFoundTitle: "این اتاق تاریک است",
    notFoundBody:
      "صفحه‌ای که دنبالش بودید هرگز ساخته نشد — یا برداشته شد. آرشیو هنوز باز است.",
    notFoundHome: "بازگشت به آرشیو",
    notFoundHint: "خطای ۴۰۴",
  },
};
