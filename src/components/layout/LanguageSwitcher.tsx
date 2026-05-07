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
      className={cn("flex items-center gap-2 editorial-caps", className)}
    >
      {(["de", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-forest-600/40">·</span>}
          <Link
            href={pathname}
            locale={l}
            className={cn(
              "transition-colors duration-200 hover:text-seal",
              locale === l ? "text-ink-700" : "text-forest-600/70",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
