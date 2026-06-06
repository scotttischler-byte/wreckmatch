"use client";

import { useEffect } from "react";
import { CheckCircle2, Download, MessageCircle, Scale } from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { WreckMatchQuickMatchForm } from "@/components/accidentsurvivalguide/WreckMatchQuickMatchForm";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { ASG_BASE_URL, SURVIVAL_GUIDE_PDF, WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/constants";
import { openGhlChatWidget } from "@/lib/open-ghl-chat";
import { formatMessage } from "@/lib/i18n/get-messages";
import { trackAsgEvent, trackGoogleAdsSignupConversion } from "@/lib/analytics";

const SARAH_PHONE_E164 =
  process.env.NEXT_PUBLIC_SARAH_PHONE_E164 ?? SUPPORT_PHONE_E164;
const SARAH_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_SARAH_PHONE_DISPLAY ?? SUPPORT_PHONE_DISPLAY;

type ThankYouSuccessProps = {
  email: string;
  firstName?: string;
  state?: string;
  phone?: string;
  city?: string;
};

export function ThankYouSuccess({ email, firstName, state, phone, city }: ThankYouSuccessProps) {
  const { messages } = useAsgLocale();
  const t = messages.thankYou;
  const greeting = firstName?.trim() || t.there;
  const pdfUrl = `${ASG_BASE_URL}${SURVIVAL_GUIDE_PDF}`;

  useEffect(() => {
    trackAsgEvent("thank_you_view");
    trackGoogleAdsSignupConversion(email);
  }, [email]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="rounded-2xl border border-[#c5dce8] bg-gradient-to-br from-white to-[#eef6fb] p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e8f4fa] text-[#2a7a9b]">
          <CheckCircle2 className="size-9" aria-hidden />
        </div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#5a9a82]">
          {t.guideSent}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1a3a52] sm:text-4xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[#4a6578] leading-relaxed">
          {formatMessage(t.emailIntro, { name: greeting, guide: t.guideName, email })}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[#5b6b7f] leading-relaxed">{t.smartSteps}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAsgEvent("pdf_download", { source: "thank_you" })}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2a7a9b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#236884]"
        >
          <Download className="size-4" aria-hidden />
          {t.downloadAgain}
        </a>
      </div>

      <SurvivalGuideDisclaimer variant="compact" className="mt-8" />

      <h2 className="mt-12 text-center font-serif text-2xl font-semibold text-[#1a3a52]">
        {t.nextStepsTitle}
      </h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="flex h-full flex-col rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-sm sm:p-8">
          <MessageCircle className="size-8 text-[#2a7a9b]" aria-hidden />
          <h3 className="mt-4 font-serif text-xl font-semibold text-[#1a3a52]">{t.sarahTitle}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5b6b7f]">{t.sarahBody}</p>
          <button
            type="button"
            onClick={() => {
              trackAsgEvent("sarah_chat_click");
              openGhlChatWidget();
            }}
            className="mt-6 w-full rounded-xl bg-[#2a7a9b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#236884]"
          >
            {t.chatSarah}
          </button>
          <p className="mt-4 text-center text-sm text-[#5b6b7f]">
            {t.callSarahPrefix}{" "}
            <a
              href={`tel:${SARAH_PHONE_E164}`}
              onClick={() => trackAsgEvent("sarah_call_click")}
              className="font-semibold text-[#2a7a9b] underline underline-offset-2"
            >
              {SARAH_PHONE_DISPLAY}
            </a>
          </p>
        </article>

        <article className="flex h-full flex-col rounded-2xl border border-[#d4e8dc] bg-[#f4faf8] p-6 shadow-sm sm:p-8">
          <Scale className="size-8 text-[#5a9a82]" aria-hidden />
          <h3 className="mt-4 font-serif text-xl font-semibold text-[#1a3a52]">{t.attorneyCardTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5b6b7f]">{t.attorneyCardBody}</p>
          <WreckMatchQuickMatchForm
            defaultValues={{
              firstName: firstName ?? "",
              email,
              phone: phone ?? "",
              state: state ?? "",
              city: city ?? "",
            }}
          />
          <p className="mt-4 text-[0.72rem] leading-relaxed text-[#7a8a98]">{t.wreckmatchDisclaimer}</p>
          <a
            href={WRECKMATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAsgEvent("wreckmatch_referral", { source: "thank_you_link" })}
            className="mt-4 text-center text-sm font-semibold text-[#2a7a9b] underline underline-offset-2"
          >
            {t.wreckmatchLink}
          </a>
        </article>
      </div>

      <div className="mt-10 rounded-xl border border-[#c5dce8] bg-white p-6">
        <h3 className="font-semibold text-[#1a3a52]">{t.quickTipsTitle}</h3>
        <ul className="mt-4 space-y-2 text-sm text-[#5b6b7f]">
          {t.quickTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#5a9a82]" aria-hidden />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-center">
        <AsgLink href="/" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
          {t.backHome}
        </AsgLink>
      </p>
    </section>
  );
}
