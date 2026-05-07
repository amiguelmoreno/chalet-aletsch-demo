import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminGuardError = { error: "unauthorized" | "forbidden"; status: 401 | 403 };

/**
 * Server-side guard for admin API routes. Returns null when the request is
 * authorised, or an `AdminGuardError` to spread into a NextResponse.json.
 */
export async function requireAdmin(): Promise<AdminGuardError | null> {
  const session = await auth();
  if (!session?.user?.email) return { error: "unauthorized", status: 401 };
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (user?.role !== "admin") return { error: "forbidden", status: 403 };
  return null;
}
