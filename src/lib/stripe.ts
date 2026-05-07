import Stripe from "stripe";

export const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

export const stripe = stripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    })
  : null;

/** Convert CHF amount to Stripe's smallest unit (Rappen). */
export function toRappen(chf: number): number {
  return Math.round(chf * 100);
}
