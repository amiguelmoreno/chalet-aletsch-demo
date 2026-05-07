"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { FlowAction, FlowState } from "./types";

export function StepDates({
  state,
  dispatch,
  onContinue,
}: {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  onContinue: () => void;
}) {
  const t = useTranslations("booking.stepDates");

  const valid =
    !!state.checkIn &&
    !!state.checkOut &&
    state.checkIn < state.checkOut &&
    state.adults + state.children > 0;

  return (
    <div>
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
      </header>

      <form
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 max-w-3xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onContinue();
        }}
      >
        <Field
          className="md:col-span-4"
          label={t("checkIn")}
          type="date"
          value={state.checkIn}
          onChange={(v) =>
            dispatch({
              type: "SET_DATES",
              checkIn: v,
              checkOut: state.checkOut,
              adults: state.adults,
              children: state.children,
            })
          }
        />
        <Field
          className="md:col-span-4"
          label={t("checkOut")}
          type="date"
          value={state.checkOut}
          onChange={(v) =>
            dispatch({
              type: "SET_DATES",
              checkIn: state.checkIn,
              checkOut: v,
              adults: state.adults,
              children: state.children,
            })
          }
        />
        <Field
          className="md:col-span-2"
          label={t("adults")}
          type="number"
          min={1}
          max={10}
          value={String(state.adults)}
          onChange={(v) =>
            dispatch({
              type: "SET_DATES",
              checkIn: state.checkIn,
              checkOut: state.checkOut,
              adults: Math.max(1, parseInt(v || "1", 10)),
              children: state.children,
            })
          }
        />
        <Field
          className="md:col-span-2"
          label={t("children")}
          type="number"
          min={0}
          max={6}
          value={String(state.children)}
          onChange={(v) =>
            dispatch({
              type: "SET_DATES",
              checkIn: state.checkIn,
              checkOut: state.checkOut,
              adults: state.adults,
              children: Math.max(0, parseInt(v || "0", 10)),
            })
          }
        />

        <div className="md:col-span-12 flex justify-end">
          <button
            type="submit"
            disabled={!valid || state.loading}
            className="editorial-caps border border-ink-700 px-8 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 disabled:opacity-50 transition-colors"
          >
            {state.loading ? t("loading") : t("continue")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  className,
  label,
  type,
  value,
  onChange,
  min,
  max,
}: {
  className?: string;
  label: string;
  type: "date" | "number" | "text";
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className={className}>
      <span className="editorial-caps block text-forest-700 mb-2">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700"
      />
    </label>
  );
}
