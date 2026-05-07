"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentProvider";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
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
      role="dialog"
      aria-label={t("title")}
      aria-modal="false"
      className="fixed bottom-0 inset-x-0 z-50 above-grain pointer-events-none"
    >
      <div className="mx-auto max-w-4xl pointer-events-auto m-3 md:m-6 border border-ink-700/30 bg-parchment-50 shadow-[0_-2px_24px_-12px_rgba(20,19,15,0.25)]">
        {/* Inner double-rule, like an old printed notice */}
        <div className="border border-ink-700/15 m-1.5">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Edelweiss size={28} className="flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="editorial-caps text-forest-700">{t("eyebrow")}</p>
                <h2 className="font-display text-2xl md:text-[1.7rem] mt-1 text-ink-700">
                  {t("title")}
                </h2>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600 max-w-2xl">
                  {t("intro")}
                </p>
              </div>
            </div>

            {expanded && (
              <div className="mt-7 border-t border-ink-700/15 pt-6 space-y-5">
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
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              {!expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="ink-link editorial-caps text-forest-700"
                >
                  {t("customize")}
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={acceptNecessaryOnly}
                className="editorial-caps border border-ink-700/40 px-5 py-2.5 text-ink-700 hover:border-ink-700 transition-colors"
              >
                {t("necessaryOnly")}
              </button>
              {expanded ? (
                <button
                  onClick={() => saveCustom({ analytics, marketing })}
                  className="editorial-caps border border-ink-700 px-5 py-2.5 bg-ink-700 text-parchment-50 hover:bg-ink-800 transition-colors"
                >
                  {t("save")}
                </button>
              ) : (
                <button
                  onClick={acceptAll}
                  className="editorial-caps border border-ink-700 px-5 py-2.5 bg-ink-700 text-parchment-50 hover:bg-ink-800 transition-colors"
                >
                  {t("acceptAll")}
                </button>
              )}
            </div>

            <p className="mt-5 text-xs text-ink-500 italic">
              {t("note")}
            </p>
          </div>
        </div>
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
    <div className="flex items-start gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "mt-1 w-10 h-5 border border-ink-700/50 flex-shrink-0 transition-colors relative",
          checked ? "bg-forest-700 border-forest-700" : "bg-parchment-50",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-3.5 h-3.5 bg-parchment-50 transition-all",
            checked ? "left-5 bg-parchment-100" : "left-0.5",
          )}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-display text-[1.05rem] text-ink-700">{title}</p>
        <p className="text-sm text-ink-600 leading-relaxed mt-0.5">{desc}</p>
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
