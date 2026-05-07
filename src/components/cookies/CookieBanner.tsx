"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentProvider";
import { cn } from "@/lib/cn";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const { banner, acceptAll, acceptNecessaryOnly, saveCustom } = useConsent();
  const [expanded, setExpanded] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  if (!banner.open) return null;

  return (
    <div
      role="region"
      aria-label={t("title")}
      className="fixed bottom-0 inset-x-0 z-50 bg-parchment-50 border-t border-ink-700/25 shadow-[0_-2px_24px_-12px_rgba(20,19,15,0.25)]"
    >
      <div className="container-editorial py-4 md:py-5">
        {!expanded ? (
          // Compact bar — single line on desktop
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex-1 min-w-0">
              <p className="font-display text-[1.05rem] text-ink-700 leading-tight">
                {t("title")}
              </p>
              <p className="text-sm text-ink-600 mt-1 leading-snug">
                {t("intro")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 shrink-0">
              <button
                onClick={() => setExpanded(true)}
                className="ink-link editorial-caps-sm text-forest-700"
              >
                {t("customize")}
              </button>
              <button
                onClick={acceptNecessaryOnly}
                className="editorial-caps-sm border border-ink-700/40 px-4 py-2 text-ink-700 hover:border-ink-700 transition-colors"
              >
                {t("necessaryOnly")}
              </button>
              <button
                onClick={acceptAll}
                className="editorial-caps-sm border border-ink-700 px-5 py-2 bg-ink-700 text-parchment-50 hover:bg-ink-800 transition-colors"
              >
                {t("acceptAll")}
              </button>
            </div>
          </div>
        ) : (
          // Expanded — categories visible
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-xl text-ink-700">{t("title")}</p>
              <button
                onClick={() => setExpanded(false)}
                aria-label="close"
                className="editorial-caps-sm text-forest-700 hover:text-seal"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-ink-600 max-w-2xl">{t("intro")}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-ink-700/15 pt-5">
              <Category
                title={t("necessary.title")}
                desc={t("necessary.body")}
                checked
                disabled
              />
              <Category
                title={t("analytics.title")}
                desc={t("analytics.body")}
                checked={analytics}
                onChange={setAnalytics}
              />
              <Category
                title={t("marketing.title")}
                desc={t("marketing.body")}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={acceptNecessaryOnly}
                className="editorial-caps-sm border border-ink-700/40 px-4 py-2 text-ink-700 hover:border-ink-700 transition-colors"
              >
                {t("necessaryOnly")}
              </button>
              <button
                onClick={() => saveCustom({ analytics, marketing })}
                className="editorial-caps-sm border border-ink-700 px-5 py-2 bg-ink-700 text-parchment-50 hover:bg-ink-800 transition-colors"
              >
                {t("save")}
              </button>
            </div>

            <p className="text-xs italic text-ink-500 pt-1">{t("note")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Category({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "mt-0.5 w-9 h-5 border border-ink-700/50 flex-shrink-0 transition-colors relative",
          checked ? "bg-forest-700 border-forest-700" : "bg-parchment-50",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-3.5 h-3.5 transition-all",
            checked ? "left-[18px] bg-parchment-100" : "left-0.5 bg-parchment-50",
          )}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-display text-[0.98rem] text-ink-700 leading-tight">{title}</p>
        <p className="text-xs text-ink-600 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

/** Tiny link that re-opens the banner — for the footer. */
export function CookieSettingsTrigger({ className }: { className?: string }) {
  const t = useTranslations("cookies");
  const { reopen } = useConsent();
  return (
    <button onClick={reopen} className={cn("hover:underline underline-offset-4", className)}>
      {t("openSettings")}
    </button>
  );
}
