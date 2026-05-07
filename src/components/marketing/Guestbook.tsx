import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { prisma } from "@/lib/prisma";

export async function Guestbook({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.guestbook" });

  // Try a real approved review first; fall back to the seed quote.
  const recent = await fetchLatestApproved(locale);
  const rating = recent?.rating ?? 5;
  const quote = recent?.body ?? t("quote");
  const author = recent?.authorName ?? t("author");
  const date = recent?.publishedAt
    ? new Date(recent.publishedAt).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : t("date");

  return (
    <section className="py-24 md:py-32 bg-parchment-100/50 above-grain">
      <Container width="narrow" className="text-center">
        <Eyebrow ornament>{t("eyebrow")}</Eyebrow>

        <div className="mt-8 flex justify-center gap-2 text-forest-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} />
          ))}
        </div>

        <blockquote className="mt-10">
          <p className="font-display italic text-2xl md:text-[1.85rem] leading-snug text-ink-700 max-w-2xl mx-auto">
            “{quote}”
          </p>
          <footer className="mt-8 editorial-caps text-forest-700">
            <span>{author}</span>
            <span className="mx-3 text-forest-700/40">·</span>
            <span>{date}</span>
          </footer>
        </blockquote>

        <p className="mt-10 text-sm text-ink-500 italic">{t("note")}</p>
      </Container>
    </section>
  );
}

async function fetchLatestApproved(locale: string) {
  try {
    const r = await prisma.review.findFirst({
      where: { approved: true, locale },
      orderBy: { publishedAt: "desc" },
      select: { authorName: true, rating: true, body: true, publishedAt: true },
    });
    if (r) return r;
    // Fallback: any locale, latest approved
    return await prisma.review.findFirst({
      where: { approved: true },
      orderBy: { publishedAt: "desc" },
      select: { authorName: true, rating: true, body: true, publishedAt: true },
    });
  } catch {
    return null;
  }
}

function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M 8 1 L 9.8 5.8 L 15 6.2 L 11 9.6 L 12.4 14.6 L 8 12 L 3.6 14.6 L 5 9.6 L 1 6.2 L 6.2 5.8 Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
