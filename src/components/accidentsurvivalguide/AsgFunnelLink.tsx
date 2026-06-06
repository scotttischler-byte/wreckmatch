"use client";

import type { ComponentProps } from "react";
import {
  ASG_FUNNEL_PATHS,
  asgFunnelHref,
  funnelKeyForAsgPath,
  wreckmatchFunnelUrl,
  type AsgFunnelPathKey,
  type WreckmatchFunnelKey,
} from "@/lib/wreckmatch-funnel";
import { trackAsgEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"a">, "href"> & {
  /** Use an on-site redirect path (recommended) or direct GHL funnel key. */
  funnel: AsgFunnelPathKey | WreckmatchFunnelKey;
  /** When funnel is an AsgFunnelPathKey, optional UTM medium for the redirect handler. */
  utmMedium?: string;
  utmCampaign?: string;
  /** If true, link directly to go.wreckmatch.com instead of /masterclass etc. */
  external?: boolean;
};

function isAsgPath(funnel: AsgFunnelPathKey | WreckmatchFunnelKey): funnel is AsgFunnelPathKey {
  return funnel in ASG_FUNNEL_PATHS;
}

function resolveHref(
  funnel: AsgFunnelPathKey | WreckmatchFunnelKey,
  external: boolean,
  utmMedium?: string,
  utmCampaign?: string,
): string {
  if (!external && isAsgPath(funnel)) {
    return asgFunnelHref(funnel);
  }
  const key = isAsgPath(funnel) ? funnelKeyForAsgPath(funnel) : funnel;
  return wreckmatchFunnelUrl(key, { medium: utmMedium, campaign: utmCampaign });
}

export function AsgFunnelLink({
  funnel,
  utmMedium,
  utmCampaign,
  external = false,
  className,
  children,
  onClick,
  ...rest
}: Props) {
  const href = resolveHref(funnel, external, utmMedium, utmCampaign);
  const trackKey = isAsgPath(funnel) ? funnelKeyForAsgPath(funnel) : funnel;
  const opensExternal = external || !isAsgPath(funnel);

  return (
    <a
      href={href}
      {...(opensExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(className)}
      onClick={(e) => {
        trackAsgEvent("wreckmatch_funnel_click", {
          funnel: trackKey,
          medium: utmMedium ?? "website",
        });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
