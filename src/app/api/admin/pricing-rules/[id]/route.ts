import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const data: Prisma.PricingRuleUpdateInput = {};
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.dateFrom === "string") data.dateFrom = new Date(body.dateFrom);
  if (typeof body.dateTo === "string") data.dateTo = new Date(body.dateTo);
  if (typeof body.multiplier === "number") data.multiplier = new Prisma.Decimal(body.multiplier);
  if (body.flatAdjust === null) data.flatAdjust = null;
  else if (typeof body.flatAdjust === "number") data.flatAdjust = new Prisma.Decimal(body.flatAdjust);
  if (body.minStay === null) data.minStay = null;
  else if (typeof body.minStay === "number") data.minStay = body.minStay;
  if (typeof body.priority === "number") data.priority = body.priority;
  if (typeof body.notes === "string" || body.notes === null) data.notes = body.notes as string | null;

  const updated = await prisma.pricingRule.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  await prisma.pricingRule.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
