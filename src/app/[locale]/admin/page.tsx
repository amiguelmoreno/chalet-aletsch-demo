import { setRequestLocale, getTranslations } from "next-intl/server";
import { startOfYear, endOfYear } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.overview" });

  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());

  const [pending, confirmed, paidThisYear, recent] = await Promise.all([
    prisma.booking.count({ where: { status: "pending_payment" } }),
    prisma.booking.count({
      where: {
        status: { in: ["confirmed", "checked_in"] },
        checkOut: { gte: new Date() },
      },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ["confirmed", "checked_in", "checked_out"] },
        checkIn: { gte: yearStart, lte: yearEnd },
      },
      _sum: { total: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        reference: true,
        guestName: true,
        checkIn: true,
        checkOut: true,
        status: true,
        total: true,
      },
    }),
  ]);

  const yearTotal = paidThisYear._sum.total ? Number(paidThisYear._sum.total) : 0;

  return (
    <section className="py-14 md:py-20">
      <Container>
        <h1 className="font-display italic text-display-md text-ink-700">
          {t("title")}
        </h1>
        <p className="mt-3 text-ink-600 max-w-prose">{t("intro")}</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-16">
          <Stat n={1} label={t("revenueYtd")} value={formatCHF(yearTotal)} />
          <Stat n={2} label={t("upcoming")} value={String(confirmed)} />
          <Stat n={3} label={t("pending")} value={String(pending)} />
        </div>

        <div className="my-16">
          <OrnamentRule />
        </div>

        <header className="flex items-baseline justify-between mb-6">
          <Eyebrow>{t("recent")}</Eyebrow>
          <Link href="/admin/bookings" className="ink-link editorial-caps">
            {t("seeAll")} →
          </Link>
        </header>

        <ol className="border-t border-ink-700/15">
          {recent.map((b) => (
            <li key={b.id} className="border-b border-ink-700/15">
              <Link
                href={`/admin/bookings/${b.id}` as never}
                className="block py-5 grid grid-cols-12 items-baseline gap-4 hover:bg-parchment-100/40 px-2"
              >
                <div className="col-span-3 font-display italic text-forest-700">
                  {b.reference}
                </div>
                <div className="col-span-3 text-ink-700">{b.guestName}</div>
                <div className="col-span-3 text-sm text-ink-600">
                  {b.checkIn.toISOString().slice(0, 10)} → {b.checkOut.toISOString().slice(0, 10)}
                </div>
                <div className="col-span-2">
                  <StatusPill status={b.status} />
                </div>
                <div className="col-span-1 text-right font-display">
                  {formatCHF(Number(b.total))}
                </div>
              </Link>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="py-12 text-center italic text-ink-500">{t("empty")}</li>
          )}
        </ol>
      </Container>
    </section>
  );
}

function Stat({ n, label, value }: { n: number; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <RomanNumeral value={n} className="text-xl" />
        <span className="block w-8 h-px bg-forest-700/40" />
        <Eyebrow>{label}</Eyebrow>
      </div>
      <p className="font-display text-display-md text-ink-700">{value}</p>
    </div>
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
