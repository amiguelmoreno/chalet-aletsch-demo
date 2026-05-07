import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";

export function StoryExcerpt() {
  const t = useTranslations("home.story");

  return (
    <section className="bg-forest-800 text-parchment-100 py-24 md:py-32 above-grain">
      <Container width="narrow">
        <div className="text-center">
          <Eyebrow className="text-parchment-200/70">{t("eyebrow")}</Eyebrow>
          <h2 className="font-display italic text-display-md mt-5 text-parchment-50">
            {t("title")}
          </h2>
        </div>

        <div className="mt-14 md:mt-16">
          <p className="dropcap text-[1.18rem] leading-[1.7] text-parchment-100 [&::first-letter]:!text-parchment-200">
            {t("body1")}
          </p>
          <p className="mt-6 text-[1.08rem] leading-[1.7] text-parchment-100/90">
            {t("body2")}
          </p>
        </div>

        <blockquote className="mt-14 mb-10 border-l-2 border-parchment-200/40 pl-6 italic text-parchment-100/95 text-xl font-display">
          “{t("pullQuote")}”
          <footer className="not-italic editorial-caps mt-4 text-parchment-200/70 font-serif text-xs">
            — {t("pullQuoteAttribution")}
          </footer>
        </blockquote>

        <div className="my-14">
          <OrnamentRule className="text-parchment-200/40" />
        </div>

        <div className="text-center">
          <Link
            href="/story"
            className="editorial-caps border border-parchment-200/50 px-7 py-3.5 text-parchment-50 hover:bg-parchment-50 hover:text-ink-700 hover:border-parchment-50 transition-colors"
          >
            {t("cta")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
