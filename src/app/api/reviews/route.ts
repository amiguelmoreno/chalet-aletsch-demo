import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    reference?: string;
    rating?: number;
    body?: string;
    locale?: string;
  };

  if (
    !body.reference ||
    typeof body.rating !== "number" ||
    body.rating < 1 ||
    body.rating > 5 ||
    !body.body ||
    body.body.trim().length < 10
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { reference: body.reference },
    select: {
      id: true,
      guestEmail: true,
      guestName: true,
      status: true,
      reviews: { select: { id: true } },
    },
  });
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (booking.guestEmail !== session.user.email) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (booking.status !== "checked_out") {
    return NextResponse.json(
      { error: "not_yet_eligible", hint: "Reviews can only be left after checkout." },
      { status: 409 },
    );
  }
  if (booking.reviews.length > 0) {
    return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
  }

  const userRow = session.user.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const created = await prisma.review.create({
    data: {
      bookingId: booking.id,
      userId: userRow?.id,
      authorName: booking.guestName,
      rating: body.rating,
      body: body.body.trim().slice(0, 1500),
      locale: body.locale === "en" ? "en" : "de",
      approved: false,
      source: "internal",
    },
  });

  return NextResponse.json({ id: created.id, approved: false });
}
