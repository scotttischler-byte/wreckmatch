/** GoHighLevel / WreckMatch funnel pages on go.wreckmatch.com */

export const WRECKMATCH_FUNNEL_BASE = {
  info: "https://go.wreckmatch.com/info",
  registered: "https://go.wreckmatch.com/registered",
  bookNow: "https://go.wreckmatch.com/book-now",
  booked: "https://go.wreckmatch.com/booked",
} as const;

export type WreckmatchFunnelKey = keyof typeof WRECKMATCH_FUNNEL_BASE;

/** Short paths on accidentsurvivalguide.com → redirect to GHL funnels with tracking. */
export const ASG_FUNNEL_PATHS = {
  masterclass: "/masterclass",
  bookCall: "/book-call",
  webinarConfirmed: "/webinar-confirmed",
  callConfirmed: "/call-confirmed",
} as const;

export type AsgFunnelPathKey = keyof typeof ASG_FUNNEL_PATHS;

const FUNNEL_KEY_BY_PATH: Record<AsgFunnelPathKey, WreckmatchFunnelKey> = {
  masterclass: "info",
  bookCall: "bookNow",
  webinarConfirmed: "registered",
  callConfirmed: "booked",
};

function resolveFunnelBase(key: WreckmatchFunnelKey): string {
  const fromEnv: Record<WreckmatchFunnelKey, string | undefined> = {
    info: process.env.NEXT_PUBLIC_WRECKMATCH_FUNNEL_INFO,
    registered: process.env.NEXT_PUBLIC_WRECKMATCH_FUNNEL_REGISTERED,
    bookNow: process.env.NEXT_PUBLIC_WRECKMATCH_FUNNEL_BOOK_NOW,
    booked: process.env.NEXT_PUBLIC_WRECKMATCH_FUNNEL_BOOKED,
  };
  const trimmed = fromEnv[key]?.trim();
  return trimmed || WRECKMATCH_FUNNEL_BASE[key];
}

export type FunnelUtm = {
  source?: string;
  medium?: string;
  campaign?: string;
};

/** Full GHL URL with UTM params for attribution. */
export function wreckmatchFunnelUrl(key: WreckmatchFunnelKey, utm?: FunnelUtm): string {
  const url = new URL(resolveFunnelBase(key));
  url.searchParams.set("utm_source", utm?.source ?? "accidentsurvivalguide");
  if (utm?.medium) url.searchParams.set("utm_medium", utm.medium);
  if (utm?.campaign) url.searchParams.set("utm_campaign", utm.campaign);
  return url.toString();
}

/** ASG on-site path that 302-redirects to the matching GHL funnel. */
export function asgFunnelHref(pathKey: AsgFunnelPathKey): string {
  return ASG_FUNNEL_PATHS[pathKey];
}

export function funnelKeyForAsgPath(pathKey: AsgFunnelPathKey): WreckmatchFunnelKey {
  return FUNNEL_KEY_BY_PATH[pathKey];
}
