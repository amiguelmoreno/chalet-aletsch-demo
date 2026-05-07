import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";

type Props = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  /** Tailwind height utilities for the photo block. */
  height?: string;
};

/**
 * Page-level hero: a full-bleed photograph with editorial type overlaid,
 * separated from the page body by a hand-drawn ornament rule. Used at
 * the top of secondary pages (/rooms, /story, /blog, /contact, /booking)
 * so each one opens with imagery that matches its theme.
 *
 * Three-layer overlay keeps the small caps + body copy legible even on
 * bright photographs: a top-to-bottom darken (heavier at the bottom),
 * a side-to-side veil that pinches in toward the centre, and a soft
 * radial vignette that concentrates contrast behind the text block.
 */
export function PageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  intro,
  height = "h-[58vh] min-h-[440px] md:min-h-[520px]",
}: Props) {
  return (
    <section className="relative">
      <div className={`relative w-full ${height} overflow-hidden bg-ink-700`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ filter: "saturate(0.9) contrast(1.05) brightness(0.92)" }}
        />

        {/* Vertical gradient — stronger at the bottom where the rule joins. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink-700/45 via-ink-700/60 to-ink-700/85"
          aria-hidden
        />
        {/* Side veil — pinches the centre, where the title sits. */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_55%,rgba(20,19,15,0.45)_0%,rgba(20,19,15,0.0)_72%)]"
          aria-hidden
        />

        <Container
          width="narrow"
          className="relative h-full flex flex-col items-center justify-center text-center pt-20 md:pt-24 pb-8 md:pb-10"
        >
          {eyebrow && (
            <Eyebrow
              ornament
              className="text-parchment-50 [text-shadow:0_1px_4px_rgba(20,19,15,0.7)]"
            >
              {eyebrow}
            </Eyebrow>
          )}
          <h1 className="font-display italic text-display-lg mt-6 text-parchment-50 [text-shadow:0_2px_10px_rgba(20,19,15,0.55),0_1px_2px_rgba(20,19,15,0.7)]">
            {title}
          </h1>
          {intro && (
            <p className="mt-7 text-[1.05rem] md:text-[1.08rem] leading-relaxed text-parchment-50 max-w-prose mx-auto [text-shadow:0_1px_4px_rgba(20,19,15,0.7),0_0_18px_rgba(20,19,15,0.4)]">
              {intro}
            </p>
          )}
        </Container>
      </div>
      <div className="mt-12 md:mt-14">
        <OrnamentRule />
      </div>
    </section>
  );
}
