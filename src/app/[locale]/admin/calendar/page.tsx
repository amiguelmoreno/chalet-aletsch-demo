import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { prisma } from "@/lib/prisma";
import { CalendarClient, type CalendarEvent } from "./CalendarClient";

export default async function AdminCalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.calendar" });

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["pending_payment", "confirmed", "checked_in", "checked_out"] },
    },
    include: {
      items: { include: { room: { include: { roomType: true } } } },
    },
    orderBy: { checkIn: "asc" },
    take: 500,
  });

  const events: CalendarEvent[] = bookings.map((b) => {
    const room = b.items[0]?.room.roomType;
    return {
      id: b.id,
      title: `${room ? (locale === "en" ? room.nameEn : room.nameDe) : "—"} · ${b.guestName}`,
      start: format(b.checkIn, "yyyy-MM-dd"),
      end: format(b.checkOut, "yyyy-MM-dd"),
      status: b.status,
      url: `/${locale}/admin/bookings/${b.id}`,
    };
  });

  return (
    <section className="py-12 md:py-16">
      <Container>
        <header className="mb-8">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-3">{t("title")}</h1>
          <p className="mt-3 text-ink-600 max-w-prose">{t("intro")}</p>
        </header>
        <CalendarClient events={events} locale={locale} />
      </Container>
    </section>
  );
}
