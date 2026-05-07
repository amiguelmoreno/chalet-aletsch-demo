"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

type Variant = "dark" | "light";

export function LanguageSwitcher({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: Variant;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  const colors =
    variant === "light"
      ? {
          active: "text-ink-700",
          inactive: "text-ink-700/45 hover:text-ink-700",
          separator: "text-ink-700/25",
        }
      : {
          active: "text-parchment-50",
          inactive: "text-parchment-100/60 hover:text-parchment-50",
          separator: "text-parchment-100/40",
        };

  return (
    <nav
      aria-label="Sprache"
      className={cn("flex items-center gap-2 editorial-caps-sm", className)}
    >
      {(["de", "en", "fr", "it"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className={colors.separator}>·</span>}
          <Link
            href={pathname}
            locale={l}
            className={cn(
              "transition-colors duration-200",
              locale === l ? colors.active : colors.inactive,
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
