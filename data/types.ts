export type DataSource = {
  field: string;
  url: string;
  retrieved: string;
};

export type StateRecord = {
  slug: string;
  name: string;
  abbr: string;
  statute_limitations_years: number;
  comparative_negligence_rule: string;
  no_fault_state: boolean;
  min_liability_insurance: string;
  dot_url: string;
  bar_association: string;
  annual_crashes_state: number | null;
  fatal_crashes_annual_state: number | null;
};

export type CityRecord = {
  slug: string;
  city: string;
  state: string;
  state_abbr: string;
  state_slug: string;
  lat: number;
  lng: number;
  population: number;
  metro_population: number | null;
  annual_crashes: number | null;
  fatal_crashes_annual: number | null;
  major_hospitals: string[];
  trauma_centers_level1: string[];
  county: string;
  county_court: string;
  major_highways: string[];
  accident_hotspots: string[];
  local_dot_link: string | null;
  police_accident_report_link: string | null;
  local_bar_association: string | null;
  spanish_speaking_population_pct: number | null;
  data_sources: DataSource[];
};

export type BlogTemplateId =
  | "immediate-steps"
  | "statute-limitations"
  | "uninsured-driver"
  | "truck-accident"
  | "rideshare-accident"
  | "whiplash-claims"
  | "settlement-timeline"
  | "insurance-denied"
  | "costly-mistakes"
  | "hire-lawyer";
