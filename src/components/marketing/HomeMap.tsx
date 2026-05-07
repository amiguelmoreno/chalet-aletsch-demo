import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactMapWrapper } from "./ContactMapWrapper";

export async function HomeMap({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "contact.map" });

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-10">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h2 className="font-display italic text-display-md mt-4">
            {t("title")}
          </h2>
        </div>
        <ContactMapWrapper
          labels={{
            popupTitle: t("popupTitle"),
            popupAddress: t("popupAddress"),
            popupHint: t("popupHint"),
          }}
        />
      </Container>
    </section>
  );
}
