export type PracticeArea = {
  slug: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  image: string;
  blogSlug: string;
};

export const PRACTICE_AREAS: PracticeArea[] = [
  { slug: "car-accident", titleEn: "Car Accidents", titleEs: "Accidentes de Auto", descEn: "Motor vehicle crashes across Texas", descEs: "Choques de vehículos en Texas", image: "/bobbygarcia/practice/car-accident.webp", blogSlug: "car-accident-lawyer-texas" },
  { slug: "18-wheeler", titleEn: "18-Wheeler Accidents", titleEs: "Accidentes de Tráileres", descEn: "Trucking & commercial vehicle cases", descEs: "Casos de camiones comerciales", image: "/bobbygarcia/practice/18-wheeler.webp", blogSlug: "18-wheeler-accident-lawyer-texas" },
  { slug: "slip-fall", titleEn: "Slip & Fall", titleEs: "Resbalones y Caídas", descEn: "Premises liability representation", descEs: "Responsabilidad de locales", image: "/bobbygarcia/practice/slip-and-fall.png", blogSlug: "slip-and-fall-lawyer-texas" },
  { slug: "workplace", titleEn: "Workplace Injuries", titleEs: "Lesiones en el Trabajo", descEn: "On-the-job injury claims", descEs: "Reclamos por lesiones laborales", image: "/bobbygarcia/practice/workplace.png", blogSlug: "workplace-injury-lawyer-texas" },
  { slug: "mass-tort", titleEn: "Mass Tort", titleEs: "Demandas Colectivas", descEn: "Defective products & medications", descEs: "Productos y medicamentos defectuosos", image: "/bobbygarcia/practice/mass-tort.webp", blogSlug: "mass-tort-lawyer-texas" },
  { slug: "personal-injury", titleEn: "Personal Injury", titleEs: "Lesiones Personales", descEn: "Edinburg, McAllen & statewide", descEs: "Edinburg, McAllen y todo el estado", image: "/bobbygarcia/locations/edinburg-office.jpeg", blogSlug: "personal-injury-law-firm-edinburg-tx" },
];
