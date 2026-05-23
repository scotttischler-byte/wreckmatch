import type { Attorney, AttorneyMatch } from "@/lib/wreckmatch/models/match";

export const sampleAttorneys: Attorney[] = [
  {
    id: "attorney-1",
    name: "Elena Martinez, Esq.",
    bio: "Elena focuses on compassionate representation for car accident survivors. She believes in listening first and explaining options clearly — never pressuring clients to move faster than they're ready.",
    state: "TX",
    practice_areas: ["Car accidents", "Insurance disputes", "Personal injury"],
    location: "Austin, TX",
    website_url: null,
  },
  {
    id: "attorney-2",
    name: "David Chen, Esq.",
    bio: "David helps survivors understand their rights after serious collisions. His approach emphasizes education and informed decision-making at every step.",
    state: "CA",
    practice_areas: ["Motorcycle accidents", "Traumatic injury", "Uninsured motorist claims"],
    location: "Los Angeles, CA",
    website_url: null,
  },
  {
    id: "attorney-3",
    name: "Sarah Okonkwo, Esq.",
    bio: "Sarah works with families navigating complex truck accident cases. She is known for clear communication and steady support through long recoveries.",
    state: "TX",
    practice_areas: ["Truck accidents", "Wrongful injury", "Medical liens"],
    location: "Dallas, TX",
    website_url: null,
  },
];

export const sampleAttorneyMatches: AttorneyMatch[] = sampleAttorneys.map(
  (attorney, index) => ({
    id: attorney.id,
    match_type: "attorney" as const,
    name: attorney.name,
    bio: attorney.bio,
    state: attorney.state,
    practice_areas: attorney.practice_areas,
    match_reason:
      index === 0
        ? "Practices in your state with experience in car accident cases"
        : index === 1
          ? "Experience with injuries similar to yours"
          : "Available when you're ready to explore legal options",
  }),
);

export function getAttorneyById(id: string): Attorney | undefined {
  return sampleAttorneys.find((attorney) => attorney.id === id);
}
