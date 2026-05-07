import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    dateFrom?: string;
    dateTo?: string;
    multiplier?: number;
    flatAdjust?: number | null;
    minStay?: number | null;
    priority?: number;
    notes?: string | null;
  };

  if (!body.name || !body.dateFrom || !body.dateTo) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const created = await prisma.pricingRule.create({
    data: {
      name: body.name,
      dateFrom: new Date(body.dateFrom),
      dateTo: new Date(body.dateTo),
      multiplier: new Prisma.Decimal(body.multiplier ?? 1),
      flatAdjust: body.flatAdjust != null ? new Prisma.Decimal(body.flatAdjust) : null,
      minStay: body.minStay ?? null,
      priority: body.priority ?? 0,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json({ id: created.id });
}
