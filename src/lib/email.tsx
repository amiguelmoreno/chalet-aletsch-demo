import { Resend } from "resend";
import { render } from "@react-email/components";
import { BookingConfirmationEmail } from "@/emails/BookingConfirmation";

type BookingForEmail = {
  reference: string;
  guestEmail: string;
  guestName: string;
  locale: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  total: number | { toString(): string };
  depositAmount: number | { toString(): string };
  items: Array<{
    nights: number;
    lineTotal: number | { toString(): string };
    room: { roomType: { nameDe: string; nameEn: string } };
  }>;
  extras: Array<{
    quantity: number;
    lineTotal: number | { toString(): string };
    experience: { nameDe: string; nameEn: string };
  }>;
};

export const emailConfigured = !!process.env.RESEND_API_KEY;

export async function sendBookingConfirmation(booking: BookingForEmail) {
  if (!emailConfigured) {
    console.info("[email] RESEND_API_KEY not set — skipping booking email");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM ?? "Chalet Aletsch <hallo@chalet-aletsch.ch>";

  const html = await render(<BookingConfirmationEmail booking={booking} />);

  const { data, error } = await resend.emails.send({
    from,
    to: booking.guestEmail,
    subject: `Reservation ${booking.reference} — Chalet Aletsch`,
    html,
  });

  if (error) {
    throw new Error(`Resend ${error.name ?? "error"}: ${error.message}`);
  }

  console.info(
    `[email] sent ${booking.reference} → ${booking.guestEmail} (id ${data?.id})`,
  );
}
