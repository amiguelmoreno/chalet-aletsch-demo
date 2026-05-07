import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { auth } from "@/auth";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";
import { SignOutButton } from "./SignOutButton";

type BookingRow = {
  id: string;
  reference: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  total: number;
  roomName: string;
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const email = session?.user?.email ?? "";
  const name = session?.user?.name ?? "";

  const bookings = email ? await fetchBookings(email, locale) : [];
  const t = await getTranslations({ locale, namespace: "account" });

  return (
    <section className="py-20 md:py-28">
      <Container width="narrow">
        <div className="text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-5">
            {t("title", { name: name || email.split("@")[0] })}
          </h1>
          <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
        </div>

        <div className="my-12">
          <OrnamentRule />
        </div>

        <BookingsBlock bookings={bookings} locale={locale} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Field label={t("name")} value={name || "—"} />
          <Field label={t("email")} value={email} />
        </div>

        <div className="mt-14 flex justify-center">
          <SignOutButton label={t("signOut")} />
        </div>
      </Container>
    </section>
  );
}

async function fetchBookings(email: string, locale: string): Promise<BookingRow[]> {
  try {
    const rows = await prisma.booking.findMany({
      where: { guestEmail: email },
      orderBy: [{ checkIn: "desc" }],
      take: 20,
      include: {
        items: { include: { room: { include: { roomType: true } } } },
      },
    });
    return rows.map((b) => ({
      id: b.id,
      reference: b.reference,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      status: b.status,
      total: Number(b.total),
      roomName:
        b.items[0]?.room.roomType[locale === "en" ? "nameEn" : "nameDe"] ?? "—",
    }));
  } catch {
    return [];
  }
}

function BookingsBlock({
  bookings,
  locale,
}: {
  bookings: BookingRow[];
  locale: string;
}) {
  const t = useTranslations("account.bookings");
  const dateLocale = locale === "de" ? deLocale : undefined;
  const fmt = (d: Date) => format(d, "d. MMMM yyyy", { locale: dateLocale });

  if (bookings.length === 0) {
    return (
      <div className="border border-ink-700/15 bg-parchment-100/30 p-8 md:p-10">
        <div className="flex items-center justify-between border-b border-ink-700/15 pb-5 mb-6">
          <p className="editorial-caps text-forest-700">{t("heading")}</p>
        </div>
        <div className="text-center py-10">
          <Edelweiss className="mx-auto opacity-50" size={36} />
          <p className="mt-6 font-display italic text-2xl text-ink-700">{t("empty")}</p>
          <p className="mt-3 text-ink-500 text-sm">{t("emptyHint")}</p>
          <Link
            href="/booking/new"
            className="inline-block mt-7 editorial-caps border border-ink-700 px-6 py-2.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            {t("startBooking")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <p className="editorial-caps text-forest-700">{t("heading")}</p>
        <span className="text-sm italic text-ink-500">
          {bookings.length} {bookings.length === 1 ? t("entryOne") : t("entryMany")}
        </span>
      </div>
      <ol className="border-t border-ink-700/15">
        {bookings.map((b) => (
          <li key={b.id} className="border-b border-ink-700/15">
            <Link
              href={`/account/bookings/${b.reference}` as never}
              className="block py-5 grid grid-cols-12 items-baseline gap-3 hover:bg-parchment-100/40 px-2 transition-colors group"
            >
              <div className="col-span-12 md:col-span-3 font-display italic text-forest-700">
                {b.reference}
              </div>
              <div className="col-span-7 md:col-span-3 text-ink-700">{b.roomName}</div>
              <div className="col-span-12 md:col-span-3 text-sm text-ink-600">
                {fmt(b.checkIn)} → {fmt(b.checkOut)}
              </div>
              <div className="col-span-5 md:col-span-2">
                <StatusPill status={b.status} />
              </div>
              <div className="col-span-12 md:col-span-1 text-right font-display group-hover:text-seal transition-colors">
                {formatCHF(b.total)}
              </div>
            </Link>
          </li>
        ))}
      </ol>
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
    <span
      className={`editorial-caps inline-block border px-2 py-0.5 text-xs ${map[status] ?? ""}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ink-700/10 pb-3">
      <p className="editorial-caps text-forest-700 mb-1">{label}</p>
      <p className="text-ink-700 font-display">{value}</p>
    </div>
  );
}
