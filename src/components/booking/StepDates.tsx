"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CalendarField } from "./CalendarField";
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

  // Departure can't be before arrival + 1 day
  const minCheckOut = state.checkIn
    ? new Date(new Date(state.checkIn).getTime() + 86400000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  const setDates = (patch: Partial<Pick<FlowState, "checkIn" | "checkOut" | "adults" | "children">>) => {
    dispatch({
      type: "SET_DATES",
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      adults: state.adults,
      children: state.children,
      ...patch,
    });
  };

  return (
    <div>
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
      </header>

      <form
        className="space-y-10 max-w-3xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onContinue();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <CalendarField
            label={t("checkIn")}
            value={state.checkIn}
            onChange={(v) => setDates({ checkIn: v })}
          />
          <CalendarField
            label={t("checkOut")}
            value={state.checkOut}
            onChange={(v) => setDates({ checkOut: v })}
            minDate={minCheckOut}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-10 max-w-md">
          <NumberStepper
            label={t("adults")}
            value={state.adults}
            min={1}
            max={10}
            onChange={(v) => setDates({ adults: v })}
          />
          <NumberStepper
            label={t("children")}
            value={state.children}
            min={0}
            max={6}
            onChange={(v) => setDates({ children: v })}
          />
        </div>

        <div className="flex justify-end pt-4">
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

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="editorial-caps-sm block text-forest-700 mb-2">{label}</span>
      <div className="flex items-center justify-between border-b border-ink-700/40 py-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label="−"
          disabled={value <= min}
          className="w-7 h-7 flex items-center justify-center font-display text-ink-700 hover:bg-parchment-100/80 transition-colors disabled:opacity-30"
        >
          −
        </button>
        <span className="font-serif text-[1.1rem] text-ink-700 tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label="+"
          disabled={value >= max}
          className="w-7 h-7 flex items-center justify-center font-display text-ink-700 hover:bg-parchment-100/80 transition-colors disabled:opacity-30"
        >
          +
        </button>
      </div>
    </label>
  );
}
