import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { PageHero } from "@/components/marketing/PageHero";

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
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1769976723592-d720ce28439f?w=2400&q=88&auto=format&fit=crop"
        imageAlt="Verschneite Bäume rund um ein Berghaus auf einer Anhöhe"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />
      <Suspense fallback={<div className="py-24 text-center text-ink-500 italic">…</div>}>
        <BookingFlow />
      </Suspense>
    </>
  );
}
