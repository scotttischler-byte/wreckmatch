export const WRECKMATCH_APP_NAME = "WreckMatch";

export const WRECKMATCH_TAGLINE = "You're not alone after the wreck.";

export const CRISIS_PHONE = "988";
export const CRISIS_PHONE_HREF = "tel:988";

export const WRECK_TYPES = [
  "Car",
  "Motorcycle",
  "Truck",
  "Pedestrian",
  "Other",
] as const;

export type WreckType = (typeof WRECK_TYPES)[number];

export const INJURY_OPTIONS = [
  "Whiplash / neck pain",
  "Back or spine",
  "Head injury / concussion",
  "Broken bones",
  "Soft tissue",
  "Emotional trauma",
  "Other",
] as const;

export type InjuryOption = (typeof INJURY_OPTIONS)[number];

export const MOOD_OPTIONS = [
  { value: 1, label: "Overwhelmed" },
  { value: 2, label: "Anxious" },
  { value: 3, label: "Uncertain" },
  { value: 4, label: "Hopeful" },
  { value: 5, label: "Stronger today" },
] as const;

export const LEGAL_DISCLAIMER =
  "WreckMatch is a peer support community, not a law firm. We do not provide legal advice, and no attorney-client relationship is formed through this app. Always consult a licensed attorney in your state for legal guidance.";

export const MEDICAL_DISCLAIMER =
  "Information in WreckMatch is for general support only and is not medical advice. If you are in pain or concerned about your health, please contact a licensed healthcare provider.";

export const AUTH_DISCLAIMER =
  "WreckMatch offers emotional support and community connection. If you are in immediate danger or a medical emergency, call 911. For emotional crisis support, call or text 988.";
