import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { format, isAfter, subDays } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { auth } from "@/auth";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Monogram } from "@/components/ornaments/Monogram";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";
import { stripeConfigured } from "@/lib/stripe";
import { PayDepositButton } from "@/app/[locale]/booking/[reference]/confirm/PayDepositButton";
import { CancelBookingButton } from "./CancelBookingButton";
import { ReviewForm } from "./ReviewForm";

export default async function AccountBookingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; reference: string }>;
}) {
  const { locale, reference } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "accountBooking" });

  const session = await auth();
  if (!session?.user?.email) notFound();

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: {
      items: { include: { room: { include: { roomType: true } } } },
      extras: { include: { experience: true } },
      payments: { orderBy: { createdAt: "desc" } },
      reviews: { select: { id: true, approved: true } },
    },
  });
  if (!booking) notFound();

  // Authorisation: only the email owner can view
  if (booking.guestEmail !== session.user.email) notFound();

  const dateLocale = locale === "de" ? deLocale : undefined;
  const fmt = (d: Date) => format(d, "EEEE, d. MMMM yyyy", { locale: dateLocale });

  // Cancellation policy: free up to 7 days before arrival
  const cancellable =
    ["pending_payment", "confirmed"].includes(booking.status) &&
    isAfter(booking.checkIn, subDays(new Date(), -7));

  const canPay =
    stripeConfigured && booking.status === "pending_payment";

  return (
    <section className="py-16 md:py-20">
      <Container width="narrow">
        <Link href="/account" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>

        <div className="mt-8 text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-5">
            {t(`status.${booking.status}.title`)}
          </h1>
          <p className="mt-5 text-ink-600 max-w-prose mx-auto leading-relaxed">
            {t(`status.${booking.status}.body`)}
          </p>
        </div>

        <div className="my-12">
          <OrnamentRule />
        </div>

        <div className="border border-ink-700/15 bg-parchment-100/30 p-8 md:p-12">
          <div className="flex items-center justify-between mb-8 border-b border-ink-700/15 pb-6">
            <Monogram size={56} />
            <p className="font-display italic text-3xl text-forest-700">
              {booking.reference}
            </p>
          </div>

          <SectionTitle label={t("stay")} />
          <div className="space-y-3 text-[1.05rem]">
            <Row label={t("checkIn")} value={fmt(booking.checkIn)} />
            <Row label={t("checkOut")} value={fmt(booking.checkOut)} />
            <Row
              label={t("guests")}
              value={`${booking.adults}${booking.children ? ` + ${booking.children}` : ""}`}
            />
          </div>

          <div className="my-10">
            <OrnamentRule />
          </div>

          <SectionTitle label={t("rooms")} />
          {booking.items.map((item, i) => (
            <div key={i} className="flex justify-between items-baseline mb-3">
              <span className="text-ink-700">
                {locale === "en" ? item.room.roomType.nameEn : item.room.roomType.nameDe}
                <span className="text-ink-500 text-sm">
                  {" "}· {item.nights} {t("nights")}
                </span>
              </span>
              <span className="font-display">{formatCHF(Number(item.lineTotal))}</span>
            </div>
          ))}

          {booking.extras.length > 0 && (
            <>
              <div className="my-8">
                <OrnamentRule />
              </div>
              <SectionTitle label={t("extras")} />
              {booking.extras.map((e, i) => (
                <div key={i} className="flex justify-between items-baseline mb-2 text-[0.98rem]">
                  <span className="text-ink-700">
                    {locale === "en" ? e.experience.nameEn : e.experience.nameDe}
                    <span className="text-ink-500"> × {e.quantity}</span>
                  </span>
                  <span className="font-display">{formatCHF(Number(e.lineTotal))}</span>
                </div>
              ))}
            </>
          )}

          <div className="my-10">
            <OrnamentRule />
          </div>

          <div className="space-y-3">
            <Row
              label={t("deposit")}
              value={formatCHF(Number(booking.depositAmount))}
              muted
            />
            <div className="flex justify-between items-baseline pt-3 border-t border-ink-700/20">
              <p className="editorial-caps text-forest-700">{t("total")}</p>
              <p className="font-display text-3xl text-ink-700">
                {formatCHF(Number(booking.total))}
              </p>
            </div>
          </div>
        </div>

        {(canPay || cancellable) && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            {canPay && (
              <PayDepositButton
                reference={booking.reference}
                label={t("payDeposit", { amount: formatCHF(Number(booking.depositAmount)) })}
              />
            )}
            {cancellable && (
              <CancelBookingButton reference={booking.reference} label={t("cancel")} />
            )}
          </div>
        )}

        {booking.status === "checked_out" && (
          <div className="mt-14">
            <ReviewForm
              reference={booking.reference}
              alreadySubmitted={booking.reviews.length > 0}
              labels={{
                heading: t("review.heading"),
                intro: t("review.intro"),
                ratingLabel: t("review.ratingLabel"),
                bodyLabel: t("review.bodyLabel"),
                bodyPlaceholder: t("review.bodyPlaceholder"),
                submit: t("review.submit"),
                submitting: t("review.submitting"),
                thanks: t("review.thanks"),
                thanksBody: t("review.thanksBody"),
              }}
            />
          </div>
        )}

        <p className="mt-10 text-center text-sm italic text-ink-500">
          {t("policy")}
        </p>

        <div className="mt-8 text-center">
          <a
            href={`/api/pdf/booking/${booking.reference}`}
            target="_blank"
            rel="noopener"
            className="ink-link editorial-caps-sm text-forest-700"
          >
            ↓ {t("downloadPdf")}
          </a>
        </div>
      </Container>
    </section>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <p className="editorial-caps text-forest-700 mb-4">{label}</p>;
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="editorial-caps text-forest-700/80">{label}</span>
      <span className={muted ? "text-ink-500" : "text-ink-700 font-display"}>{value}</span>
    </div>
  );
}
