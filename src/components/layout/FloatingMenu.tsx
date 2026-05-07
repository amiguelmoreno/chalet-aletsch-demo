"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/ornaments/LogoMark";

type NavKey = "rooms" | "story" | "blog" | "contact" | "account" | "reserve";

const ITEMS: Array<{ key: NavKey; href: string }> = [
  { key: "rooms", href: "/rooms" },
  { key: "story", href: "/story" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
  { key: "account", href: "/account" },
  { key: "reserve", href: "/booking/new" },
];

export function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Schliessen" : "Wegweiser öffnen"}
        aria-expanded={open}
        className={cn(
          "fixed z-[60] bottom-6 left-6 md:bottom-8 md:left-8",
          "w-14 h-14 md:w-[60px] md:h-[60px]",
          "flex items-center justify-center",
          "bg-parchment-50 border border-ink-700/70",
          "shadow-[0_8px_22px_-6px_rgba(40,40,40,0.20)]",
          "transition-all duration-300 group",
          open
            ? "bg-ink-700 border-ink-700"
            : "hover:bg-ink-700 hover:border-ink-700",
        )}
      >
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        <span className="relative w-6 h-6 flex items-center justify-center">
          <span
            className={cn(
              "absolute h-px w-6 transition-all duration-300",
              open
                ? "bg-parchment-50 rotate-45"
                : "bg-ink-700 group-hover:bg-parchment-50 -translate-y-[7px]",
            )}
          />
          <span
            className={cn(
              "absolute h-px transition-all duration-300",
              open
                ? "w-0 bg-parchment-50 opacity-0"
                : "w-4 bg-ink-700 group-hover:bg-parchment-50",
            )}
          />
          <span
            className={cn(
              "absolute h-px w-6 transition-all duration-300",
              open
                ? "bg-parchment-50 -rotate-45"
                : "bg-ink-700 group-hover:bg-parchment-50 translate-y-[7px]",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[55] transition-opacity duration-500 ease-out",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink-700/55 backdrop-blur-[2px]" />
      </div>

      <aside
        className={cn(
          "fixed top-0 left-0 h-[100dvh] z-[58]",
          "w-full sm:w-[26rem] md:w-[28rem]",
          "bg-parchment-50 border-r border-ink-700/15",
          "transform transition-transform duration-500 ease-out",
          "overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
        aria-label="Wegweiser"
      >
        <div className="flex flex-col min-h-full">
          <header className="px-7 md:px-9 pt-7 pb-7 border-b border-ink-700/15">
            <div className="flex items-baseline justify-between mb-3">
              <span className="editorial-caps-sm text-forest-700">Wegweiser</span>
              <span className="editorial-caps-sm text-forest-700">1923</span>
            </div>
            <div className="flex items-center gap-4">
              <LogoMark size={64} className="shrink-0" />
              <div className="min-w-0">
                <h2 className="font-display italic text-[1.6rem] leading-[1] text-ink-700 truncate">
                  Chalet Aletsch
                </h2>
                <p className="mt-2 text-xs text-forest-700/85 leading-relaxed">
                  Riederalp · Wallis · Schweiz
                </p>
              </div>
            </div>
          </header>

          <nav className="flex-1 px-7 md:px-9 py-2">
            <ol>
              {ITEMS.map((item, i) => (
                <li key={item.key} className="border-b border-ink-700/10 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-5 py-5 group transition-colors"
                  >
                    <span className="font-display italic text-forest-700/55 text-sm w-7 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl md:text-[1.65rem] text-ink-700 group-hover:text-seal transition-colors">
                      {t(item.key)}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <footer className="px-7 md:px-9 py-7 border-t border-ink-700/15 bg-parchment-100/40">
            <div className="mb-6">
              <p className="editorial-caps-sm text-forest-700 mb-3">Sprache</p>
              <nav aria-label="Sprache" className="flex items-center gap-3 editorial-caps-sm">
                {(["de", "en", "fr", "it"] as const).map((l, i) => (
                  <span key={l} className="flex items-center gap-3">
                    {i > 0 && <span className="text-ink-700/30">·</span>}
                    <Link
                      href={pathname}
                      locale={l}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "transition-colors",
                        locale === l ? "text-ink-700" : "text-ink-700/45 hover:text-ink-700",
                      )}
                    >
                      {l}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
            <div className="space-y-1.5 text-sm text-ink-700">
              <p>+41 27 928 00 23</p>
              <p>hallo@chalet-aletsch.ch</p>
              <p className="text-ink-600">Furkastrasse 14, 3987 Riederalp</p>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
}
