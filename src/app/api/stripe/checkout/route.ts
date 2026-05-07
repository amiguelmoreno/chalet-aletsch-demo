import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured, toRappen } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout Session for a booking's deposit (30%).
 * Body: { reference: string }
 * Returns: { url: string } redirect target.
 *
 * Twint is enabled natively by Stripe in CH-region accounts; we declare
 * card + twint and Stripe will hide what isn't supported by the account.
 */
export async function POST(req: Request) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        hint: "Set STRIPE_SECRET_KEY in .env to enable payments.",
      },
      { status: 503 },
    );
  }

  const { reference } = (await req.json().catch(() => ({}))) as { reference?: string };
  if (!reference) {
    return NextResponse.json({ error: "missing_reference" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { items: { include: { room: { include: { roomType: true } } } } },
  });
  if (!booking) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  if (booking.status !== "pending_payment") {
    return NextResponse.json(
      { error: "booking_not_payable", status: booking.status },
      { status: 409 },
    );
  }

  const deposit = Number(booking.depositAmount);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const locale = booking.locale === "en" ? "en" : "de";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "twint"],
    customer_email: booking.guestEmail,
    locale: locale === "en" ? "en" : "de",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "chf",
          unit_amount: toRappen(deposit),
          product_data: {
            name: `Chalet Aletsch · Anzahlung · ${booking.reference}`,
            description: `30% Anzahlung für ${booking.guestName} · ${formatDate(
              booking.checkIn,
            )} → ${formatDate(booking.checkOut)}`,
          },
        },
      },
    ],
    success_url: `${siteUrl}/${locale}/booking/${booking.reference}/confirm?paid=1`,
    cancel_url: `${siteUrl}/${locale}/booking/${booking.reference}/confirm?paid=0`,
    metadata: { bookingReference: booking.reference, bookingId: booking.id },
    payment_intent_data: {
      metadata: { bookingReference: booking.reference, bookingId: booking.id },
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
  });

  if (!session.url) {
    return NextResponse.json({ error: "checkout_url_missing" }, { status: 500 });
  }

  // Persist the session id for reconciliation in case the webhook is delayed
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      payments: {
        create: {
          amount: deposit,
          currency: "CHF",
          type: "deposit",
          status: "pending",
          stripeIntentId: session.payment_intent as string | null,
          method: null,
          reference: session.id,
        },
      },
    },
  });

  return NextResponse.json({ url: session.url });
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
