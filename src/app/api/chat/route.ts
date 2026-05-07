import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chat-knowledge";

export const runtime = "nodejs";
// In-memory rate limit by IP — best-effort, resets on cold start.
// For production-grade limiting use Upstash Ratelimit or similar.
const RATE_LIMIT = 20; // messages per IP per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
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

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "chatbot_not_configured" },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: Array<{ role: "user" | "assistant"; content: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "missing_messages" }, { status: 400 });
  }

  // Truncate to last 10 turns to keep context tight + cap input
  const messages = body.messages
    .slice(-10)
    .filter((m) => typeof m.content === "string" && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, 1000),
    }));

  if (messages.length === 0 || messages[messages.length - 1]!.role !== "user") {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 320,
      system: CHATBOT_SYSTEM_PROMPT,
      messages,
    });

    const text = response.content
      .filter((c) => c.type === "text")
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("")
      .trim();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[chat] anthropic error:", err);
    return NextResponse.json(
      { error: "upstream_error", hint: (err as Error).message },
      { status: 502 },
    );
  }
}
