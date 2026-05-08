/**
 * Wipe the User row (and its Accounts/Sessions via cascade) for the given
 * email. Use when the user was pre-seeded by `admin:make` and Auth.js
 * keeps refusing to link an OAuth Account on first sign-in
 * (OAuthAccountNotLinked). After running, sign in with Google
 * normally — Auth.js will create a fresh User + Account, and you can
 * promote again with `npm run admin:make`.
 *
 * Usage:
 *   npm run user:reset -- you@example.com
 */

import { PrismaClient } from "@prisma/client";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Usage: npm run user:reset -- you@example.com");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true, sessions: true },
    });
    if (!existing) {
      console.log(`No user found for ${email}. Nothing to do.`);
      return;
    }
    console.log(
      `Found user ${existing.id} (${existing.email}) with ` +
        `${existing.accounts.length} account(s) and ${existing.sessions.length} session(s).`,
    );

    // Cascade delete: sessions, accounts, then user.
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    await prisma.account.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });

    console.log(`✓ Removed user ${existing.email} and all linked rows.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
