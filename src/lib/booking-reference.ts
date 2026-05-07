import { prisma } from "./prisma";

/**
 * Generates a sequential booking reference of the form CA-YYYY-NNNN.
 * Picks the next number after the current max for this calendar year.
 * Concurrency note: under load this could collide; the unique constraint
 * on `Booking.reference` will surface a P2002 and the caller should retry.
 */
export async function nextBookingReference(now: Date = new Date()): Promise<string> {
  const year = now.getFullYear();
  const prefix = `CA-${year}-`;

  const last = await prisma.booking.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: "desc" },
    select: { reference: true },
  });

  const lastNumber = last?.reference ? parseInt(last.reference.split("-")[2] ?? "0", 10) : 0;
  const next = (lastNumber + 1).toString().padStart(4, "0");
  return `${prefix}${next}`;
}
