export const WRECKMATCH_SEO_BASE = "https://www.wreckmatch.com";

export function cityPagePath(slug: string): string {
  return `/car-accident-help-${slug}`;
}

export function statePagePath(slug: string): string {
  return `/car-accident-help-${slug}`;
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`;
}

export function absoluteUrl(path: string): string {
  return `${WRECKMATCH_SEO_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
