import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { prisma } from "@/lib/prisma";
import { ReviewModerationRow } from "./ReviewModerationRow";

export default async function AdminReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { locale } = await params;
  const { filter } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.reviews" });

  const where =
    filter === "approved"
      ? { approved: true }
      : filter === "pending"
        ? { approved: false }
        : undefined;

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { booking: { select: { reference: true, checkOut: true } } },
  });

  return (
    <section className="py-14 md:py-20">
      <Container>
        <header className="flex items-baseline justify-between flex-wrap gap-6 mb-10">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display italic text-display-md mt-3">{t("title")}</h1>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <FilterChip href="/admin/reviews" label={t("all")} active={!filter} />
            <FilterChip
              href="/admin/reviews?filter=pending"
              label={t("pendingFilter")}
              active={filter === "pending"}
            />
            <FilterChip
              href="/admin/reviews?filter=approved"
              label={t("approvedFilter")}
              active={filter === "approved"}
            />
          </div>
        </header>

        {reviews.length === 0 ? (
          <p className="py-12 text-center italic text-ink-500">{t("empty")}</p>
        ) : (
          <ul className="border-t border-ink-700/15">
            {reviews.map((r) => (
              <ReviewModerationRow
                key={r.id}
                id={r.id}
                authorName={r.authorName}
                rating={r.rating}
                body={r.body}
                approved={r.approved}
                createdAt={r.createdAt.toISOString()}
                bookingReference={r.booking?.reference ?? null}
                locale={r.locale}
              />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

import { Link } from "@/i18n/routing";

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={`editorial-caps border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-ink-700 bg-ink-700 text-parchment-50"
          : "border-ink-700/20 text-ink-700 hover:border-ink-700"
      }`}
    >
      {label}
    </Link>
  );
}
