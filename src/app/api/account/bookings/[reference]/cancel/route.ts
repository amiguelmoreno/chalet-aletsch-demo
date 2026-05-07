import { NextResponse } from "next/server";
import { isAfter, subDays } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CANCELLABLE = new Set(["pending_payment", "confirmed"]);

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ reference: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { reference } = await ctx.params;
  const booking = await prisma.booking.findUnique({
    where: { reference },
    select: { id: true, guestEmail: true, status: true, checkIn: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (booking.guestEmail !== session.user.email) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!CANCELLABLE.has(booking.status)) {
    return NextResponse.json(
      { error: "not_cancellable", status: booking.status },
      { status: 409 },
    );
  }
  // Free cancellation window: up to 7 days before arrival.
  if (isAfter(new Date(), subDays(booking.checkIn, 7))) {
    return NextResponse.json(
      { error: "outside_window" },
      { status: 409 },
    );
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "cancelled", holdExpiresAt: null },
  });

  // TODO Phase 5: trigger Stripe refund if a deposit was captured

  return NextResponse.json({ ok: true });
}
