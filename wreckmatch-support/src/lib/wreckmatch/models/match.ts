export type MatchType = "peer" | "attorney";

export type PeerMatch = {
  id: string;
  match_type: "peer";
  display_name: string;
  wreck_type: string;
  injuries: string[];
  state: string;
  shared_note: string;
  score: number;
};

export type AttorneyMatch = {
  id: string;
  match_type: "attorney";
  name: string;
  bio: string;
  state: string;
  practice_areas: string[];
  match_reason: string;
};

export type Match = PeerMatch | AttorneyMatch;

export type Attorney = {
  id: string;
  name: string;
  bio: string;
  state: string;
  practice_areas: string[];
  location: string;
  website_url: string | null;
};
