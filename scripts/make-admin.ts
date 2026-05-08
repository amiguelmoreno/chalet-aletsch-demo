/**
 * Promote a user to admin by email, or create the user row first if it
 * doesn't exist yet.
 *
 * Usage:
 *   npm run admin:make -- you@example.com
 *
 * Reads DATABASE_URL from `.env` (so it talks to your Neon database).
 * Idempotent — safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Usage: npm run admin:make -- you@example.com");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "admin" },
      create: { email, role: "admin" },
      select: { id: true, email: true, role: true },
    });
    console.log(`✓ ${user.email} is now ${user.role}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
