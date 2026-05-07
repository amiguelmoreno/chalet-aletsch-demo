import { format } from "date-fns";
import { dateInRange, nightsBetween, nightCount } from "./dates";

export type PricingRuleInput = {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  multiplier: number;
  flatAdjust?: number | null;
  minStay?: number | null;
  priority: number;
};

export type RoomTypeInput = {
  id: string;
  slug: string;
  basePrice: number;
};

export type PriceBreakdownNight = {
  date: string; // yyyy-MM-dd
  rate: number;
  ruleApplied?: string;
};

export type PriceResult = {
  nights: number;
  breakdown: PriceBreakdownNight[];
  subtotal: number;
  deposit: number;
  total: number;
  /** True iff the stay satisfies every rule's minimum stay it touches. */
  meetsMinStay: boolean;
  /** Strictest minStay touched by this stay, for messaging. */
  enforcedMinStay: number;
};

export const DEPOSIT_FRACTION = 0.3;

/**
 * Pure price calculation for a single room over a date range.
 * Pass in the rules that *might* apply — we filter and pick the highest priority
 * matching one for each night.
 */
export function priceFor(args: {
  roomType: RoomTypeInput;
  checkIn: Date;
  checkOut: Date;
  rules: PricingRuleInput[];
}): PriceResult {
  const { roomType, checkIn, checkOut, rules } = args;
  const nights = nightCount(checkIn, checkOut);
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  const breakdown: PriceBreakdownNight[] = nightsBetween(checkIn, checkOut).map(
    (night) => {
      let rate = roomType.basePrice;
      let ruleApplied: string | undefined;

      for (const rule of sortedRules) {
        if (dateInRange(night, rule.dateFrom, rule.dateTo)) {
          if (rule.multiplier !== 1) rate *= rule.multiplier;
          if (rule.flatAdjust) rate += rule.flatAdjust;
          ruleApplied = rule.id;
          break; // top-priority match wins
        }
      }

      return {
        date: format(night, "yyyy-MM-dd"),
        rate: roundCHF(rate),
        ruleApplied,
      };
    },
  );

  const subtotal = breakdown.reduce((sum, n) => sum + n.rate, 0);
  const total = roundCHF(subtotal);
  const deposit = roundCHF(total * DEPOSIT_FRACTION);

  // Validate minimum stay against the strictest rule that touches the stay
  const touchedMinStays = sortedRules
    .filter((r) =>
      nightsBetween(checkIn, checkOut).some((n) => dateInRange(n, r.dateFrom, r.dateTo)),
    )
    .map((r) => r.minStay ?? 0)
    .filter((m) => m > 0);
  const enforcedMinStay = touchedMinStays.length ? Math.max(...touchedMinStays) : 0;
  const meetsMinStay = nights >= enforcedMinStay;

  return {
    nights,
    breakdown,
    subtotal: total,
    deposit,
    total,
    meetsMinStay,
    enforcedMinStay,
  };
}

function roundCHF(n: number): number {
  // Swiss rounding to 5 cents: 0.85 → 0.85, 0.83 → 0.85, 0.87 → 0.85.
  // For showcase purposes, round to whole francs to keep numbers tidy on a printed-style site.
  return Math.round(n);
}

/** Format CHF amounts as `CHF 1’234` with Swiss thousands separator. */
export function formatCHF(amount: number): string {
  const rounded = Math.round(amount);
  const thousands = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  return `CHF ${thousands}`;
}
