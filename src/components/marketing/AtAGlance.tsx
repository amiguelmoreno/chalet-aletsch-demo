import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { Edelweiss } from "@/components/ornaments/Edelweiss";

const items: Array<{ key: "lage" | "stube" | "handwerk"; n: number }> = [
  { key: "lage", n: 1 },
  { key: "stube", n: 2 },
  { key: "handwerk", n: 3 },
];

export function AtAGlance() {
  const t = useTranslations("home.glance");

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-16 md:mb-20">
          <Edelweiss className="mx-auto" size={36} />
          <Eyebrow ornament className="mt-4">
            {t("eyebrow")}
          </Eyebrow>
          <h2 className="font-display text-display-md mt-5 max-w-2xl mx-auto">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-16">
          {items.map((item, i) => (
            <article key={item.key} className="relative">
              {/* Vertical hairline between columns */}
              {i > 0 && (
                <span className="hidden md:block absolute -left-8 top-2 bottom-2 w-px bg-ink-700/15" aria-hidden />
              )}

              <div className="flex items-baseline gap-3 mb-5">
                <RomanNumeral value={item.n} className="text-xl" />
                <span className="block w-8 h-px bg-forest-700/40" />
              </div>

              <h3 className="font-display text-2xl text-ink-700 mb-4">
                {t(`${item.key}.title`)}
              </h3>
              <p className="max-w-prose text-ink-600 leading-relaxed">
                {t(`${item.key}.body`)}
              </p>
              <p className="mt-5 italic text-forest-700 text-sm">
                {t(`${item.key}.aside`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
