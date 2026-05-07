import { cn } from "@/lib/cn";

type Props = { className?: string };

/**
 * Hand-drawn mountain silhouette — used as a wide horizontal divider
 * or backdrop. Three layered ranges with a single sun/moon disc.
 */
export function MountainRule({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={cn("text-forest-700 w-full", className)}
      aria-hidden
    >
      {/* Distant range — softer */}
      <path
        d="M 0 130 L 90 90 L 170 110 L 260 60 L 360 100 L 470 70 L 580 105 L 680 55 L 790 95 L 900 65 L 1010 105 L 1110 75 L 1200 110 L 1200 160 L 0 160 Z"
        fill="currentColor"
        opacity="0.18"
      />
      {/* Mid range */}
      <path
        d="M 0 145 L 80 110 L 170 135 L 280 85 L 390 130 L 510 95 L 620 130 L 740 90 L 860 130 L 970 100 L 1090 135 L 1200 110 L 1200 160 L 0 160 Z"
        fill="currentColor"
        opacity="0.32"
      />
      {/* Foreground range — sharp, dark */}
      <path
        d="M 0 160 L 0 152 L 110 120 L 230 145 L 360 100 L 480 140 L 600 110 L 720 145 L 840 115 L 960 145 L 1080 125 L 1200 145 L 1200 160 Z"
        fill="currentColor"
        opacity="0.62"
      />
      {/* Sun/moon disc */}
      <circle cx="900" cy="62" r="14" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
    </svg>
  );
}
