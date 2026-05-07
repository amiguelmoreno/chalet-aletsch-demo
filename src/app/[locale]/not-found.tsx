import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="py-32 md:py-40">
      <Container width="narrow" className="text-center">
        <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
        <h1 className="font-display italic text-display-lg mt-6 text-ink-700">
          {t("title")}
        </h1>
        <p className="mt-7 text-ink-600 leading-relaxed">{t("body")}</p>
        <div className="my-12">
          <OrnamentRule />
        </div>
        <Link href="/" className="ink-link editorial-caps">
          {t("home")} →
        </Link>
      </Container>
    </section>
  );
}
