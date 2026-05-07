import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";
import type { BookingStatus } from "@prisma/client";

const STATUSES: BookingStatus[] = [
  "pending_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
];

export default async function AdminBookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.bookings" });

  const filter = status && STATUSES.includes(status as BookingStatus)
    ? (status as BookingStatus)
    : null;

  const bookings = await prisma.booking.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: { include: { room: { include: { roomType: true } } } },
    },
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
            <FilterChip href="/admin/bookings" label={t("all")} active={!filter} />
            {STATUSES.map((s) => (
              <FilterChip
                key={s}
                href={`/admin/bookings?status=${s}` as `/admin/bookings?status=${string}`}
                label={t(`status.${s}`)}
                active={filter === s}
              />
            ))}
          </div>
        </header>

        <ol className="border-t border-ink-700/15">
          {bookings.map((b) => {
            const room =
              b.items[0]?.room.roomType[locale === "en" ? "nameEn" : "nameDe"] ?? "—";
            return (
              <li key={b.id} className="border-b border-ink-700/15">
                <Link
                  href={`/admin/bookings/${b.id}` as never}
                  className="block py-5 grid grid-cols-12 items-baseline gap-4 hover:bg-parchment-100/40 px-2"
                >
                  <div className="col-span-12 md:col-span-2 font-display italic text-forest-700">
                    {b.reference}
                  </div>
                  <div className="col-span-6 md:col-span-3 text-ink-700">{b.guestName}</div>
                  <div className="col-span-6 md:col-span-2 text-sm text-ink-600">{room}</div>
                  <div className="col-span-12 md:col-span-3 text-sm text-ink-600">
                    {b.checkIn.toISOString().slice(0, 10)} → {b.checkOut.toISOString().slice(0, 10)}
                  </div>
                  <div className="col-span-6 md:col-span-1 font-display">
                    {formatCHF(Number(b.total))}
                  </div>
                  <div className="col-span-6 md:col-span-1 text-right">
                    <StatusPill status={b.status} />
                  </div>
                </Link>
              </li>
            );
          })}
          {bookings.length === 0 && (
            <li className="py-12 text-center italic text-ink-500">{t("empty")}</li>
          )}
        </ol>
      </Container>
    </section>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: `/admin/bookings${string}`;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_payment: "text-seal border-seal/40",
    confirmed: "text-forest-700 border-forest-700/40",
    checked_in: "text-forest-700 border-forest-700/60 bg-forest-700/10",
    checked_out: "text-ink-500 border-ink-500/30",
    cancelled: "text-ink-400 border-ink-400/30 line-through",
    no_show: "text-ink-400 border-ink-400/30",
  };
  return (
    <span className={`editorial-caps inline-block border px-2 py-0.5 text-xs ${map[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
