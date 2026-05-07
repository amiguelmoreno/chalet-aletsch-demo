import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactMapWrapper } from "./ContactMapWrapper";
import { MAP_DIRECTIONS_URL } from "@/lib/map";

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
            directionsLabel: t("directions"),
          }}
        />
        <div className="flex justify-center mt-8">
          <a
            href={MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-caps inline-flex items-center gap-2 border border-ink-700 px-7 py-3 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            {t("directions")} →
          </a>
        </div>
      </Container>
    </section>
  );
}
