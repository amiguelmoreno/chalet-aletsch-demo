import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";
import { StatusEditor } from "./StatusEditor";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.bookingDetail" });

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      items: { include: { room: { include: { roomType: true } } } },
      extras: { include: { experience: true } },
      payments: { orderBy: { createdAt: "desc" } },
      user: true,
    },
  });
  if (!booking) notFound();

  const dateLocale = locale === "de" ? deLocale : undefined;
  const fmt = (d: Date) => format(d, "EEEE, d. MMMM yyyy", { locale: dateLocale });

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/bookings" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>

        <header className="mt-6 flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display italic text-display-md mt-2">{booking.reference}</h1>
          </div>
          <StatusEditor id={booking.id} initial={booking.status} />
        </header>

        <div className="my-10">
          <OrnamentRule />
        </div>

        <SectionTitle label={t("guest")} />
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-10">
          <Field label={t("name")} value={booking.guestName} />
          <Field label={t("email")} value={booking.guestEmail} />
          {booking.user?.id && (
            <Field label={t("user")} value={`${booking.user.email} · ${booking.user.role}`} />
          )}
          <Field label={t("locale")} value={booking.locale.toUpperCase()} />
        </dl>

        <SectionTitle label={t("stay")} />
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-10">
          <Field label={t("checkIn")} value={fmt(booking.checkIn)} />
          <Field label={t("checkOut")} value={fmt(booking.checkOut)} />
          <Field label={t("guests")} value={`${booking.adults} + ${booking.children}`} />
          <Field
            label={t("hold")}
            value={
              booking.holdExpiresAt
                ? booking.holdExpiresAt.toLocaleString(locale)
                : "—"
            }
          />
        </dl>

        <SectionTitle label={t("rooms")} />
        <ul className="border-t border-ink-700/10 mb-10">
          {booking.items.map((item, i) => (
            <li key={i} className="border-b border-ink-700/10 py-3 flex justify-between">
              <span>
                {locale === "en" ? item.room.roomType.nameEn : item.room.roomType.nameDe}
                <span className="text-ink-500"> · {item.nights} × {formatCHF(Number(item.unitPrice))}</span>
              </span>
              <span className="font-display">{formatCHF(Number(item.lineTotal))}</span>
            </li>
          ))}
        </ul>

        {booking.extras.length > 0 && (
          <>
            <SectionTitle label={t("extras")} />
            <ul className="border-t border-ink-700/10 mb-10">
              {booking.extras.map((e, i) => (
                <li key={i} className="border-b border-ink-700/10 py-3 flex justify-between">
                  <span>
                    {locale === "en" ? e.experience.nameEn : e.experience.nameDe}
                    <span className="text-ink-500"> × {e.quantity}</span>
                  </span>
                  <span className="font-display">{formatCHF(Number(e.lineTotal))}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <SectionTitle label={t("payments")} />
        <ul className="border-t border-ink-700/10 mb-10">
          {booking.payments.map((p, i) => (
            <li key={i} className="border-b border-ink-700/10 py-3 grid grid-cols-12 items-baseline gap-3 text-sm">
              <span className="col-span-3 editorial-caps text-forest-700">{p.type}</span>
              <span className="col-span-3 text-ink-600">{p.method ?? "—"}</span>
              <span className="col-span-3 italic text-ink-500">
                {p.receivedAt ? p.receivedAt.toLocaleDateString(locale) : "—"}
              </span>
              <span className="col-span-2"><StatusPill status={p.status} /></span>
              <span className="col-span-1 text-right font-display">{formatCHF(Number(p.amount))}</span>
            </li>
          ))}
          {booking.payments.length === 0 && (
            <li className="py-3 italic text-ink-500 text-sm">{t("noPayments")}</li>
          )}
        </ul>

        <div className="flex justify-between items-baseline pt-4 border-t border-ink-700/20">
          <p className="editorial-caps text-forest-700">{t("total")}</p>
          <p className="font-display text-3xl">{formatCHF(Number(booking.total))}</p>
        </div>

        {booking.notes && (
          <>
            <div className="my-10">
              <OrnamentRule />
            </div>
            <SectionTitle label={t("notes")} />
            <p className="italic text-ink-700 leading-relaxed">{booking.notes}</p>
          </>
        )}
      </Container>
    </section>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <p className="editorial-caps text-forest-700 mb-4">{label}</p>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="editorial-caps text-forest-700 mb-1">{label}</dt>
      <dd className="text-ink-700">{value}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "text-seal border-seal/40",
    succeeded: "text-forest-700 border-forest-700/40",
    failed: "text-ink-400 border-ink-400/30",
    refunded: "text-ink-400 border-ink-400/30",
  };
  return (
    <span className={`editorial-caps inline-block border px-2 py-0.5 text-xs ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
