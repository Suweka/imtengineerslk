export type CapacitySuggestion = {
  label: string;
  hp: number | null;
  btu: number | null;
};

export function suggestCapacity(sqft: number): CapacitySuggestion {
  if (sqft <= 120) return { label: "1.0 HP (9,000 BTU/hr)", hp: 1.0, btu: 9000 };
  if (sqft <= 180) return { label: "1.5 HP (12,000 BTU/hr)", hp: 1.5, btu: 12000 };
  if (sqft <= 260) return { label: "2.0 HP (18,000 BTU/hr)", hp: 2.0, btu: 18000 };
  if (sqft <= 320) return { label: "2.5 HP (24,000 BTU/hr)", hp: 2.5, btu: 24000 };
  return { label: "3.0 HP or ducted system — talk to our engineers", hp: null, btu: null };
}
