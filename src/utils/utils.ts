export function getMonthsBetween(
  startDate: Date,
  endDate: Date,
): { month: number; year: number }[] {
  const months: { month: number; year: number }[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= last) {
    months.push({ month: current.getMonth() + 1, year: current.getFullYear() });

    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

export function isDateInMonth(
  date: Date | string,
  month: number,
  year: number,
): boolean {
  const d = new Date(date);
  return d.getMonth() + 1 === month && d.getFullYear() === year;
}
export function makeDateFromMonthYear(month: number, year: number): Date {
  // If your `month` is 1–12 from your loop, subtract 1 to fit JS's 0-indexed months.
  return new Date(year, month - 1, 1);
}
