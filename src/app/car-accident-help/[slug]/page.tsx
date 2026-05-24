import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CITY_BY_SLUG,
  CITIES,
  STATE_BY_SLUG,
  getCitiesByState,
  getStateForCity,
} from "@/lib/seo/cities";
import { getCityMarkdownBody, getStateMarkdownBody } from "@/lib/seo/markdown-content";
import { buildCityMarkdown } from "@/lib/seo/build-city-page";
import { buildStateMarkdown } from "@/lib/seo/build-state-page";
import { cityMetaDescription, stateMetaDescription } from "@/lib/seo/meta";
import { CityLandingPage } from "@/components/seo/CityLandingPage";
import { StateHubPage } from "@/components/seo/StateHubPage";
import { getSeoPageCoverImage, getSeoPageCoverAlt } from "@/lib/seo/covers";
import { cityPagePath, absoluteUrl } from "@/lib/seo/site";
import { STATES } from "@/lib/seo/cities";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [
    ...CITIES.map((c) => ({ slug: c.slug })),
    ...STATES.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = CITY_BY_SLUG[slug];
  const state = STATE_BY_SLUG[slug];

  if (city) {
    const st = getStateForCity(city)!;
    const title = `Car Accident Help in ${city.city}, ${st.name} (${new Date().getFullYear()})`;
    const description = cityMetaDescription(city);
    const coverUrl = absoluteUrl(getSeoPageCoverImage(slug));
    return {
      title,
      description,
      alternates: { canonical: absoluteUrl(cityPagePath(slug)) },
      openGraph: {
        title,
        description,
        type: "article",
        images: [{ url: coverUrl, width: 1200, height: 630, alt: getSeoPageCoverAlt(`${city.city}, ${st.abbr}`) }],
      },
      twitter: { card: "summary_large_image", title, description, images: [coverUrl] },
    };
  }

  if (state) {
    const cities = getCitiesByState(slug);
    const title = `Car Accident Help in ${state.name} — State Guide (${new Date().getFullYear()})`;
    const description = stateMetaDescription(state, cities.length);
    const coverUrl = absoluteUrl(getSeoPageCoverImage(slug));
    return {
      title,
      description,
      alternates: { canonical: absoluteUrl(cityPagePath(slug)) },
      openGraph: {
        title,
        description,
        type: "article",
        images: [{ url: coverUrl, width: 1200, height: 630, alt: getSeoPageCoverAlt(state.name) }],
      },
      twitter: { card: "summary_large_image", title, description, images: [coverUrl] },
    };
  }

  return { title: "Page not found" };
}

export default async function CarAccidentHelpPage({ params }: PageProps) {
  const { slug } = await params;
  const city = CITY_BY_SLUG[slug];
  const stateHub = STATE_BY_SLUG[slug];

  if (city) {
    const state = getStateForCity(city);
    if (!state) notFound();
    const markdown = getCityMarkdownBody(city) ?? buildCityMarkdown(city, state);
    return <CityLandingPage city={city} state={state} markdown={markdown} />;
  }

  if (stateHub) {
    const cities = getCitiesByState(slug);
    const markdown = getStateMarkdownBody(slug) ?? buildStateMarkdown(stateHub, cities);
    return <StateHubPage state={stateHub} markdown={markdown} cityCount={cities.length} />;
  }

  notFound();
}
