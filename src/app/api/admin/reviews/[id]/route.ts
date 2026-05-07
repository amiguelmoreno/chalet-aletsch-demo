import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user?.email) return { error: "unauthorized" as const, status: 401 };
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (user?.role !== "admin") return { error: "forbidden" as const, status: 403 };
  return null;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await ensureAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { approved?: boolean };
  if (typeof body.approved !== "boolean") {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: {
      approved: body.approved,
      publishedAt: body.approved ? new Date() : null,
    },
    select: { id: true, approved: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await ensureAdmin();
  if (guard) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { id } = await ctx.params;
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
