"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sprache"
      className={cn("flex items-center gap-2 editorial-caps-sm", className)}
    >
      {(["de", "en", "fr", "it"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-parchment-100/40">·</span>}
          <Link
            href={pathname}
            locale={l}
            className={cn(
              "transition-colors duration-200 hover:text-parchment-50",
              locale === l ? "text-parchment-50" : "text-parchment-100/60",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
