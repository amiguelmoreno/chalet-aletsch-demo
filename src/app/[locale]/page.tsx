import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { AtAGlance } from "@/components/marketing/AtAGlance";
import { StoryExcerpt } from "@/components/marketing/StoryExcerpt";
import { RoomsLedger } from "@/components/marketing/RoomsLedger";
import { Guestbook } from "@/components/marketing/Guestbook";
import { AvailabilityNudge } from "@/components/marketing/AvailabilityNudge";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelJsonLd, lodgingBusinessJsonLd, faqJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { WalliserBand } from "@/components/ornaments/WalliserBand";
import { Reveal } from "@/components/motion/Reveal";

async function fetchAggregateRating() {
  try {
    const stats = await prisma.review.aggregate({
      where: { approved: true },
      _avg: { rating: true },
      _count: { _all: true },
    });
    if (!stats._count._all) return null;
    return {
      ratingValue: Number((stats._avg.rating ?? 0).toFixed(1)),
      reviewCount: stats._count._all,
    };
  } catch {
    return null;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale === "en" ? "en" : "de";

  const faqs =
    loc === "en"
      ? [
          {
            q: "Where is Chalet Aletsch?",
            a: "On the Riederalp, a car-free village above the Rhône valley in the Canton of Valais, Switzerland. Reach us by train to Mörel and then the cable car to Riederalp.",
          },
          {
            q: "How many rooms does the house have?",
            a: "Four — Arvenstube (double), Blauseeli (single), Fiescher (family) and the Konkordia suite. We do not plan to add more.",
          },
          {
            q: "Is breakfast included?",
            a: "A simple breakfast is included with all rooms. Half board (breakfast plus a four-course evening meal) can be added.",
          },
          {
            q: "Are pets welcome?",
            a: "Yes, well-behaved dogs are welcome. A small fee applies for cleaning.",
          },
          {
            q: "What is the cancellation policy?",
            a: "Free cancellation up to 7 days before arrival. After that, the deposit is retained.",
          },
        ]
      : [
          {
            q: "Wo befindet sich das Chalet Aletsch?",
            a: "Auf der Riederalp, einem autofreien Dorf oberhalb des Rhonetals im Kanton Wallis. Anreise per Bahn nach Mörel, dann mit der Seilbahn auf die Riederalp.",
          },
          {
            q: "Wie viele Stuben hat das Haus?",
            a: "Vier — Arvenstube (Doppel), Blauseeli (Einzel), Fiescher (Familie) und die Konkordia-Suite. Wir planen nicht zu wachsen.",
          },
          {
            q: "Ist Frühstück inbegriffen?",
            a: "Ein einfaches Frühstück ist in jedem Zimmerpreis enthalten. Halbpension (Frühstück und viergängiges Abendessen) kann dazugebucht werden.",
          },
          {
            q: "Sind Hunde erlaubt?",
            a: "Ja, brave Hunde sind willkommen. Eine kleine Reinigungsgebühr fällt an.",
          },
          {
            q: "Wie sind die Stornobedingungen?",
            a: "Kostenloser Rücktritt bis 7 Tage vor Anreise. Danach wird die Anzahlung einbehalten.",
          },
        ];

  const aggregate = await fetchAggregateRating();
  const lodging = lodgingBusinessJsonLd(loc) as Record<string, unknown>;
  if (aggregate) {
    lodging.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregate.ratingValue,
      reviewCount: aggregate.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <>
      <JsonLd data={[lodging, hotelJsonLd(loc), faqJsonLd(faqs)]} />
      <Hero />
      <Reveal threshold={0.1}>
        <AtAGlance />
      </Reveal>
      <Reveal threshold={0.05}>
        <StoryExcerpt />
      </Reveal>
      <Reveal threshold={0.05}>
        <RoomsLedger />
      </Reveal>
      <Reveal>
        <WalliserBand />
      </Reveal>
      <Reveal threshold={0.1}>
        <Guestbook locale={loc} />
      </Reveal>
      <Reveal threshold={0.1}>
        <AvailabilityNudge />
      </Reveal>
    </>
  );
}
