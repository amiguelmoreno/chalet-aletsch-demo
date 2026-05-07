import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  buildSwissQrPayload,
  generateSwissQrDataUrl,
} from "@/lib/swiss-qr";
import {
  BookingInvoicePdf,
  type BookingInvoiceData,
} from "@/components/pdf/BookingInvoicePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ reference: string }> },
) {
  const { reference } = await ctx.params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: {
      items: { include: { room: { include: { roomType: true } } } },
      extras: { include: { experience: true } },
    },
  });
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Authorisation: owner or admin only
  const session = await auth();
  const requesterEmail = session?.user?.email;
  let isAdmin = false;
  if (requesterEmail) {
    const u = await prisma.user.findUnique({
      where: { email: requesterEmail },
      select: { role: true },
    });
    isAdmin = u?.role === "admin";
  }
  if (!isAdmin && requesterEmail !== booking.guestEmail) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Resolve business settings (with sensible defaults)
  const settings = await prisma.appSetting.findMany({
    where: { key: { in: ["business.name", "business.email", "business.phone", "business.iban"] } },
  });
  const setting = (key: string, fallback: string) =>
    settings.find((s) => s.key === key)?.value ?? fallback;

  const business = {
    name: setting("business.name", "Chalet Aletsch"),
    street: "Furkastrasse 14",
    zip: "3987",
    city: "Riederalp",
    country: "CH",
    email: setting("business.email", "hallo@chalet-aletsch.ch"),
    phone: setting("business.phone", "+41 27 928 00 23"),
    iban: setting("business.iban", "CH00 0000 0000 0000 0000 0"),
    bank: "PostFinance AG",
    accountHolder: "Chalet Aletsch GmbH",
  };

  const subtotalRappen = Math.round(Number(booking.subtotal) * 100);
  const totalRappen = Math.round(Number(booking.total) * 100);
  const depositRappen = Math.round(Number(booking.depositAmount) * 100);

  // Generate QR (only if IBAN is configured properly — placeholder IBAN won't be valid for QR)
  const ibanClean = business.iban.replace(/\s/g, "");
  let qrDataUrl: string | null = null;
  if (/^CH\d{19}$/.test(ibanClean)) {
    try {
      const payload = buildSwissQrPayload({
        iban: business.iban,
        creditorName: business.accountHolder,
        creditorStreet: business.street,
        creditorZipCity: `${business.zip} ${business.city}`,
        creditorCountry: business.country,
        amountRappen: depositRappen,
        currency: "CHF",
        debtorName: booking.guestName,
        debtorCountry: "CH",
        message: `${booking.reference} — Anzahlung`,
      });
      qrDataUrl = await generateSwissQrDataUrl(payload);
    } catch (err) {
      console.warn("[pdf] QR generation failed:", (err as Error).message);
    }
  }

  const data: BookingInvoiceData = {
    reference: booking.reference,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    locale: ["de", "en", "fr", "it"].includes(booking.locale)
      ? (booking.locale as "de" | "en" | "fr" | "it")
      : "de",
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    adults: booking.adults,
    children: booking.children,
    items: booking.items.map((it) => ({
      roomName: it.room.roomType.nameDe,
      nights: it.nights,
      unitPriceRappen: Math.round(Number(it.unitPrice) * 100),
      lineTotalRappen: Math.round(Number(it.lineTotal) * 100),
    })),
    extras: booking.extras.map((ex) => ({
      name: ex.experience.nameDe,
      quantity: ex.quantity,
      unitPriceRappen: Math.round(Number(ex.unitPrice) * 100),
      lineTotalRappen: Math.round(Number(ex.lineTotal) * 100),
    })),
    subtotalRappen,
    totalRappen,
    depositRappen,
    issueDate: booking.createdAt,
    business,
    qrDataUrl,
  };

  const stream = await renderToStream(<BookingInvoicePdf data={data} />);

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${booking.reference}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
