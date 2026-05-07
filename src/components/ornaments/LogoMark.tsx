import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Display size in pixels (square). */
  size?: number;
  /** "dark" = use on parchment / light backgrounds (default).
   *  "light" = invert to a near-parchment tone for forest / dark backgrounds. */
  variant?: "dark" | "light";
  priority?: boolean;
};

/**
 * Detailed house mark for Chalet Aletsch — chalet, alpine peaks, pines,
 * a winding river and a Swiss cross shield, drawn into a domed cartouche.
 *
 * The PNG has been pre-processed so its background is transparent, which
 * means it sits cleanly on any underlying surface. For dark surfaces use
 * variant="light" to invert the artwork.
 */
export function LogoMark({
  className,
  size = 64,
  variant = "dark",
  priority,
}: Props) {
  return (
    <Image
      src="/logo-chalet.png"
      alt="Chalet Aletsch"
      width={size}
      height={size}
      priority={priority}
      className={cn(
        "object-contain",
        variant === "light" &&
          "[filter:brightness(0)_invert(1)_sepia(0.18)_saturate(0.5)_brightness(0.97)]",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
