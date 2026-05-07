import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";

export default async function AdminRoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.rooms" });

  const types = await prisma.roomType.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { rooms: true } } },
  });

  return (
    <section className="py-14 md:py-20">
      <Container>
        <header className="mb-10">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-3">{t("title")}</h1>
          <p className="mt-3 text-ink-600 max-w-prose">{t("intro")}</p>
        </header>

        <ol className="border-t border-ink-700/15">
          {types.map((rt) => (
            <li key={rt.id} className="border-b border-ink-700/15">
              <Link
                href={`/admin/rooms/${rt.id}` as never}
                className="block py-5 grid grid-cols-12 items-baseline gap-4 hover:bg-parchment-100/40 px-2 transition-colors"
              >
                <div className="col-span-12 md:col-span-1 font-display italic text-forest-700">
                  {String(rt.position).padStart(2, "0")}
                </div>
                <div className="col-span-7 md:col-span-3">
                  <p className="font-display text-xl text-ink-700">
                    {locale === "en" ? rt.nameEn : rt.nameDe}
                  </p>
                  <p className="editorial-caps text-forest-700/80 mt-0.5 text-xs">{rt.slug}</p>
                </div>
                <div className="col-span-5 md:col-span-3 text-sm text-ink-600">
                  {locale === "en" ? rt.subtitleEn : rt.subtitleDe}
                </div>
                <div className="col-span-4 md:col-span-1 text-sm">
                  {rt.capacity} {t("guests")}
                </div>
                <div className="col-span-4 md:col-span-1 text-sm">
                  {rt._count.rooms} {t("rooms")}
                </div>
                <div className="col-span-4 md:col-span-2 text-right font-display">
                  {formatCHF(Number(rt.basePrice))}
                </div>
                <div className="col-span-12 md:col-span-1 text-right">
                  <span
                    className={`editorial-caps text-xs px-2 py-0.5 border ${
                      rt.active
                        ? "text-forest-700 border-forest-700/40"
                        : "text-ink-400 border-ink-400/30"
                    }`}
                  >
                    {rt.active ? t("active") : t("inactive")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
