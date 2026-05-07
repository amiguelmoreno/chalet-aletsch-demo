import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RomanNumeral } from "@/components/ui/RomanNumeral";
import { ChaletSketch } from "@/components/ornaments/ChaletSketch";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="pt-12 md:pt-20 pb-20 md:pb-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Left — chalet sketch */}
          <Reveal from="left" className="lg:col-span-5 order-2 lg:order-1">
            <Parallax amplitude={18}>
              <div className="border border-ink-700/15 p-4 md:p-8 bg-parchment-100/40 relative">
                {/* Tiny corner brackets, like an old map cartouche */}
                <CornerBrackets />
                <ChaletSketch />
                <p className="editorial-caps text-center mt-4 text-forest-700/80">
                  {t("plate")}
                </p>
              </div>
            </Parallax>
          </Reveal>

          {/* Right — opening text */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-4 mb-7">
                <RomanNumeral value={1} className="text-2xl" />
                <span className="block w-12 h-px bg-forest-700/40" />
                <Eyebrow>{t("eyebrow")}</Eyebrow>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="font-display text-display-lg text-ink-700 max-w-editorial">
                <span className="block italic font-light text-forest-700">
                  {t("titleA")}
                </span>
                <span className="block">{t("titleB")}</span>
              </h1>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-8 max-w-prose text-[1.12rem] leading-relaxed text-ink-600">
                {t("lead")}
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/rooms"
                  className="editorial-caps border border-ink-700 px-7 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
                >
                  {t("ctaPrimary")}
                </Link>
                <Link href="/story" className="ink-link editorial-caps">
                  {t("ctaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="mt-20 md:mt-28">
        <OrnamentRule />
      </div>
    </section>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-forest-700/50" aria-hidden />
      <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-forest-700/50" aria-hidden />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-forest-700/50" aria-hidden />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-forest-700/50" aria-hidden />
    </>
  );
}
