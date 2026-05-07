import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Size in pixels — width and height are equal */
  size?: number;
  /** crest = ring + peak + wordmark · mark = peak only · seal = ring + AC interlocked */
  variant?: "crest" | "mark" | "seal";
};

/**
 * Refined house mark for Chalet Aletsch.
 *
 * Conceptually: a single triangular alpine peak inside a hairline ring,
 * with the "AC" monogram tucked into the negative space above it.
 * Reads clearly at every size — from 24px favicon to 240px footer hero.
 */
export function Monogram({ className, size = 88, variant = "crest" }: Props) {
  if (variant === "mark") {
    // Standalone peak — for favicons, tight nav, footer corners.
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={cn("text-forest-700", className)}
        aria-hidden
      >
        <g fill="none" stroke="currentColor" strokeLinejoin="round">
          {/* Outer peak silhouette */}
          <path
            d="M 8 50 L 32 14 L 56 50 Z"
            fill="currentColor"
            stroke="none"
          />
          {/* Inner snowline notch */}
          <path
            d="M 23 30 L 32 18 L 41 30"
            stroke="rgb(251 248 241)"
            strokeWidth="1.4"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  if (variant === "seal") {
    // Compact circular seal — wax-stamp feel, for very small marks.
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={cn("text-seal", className)}
        aria-hidden
      >
        <circle cx="32" cy="32" r="30" fill="currentColor" />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="var(--font-display), Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fill="rgb(251 248 241)"
        >
          CA
        </text>
      </svg>
    );
  }

  // Default crest — elegant ring + peak + wordmark
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("text-forest-700", className)}
      aria-hidden
    >
      <defs>
        <path
          id="crest-bottom-arc"
          d="M 38,108 A 62,62 0 0 0 162,108"
          fill="none"
        />
      </defs>

      {/* Outer hairline ring */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* Inner ring — slightly thicker */}
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Central peak — solid triangle, the dominant graphic */}
      <path d="M 60 130 L 100 60 L 140 130 Z" fill="currentColor" />

      {/* Snowline highlight on the peak */}
      <path
        d="M 84 88 L 100 68 L 116 88"
        fill="none"
        stroke="rgb(251 248 241)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Tiny "CA" monogram tucked into the upper negative space, above the peak */}
      <text
        x="100"
        y="50"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="18"
        fontStyle="italic"
        fill="currentColor"
      >
        CA
      </text>

      {/* Curved date along the bottom interior of the ring */}
      <text
        fill="currentColor"
        fontSize="8"
        fontFamily="var(--font-display), Georgia, serif"
        letterSpacing="3.6"
      >
        <textPath href="#crest-bottom-arc" startOffset="50%" textAnchor="middle">
          MCMXXIII
        </textPath>
      </text>

      {/* Side dot ornaments at 9 and 3 o'clock between rings */}
      <g fill="currentColor">
        <circle cx="14" cy="100" r="1.4" />
        <circle cx="186" cy="100" r="1.4" />
      </g>
    </svg>
  );
}
