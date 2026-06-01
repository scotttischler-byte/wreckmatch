"use client";

import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import {
  BG_BASE_URL,
  BG_LOCATIONS,
  BG_PHONE_DISPLAY,
  BG_PHONE_E164,
} from "@/lib/bobbygarcia/site";

export function BgFooter() {
  const { locale, messages } = useBgLocale();
  const f = messages.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#c9a227]/20 bg-[#060d18] text-[#9aa8bc]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="font-serif text-lg text-[#c9a227]">{f.tagline}</p>
        <p className="mt-2 text-sm">{messages.meta.siteName}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c9a227]">
              {f.locations}
            </p>
            <ul className="mt-3 space-y-4 text-sm leading-relaxed">
              <li>
                <strong className="text-white">
                  {locale === "es" ? BG_LOCATIONS.rgv.labelEs : BG_LOCATIONS.rgv.labelEn}
                </strong>
                <br />
                {BG_LOCATIONS.rgv.address}
              </li>
              <li>
                <strong className="text-white">
                  {locale === "es" ? BG_LOCATIONS.houston.labelEs : BG_LOCATIONS.houston.labelEn}
                </strong>
                <br />
                {BG_LOCATIONS.houston.address}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c9a227]">
              {f.phoneLabel}
            </p>
            <a
              href={`tel:${BG_PHONE_E164}`}
              className="mt-3 block font-serif text-2xl text-white transition hover:text-[#c9a227]"
            >
              {BG_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs">
          © {year} {messages.meta.siteName}. {f.rights}{" "}
          <a href={BG_BASE_URL} className="text-[#c9a227] hover:underline">
            {BG_BASE_URL.replace("https://", "")}
          </a>
        </p>
      </div>
    </footer>
  );
}
