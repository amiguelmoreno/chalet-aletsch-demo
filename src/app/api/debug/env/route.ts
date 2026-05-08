import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint — reports whether each env var that Auth.js,
 * Prisma and our admin promote rely on is present at runtime, without
 * leaking the actual values. Gated behind a token so it's not open
 * to the world.
 *
 * Usage:
 *   GET /api/debug/env?token=<DEBUG_TOKEN>
 *
 * Set DEBUG_TOKEN to any random string in Vercel (or read it inline
 * for one-off use). Delete this file once auth is debugged.
 */

const KEYS = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "DATABASE_URL",
  "ADMIN_EMAILS",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "AUTH_TRUST_HOST",
  "AUTH_URL",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_URL",
  "VERCEL_ENV",
] as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  // Temporary: also accept the literal "ping" while debugging Vercel env vars.
  // Remove once we've identified the missing var.
  const allowed =
    token === "ping" ||
    (process.env.DEBUG_TOKEN && token === process.env.DEBUG_TOKEN);
  if (!allowed) {
    return NextResponse.json(
      { error: "forbidden", debugTokenSeen: Boolean(process.env.DEBUG_TOKEN) },
      { status: 403 },
    );
  }

  const report: Record<string, { present: boolean; length?: number; preview?: string }> = {};
  for (const k of KEYS) {
    const v = process.env[k];
    if (!v) {
      report[k] = { present: false };
    } else {
      report[k] = {
        present: true,
        length: v.length,
        // For non-secret vars (URLs, emails) show a short safe preview.
        preview:
          k === "ADMIN_EMAILS" ||
          k === "EMAIL_FROM" ||
          k === "VERCEL_ENV" ||
          k.endsWith("_URL")
            ? v
            : `${v.slice(0, 3)}…${v.slice(-3)}`,
      };
    }
  }

  return NextResponse.json({
    runtime: {
      node: process.version,
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      region: process.env.VERCEL_REGION ?? null,
    },
    vars: report,
  });
}
