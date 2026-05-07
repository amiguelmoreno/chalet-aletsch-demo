import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../ExperienceForm";

export default async function AdminExperienceNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.experiences" });

  const property = await prisma.property.findFirst({ select: { id: true } });
  if (!property) notFound();

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/experiences" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>
        <header className="mt-6">
          <Eyebrow>{t("newEyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-2">{t("newTitle")}</h1>
        </header>

        <div className="my-10 border-t border-ink-700/15" />

        <ExperienceForm
          id={null}
          propertyId={property.id}
          initial={{
            slug: "",
            nameDe: "",
            nameEn: "",
            descriptionDe: "",
            descriptionEn: "",
            unitPrice: 0,
            unit: "person",
            active: true,
          }}
          labels={{
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
          }}
        />
      </Container>
    </section>
  );
}
