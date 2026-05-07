import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Size in pixels — width and height are equal */
  size?: number;
  variant?: "crest" | "mark";
};

/**
 * House crest of Chalet Aletsch.
 * Variant "crest" → full circular monogram with text rings.
 * Variant "mark"  → just the interlocked CA, no rings, for tight spaces.
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
        <g fill="currentColor">
          <path d="M32 8 L48 50 L42 50 L38 40 L26 40 L22 50 L16 50 Z M28 36 L36 36 L32 18 Z" />
          <path d="M14 24 Q14 16 22 16 L26 16 L26 20 L22 20 Q18 20 18 24 L18 32 Q18 36 22 36 L26 36 L26 40 L22 40 Q14 40 14 32 Z" opacity="0.92" />
        </g>
      </svg>
    );
  }

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
          id="crest-top-arc"
          d="M 30,100 A 70,70 0 0 1 170,100"
          fill="none"
        />
        <path
          id="crest-bottom-arc"
          d="M 35,108 A 65,65 0 0 0 165,108"
          fill="none"
        />
      </defs>

      {/* Hairline rings */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="0.6" />

      {/* Top curved label */}
      <text
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-display), Georgia, serif"
        letterSpacing="3.6"
        style={{ fontFeatureSettings: '"smcp"' }}
      >
        <textPath href="#crest-top-arc" startOffset="50%" textAnchor="middle">
          CHALET · ALETSCH
        </textPath>
      </text>

      {/* Bottom curved label */}
      <text
        fill="currentColor"
        fontSize="8"
        fontFamily="var(--font-display), Georgia, serif"
        letterSpacing="3.2"
        style={{ fontFeatureSettings: '"smcp"' }}
      >
        <textPath href="#crest-bottom-arc" startOffset="50%" textAnchor="middle">
          EST · MCMXXIII
        </textPath>
      </text>

      {/* Side decorations between top and bottom labels */}
      <g fill="currentColor">
        <circle cx="30" cy="100" r="1.2" />
        <circle cx="170" cy="100" r="1.2" />
      </g>

      {/* Interlocked CA — center mark */}
      <g transform="translate(100 116)" fill="currentColor">
        {/* C */}
        <path d="M -32 -22 Q -42 -22 -42 -10 L -42 6 Q -42 18 -32 18 L -16 18 L -16 12 L -30 12 Q -36 12 -36 6 L -36 -10 Q -36 -16 -30 -16 L -16 -16 L -16 -22 Z" />
        {/* A — slightly overlapping */}
        <path d="M 8 -22 L 30 18 L 22 18 L 17 8 L -1 8 L -6 18 L -14 18 L 8 -22 Z M 2 2 L 14 2 L 8 -12 Z" />
      </g>

      {/* Tiny star above monogram */}
      <g transform="translate(100 56)" fill="currentColor">
        <path d="M 0 -6 L 1.6 -1.8 L 6 -1.8 L 2.4 1 L 3.8 5.2 L 0 2.6 L -3.8 5.2 L -2.4 1 L -6 -1.8 L -1.6 -1.8 Z" />
      </g>
    </svg>
  );
}
