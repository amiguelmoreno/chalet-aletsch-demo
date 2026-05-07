import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { RoomGallery } from "@/components/marketing/RoomGallery";
import { PageHero } from "@/components/marketing/PageHero";
import { Link } from "@/i18n/routing";

type RoomKey = "arvenstube" | "blauseeli" | "fiescher" | "konkordia";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const rooms: Array<{
  key: RoomKey;
  price: number;
  sleeps: number;
  area: number;
  photos: Array<{ src: string; alt: string }>;
}> = [
  {
    key: "arvenstube",
    price: 320,
    sleeps: 2,
    area: 22,
    photos: [
      { src: u("1631940182015-6604116ead7d"), alt: "Arvenstube, Bett zwischen getäfelten Holzwänden" },
      { src: u("1722603931808-d5ddd71f4924"), alt: "Arvenstube, Bett am Fenster" },
      { src: u("1680703261560-11c234762abe"), alt: "Arvenstube, Detail in Arvenholz" },
      { src: u("1722650364897-33fb86a44592"), alt: "Arvenstube, Holzgetäfelte Wände" },
    ],
  },
  {
    key: "blauseeli",
    price: 280,
    sleeps: 2,
    area: 18,
    photos: [
      { src: u("1631805991633-eb01749753af"), alt: "Blauseeli, schmales Bett vor Holzwand" },
      { src: u("1699629208190-672f7ef56d7b"), alt: "Blauseeli, Bett am Erker mit Fenster" },
      { src: u("1664361238207-164532d1934e"), alt: "Blauseeli, kleiner Spiegel und Bett" },
      { src: u("1721396187257-a2bcdabb25c0"), alt: "Blauseeli, Bett vor Holzwand" },
    ],
  },
  {
    key: "fiescher",
    price: 410,
    sleeps: 4,
    area: 36,
    photos: [
      { src: u("1773423389979-b28b469967f8"), alt: "Fiescher, Wohnstube mit Specksteinofen" },
      { src: u("1631941392209-70cad44ecfb7"), alt: "Fiescher, Stube mit Holzbalken" },
      { src: u("1727706572437-4fcda0cbd66f"), alt: "Fiescher, Schlafraum mit zwei Betten" },
      { src: u("1698933787104-3f91cf25909c"), alt: "Fiescher, Specksteinofen aus Naters" },
    ],
  },
  {
    key: "konkordia",
    price: 540,
    sleeps: 6,
    area: 58,
    photos: [
      { src: u("1773423391716-04e278b07b1b"), alt: "Konkordia, Schlafraum mit Holzwänden und Aussicht" },
      { src: u("1774627868171-0a08bcc8d9ca"), alt: "Konkordia, Suite mit Bergblick" },
      { src: u("1670914120781-4b7c8512fc41"), alt: "Konkordia, Wohnraum unter Dachbalken" },
      { src: u("1680703008401-c5daa1789316"), alt: "Konkordia, Schlafnische unter dem Dach" },
    ],
  },
];

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
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1610486870542-70d0062d150f?w=2400&q=88&auto=format&fit=crop"
        imageAlt="Holzchalet auf grüner Almwiese vor Berggipfeln"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

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

              <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Hero photo, anchors the room visually */}
                <div className="md:col-span-7">
                  <RoomGallery
                    photos={room.photos}
                    caption={`Plate ${i + 1}, ${t(`items.${room.key}.name`)}`}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-5 flex flex-col">
                  <Eyebrow>{t(`items.${room.key}.subtitle`)}</Eyebrow>
                  <h2 className="font-display text-display-sm mt-3 text-ink-700">
                    {t(`items.${room.key}.name`)}
                  </h2>
                  <p className="mt-5 text-ink-600 leading-relaxed text-[1.02rem]">
                    {t(`items.${room.key}.description`)}
                  </p>
                  <p className="mt-4 italic text-forest-700 text-sm">
                    {t(`items.${room.key}.quirk`)}
                  </p>
                  <div className="mt-7">
                    <Link
                      href={`/booking/new?room=${room.key}` as never}
                      className="editorial-caps inline-flex items-center justify-center border border-ink-700 px-6 py-3 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
                    >
                      {t("reserveThis")}
                    </Link>
                  </div>
                </div>

                {/* Specs strip */}
                <dl className="md:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3 border-t border-ink-700/15 pt-6 text-sm">
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
    <div className="flex flex-col">
      <dt className="editorial-caps-sm text-forest-700/80">{label}</dt>
      <dd className="text-ink-700 font-display mt-1">{value}</dd>
    </div>
  );
}

function romanFor(n: number) {
  return ["I", "II", "III", "IV", "V"][n - 1] ?? `${n}`;
}
