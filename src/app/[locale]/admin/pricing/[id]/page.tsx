import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { PricingRuleForm } from "../PricingRuleForm";

export default async function AdminPricingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.pricing" });

  const r = await prisma.pricingRule.findUnique({ where: { id } });
  if (!r) notFound();

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/pricing" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>
        <header className="mt-6">
          <Eyebrow>{t("editEyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-2">{r.name}</h1>
        </header>

        <div className="my-10 border-t border-ink-700/15" />

        <PricingRuleForm
          id={r.id}
          initial={{
            name: r.name,
            dateFrom: format(r.dateFrom, "yyyy-MM-dd"),
            dateTo: format(r.dateTo, "yyyy-MM-dd"),
            multiplier: Number(r.multiplier),
            flatAdjust: r.flatAdjust ? Number(r.flatAdjust) : 0,
            minStay: r.minStay ?? 0,
            priority: r.priority,
            notes: r.notes ?? "",
          }}
          labels={getLabels(t)}
        />
      </Container>
    </section>
  );
}

function getLabels(t: (k: string) => string) {
  return {
    name: t("fields.name"),
    dateFrom: t("fields.dateFrom"),
    dateTo: t("fields.dateTo"),
    multiplier: t("fields.multiplier"),
    flatAdjust: t("fields.flatAdjust"),
    minStay: t("fields.minStay"),
    priority: t("fields.priority"),
    notes: t("fields.notes"),
    save: t("save"),
    saving: t("saving"),
    saved: t("saved"),
    delete: t("delete"),
    deleting: t("deleting"),
    confirmDelete: t("confirmDelete"),
  };
}
