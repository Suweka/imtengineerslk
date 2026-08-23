export function lkr(value: number): string {
  return "LKR " + value.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function lkrShort(value: number): string {
  return value.toLocaleString("en-LK");
}

export function roomSizeLabel(min: number, max: number): string {
  return min + "–" + max + " sq ft";
}

export function hpLabel(hp: number): string {
  return (hp % 1 === 0 ? hp.toFixed(1) : String(hp)) + " HP";
}
