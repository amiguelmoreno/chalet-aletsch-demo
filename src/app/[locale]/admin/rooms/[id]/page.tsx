import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { RoomTypeForm } from "./RoomTypeForm";

export default async function AdminRoomTypePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.rooms" });

  const rt = await prisma.roomType.findUnique({ where: { id } });
  if (!rt) notFound();

  return (
    <section className="py-12 md:py-16">
      <Container width="narrow">
        <Link href="/admin/rooms" className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </Link>
        <header className="mt-6">
          <Eyebrow>{t("editEyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-2">
            {locale === "en" ? rt.nameEn : rt.nameDe}
          </h1>
          <p className="editorial-caps text-forest-700/80 mt-1 text-xs">{rt.slug}</p>
        </header>

        <div className="my-10 border-t border-ink-700/15" />

        <RoomTypeForm
          id={rt.id}
          initial={{
            nameDe: rt.nameDe,
            nameEn: rt.nameEn,
            subtitleDe: rt.subtitleDe ?? "",
            subtitleEn: rt.subtitleEn ?? "",
            descriptionDe: rt.descriptionDe ?? "",
            descriptionEn: rt.descriptionEn ?? "",
            capacity: rt.capacity,
            basePrice: Number(rt.basePrice),
            areaSqm: rt.areaSqm ?? 0,
            position: rt.position,
            active: rt.active,
          }}
          labels={{
            nameDe: t("fields.nameDe"),
            nameEn: t("fields.nameEn"),
            subtitleDe: t("fields.subtitleDe"),
            subtitleEn: t("fields.subtitleEn"),
            descriptionDe: t("fields.descriptionDe"),
            descriptionEn: t("fields.descriptionEn"),
            capacity: t("fields.capacity"),
            basePrice: t("fields.basePrice"),
            areaSqm: t("fields.areaSqm"),
            position: t("fields.position"),
            active: t("fields.active"),
            save: t("save"),
            saving: t("saving"),
            saved: t("saved"),
          }}
        />
      </Container>
    </section>
  );
}
