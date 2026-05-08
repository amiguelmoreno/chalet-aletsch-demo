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
      // Auto-link the Google identity to an existing User row with the
      // same verified email. Safe here because Google guarantees the
      // email belongs to the signed-in user, and we want admin rows
      // pre-seeded by `npm run admin:make` to be claimable on first
      // Google sign-in instead of failing with OAuthAccountNotLinked.
      allowDangerousEmailAccountLinking: true,
      // Always force Google's account picker — prevents the case where
      // the user is signed into multiple Google accounts and Google
      // silently re-uses the last one, making "switch account" useless.
      authorization: {
        params: { prompt: "select_account" },
      },
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
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: process.env.AUTH_DEBUG === "1",
  logger: {
    error(error) {
      console.error("[auth][error]", error);
    },
    warn(code) {
      console.warn("[auth][warn]", code);
    },
    debug(message, metadata) {
      if (process.env.AUTH_DEBUG === "1") {
        console.log("[auth][debug]", message, metadata);
      }
    },
  },
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
