import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { prisma } from "@/lib/prisma";
import {
  GuestbookCarousel,
  type GuestbookEntry,
} from "./GuestbookCarousel";
import { SAMPLE_REVIEWS, type Locale as SampleLocale } from "@/lib/sample-reviews";

const SAMPLE_LOCALES: SampleLocale[] = ["de", "en", "fr", "it"];

export async function Guestbook({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.guestbook" });

  const dbEntries = await fetchApprovedReviews(locale);
  const sampleLocale: SampleLocale = SAMPLE_LOCALES.includes(locale as SampleLocale)
    ? (locale as SampleLocale)
    : "de";

  // Build the carousel entries: prefer real reviews, fall back to samples,
  // and always show at least four cards so the carousel feels populated.
  const entries: GuestbookEntry[] = [];
  for (const r of dbEntries) {
    entries.push({
      id: `db-${r.id}`,
      body: r.body,
      authorName: r.authorName,
      rating: r.rating,
      formattedDate: r.publishedAt
        ? formatDate(r.publishedAt, locale)
        : t("date"),
    });
  }
  if (entries.length < 4) {
    const seenAuthors = new Set(entries.map((e) => e.authorName));
    for (const s of SAMPLE_REVIEWS[sampleLocale]) {
      if (entries.length >= 6) break;
      if (seenAuthors.has(s.authorName)) continue;
      entries.push({
        id: `sample-${s.id}`,
        body: s.body,
        authorName: s.authorName,
        location: s.location,
        rating: s.rating,
        formattedDate: formatDate(new Date(s.publishedAt), locale),
      });
    }
  }

  return (
    <section className="py-24 md:py-32 bg-parchment-100/50 above-grain">
      <Container width="narrow">
        <div className="text-center mb-14 md:mb-16">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
        </div>

        <GuestbookCarousel
          entries={entries}
          prevLabel={t("prev")}
          nextLabel={t("next")}
        />

        <p className="mt-12 text-center text-sm text-ink-500 italic">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}

function formatDate(d: Date, locale: string) {
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function fetchApprovedReviews(locale: string) {
  try {
    const rows = await prisma.review.findMany({
      where: { approved: true, locale },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        id: true,
        authorName: true,
        rating: true,
        body: true,
        publishedAt: true,
      },
    });
    if (rows.length > 0) return rows;
    return await prisma.review.findMany({
      where: { approved: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        id: true,
        authorName: true,
        rating: true,
        body: true,
        publishedAt: true,
      },
    });
  } catch {
    return [];
  }
}
