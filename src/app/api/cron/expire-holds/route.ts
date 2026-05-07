import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron — cancels bookings whose 15-minute hold has expired without payment.
 * Vercel Cron triggers this hourly via vercel.json.
 *
 * Authentication: Vercel Cron sends `authorization: Bearer ${CRON_SECRET}`.
 * If CRON_SECRET is set, we require it; otherwise allow (dev convenience).
 */
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();

  const expired = await prisma.booking.findMany({
    where: {
      status: "pending_payment",
      holdExpiresAt: { lte: now, not: null },
    },
    select: { id: true, reference: true },
  });

  if (expired.length === 0) {
    return NextResponse.json({ cancelled: 0 });
  }

  await prisma.booking.updateMany({
    where: { id: { in: expired.map((b) => b.id) } },
    data: { status: "cancelled" },
  });

  console.info(
    `[cron/expire-holds] cancelled ${expired.length} booking(s):`,
    expired.map((b) => b.reference).join(", "),
  );

  return NextResponse.json({
    cancelled: expired.length,
    references: expired.map((b) => b.reference),
  });
}
