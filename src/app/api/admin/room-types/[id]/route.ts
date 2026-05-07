import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const data: Prisma.RoomTypeUpdateInput = {};
  if (typeof body.nameDe === "string") data.nameDe = body.nameDe;
  if (typeof body.nameEn === "string") data.nameEn = body.nameEn;
  if (typeof body.subtitleDe === "string") data.subtitleDe = body.subtitleDe;
  if (typeof body.subtitleEn === "string") data.subtitleEn = body.subtitleEn;
  if (typeof body.descriptionDe === "string") data.descriptionDe = body.descriptionDe;
  if (typeof body.descriptionEn === "string") data.descriptionEn = body.descriptionEn;
  if (typeof body.capacity === "number") data.capacity = body.capacity;
  if (typeof body.basePrice === "number") data.basePrice = new Prisma.Decimal(body.basePrice);
  if (typeof body.areaSqm === "number") data.areaSqm = body.areaSqm;
  if (typeof body.position === "number") data.position = body.position;
  if (typeof body.active === "boolean") data.active = body.active;

  const updated = await prisma.roomType.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id });
}
