import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { SeoShell } from "@/components/seo/SeoShell";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";
import { SeoMarkdownBody } from "@/components/seo/SeoMarkdownBody";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { NearbyCities } from "@/components/seo/NearbyCities";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { ProgressiveLeadForm } from "@/components/seo/ProgressiveLeadForm";
import { StickyLeadCta } from "@/components/seo/StickyLeadCta";
import { cityInternalLinks } from "@/lib/seo/city-internal-links";
import {
  cityBreadcrumbs,
  nearbyCityLinks,
} from "@/lib/seo/internal-links";
import { cityPageJsonLd } from "@/lib/seo/schema";
import { EeatCredibilityBlock } from "@/components/seo/EeatCredibilityBlock";

type CityLandingPageProps = {
  city: CityRecord;
  state: StateRecord;
  markdown: string;
};

export function CityLandingPage({ city, state, markdown }: CityLandingPageProps) {
  const breadcrumbs = cityBreadcrumbs(city);
  const jsonLd = cityPageJsonLd(city, state, breadcrumbs);

  return (
    <SeoShell>
      <SeoJsonLd data={jsonLd} />
      <article className="mx-auto max-w-5xl px-4 py-10 pb-24 sm:px-6 sm:py-14">
        <SeoBreadcrumbs items={breadcrumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <SeoMarkdownBody markdown={markdown} />
            <EeatCredibilityBlock state={state} />
            <RelatedGuides
              title={`More ${city.city} guides`}
              links={cityInternalLinks(city, state).map((l) => ({ label: l.label, href: l.href }))}
            />
          </div>
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProgressiveLeadForm
              defaultValues={{
                city: city.city,
                state: city.state_abbr,
                leadSource: `city-page-${city.slug}`,
              }}
            />
          </aside>
        </div>

        <NearbyCities
          title={`Nearby ${state.name} cities`}
          links={nearbyCityLinks(city.slug, 5)}
        />
      </article>
      <StickyLeadCta label={`Free ${city.city} attorney match`} />
    </SeoShell>
  );
}
