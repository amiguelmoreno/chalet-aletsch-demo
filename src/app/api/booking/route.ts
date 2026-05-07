import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/dates";
import { findAvailableRooms } from "@/lib/availability";
import { priceFor } from "@/lib/pricing";
import { nextBookingReference } from "@/lib/booking-reference";
import { sendBookingConfirmation } from "@/lib/email";

const HOLD_MINUTES = 15;

type BookingInput = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomTypeSlug: string;
  guestEmail: string;
  guestName: string;
  phone?: string;
  notes?: string;
  locale?: "de" | "en";
  marketingConsent?: boolean;
  extras?: Array<{ slug: string; quantity: number }>;
};

export async function POST(req: Request) {
  let body: BookingInput;
  try {
    body = (await req.json()) as BookingInput;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.checkIn || !body.checkOut || !body.roomTypeSlug || !body.guestEmail || !body.guestName) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const checkIn = parseDateOnly(body.checkIn);
  const checkOut = parseDateOnly(body.checkOut);
  const guests = (body.adults || 0) + (body.children || 0);

  try {
    // Re-verify availability + pricing on the server
    const options = await findAvailableRooms({ checkIn, checkOut, guests });
    const chosen = options.find((o) => o.slug === body.roomTypeSlug);
    if (!chosen) {
      return NextResponse.json({ error: "room_unavailable" }, { status: 409 });
    }

    // Resolve experiences
    const extraSlugs = (body.extras ?? []).filter((e) => e.quantity > 0).map((e) => e.slug);
    const experiences = extraSlugs.length
      ? await prisma.experience.findMany({ where: { slug: { in: extraSlugs }, active: true } })
      : [];

    const extrasTotal = experiences.reduce((sum, exp) => {
      const requested = (body.extras ?? []).find((e) => e.slug === exp.slug);
      const qty = requested?.quantity ?? 0;
      return sum + qty * Number(exp.unitPrice);
    }, 0);

    const subtotal = chosen.price.subtotal + extrasTotal;
    const total = subtotal;
    const deposit = Math.round(total * 0.3);

    // Create booking
    const reference = await nextBookingReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        guestEmail: body.guestEmail,
        guestName: body.guestName,
        locale: body.locale ?? "de",
        checkIn,
        checkOut,
        adults: body.adults,
        children: body.children,
        status: "pending_payment",
        subtotal: new Prisma.Decimal(subtotal),
        total: new Prisma.Decimal(total),
        depositAmount: new Prisma.Decimal(deposit),
        notes: body.notes,
        holdExpiresAt: addMinutes(new Date(), HOLD_MINUTES),
        items: {
          create: {
            roomId: chosen.roomId,
            unitPrice: new Prisma.Decimal(chosen.price.subtotal / chosen.price.nights),
            nights: chosen.price.nights,
            lineTotal: new Prisma.Decimal(chosen.price.subtotal),
          },
        },
        extras: {
          create: experiences.map((exp) => {
            const qty = body.extras?.find((e) => e.slug === exp.slug)?.quantity ?? 1;
            return {
              experienceId: exp.id,
              quantity: qty,
              unitPrice: exp.unitPrice,
              lineTotal: new Prisma.Decimal(qty * Number(exp.unitPrice)),
            };
          }),
        },
      },
      include: {
        items: { include: { room: { include: { roomType: true } } } },
        extras: { include: { experience: true } },
      },
    });

    // Optional consent
    if (body.marketingConsent && body.guestEmail) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: body.guestEmail },
        update: { consentAt: new Date() },
        create: { email: body.guestEmail, locale: body.locale ?? "de", source: "booking" },
      });
    }

    // Fire-and-forget email
    sendBookingConfirmation(booking).catch((e) =>
      console.warn("[booking] email failed:", (e as Error).message),
    );

    return NextResponse.json({
      reference: booking.reference,
      total,
      deposit,
      currency: "CHF",
    });
  } catch (err) {
    console.error("[/api/booking]", err);
    return NextResponse.json(
      {
        error: "service_unavailable",
        hint: "Database not configured? Set DATABASE_URL and run npm run db:push && npm run db:seed.",
      },
      { status: 503 },
    );
  }
}
