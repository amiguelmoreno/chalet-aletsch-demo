import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { PageHero } from "@/components/marketing/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Our story" : "Geschichte",
    description: isEn
      ? "One hundred years on the Riederalp. The Imboden family chronicle in three short chapters."
      : "Hundert Jahre auf der Riederalp. Die Hauschronik der Familie Imboden in drei kurzen Kapiteln.",
    alternates: { canonical: `/${locale}/story` },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StoryContent />;
}

function StoryContent() {
  const t = useTranslations("story");
  const chapters = [1, 2, 3];

  return (
    <>
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1695135210851-5c6628d45100?w=2400&q=88&auto=format&fit=crop"
        imageAlt="Kleines Berghaus auf grüner Anhöhe vor Walliser Gipfeln"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("subtitle")}
      />

      <section className="pb-24">
        <Container width="narrow">
          {chapters.map((n, i) => (
            <article key={n} className="mb-20 md:mb-24 last:mb-0">
              <header className="flex items-center gap-4 mb-8">
                <RomanNumeral value={n} className="text-2xl" />
                <span className="block w-16 h-px bg-forest-700/40" />
                <Eyebrow>{t(`ch${n}.eyebrow`)}</Eyebrow>
              </header>

              <h2 className="font-display text-display-md text-ink-700 mb-8">
                {t(`ch${n}.title`)}
              </h2>

              <div className="space-y-6 text-[1.08rem] leading-[1.75] text-ink-600">
                {i === 0 ? (
                  <p className="dropcap">{t(`ch${n}.body1`)}</p>
                ) : (
                  <p>{t(`ch${n}.body1`)}</p>
                )}
                <p>{t(`ch${n}.body2`)}</p>
              </div>
            </article>
          ))}

          <div className="flex flex-col items-center mt-20 gap-6">
            <Edelweiss size={36} />
            <p className="font-display italic text-2xl text-ink-700 max-w-md text-center">
              {t("closing")}
            </p>
            <p className="editorial-caps text-forest-700">{t("signoff")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
