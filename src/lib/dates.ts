import { differenceInCalendarDays, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

/** Parse an ISO yyyy-MM-dd string to a Date set at midnight local. */
export function parseDateOnly(s: string): Date {
  return parseISO(s);
}

/** Iterate the nights between checkIn (inclusive) and checkOut (exclusive). */
export function nightsBetween(checkIn: Date, checkOut: Date): Date[] {
  const days = eachDayOfInterval({ start: checkIn, end: checkOut });
  return days.slice(0, -1); // checkOut day itself isn't a night spent
}

export function nightCount(checkIn: Date, checkOut: Date): number {
  return Math.max(0, differenceInCalendarDays(checkOut, checkIn));
}

export function dateInRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end });
}

/** Two date intervals overlap iff aStart < bEnd && bStart < aEnd (half-open). */
export function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}
