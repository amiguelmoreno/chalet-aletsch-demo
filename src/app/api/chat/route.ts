import { NextResponse } from "next/server";
import { matchFaq, getFaqAnswerById, type Locale } from "@/lib/chat-faq";

export const runtime = "edge";

// Light per-IP rate limit (best-effort, in-memory).
// Generous because the bot is deterministic and free.
const RATE_LIMIT = 60;
const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_LIMIT) return false;
  b.count++;
  return true;
}

const FALLBACKS: Record<Locale, string> = {
  de: "Das weiss ich nicht — am besten fragen Sie direkt an der Réception unter +41 27 928 00 23 oder per E-Mail an hallo@chalet-aletsch.ch.",
  en: "I'm not sure about that one — please reach out to reception on +41 27 928 00 23 or write to hallo@chalet-aletsch.ch.",
  fr: "Je n'ai pas la réponse à cette question — appelez la réception au +41 27 928 00 23 ou écrivez à hallo@chalet-aletsch.ch.",
  it: "Non ho la risposta a questa domanda — rivolgetevi alla reception allo +41 27 928 00 23 o scrivete a hallo@chalet-aletsch.ch.",
};

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { message?: string; faqId?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const locale: Locale = (["de", "en", "fr", "it"] as Locale[]).includes(
    body.locale as Locale,
  )
    ? (body.locale as Locale)
    : "de";

  // Chip click — fetch the canned answer by id
  if (body.faqId) {
    const answer = getFaqAnswerById(body.faqId, locale);
    return NextResponse.json({
      reply: answer ?? FALLBACKS[locale],
      matched: answer ? body.faqId : null,
    });
  }

  // Free-text query — match against keywords
  const text = (body.message ?? "").toString().slice(0, 500).trim();
  if (!text) {
    return NextResponse.json({ error: "missing_message" }, { status: 400 });
  }

  const match = matchFaq(text, locale);
  return NextResponse.json({
    reply: match ? match.answer : FALLBACKS[locale],
    matched: match?.faqId ?? null,
  });
}
