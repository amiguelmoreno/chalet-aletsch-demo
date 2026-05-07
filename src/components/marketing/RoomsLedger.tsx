import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Edelweiss } from "@/components/ornaments/Edelweiss";

const rooms = [
  { key: "arvenstube", price: 320, capacity: 2 },
  { key: "blauseeli", price: 280, capacity: 2 },
  { key: "fiescher", price: 410, capacity: 4 },
  { key: "konkordia", price: 540, capacity: 6 },
] as const;

export function RoomsLedger() {
  const t = useTranslations("home.rooms");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="font-display text-display-md mt-4 max-w-md">
              {t("title")}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-ink-600 max-w-prose leading-relaxed text-[1.05rem]">
              {t("intro")}
            </p>
          </div>
        </div>

        {/* Ledger-style listing — no cards, no grid of boxes */}
        <div className="border-t border-ink-700/25">
          {rooms.map((room) => (
            <Link
              key={room.key}
              href="/rooms"
              className="group block border-b border-ink-700/15 hover:border-seal/70 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 md:gap-8 items-baseline py-7 md:py-8">
                <div className="col-span-12 md:col-span-1">
                  <span className="font-display italic text-forest-700 text-2xl">
                    {String(rooms.indexOf(room) + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3 className="font-display text-2xl md:text-3xl text-ink-700 group-hover:text-seal transition-colors">
                    {t(`items.${room.key}.name`)}
                  </h3>
                  <p className="editorial-caps mt-2 text-forest-700/80">
                    {t(`items.${room.key}.subtitle`)}
                  </p>
                </div>
                <div className="col-span-7 md:col-span-4">
                  <p className="text-ink-600 leading-relaxed">
                    {t(`items.${room.key}.description`)}
                  </p>
                </div>
                <div className="col-span-5 md:col-span-2 text-right">
                  <p className="editorial-caps text-forest-700/70">{t("from")}</p>
                  <p className="font-display text-2xl text-ink-700 mt-1">
                    CHF {room.price}
                  </p>
                  <p className="text-xs text-ink-500 mt-1">{t("perNight")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Edelweiss className="opacity-60" size={32} />
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/rooms" className="ink-link editorial-caps">
            {t("cta")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
