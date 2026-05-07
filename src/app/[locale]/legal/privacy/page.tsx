import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}

function Content() {
  const t = useTranslations("privacy");
  return (
    <section className="py-20 md:py-28">
      <Container width="narrow">
        <div className="text-center mb-12">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-5">{t("title")}</h1>
        </div>
        <OrnamentRule className="mb-14" />
        <div className="space-y-8 text-[1.02rem] leading-relaxed text-ink-700">
          <p>{t("intro")}</p>
          <Block title={t("controllerLabel")}>{t("controllerBody")}</Block>
          <Block title={t("dataLabel")}>{t("dataBody")}</Block>
          <Block title={t("purposesLabel")}>{t("purposesBody")}</Block>
          <Block title={t("rightsLabel")}>{t("rightsBody")}</Block>
          <Block title={t("cookiesLabel")}>{t("cookiesBody")}</Block>
          <p className="text-sm italic text-ink-500 pt-4">{t("note")}</p>
        </div>
      </Container>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="editorial-caps text-forest-700 mb-2">{title}</p>
      <p>{children}</p>
    </div>
  );
}
