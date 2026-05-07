"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatCHF } from "@/lib/pricing";
import type { FlowAction, FlowState } from "./types";

const EXTRAS = [
  { slug: "halbpension", price: 78, unit: "person" },
  { slug: "transfer-moerel", price: 25, unit: "person" },
  { slug: "bergführer-tag", price: 480, unit: "day" },
  { slug: "raclette-abend", price: 52, unit: "person" },
] as const;

export function StepExtras({
  state,
  dispatch,
  onContinue,
  onBack,
}: {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  onContinue: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("booking.stepExtras");

  return (
    <div>
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
      </header>

      <ul className="border-t border-ink-700/15 max-w-3xl mx-auto">
        {EXTRAS.map((extra) => {
          const qty = state.extras[extra.slug] ?? 0;
          return (
            <li key={extra.slug} className="border-b border-ink-700/15 py-7 px-4 md:px-6 grid grid-cols-12 gap-4 items-baseline">
              <div className="col-span-12 md:col-span-7">
                <h3 className="font-display text-xl text-ink-700">
                  {t(`items.${extra.slug}.name`)}
                </h3>
                <p className="text-ink-600 text-sm leading-relaxed mt-2 max-w-prose">
                  {t(`items.${extra.slug}.body`)}
                </p>
              </div>
              <div className="col-span-6 md:col-span-2 text-sm">
                <p className="editorial-caps text-forest-700/70">{t("from")}</p>
                <p className="font-display text-lg">{formatCHF(extra.price)}</p>
                <p className="text-xs italic text-ink-500">{t(`units.${extra.unit}`)}</p>
              </div>
              <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_EXTRA", slug: extra.slug, quantity: qty - 1 })}
                  disabled={qty <= 0}
                  className="w-9 h-9 border border-ink-700/40 hover:border-ink-700 disabled:opacity-30 font-display"
                  aria-label="−"
                >
                  −
                </button>
                <span className="w-8 text-center font-display text-lg">{qty}</span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_EXTRA", slug: extra.slug, quantity: qty + 1 })}
                  className="w-9 h-9 border border-ink-700/40 hover:border-ink-700 font-display"
                  aria-label="+"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-sm italic text-ink-500 mt-8">{t("note")}</p>

      <div className="flex justify-between items-center max-w-3xl mx-auto mt-10">
        <button onClick={onBack} className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </button>
        <button
          onClick={onContinue}
          className="editorial-caps border border-ink-700 px-8 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
