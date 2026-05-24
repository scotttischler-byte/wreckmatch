import type { StateRecord } from "../../../data/types";
import { SeoShell } from "@/components/seo/SeoShell";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";
import { SeoMarkdownBody } from "@/components/seo/SeoMarkdownBody";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { NearbyCities } from "@/components/seo/NearbyCities";
import { ProgressiveLeadForm } from "@/components/seo/ProgressiveLeadForm";
import { StickyLeadCta } from "@/components/seo/StickyLeadCta";
import { stateBreadcrumbs, stateCityLinks } from "@/lib/seo/internal-links";
import { statePageJsonLd } from "@/lib/seo/schema";

type StateHubPageProps = {
  state: StateRecord;
  markdown: string;
  cityCount: number;
};

export function StateHubPage({ state, markdown, cityCount }: StateHubPageProps) {
  const breadcrumbs = stateBreadcrumbs(state.name, state.slug);
  const jsonLd = statePageJsonLd(state, breadcrumbs);

  return (
    <SeoShell>
      <SeoJsonLd data={jsonLd} />
      <article className="mx-auto max-w-5xl px-4 py-10 pb-24 sm:px-6 sm:py-14">
        <SeoBreadcrumbs items={breadcrumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <SeoMarkdownBody markdown={markdown} />
          </div>
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProgressiveLeadForm
              defaultValues={{
                state: state.abbr,
                leadSource: `state-page-${state.slug}`,
              }}
            />
          </aside>
        </div>

        <NearbyCities
          title={`${state.name} city guides (${cityCount})`}
          links={stateCityLinks(state.slug, 20)}
        />
      </article>
      <StickyLeadCta label={`Free ${state.abbr} attorney match`} />
    </SeoShell>
  );
}
