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
 * the top of secondary pages (/rooms, /story, /blog, /contact) so each
 * one opens with imagery that matches its theme.
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
          style={{ filter: "saturate(0.92) contrast(1.05)" }}
        />
        {/* Layered legibility overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-700/80 via-ink-700/35 to-ink-700/45"
          aria-hidden
        />
        <Container
          width="narrow"
          className="relative h-full flex flex-col items-center justify-center text-center pt-20 md:pt-24 pb-8 md:pb-10"
        >
          {eyebrow && (
            <Eyebrow ornament className="text-parchment-200">
              {eyebrow}
            </Eyebrow>
          )}
          <h1
            className="font-display italic text-display-lg mt-6 text-parchment-50"
            style={{ textShadow: "0 1px 6px rgba(20,19,15,0.5)" }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="mt-7 text-[1.05rem] leading-relaxed text-parchment-100/95 max-w-prose mx-auto"
              style={{ textShadow: "0 1px 4px rgba(20,19,15,0.4)" }}
            >
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
