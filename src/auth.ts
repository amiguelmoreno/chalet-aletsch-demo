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

// On Vercel + custom domain we explicitly mark cookies as Secure +
// SameSite=Lax so the PKCE / state cookies survive the OAuth round-trip.
// Without this, Auth.js can fall back to inferring host from the request
// (which on Vercel proxies looks like HTTP), and the resulting cookies
// don't get the __Secure- prefix → next request loses them.
const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: { sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}authjs.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
    state: {
      name: `${cookiePrefix}authjs.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
    nonce: {
      name: `${cookiePrefix}authjs.nonce`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
  },
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
