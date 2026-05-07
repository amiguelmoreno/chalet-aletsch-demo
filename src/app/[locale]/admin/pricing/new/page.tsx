import { setRequestLocale, getTranslations } from "next-intl/server";
import { format, addMonths } from "date-fns";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { PricingRuleForm } from "../PricingRuleForm";

export default async function AdminPricingNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.pricing" });

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/pricing" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>
        <header className="mt-6">
          <Eyebrow>{t("newEyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-2">{t("newTitle")}</h1>
        </header>

        <div className="my-10 border-t border-ink-700/15" />

        <PricingRuleForm
          id={null}
          initial={{
            name: "",
            dateFrom: format(new Date(), "yyyy-MM-dd"),
            dateTo: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
            multiplier: 1,
            flatAdjust: 0,
            minStay: 0,
            priority: 0,
            notes: "",
          }}
          labels={{
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
          }}
        />
      </Container>
    </section>
  );
}
