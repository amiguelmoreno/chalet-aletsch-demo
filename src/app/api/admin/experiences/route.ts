import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const body = (await req.json().catch(() => ({}))) as {
    propertyId?: string;
    slug?: string;
    nameDe?: string;
    nameEn?: string;
    descriptionDe?: string | null;
    descriptionEn?: string | null;
    unitPrice?: number;
    unit?: string;
    active?: boolean;
  };

  if (!body.propertyId || !body.slug || !body.nameDe || !body.nameEn || typeof body.unitPrice !== "number") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const created = await prisma.experience.create({
    data: {
      propertyId: body.propertyId,
      slug: body.slug,
      nameDe: body.nameDe,
      nameEn: body.nameEn,
      descriptionDe: body.descriptionDe ?? null,
      descriptionEn: body.descriptionEn ?? null,
      unitPrice: new Prisma.Decimal(body.unitPrice),
      unit: body.unit ?? "person",
      active: body.active ?? true,
    },
  });

  return NextResponse.json({ id: created.id });
}
