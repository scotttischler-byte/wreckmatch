export type TeamMember = {
  slug: string;
  name: string;
  roleEn: string;
  roleEs: string;
  group: "attorney" | "litigation" | "medical" | "operations";
  image?: string;
  initials: string;
};

export const TEAM: TeamMember[] = [
  { slug: "bobby-garcia", name: "Bobby Garcia", roleEn: "Founding Partner & CEO", roleEs: "Socio Fundador y CEO", group: "attorney", image: "/bobbygarcia/team/bobby-garcia.png", initials: "BG" },
  { slug: "tamara-rodriguez", name: "Tamara Rodriguez", roleEn: "Litigation Manager", roleEs: "Gerente de Litigio", group: "litigation", image: "/bobbygarcia/team/tamara-rodriguez.png", initials: "TR" },
  { slug: "norma-champion", name: "Norma Champion", roleEn: "Chief Legal Analyst", roleEs: "Analista Legal Principal", group: "litigation", image: "/bobbygarcia/team/norma-champion.png", initials: "NC" },
  { slug: "krissy-fernandez", name: "Krissy Fernandez-Hinojosa", roleEn: "Medical Specialist", roleEs: "Especialista Médica", group: "medical", image: "/bobbygarcia/team/krissy-fernandez.png", initials: "KF" },
  { slug: "haley-quiroz", name: "Haley Quiroz", roleEn: "Medical Specialist", roleEs: "Especialista Médica", group: "medical", image: "/bobbygarcia/team/haley-quiroz.png", initials: "HQ" },
  { slug: "hilda-caldwell", name: "Hilda Caldwell", roleEn: "Case Analyst", roleEs: "Analista de Casos", group: "litigation", image: "/bobbygarcia/team/hilda-caldwell.png", initials: "HC" },
  { slug: "gloria-salinas", name: "Gloria Salinas", roleEn: "Office Administrator", roleEs: "Administradora de Oficina", group: "operations", image: "/bobbygarcia/team/gloria-salinas.png", initials: "GS" },
  { slug: "marty-hernandez", name: "Marty Hernandez", roleEn: "Digital Marketing / Network Administrator", roleEs: "Marketing Digital / Administrador de Red", group: "operations", image: "/bobbygarcia/team/marty-hernandez.png", initials: "MH" },
  { slug: "jazzlynn-ramirez", name: "Jazzlynn Ramirez", roleEn: "Litigation Paralegal", roleEs: "Paralegal de Litigio", group: "litigation", initials: "JR" },
  { slug: "melanie-martinez", name: "Melanie Martinez", roleEn: "Litigation Paralegal", roleEs: "Paralegal de Litigio", group: "litigation", initials: "MM" },
];

export const TEAM_STATS = { members: TEAM.length, attorneys: 1, guides: 103, faqs: 215 };
