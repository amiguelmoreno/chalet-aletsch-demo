import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Size in pixels — width and height are equal */
  size?: number;
  /** crest = heraldic shield · mark = peak silhouette · seal = wax-stamp roundel */
  variant?: "crest" | "mark" | "seal";
};

/**
 * House mark for Chalet Aletsch.
 *
 * The crest reads as a Walliser Wappen — a Swiss escutcheon (pointed shield)
 * with the alpine peak inside, the "CA" cipher above it and the founding
 * year along the foot. Keeps the heraldic, hand-pressed feel without the
 * "iris ring" of a circular seal.
 */
export function Monogram({ className, size = 88, variant = "crest" }: Props) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={cn("text-forest-700", className)}
        aria-hidden
      >
        <g fill="none" stroke="currentColor" strokeLinejoin="round">
          <path d="M 8 50 L 32 14 L 56 50 Z" fill="currentColor" stroke="none" />
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

  // Default crest — Swiss escutcheon (pointed shield).
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("text-forest-700", className)}
      aria-hidden
    >
      {/* Outer hairline shield */}
      <path
        d="M 36 36 L 164 36 L 164 128 Q 164 166 100 184 Q 36 166 36 128 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      {/* Inner shield — slightly thicker, classic heraldic double-line */}
      <path
        d="M 44 44 L 156 44 L 156 126 Q 156 160 100 175 Q 44 160 44 126 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />

      {/* Top compartment: CA cipher */}
      <text
        x="100"
        y="64"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="15"
        fontStyle="italic"
        fill="currentColor"
        letterSpacing="0.5"
      >
        C · A
      </text>

      {/* Hairline divider between cipher and peak */}
      <line
        x1="58"
        y1="74"
        x2="142"
        y2="74"
        stroke="currentColor"
        strokeWidth="0.5"
      />

      {/* Central peak — solid triangle, dominant graphic */}
      <path d="M 60 138 L 100 84 L 140 138 Z" fill="currentColor" />

      {/* Snowline highlight on the peak */}
      <path
        d="M 82 110 L 100 90 L 118 110"
        fill="none"
        stroke="rgb(251 248 241)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Date along the bottom of the shield */}
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="9"
        fill="currentColor"
        letterSpacing="3"
      >
        1923
      </text>
    </svg>
  );
}
