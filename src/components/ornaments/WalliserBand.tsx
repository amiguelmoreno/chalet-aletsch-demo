import { cn } from "@/lib/cn";

type Props = { className?: string };

/**
 * Walliser-inspired horizontal pattern band — 8-pointed alpine stars,
 * geometric crosses and a hairline borders. Adapted from traditional
 * Swiss embroidery motifs of the Wallis canton.
 *
 * Uses forest + oak + a touch of seal red for warmth — a deliberate
 * shift from the otherwise monochromatic editorial palette.
 */
export function WalliserBand({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="xMidYMid slice"
      className={cn("w-full h-12 md:h-14", className)}
      aria-hidden
    >
      <defs>
        <pattern
          id="walliser-tile"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* 8-pointed star — main motif */}
          <g transform="translate(30 30)">
            <path
              d="M 0 -18 L 4 -4 L 18 0 L 4 4 L 0 18 L -4 4 L -18 0 L -4 -4 Z"
              fill="rgb(60 70 36)"
              fillOpacity="0.7"
            />
            <path
              d="M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z"
              fill="rgb(168 42 31)"
              fillOpacity="0.55"
            />
          </g>
          {/* Cross between stars */}
          <g
            transform="translate(60 30)"
            fill="rgb(118 91 48)"
            fillOpacity="0.45"
          >
            <rect x="-1" y="-6" width="2" height="12" />
            <rect x="-6" y="-1" width="12" height="2" />
          </g>
        </pattern>
      </defs>
      <rect
        x="0"
        y="0"
        width="1200"
        height="60"
        fill="url(#walliser-tile)"
      />
      {/* Top + bottom hairline borders */}
      <line x1="0" y1="0.5" x2="1200" y2="0.5" stroke="rgb(60 70 36)" strokeOpacity="0.35" />
      <line x1="0" y1="59.5" x2="1200" y2="59.5" stroke="rgb(60 70 36)" strokeOpacity="0.35" />
    </svg>
  );
}
