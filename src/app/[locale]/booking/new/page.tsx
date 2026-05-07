import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default async function BookingNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}

function Content() {
  const t = useTranslations("booking");
  return (
    <>
      <section className="pt-16 md:pt-24 pb-8">
        <Container width="narrow" className="text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-lg mt-6">{t("title")}</h1>
          <p className="mt-7 text-[1.1rem] leading-relaxed text-ink-600 max-w-prose mx-auto">
            {t("intro")}
          </p>
        </Container>
        <div className="mt-12">
          <OrnamentRule />
        </div>
      </section>
      <Suspense fallback={<div className="py-24 text-center text-ink-500 italic">…</div>}>
        <BookingFlow />
      </Suspense>
    </>
  );
}
