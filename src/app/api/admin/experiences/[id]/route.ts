import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const data: Prisma.ExperienceUpdateInput = {};
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.nameDe === "string") data.nameDe = body.nameDe;
  if (typeof body.nameEn === "string") data.nameEn = body.nameEn;
  if (typeof body.descriptionDe === "string" || body.descriptionDe === null)
    data.descriptionDe = body.descriptionDe as string | null;
  if (typeof body.descriptionEn === "string" || body.descriptionEn === null)
    data.descriptionEn = body.descriptionEn as string | null;
  if (typeof body.unitPrice === "number") data.unitPrice = new Prisma.Decimal(body.unitPrice);
  if (typeof body.unit === "string") data.unit = body.unit;
  if (typeof body.active === "boolean") data.active = body.active;

  const updated = await prisma.experience.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
