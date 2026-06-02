export type AccidentType =
  | "car"
  | "truck"
  | "motorcycle"
  | "slip-fall"
  | "pedestrian"
  | "other";

export type InjurySeverity = "minor" | "moderate" | "severe" | "catastrophic";

export type MedicalBillsBand =
  | "0"
  | "1-5000"
  | "5001-25000"
  | "25001-100000"
  | "100001-500000"
  | "500000+";

export type LostWagesBand =
  | "0"
  | "1-5000"
  | "5001-25000"
  | "25001-100000"
  | "100001-200000"
  | "200000+";

export type FaultAnswer = "yes" | "no" | "unsure";

export type CalculatorInput = {
  accidentType: AccidentType;
  injurySeverity: InjurySeverity;
  medicalBills: MedicalBillsBand;
  lostWages: LostWagesBand;
  futureMedical: boolean;
  atFault: FaultAnswer;
  state: string;
  policeReport: boolean;
};

export type CompensationEstimate = {
  low: number;
  medium: number;
  high: number;
  economicDamages: number;
  painSufferingLow: number;
  painSufferingHigh: number;
  multipliers: {
    injury: number;
    accident: number;
    fault: number;
    documentation: number;
    futureMedical: number;
  };
};

const MEDICAL_MIDPOINT: Record<MedicalBillsBand, number> = {
  "0": 0,
  "1-5000": 2500,
  "5001-25000": 12500,
  "25001-100000": 50000,
  "100001-500000": 250000,
  "500000+": 600000,
};

const WAGES_MIDPOINT: Record<LostWagesBand, number> = {
  "0": 0,
  "1-5000": 2500,
  "5001-25000": 12500,
  "25001-100000": 50000,
  "100001-200000": 150000,
  "200000+": 275000,
};

const INJURY_BASE: Record<
  InjurySeverity,
  { low: number; mid: number; high: number; painMult: [number, number] }
> = {
  minor: { low: 5_000, mid: 12_000, high: 28_000, painMult: [1.2, 2.0] },
  moderate: { low: 25_000, mid: 55_000, high: 120_000, painMult: [1.5, 2.8] },
  severe: { low: 75_000, mid: 175_000, high: 400_000, painMult: [2.0, 4.0] },
  catastrophic: { low: 250_000, mid: 750_000, high: 2_500_000, painMult: [2.5, 6.0] },
};

const ACCIDENT_MULT: Record<AccidentType, number> = {
  car: 1,
  truck: 1.2,
  motorcycle: 1.15,
  "slip-fall": 0.9,
  pedestrian: 1.1,
  other: 1,
};

const FAULT_MULT: Record<FaultAnswer, number> = {
  yes: 1,
  unsure: 0.75,
  no: 0.35,
};

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function estimateCompensation(input: CalculatorInput): CompensationEstimate {
  const injury = INJURY_BASE[input.injurySeverity];
  const medical = MEDICAL_MIDPOINT[input.medicalBills];
  const wages = WAGES_MIDPOINT[input.lostWages];
  const economic = medical + wages;

  const accidentMult = ACCIDENT_MULT[input.accidentType];
  const faultMult = FAULT_MULT[input.atFault];
  const docMult = input.policeReport ? 1.05 : 0.95;
  const futureMult = input.futureMedical ? 1.15 : 1;

  const painLow = economic * injury.painMult[0];
  const painHigh = economic * injury.painMult[1];

  const baseLow = injury.low + economic * 0.8 + painLow;
  const baseMid = injury.mid + economic * 1.2 + (painLow + painHigh) / 2;
  const baseHigh = injury.high + economic * 1.5 + painHigh;

  const combined =
    accidentMult * faultMult * docMult * futureMult;

  const low = Math.round(baseLow * combined);
  const medium = Math.round(baseMid * combined);
  const high = Math.round(baseHigh * combined);

  return {
    low: Math.max(low, 0),
    medium: Math.max(medium, low),
    high: Math.max(high, medium),
    economicDamages: economic,
    painSufferingLow: Math.round(painLow),
    painSufferingHigh: Math.round(painHigh),
    multipliers: {
      injury: injury.painMult[1],
      accident: accidentMult,
      fault: faultMult,
      documentation: docMult,
      futureMedical: futureMult,
    },
  };
}
