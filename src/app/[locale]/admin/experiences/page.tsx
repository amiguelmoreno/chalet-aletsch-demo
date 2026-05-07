import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/pricing";

export default async function AdminExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.experiences" });

  const experiences = await prisma.experience.findMany({
    orderBy: { slug: "asc" },
  });

  return (
    <section className="py-14 md:py-20">
      <Container>
        <header className="flex items-baseline justify-between flex-wrap gap-6 mb-10">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display italic text-display-md mt-3">{t("title")}</h1>
            <p className="mt-3 text-ink-600 max-w-prose">{t("intro")}</p>
          </div>
          <Link
            href="/admin/experiences/new"
            className="editorial-caps border border-ink-700 px-5 py-2.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            + {t("new")}
          </Link>
        </header>

        {experiences.length === 0 ? (
          <p className="py-12 text-center italic text-ink-500">{t("empty")}</p>
        ) : (
          <ol className="border-t border-ink-700/15">
            {experiences.map((e) => (
              <li key={e.id} className="border-b border-ink-700/15">
                <Link
                  href={`/admin/experiences/${e.id}` as never}
                  className="block py-5 grid grid-cols-12 items-baseline gap-4 hover:bg-parchment-100/40 px-2 transition-colors"
                >
                  <div className="col-span-12 md:col-span-4">
                    <p className="font-display text-xl text-ink-700">
                      {locale === "en" ? e.nameEn : e.nameDe}
                    </p>
                    <p className="editorial-caps text-forest-700/80 text-xs mt-0.5">{e.slug}</p>
                  </div>
                  <div className="col-span-7 md:col-span-4 text-sm text-ink-600">
                    {locale === "en" ? e.descriptionEn : e.descriptionDe}
                  </div>
                  <div className="col-span-5 md:col-span-2 text-sm">
                    {formatCHF(Number(e.unitPrice))} / {e.unit}
                  </div>
                  <div className="col-span-12 md:col-span-2 text-right">
                    <span
                      className={`editorial-caps text-xs px-2 py-0.5 border ${
                        e.active
                          ? "text-forest-700 border-forest-700/40"
                          : "text-ink-400 border-ink-400/30"
                      }`}
                    >
                      {e.active ? t("active") : t("inactive")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}
