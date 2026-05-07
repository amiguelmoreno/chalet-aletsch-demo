import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Edelweiss } from "@/components/ornaments/Edelweiss";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}

function Content() {
  const t = useTranslations("signIn.verify");
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow" className="text-center">
        <Edelweiss className="mx-auto" size={48} />
        <Eyebrow ornament className="mt-6">{t("eyebrow")}</Eyebrow>
        <h1 className="font-display italic text-display-md mt-5">{t("title")}</h1>
        <p className="mt-6 max-w-prose mx-auto text-ink-600 leading-relaxed text-[1.05rem]">
          {t("body")}
        </p>
        <div className="my-10">
          <OrnamentRule width="narrow" />
        </div>
        <p className="text-sm italic text-ink-500">{t("hint")}</p>
      </Container>
    </section>
  );
}
