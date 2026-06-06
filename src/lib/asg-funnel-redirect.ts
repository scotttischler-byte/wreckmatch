import {
  funnelKeyForAsgPath,
  wreckmatchFunnelUrl,
  type AsgFunnelPathKey,
} from "@/lib/wreckmatch-funnel";

export function asgFunnelRedirectTarget(pathKey: AsgFunnelPathKey): string {
  const key = funnelKeyForAsgPath(pathKey);
  return wreckmatchFunnelUrl(key, {
    medium: `asg_redirect_${pathKey}`,
    campaign: "asg_funnel",
  });
}
