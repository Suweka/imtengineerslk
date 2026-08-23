export function formatLKR(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatLKRShort(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}
