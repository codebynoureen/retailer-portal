/** Formats integer paisa as "PKR 1,84,500" (Pakistani lakh-style grouping). Never pass floats. */
export function formatPaisaAsPKR(paisa: number): string {
  const rupees = Math.round(paisa / 100);
  const value = Math.max(rupees, 0).toString();
  const lastThree = value.slice(-3);
  const otherDigits = value.slice(0, -3);
  const grouped = otherDigits
    ? `${otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  return `PKR ${grouped}`;
}

export function rupeesToPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}