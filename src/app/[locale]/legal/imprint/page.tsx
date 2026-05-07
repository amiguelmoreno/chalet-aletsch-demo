import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}

function Content() {
  const t = useTranslations("imprint");

  return (
    <section className="py-20 md:py-28">
      <Container width="narrow">
        <div className="text-center mb-12">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-md mt-5">{t("title")}</h1>
        </div>
        <OrnamentRule className="mb-14" />

        <div className="space-y-10 text-[1.02rem] leading-relaxed text-ink-700">
          <Block title={t("operator")}>
            Chalet Aletsch GmbH<br />
            Furkastrasse 14<br />
            3987 Riederalp<br />
            Wallis, Schweiz
          </Block>
          <Block title={t("contact")}>
            +41 27 928 00 23<br />
            hallo@chalet-aletsch.ch
          </Block>
          <Block title={t("registry")}>
            CHE-XXX.XXX.XXX<br />
            {t("registryNote")}
          </Block>
          <Block title={t("vat")}>{t("vatBody")}</Block>
          <Block title={t("liability")}>{t("liabilityBody")}</Block>
          <Block title={t("colophon")}>
            {t.rich("colophonBody", {
              link: (chunks) => (
                <a
                  href="https://morenodev.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ink-link"
                >
                  {chunks}
                </a>
              ),
            })}
          </Block>
        </div>
      </Container>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink-700/10 pb-8 last:border-0 last:pb-0">
      <p className="editorial-caps text-forest-700 mb-3">{title}</p>
      <div>{children}</div>
    </div>
  );
}
