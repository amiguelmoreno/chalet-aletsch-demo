import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@prisma/client";

const ALLOWED: BookingStatus[] = [
  "pending_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userRow = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (userRow?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  if (!body.status || !ALLOWED.includes(body.status as BookingStatus)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: body.status as BookingStatus },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}
