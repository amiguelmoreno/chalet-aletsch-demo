import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "Chalet Aletsch <hallo@chalet-aletsch.ch>",
    }),
  );
}

/** True iff at least one auth provider is configured via environment. */
export const authConfigured = providers.length > 0;

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/de/sign-in",
    verifyRequest: "/de/sign-in/verify",
  },
  providers,
  events: {
    async signIn({ user }) {
      // Auto-promote configured admins on every sign-in.
      if (user?.id && user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin" },
        });
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      // Surface role to client via session.user.role
      if (session.user) {
        // @ts-expect-error - extending session type
        session.user.role = (user as { role?: string } | undefined)?.role ?? "guest";
      }
      return session;
    },
  },
});
