import type { PeerMatch } from "@/lib/wreckmatch/models/match";

export const samplePeerMatches: PeerMatch[] = [
  {
    id: "peer-1",
    match_type: "peer",
    display_name: "Taylor",
    wreck_type: "Car",
    injuries: ["Whiplash / neck pain", "Emotional trauma"],
    state: "TX",
    shared_note: "Similar wreck type and recovery timeline in Texas",
    score: 92,
  },
  {
    id: "peer-2",
    match_type: "peer",
    display_name: "Chris",
    wreck_type: "Car",
    injuries: ["Back or spine", "Soft tissue"],
    state: "TX",
    shared_note: "Also navigating back pain and insurance follow-ups",
    score: 87,
  },
  {
    id: "peer-3",
    match_type: "peer",
    display_name: "Riley",
    wreck_type: "Motorcycle",
    injuries: ["Broken bones", "Emotional trauma"],
    state: "CA",
    shared_note: "Motorcycle survivor working through physical and emotional healing",
    score: 81,
  },
];
