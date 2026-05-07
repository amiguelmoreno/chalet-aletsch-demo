import { prisma } from "./prisma";
import { intervalsOverlap, nightCount } from "./dates";
import { priceFor, type PriceResult, type PricingRuleInput } from "./pricing";

export type RoomOption = {
  roomTypeId: string;
  roomId: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  subtitleDe: string | null;
  subtitleEn: string | null;
  capacity: number;
  basePrice: number;
  price: PriceResult;
};

export class AvailabilityError extends Error {
  constructor(public readonly code: "invalid_dates" | "too_many_guests" | "min_stay") {
    super(code);
  }
}

/**
 * Returns the room types that have at least one bookable Room for the given
 * date range and guest count, with full pricing applied.
 */
export async function findAvailableRooms(args: {
  checkIn: Date;
  checkOut: Date;
  guests: number;
}): Promise<RoomOption[]> {
  const { checkIn, checkOut, guests } = args;

  if (!(checkIn instanceof Date) || !(checkOut instanceof Date) || isNaN(+checkIn) || isNaN(+checkOut)) {
    throw new AvailabilityError("invalid_dates");
  }
  if (nightCount(checkIn, checkOut) < 1) {
    throw new AvailabilityError("invalid_dates");
  }
  if (guests < 1) throw new AvailabilityError("too_many_guests");

  const candidates = await prisma.roomType.findMany({
    where: { active: true, capacity: { gte: guests } },
    include: {
      rooms: {
        include: {
          bookings: {
            select: {
              booking: {
                select: {
                  checkIn: true,
                  checkOut: true,
                  status: true,
                  holdExpiresAt: true,
                },
              },
            },
          },
          blocked: { select: { dateFrom: true, dateTo: true } },
        },
      },
    },
    orderBy: { position: "asc" },
  });

  const rules = await prisma.pricingRule.findMany({
    where: {
      OR: [
        { dateFrom: { lte: checkOut } },
        { dateTo: { gte: checkIn } },
      ],
    },
  });

  const ruleInputs: PricingRuleInput[] = rules.map((r) => ({
    id: r.id,
    dateFrom: r.dateFrom,
    dateTo: r.dateTo,
    multiplier: Number(r.multiplier),
    flatAdjust: r.flatAdjust ? Number(r.flatAdjust) : null,
    minStay: r.minStay,
    priority: r.priority,
  }));

  const result: RoomOption[] = [];

  for (const type of candidates) {
    const room = type.rooms.find((r) => isRoomFree(r, checkIn, checkOut));
    if (!room) continue;

    const price = priceFor({
      roomType: { id: type.id, slug: type.slug, basePrice: Number(type.basePrice) },
      checkIn,
      checkOut,
      rules: ruleInputs,
    });

    if (!price.meetsMinStay) continue;

    result.push({
      roomTypeId: type.id,
      roomId: room.id,
      slug: type.slug,
      nameDe: type.nameDe,
      nameEn: type.nameEn,
      subtitleDe: type.subtitleDe,
      subtitleEn: type.subtitleEn,
      capacity: type.capacity,
      basePrice: Number(type.basePrice),
      price,
    });
  }

  return result;
}

type RoomWithLinks = {
  bookings: {
    booking: {
      checkIn: Date;
      checkOut: Date;
      status: string;
      holdExpiresAt: Date | null;
    };
  }[];
  blocked: { dateFrom: Date; dateTo: Date }[];
};

function isRoomFree(room: RoomWithLinks, checkIn: Date, checkOut: Date): boolean {
  const blockingStatuses = new Set(["pending_payment", "confirmed", "checked_in"]);
  const now = new Date();

  for (const link of room.bookings) {
    const b = link.booking;
    if (!blockingStatuses.has(b.status)) continue;
    // pending_payment with an expired hold no longer reserves the room —
    // the daily cron will eventually mark it cancelled, but availability
    // queries should treat it as free immediately.
    if (b.status === "pending_payment" && b.holdExpiresAt && b.holdExpiresAt < now) {
      continue;
    }
    if (intervalsOverlap(b.checkIn, b.checkOut, checkIn, checkOut)) return false;
  }

  for (const block of room.blocked) {
    if (intervalsOverlap(block.dateFrom, block.dateTo, checkIn, checkOut)) return false;
  }

  return true;
}
