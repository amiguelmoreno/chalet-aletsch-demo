import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative">
      {/* Full-bleed photograph */}
      <div className="relative w-full h-[88vh] min-h-[640px] md:min-h-[720px] overflow-hidden bg-ink-700">
        <Image
          src="https://images.unsplash.com/photo-1594069758873-e79e9075eb7d?w=2400&q=88&auto=format&fit=crop"
          alt="Walliser Bergdorf Grimentz, Holzchalets unter Wolken und schneebedeckten Gipfeln"
          fill
          sizes="100vw"
          priority
          className="object-cover hero-photo"
          style={{ filter: "saturate(0.92) contrast(1.06)" }}
        />

        {/* Bottom darkening gradient — for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-700/85 via-ink-700/30 to-ink-700/0"
          aria-hidden
        />
        {/* Left darkening gradient — keeps text readable on overlap */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-700/55 via-ink-700/10 to-transparent"
          aria-hidden
        />
        {/* Subtle warm grain — paper texture */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(180,150,110,0.15) 0%, transparent 50%)",
          }}
          aria-hidden
        />

        {/* Top-right meta strip — editorial detail */}
        <div
          className="absolute top-5 md:top-8 right-5 md:right-10 z-10 flex items-center gap-3 md:gap-4 text-parchment-50"
          style={{ textShadow: "0 1px 3px rgba(20,19,15,0.55), 0 0 14px rgba(20,19,15,0.35)" }}
        >
          <span className="hidden sm:block h-px w-12 md:w-20 bg-parchment-50/70 shadow-[0_1px_3px_rgba(20,19,15,0.4)]" />
          <span className="editorial-caps-sm">{t("plate")}</span>
        </div>

        {/* Bottom-left content */}
        <Container className="relative z-10 h-full flex items-end pb-14 md:pb-20 lg:pb-24">
          <div className="max-w-[42rem]">
            <Reveal delay={120}>
              <div className="flex items-center gap-4 mb-6 md:mb-7">
                <span className="font-display italic text-parchment-50 text-xl md:text-2xl">
                  1
                </span>
                <span className="block w-10 md:w-14 h-px bg-parchment-50/45" />
                <span className="editorial-caps text-parchment-50/85">
                  {t("eyebrow")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <h1 className="font-display text-parchment-50 leading-[1.04] text-[2.25rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.6rem]">
                <span className="block italic font-light text-parchment-50/95">
                  {t("titleA")}
                </span>
                <span className="block">{t("titleB")}</span>
              </h1>
            </Reveal>

            <Reveal delay={420}>
              <p className="mt-6 md:mt-8 max-w-prose text-[0.98rem] md:text-[1.08rem] leading-relaxed text-parchment-50/85">
                {t("lead")}
              </p>
            </Reveal>

            <Reveal delay={560}>
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-4 gap-x-8">
                <Link
                  href="/rooms"
                  className="editorial-caps inline-flex items-center justify-center border border-parchment-50 px-7 py-3.5 text-parchment-50 hover:bg-parchment-50 hover:text-ink-700 transition-colors w-full sm:w-auto"
                >
                  {t("ctaPrimary")}
                </Link>
                <Link
                  href="/story"
                  className="editorial-caps text-parchment-50 underline decoration-parchment-50/40 underline-offset-[6px] hover:decoration-parchment-50 transition-colors text-center sm:text-left"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Tiny scroll hint at bottom-right (desktop only) */}
        <div
          className="hidden lg:flex absolute bottom-8 right-10 z-10 flex-col items-center gap-3 text-parchment-50/85"
          style={{ textShadow: "0 1px 3px rgba(20,19,15,0.55)" }}
          aria-hidden
        >
          <span className="editorial-caps-sm rotate-90 origin-center mb-6 whitespace-nowrap">
            Tafel 1
          </span>
          <span className="block w-px h-12 bg-parchment-50/55" />
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <OrnamentRule />
      </div>
    </section>
  );
}
