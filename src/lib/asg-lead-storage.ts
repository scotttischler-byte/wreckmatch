const CALC_LEAD_KEY = "asg_calculator_lead";

export type CalculatorLeadCapture = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
};

export function saveCalculatorLead(lead: CalculatorLeadCapture): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CALC_LEAD_KEY, JSON.stringify(lead));
}

export function loadCalculatorLead(): CalculatorLeadCapture | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CALC_LEAD_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CalculatorLeadCapture;
  } catch {
    return null;
  }
}
