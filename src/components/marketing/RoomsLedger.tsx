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
          {rooms.map((room, i) => (
            <article
              key={room.key}
              className="group border-b border-ink-700/15 hover:border-seal/70 transition-colors"
            >
              <div className="grid grid-cols-12 gap-x-4 gap-y-3 md:gap-8 items-baseline py-7 md:py-8">
                {/* Number + name + description — clickable area to read more */}
                <Link
                  href="/rooms"
                  className="col-span-12 md:col-span-9 grid grid-cols-12 md:grid-cols-9 gap-x-4 gap-y-3 md:gap-8 items-baseline"
                >
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-display italic text-forest-700 text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <h3 className="font-display text-2xl md:text-3xl text-ink-700 group-hover:text-seal transition-colors">
                      {t(`items.${room.key}.name`)}
                    </h3>
                    <p className="editorial-caps mt-2 text-forest-700/80">
                      {t(`items.${room.key}.subtitle`)}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-ink-600 leading-relaxed text-[0.98rem] md:text-base">
                      {t(`items.${room.key}.description`)}
                    </p>
                  </div>
                </Link>

                {/* Price + reserve button — own clickable region */}
                <div className="col-span-12 md:col-span-3 flex md:flex-col md:items-end md:text-right items-baseline justify-between gap-4 md:gap-3 pt-1 md:pt-0">
                  <div className="flex md:flex-col items-baseline md:items-end gap-3 md:gap-0">
                    <p className="editorial-caps text-forest-700/70">{t("from")}</p>
                    <p className="font-display text-xl md:text-2xl text-ink-700 md:mt-1">
                      CHF {room.price}
                    </p>
                    <p className="hidden md:block text-xs text-ink-500 mt-1">{t("perNight")}</p>
                  </div>
                  <Link
                    href={`/booking/new?room=${room.key}` as never}
                    className="editorial-caps-sm border border-ink-700/60 px-4 py-2 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 hover:border-ink-700 transition-colors whitespace-nowrap"
                  >
                    {t("reserveThis")}
                  </Link>
                </div>
              </div>
            </article>
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
