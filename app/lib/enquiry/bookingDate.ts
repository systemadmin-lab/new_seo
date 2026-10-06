/** Keep calendar dates local: UTC conversion can move a selection by one day. */
export function toDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDateValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return toDateValue(date) === value ? date : null;
}

export function formatBookingDate(value: string, weekday = false) {
  return parseDateValue(value)?.toLocaleDateString("en-GB", {
    ...(weekday ? { weekday: "short" as const } : {}),
    day: "numeric",
    month: "long",
    year: "numeric",
  }) ?? "";
}

export function isSelectableDate(value: string, today: string) {
  return parseDateValue(value) !== null && value >= today;
}

export type BookingDateRange = { start: string; end: string };

export function getOrderedDateRange(first: string, last: string): BookingDateRange {
  return first <= last ? { start: first, end: last } : { start: last, end: first };
}

export function getNextDateRange(range: BookingDateRange, date: string): BookingDateRange {
  return !range.start || range.end
    ? { start: date, end: "" }
    : getOrderedDateRange(range.start, date);
}

export function isSelectableDateRange(range: BookingDateRange, today: string) {
  return isSelectableDate(range.start, today)
    && isSelectableDate(range.end, today)
    && range.start <= range.end;
}

export function moveCalendarMonth(date: Date, offset: number) {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + offset, 1, 12);
  const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  nextMonth.setDate(Math.min(date.getDate(), lastDay));
  return nextMonth;
}

export function getCalendarDays(month: Date): (Date | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) =>
    index < offset || index >= offset + count
      ? null
      : new Date(month.getFullYear(), month.getMonth(), index - offset + 1, 12),
  );
}
