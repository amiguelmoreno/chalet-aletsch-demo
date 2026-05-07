import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook_secret_missing" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markBookingPaid(session);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPaymentFailed(session);
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripeIntentId: intent.id },
          data: { status: "failed" },
        });
        break;
      }
      default:
        // Other events ignored
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler failed:", err);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function markBookingPaid(session: Stripe.Checkout.Session) {
  const reference = session.metadata?.bookingReference;
  if (!reference) return;

  const intentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;
  const method =
    (Array.isArray(session.payment_method_types) && session.payment_method_types[0]) ||
    null;

  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { reference } });
    if (!booking) return;

    await tx.payment.updateMany({
      where: { reference: session.id },
      data: {
        status: "succeeded",
        receivedAt: new Date(),
        stripeIntentId: intentId,
        method,
      },
    });

    if (booking.status === "pending_payment") {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: "confirmed", holdExpiresAt: null },
      });
    }
  });
}

async function markPaymentFailed(session: Stripe.Checkout.Session) {
  await prisma.payment.updateMany({
    where: { reference: session.id },
    data: { status: "failed" },
  });
}
