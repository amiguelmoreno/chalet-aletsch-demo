import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../ExperienceForm";

export default async function AdminExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.experiences" });

  const e = await prisma.experience.findUnique({ where: { id } });
  if (!e) notFound();

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/experiences" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>
        <header className="mt-6">
          <Eyebrow>{t("editEyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-2">
            {locale === "en" ? e.nameEn : e.nameDe}
          </h1>
        </header>

        <div className="my-10 border-t border-ink-700/15" />

        <ExperienceForm
          id={e.id}
          propertyId={e.propertyId}
          initial={{
            slug: e.slug,
            nameDe: e.nameDe,
            nameEn: e.nameEn,
            descriptionDe: e.descriptionDe ?? "",
            descriptionEn: e.descriptionEn ?? "",
            unitPrice: Number(e.unitPrice),
            unit: e.unit,
            active: e.active,
          }}
          labels={getLabels(t)}
        />
      </Container>
    </section>
  );
}

function getLabels(t: (k: string) => string) {
  return {
    slug: t("fields.slug"),
    nameDe: t("fields.nameDe"),
    nameEn: t("fields.nameEn"),
    descriptionDe: t("fields.descriptionDe"),
    descriptionEn: t("fields.descriptionEn"),
    unitPrice: t("fields.unitPrice"),
    unit: t("fields.unit"),
    active: t("fields.active"),
    units: {
      person: t("units.person"),
      day: t("units.day"),
      piece: t("units.piece"),
      hour: t("units.hour"),
    },
    save: t("save"),
    saving: t("saving"),
    saved: t("saved"),
    delete: t("delete"),
    deleting: t("deleting"),
    confirmDelete: t("confirmDelete"),
  };
}
