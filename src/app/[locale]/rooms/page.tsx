import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const rooms = [
  { key: "arvenstube", price: 320, sleeps: 2, area: 22 },
  { key: "blauseeli", price: 280, sleeps: 2, area: 18 },
  { key: "fiescher", price: 410, sleeps: 4, area: 36 },
  { key: "konkordia", price: 540, sleeps: 6, area: 58 },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Rooms" : "Stuben",
    description: isEn
      ? "Four rooms, four characters. From the original 1923 parlour to the attic suite under the rafters."
      : "Vier Stuben, jede mit eigenem Charakter. Von der ursprünglichen Stube aus dem Bauteil von 1923 bis zur Konkordia-Suite unter dem Dach.",
    alternates: { canonical: `/${locale}/rooms` },
  };
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale === "en" ? "en" : "de";
  return (
    <>
      <JsonLd
        data={[
          hotelJsonLd(loc),
          breadcrumbJsonLd(loc, [
            { name: loc === "en" ? "Home" : "Startseite", href: "/" },
            { name: loc === "en" ? "Rooms" : "Stuben", href: "/rooms" },
          ]),
        ]}
      />
      <RoomsContent />
    </>
  );
}

function RoomsContent() {
  const t = useTranslations("rooms");

  return (
    <>
      <section className="pt-16 md:pt-24 pb-12">
        <Container width="narrow" className="text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-lg mt-6">
            {t("title")}
          </h1>
          <p className="mt-7 text-[1.1rem] leading-relaxed text-ink-600">
            {t("intro")}
          </p>
        </Container>
        <div className="mt-12">
          <OrnamentRule />
        </div>
      </section>

      <section className="pb-24">
        <Container>
          {rooms.map((room, i) => (
            <article
              key={room.key}
              className="border-b border-ink-700/15 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-2">
                <RomanNumeral value={i + 1} className="text-3xl" />
                <span className="block w-12 h-px bg-forest-700/40 mt-4" />
              </div>

              <div className="lg:col-span-6">
                <Eyebrow>{t(`items.${room.key}.subtitle`)}</Eyebrow>
                <h2 className="font-display text-display-md mt-3 text-ink-700">
                  {t(`items.${room.key}.name`)}
                </h2>
                <p className="mt-6 text-ink-600 leading-relaxed max-w-prose text-[1.05rem]">
                  {t(`items.${room.key}.description`)}
                </p>
                <p className="mt-5 italic text-forest-700">
                  — {t(`items.${room.key}.quirk`)}
                </p>
              </div>

              <div className="lg:col-span-3 lg:col-start-10">
                <dl className="border border-ink-700/15 p-6 bg-parchment-100/30 space-y-4 text-sm">
                  <Row label={t("specs.from")} value={`CHF ${room.price}`} />
                  <Row label={t("specs.sleeps")} value={`${room.sleeps}`} />
                  <Row label={t("specs.area")} value={`${room.area} m²`} />
                  <Row label={t("specs.bath")} value={t(`items.${room.key}.bath`)} />
                  <Row label={t("specs.view")} value={t(`items.${room.key}.view`)} />
                </dl>
              </div>
            </article>
          ))}

          <div className="flex flex-col items-center mt-20 gap-6">
            <Edelweiss size={36} />
            <p className="font-display italic text-2xl text-ink-700 max-w-md text-center">
              {t("closing")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-700/10 pb-3 last:border-0 last:pb-0">
      <dt className="editorial-caps text-forest-700">{label}</dt>
      <dd className="text-ink-700 font-display">{value}</dd>
    </div>
  );
}
