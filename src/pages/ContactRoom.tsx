import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Room from "../components/shell/Room";
import Unfold from "../components/scroll/Unfold";
import { CONTACT, ROOMS, roomLabel } from "../config/portfolio";
import { SITE_TEXTS, type Lang } from "../config/siteTexts";
import { cn } from "../utils/cn";

/**
 * CONTACT — 06
 * Art direction: letterpress on bone stock. Reverse contrast to the
 * rest of the site, oversized email, four big tappable channels, and
 * a form that looks like a typewritten order slip.
 */
export default function ContactRoom({ lang }: { lang: Lang }) {
  const t = SITE_TEXTS[lang];
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // No backend for the letter — it opens the visitor's mail client.
    const subject = encodeURIComponent(`${form.name || "Project"} — via picksaw.ir`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.contact}`);
    window.setTimeout(() => {
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
      setSending(false);
      setSent(true);
    }, 320);
  };

  return (
    <Room tone="room-contact" lang={lang} current="contact" noNext>
      {/* ── headline ─────────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--room-line)" }}>
            <p className="eyebrow opacity-60">06 — {t.navContact}</p>
            <p className="mono-label flex items-center gap-2 opacity-55">
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-ring absolute inset-0 rounded-full bg-[#1c7c46]" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#1c7c46]" />
              </span>
              {t.contactAvailable}
            </p>
          </div>

          <h1
            className={cn(
              "display-xl mt-8 max-w-[15ch] text-balance",
              lang === "fa" && "text-[clamp(2rem,7.2vw,5rem)] leading-[1.14]"
            )}
          >
            {t.contactTitle}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed opacity-65 sm:text-base">
            {t.contactLead}
          </p>
        </div>
      </section>

      {/* ── the letter folds open ─────────────────────────────── */}
      <section className="px-5 pb-12 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <Unfold
            variant="folds"
            src="/art/hero.jpg"
            alt={t.contactTitle}
            className="aspect-[16/9] w-full sm:aspect-[21/9]"
          >
            <div className="absolute inset-0 z-[3] flex items-end">
              <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                <p className="mono-label text-white/55">{t.contactAvailable}</p>
                <p className="font-display text-xl text-white sm:text-2xl">{t.contactLead}</p>
              </div>
            </div>
          </Unfold>
        </div>
      </section>

      {/* ── channels ─────────────────────────────────────────── */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1680px]">
          <a
            href={`mailto:${CONTACT.email}`}
            className="group block border-y py-6 sm:py-9"
            style={{ borderColor: "var(--room-line)" }}
          >
            <p className="mono-label mb-3 opacity-45">{t.contactEmail}</p>
            <p
              className={cn(
                "font-display text-[1.9rem] leading-none tracking-tight transition-all duration-500 group-hover:opacity-70 sm:text-[4.2rem]",
                lang === "fa" && "text-[1.7rem] sm:text-[3rem]"
              )}
              style={{ direction: "ltr", textAlign: lang === "fa" ? "right" : "left" }}
            >
              {CONTACT.email}
              <span className="ml-3 inline-block align-middle text-[0.4em] transition-transform duration-500 group-hover:translate-x-1">
                ↗
              </span>
            </p>
          </a>

          <div className="grid gap-px border-b sm:grid-cols-3" style={{ background: "var(--room-line)", borderColor: "var(--room-line)" }}>
            {[
              { label: t.contactWhatsapp, value: CONTACT.phoneLabel, href: CONTACT.whatsapp, ext: true },
              { label: t.contactCall, value: CONTACT.phoneLabel, href: `tel:${CONTACT.phone}`, ext: false },
              { label: t.contactInstagram, value: CONTACT.instagramLabel, href: CONTACT.instagram, ext: true },
            ].map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-start justify-between gap-4 p-6 transition-colors duration-300 hover:bg-[#141619] hover:text-[#f4f1ea] sm:p-7"
                style={{ background: "var(--room-bg)", transitionDelay: `${i * 20}ms` }}
              >
                <div>
                  <p className="mono-label opacity-45 group-hover:opacity-60">{c.label}</p>
                  <p className="mt-2 font-display text-xl leading-none sm:text-2xl" style={{ direction: "ltr" }}>
                    {c.value}
                  </p>
                </div>
                <span className="text-sm opacity-40 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── letter form ──────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-md max-w-[12ch]">{t.contactFormTitle}</h2>
            <p className="mt-4 max-w-xs text-xs leading-relaxed opacity-55">{t.formNote}</p>
          </div>

          <div className="lg:col-span-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="border p-8"
                style={{ borderColor: "var(--room-line)" }}
              >
                <p className="font-display text-2xl">{t.formSuccess}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", contact: "", message: "" });
                  }}
                  className="mono-label mt-6 opacity-50 underline-draw hover:opacity-100"
                >
                  {lang === "fa" ? "ارسال دیگری" : "Write another"}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-0">
                {[
                  { key: "name", label: t.formName, type: "text", required: true },
                  { key: "contact", label: t.formContact, type: "text", required: true },
                ].map((field) => (
                  <label key={field.key} className="block border-b py-5" style={{ borderColor: "var(--room-line)" }}>
                    <span className="mono-label mb-2 block opacity-45">{field.label}</span>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.key as "name" | "contact"]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full bg-transparent font-display text-2xl outline-none placeholder:opacity-20 sm:text-3xl"
                      placeholder="—"
                    />
                  </label>
                ))}

                <label className="block border-b py-5" style={{ borderColor: "var(--room-line)" }}>
                  <span className="mono-label mb-2 block opacity-45">{t.formMessage}</span>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:opacity-20"
                    placeholder="—"
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center gap-3 bg-[#121110] px-7 py-3.5 text-sm font-medium text-[#e8e4db] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {sending ? t.formSending : t.formSubmit}
                    <span className="arrow-step text-xs">→</span>
                  </button>
                  <p className="mono-label max-w-xs opacity-40">{CONTACT.email}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── colophon / nav ───────────────────────────────────── */}
      <section className="border-t px-5 py-14 sm:px-8" style={{ borderColor: "var(--room-line)" }}>
        <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mono-label mb-3 opacity-40">{t.contactColophon}</p>
            <p className="max-w-md text-xs leading-relaxed opacity-55">{t.contactColophonBody}</p>
          </div>
          <nav className="lg:col-span-7" aria-label="Rooms">
            <ul className="grid grid-cols-2 gap-x-8">
              {[...ROOMS, { key: "journal" as const, path: "/journal", number: "07" }].map((r) => (
                <li key={r.path} className="border-b py-2.5" style={{ borderColor: "var(--room-line)" }}>
                  <Link
                    to={r.path}
                    className="group flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="opacity-75 transition-opacity group-hover:opacity-100">
                      {r.key === "journal" ? t.navJournal : roomLabel(r.key as never, lang)}
                    </span>
                    <span className="mono-label opacity-25">{r.number}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-12 flex max-w-[1680px] flex-col gap-3 border-t pt-6 text-[11px] opacity-45 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--room-line)" }}>
          <p className="mono-label">{t.footerCredit.replace("{year}", String(new Date().getFullYear()))}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={CONTACT.game} target="_blank" rel="noopener noreferrer" className="underline-draw">
              Stormblade ↗
            </a>
            <span className="mono-label">{t.footerRights}</span>
          </div>
        </div>
      </section>
    </Room>
  );
}
