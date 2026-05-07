import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { Monogram } from "@/components/ornaments/Monogram";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";
import { stripeConfigured } from "@/lib/stripe";
import { PayDepositButton } from "./PayDepositButton";

export default async function BookingConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; reference: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { locale, reference } = await params;
  const { paid } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bookingConfirm" });

  const booking = await fetchBooking(reference);
  if (!booking) notFound();

  const dateLocale = locale === "de" ? deLocale : undefined;
  const fmt = (d: Date) => format(d, "EEEE, d. MMMM yyyy", { locale: dateLocale });

  const isConfirmed = booking.status === "confirmed";
  const isAwaitingWebhook = paid === "1" && booking.status === "pending_payment";
  const isCancelledByUser = paid === "0";
  const canStillPay =
    stripeConfigured &&
    booking.status === "pending_payment" &&
    !isAwaitingWebhook;

  const heading = isConfirmed
    ? t("paid.title")
    : isAwaitingWebhook
      ? t("processing.title")
      : isCancelledByUser
        ? t("cancelled.title")
        : t("title");

  const lead = isConfirmed
    ? t("paid.body", { name: booking.guestName })
    : isAwaitingWebhook
      ? t("processing.body")
      : isCancelledByUser
        ? t("cancelled.body")
        : t("intro", { name: booking.guestName });

  return (
    <section className="py-20 md:py-28">
      <Container width="narrow">
        <div className="text-center">
          <Edelweiss className="mx-auto" size={48} />
          <Eyebrow ornament className="mt-6">
            {isConfirmed
              ? t("paid.eyebrow")
              : isAwaitingWebhook
                ? t("processing.eyebrow")
                : isCancelledByUser
                  ? t("cancelled.eyebrow")
                  : t("eyebrow")}
          </Eyebrow>
          <h1 className="font-display italic text-display-lg mt-6">{heading}</h1>
          <p className="mt-7 text-[1.1rem] leading-relaxed text-ink-600 max-w-prose mx-auto">
            {lead}
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
                <span className="text-ink-500 text-sm"> · {item.nights} {t("nights")}</span>
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
            <Row label={t("deposit")} value={formatCHF(Number(booking.depositAmount))} muted />
            <div className="flex justify-between items-baseline pt-3 border-t border-ink-700/20">
              <p className="editorial-caps text-forest-700">{t("total")}</p>
              <p className="font-display text-3xl text-ink-700">{formatCHF(Number(booking.total))}</p>
            </div>
          </div>
        </div>

        {canStillPay && (
          <div className="mt-12 text-center">
            <PayDepositButton reference={booking.reference} label={t("payDeposit", { amount: formatCHF(Number(booking.depositAmount)) })} />
          </div>
        )}

        <div className="mt-12 text-center space-y-4">
          <p className="font-display italic text-2xl text-ink-700 max-w-md mx-auto">
            {isConfirmed ? t("paid.nextStep") : t("nextStep")}
          </p>
          <p className="text-ink-600 max-w-prose mx-auto leading-relaxed">
            {isConfirmed ? t("paid.nextStepBody") : t("nextStepBody")}
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="ink-link editorial-caps">
            ← {t("home")}
          </Link>
        </div>
      </Container>
    </section>
  );
}

async function fetchBooking(reference: string) {
  try {
    return await prisma.booking.findUnique({
      where: { reference },
      include: {
        items: { include: { room: { include: { roomType: true } } } },
        extras: { include: { experience: true } },
      },
    });
  } catch {
    return null;
  }
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
