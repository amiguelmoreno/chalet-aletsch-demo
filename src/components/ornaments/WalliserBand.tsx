import { cn } from "@/lib/cn";

type Props = { className?: string };

/**
 * Walliser-inspired horizontal pattern band — 8-pointed alpine stars
 * alternating with hairline crosses, adapted from traditional Swiss
 * embroidery motifs of the Wallis canton.
 *
 * Implemented as a CSS background-image so the tile size is fixed
 * (60×60 px) and the stars are never sliced or cropped, regardless of
 * the band's height or the viewport width.
 */
export function WalliserBand({ className }: Props) {
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'>
    <g transform='translate(30 30)'>
      <path d='M 0 -18 L 4 -4 L 18 0 L 4 4 L 0 18 L -4 4 L -18 0 L -4 -4 Z' fill='rgb(60 70 36)' fill-opacity='0.7'/>
      <path d='M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z' fill='rgb(168 42 31)' fill-opacity='0.55'/>
    </g>
    <g transform='translate(60 30)' fill='rgb(118 91 48)' fill-opacity='0.45'>
      <rect x='-1' y='-6' width='2' height='12'/>
      <rect x='-6' y='-1' width='12' height='2'/>
    </g>
  </svg>`;

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(tile)}`;

  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        "w-full h-16 md:h-20 border-y border-forest-700/30",
        className,
      )}
      style={{
        backgroundImage: `url("${dataUri}")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "60px 60px",
        backgroundPosition: "center center",
      }}
    />
  );
}
