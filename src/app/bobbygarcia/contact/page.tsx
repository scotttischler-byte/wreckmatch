import type { Metadata } from "next";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import { BG_LOCATIONS, BG_PHONE_DISPLAY, BG_PHONE_E164, BG_WHATSAPP_URL } from "@/lib/bobbygarcia/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const c = getBgMessages(locale).contactPage;
  return { title: c.metaTitle, description: c.metaDescription };
}

export default function ContactPage() {
  const locale = getBgLocale();
  const c = getBgMessages(locale).contactPage;
  const es = locale === "es";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{c.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-white">{c.title}</h1>
      <p className="mt-4 text-lg text-[#b8c4d4]">{c.intro}</p>

      <a
        href={`tel:${BG_PHONE_E164}`}
        className="mt-10 block rounded-2xl border border-[#c9a227]/30 bg-[#0f1c2e] p-8 text-center transition hover:border-[#c9a227]"
      >
        <p className="text-sm uppercase tracking-widest text-[#c9a227]">{c.phoneLabel}</p>
        <p className="mt-2 font-serif text-4xl font-semibold text-white">{BG_PHONE_DISPLAY}</p>
        <p className="mt-2 text-sm text-[#8fa3bc]">{c.available}</p>
      </a>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {[BG_LOCATIONS.rgv, BG_LOCATIONS.houston].map((loc) => (
          <div key={loc.address} className="rounded-xl border border-[#c9a227]/20 bg-[#0f1c2e] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
              {es ? loc.labelEs : loc.labelEn}
            </p>
            <p className="mt-2 text-white">{loc.address}</p>
          </div>
        ))}
      </div>

      <a
        href={BG_WHATSAPP_URL}
        className="mt-8 inline-block text-[#c9a227] underline underline-offset-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        WhatsApp 24/7
      </a>
    </div>
  );
}
