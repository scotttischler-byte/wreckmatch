import Link from "next/link";
import { ExternalLink, Heart, Phone, Shield } from "lucide-react";
import { LegalDisclaimerBanner } from "@/components/wreckmatch/LegalDisclaimerBanner";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { CRISIS_PHONE, CRISIS_PHONE_HREF, MEDICAL_DISCLAIMER } from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";

const resources = [
  {
    title: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support 24/7 if you're in emotional distress.",
    href: CRISIS_PHONE_HREF,
    icon: Phone,
  },
  {
    title: "Accident Survival Guide",
    description: "Educational state-by-state guides from our sister resource.",
    href: "/accidentsurvivalguide",
    icon: Shield,
  },
  {
    title: "Mental health after trauma",
    description: "Understanding common emotional responses after a wreck.",
    href: "https://www.samhsa.gov/find-help/national-helpline",
    icon: Heart,
    external: true,
  },
];

export default function ResourcesPage() {
  return (
    <main className={wm.page}>
      <header>
        <h1 className={wm.heading}>Resources</h1>
        <p className={`mt-2 ${wm.subheading}`}>
          Helpful links when you need information or immediate support.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const content = (
            <WmCard className="transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#006D77]/10 text-[#006D77]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-[#2B2B2B]">{resource.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5C5C5C]">
                    {resource.description}
                  </p>
                  {resource.title.includes("988") && (
                    <p className="mt-2 text-sm font-medium text-[#006D77]">
                      Call or text {CRISIS_PHONE}
                    </p>
                  )}
                </div>
                {resource.external && (
                  <ExternalLink className="ml-auto size-4 text-[#5C5C5C]" aria-hidden />
                )}
              </div>
            </WmCard>
          );

          if (resource.external) {
            return (
              <a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={resource.title} href={resource.href}>
              {content}
            </Link>
          );
        })}
      </div>

      <LegalDisclaimerBanner
        variant="compact"
        text={MEDICAL_DISCLAIMER}
        className="mt-8"
      />
    </main>
  );
}
