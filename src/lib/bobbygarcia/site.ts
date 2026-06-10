export const BG_SITE_NAME = "Law Office of Bobby Garcia";
export const BG_TAGLINE_EN = "Justice Made Simple";
export const BG_TAGLINE_ES = "Justicia Hecha Simple";
export const BG_DOMAIN = "www.bobbygarcia.com";
export const BG_BASE_URL = `https://${BG_DOMAIN}`;
export const BG_PHONE_DISPLAY = "(956) 668-7400";
export const BG_PHONE_E164 = "+19566687400";
export const BG_WHATSAPP_URL = "https://wa.me/19566687400";

export const BG_HOSTS = ["bobbygarcia.com", "www.bobbygarcia.com"];

export const BG_EDINBURG_ADDRESS = "124 E. Cano Street, Edinburg, TX 78539";
export const BG_WOODLANDS_ADDRESS = "16610 IH 45 South, Ste 200, The Woodlands, TX";

export const BG_LOCATIONS = {
  rgv: {
    labelEn: "Rio Grande Valley — Edinburg",
    labelEs: "Valle del Río Grande — Edinburg",
    address: BG_EDINBURG_ADDRESS,
  },
  houston: {
    labelEn: "Houston / The Woodlands",
    labelEs: "Houston / The Woodlands",
    address: BG_WOODLANDS_ADDRESS,
  },
} as const;

export const BG_OFFICES_FAQ_EN = `${BG_EDINBURG_ADDRESS} (Rio Grande Valley) and ${BG_WOODLANDS_ADDRESS} (Houston area).`;
export const BG_OFFICES_FAQ_ES = `${BG_EDINBURG_ADDRESS} (Valle del Río Grande) y ${BG_WOODLANDS_ADDRESS} (área de Houston).`;

export function isBgHostname(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return BG_HOSTS.includes(hostname);
}
