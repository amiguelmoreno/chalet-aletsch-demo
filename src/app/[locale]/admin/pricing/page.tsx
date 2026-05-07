import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

export default async function AdminPricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.pricing" });

  const rules = await prisma.pricingRule.findMany({
    orderBy: [{ priority: "desc" }, { dateFrom: "asc" }],
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
            href="/admin/pricing/new"
            className="editorial-caps border border-ink-700 px-5 py-2.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            + {t("new")}
          </Link>
        </header>

        {rules.length === 0 ? (
          <p className="py-12 text-center italic text-ink-500">{t("empty")}</p>
        ) : (
          <ol className="border-t border-ink-700/15">
            {rules.map((r) => (
              <li key={r.id} className="border-b border-ink-700/15">
                <Link
                  href={`/admin/pricing/${r.id}` as never}
                  className="block py-5 grid grid-cols-12 items-baseline gap-4 hover:bg-parchment-100/40 px-2 transition-colors"
                >
                  <div className="col-span-12 md:col-span-4">
                    <p className="font-display text-xl text-ink-700">{r.name}</p>
                  </div>
                  <div className="col-span-7 md:col-span-3 text-sm text-ink-600">
                    {format(r.dateFrom, "d. MMM yyyy")} →{" "}
                    {format(r.dateTo, "d. MMM yyyy")}
                  </div>
                  <div className="col-span-5 md:col-span-2 text-sm">
                    × {Number(r.multiplier).toFixed(2)}
                    {r.flatAdjust ? ` · +${Number(r.flatAdjust)}` : ""}
                  </div>
                  <div className="col-span-6 md:col-span-2 text-sm text-ink-600">
                    {r.minStay ? `min. ${r.minStay} ${t("nights")}` : "—"}
                  </div>
                  <div className="col-span-6 md:col-span-1 text-right text-sm">
                    {t("priority")} {r.priority}
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
