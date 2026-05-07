"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { FlowAction, FlowState } from "./types";

export function StepDetails({
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
  const t = useTranslations("booking.stepDetails");
  const valid =
    state.details.name.trim().length > 1 && /\S+@\S+\.\S+/.test(state.details.email);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onContinue();
      }}
    >
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 max-w-3xl mx-auto">
        <Field
          label={t("name")}
          value={state.details.name}
          onChange={(v) => dispatch({ type: "SET_DETAILS", details: { name: v } })}
          required
        />
        <Field
          label={t("email")}
          type="email"
          value={state.details.email}
          onChange={(v) => dispatch({ type: "SET_DETAILS", details: { email: v } })}
          required
        />
        <Field
          label={t("phone")}
          type="tel"
          value={state.details.phone}
          onChange={(v) => dispatch({ type: "SET_DETAILS", details: { phone: v } })}
        />
        <div /> {/* spacer */}
        <label className="md:col-span-2 block">
          <span className="editorial-caps text-forest-700 mb-2 block">{t("notes")}</span>
          <textarea
            value={state.details.notes}
            onChange={(e) => dispatch({ type: "SET_DETAILS", details: { notes: e.target.value } })}
            rows={4}
            placeholder={t("notesPlaceholder")}
            className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700 resize-none placeholder:text-ink-400"
          />
        </label>

        <label className="md:col-span-2 flex items-start gap-3 mt-2">
          <input
            type="checkbox"
            checked={state.marketingConsent}
            onChange={(e) => dispatch({ type: "SET_MARKETING_CONSENT", value: e.target.checked })}
            className="mt-1 w-4 h-4 accent-forest-700"
          />
          <span className="text-sm text-ink-600 leading-relaxed">{t("marketing")}</span>
        </label>
      </div>

      <div className="flex justify-between items-center max-w-3xl mx-auto mt-12">
        <button type="button" onClick={onBack} className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="editorial-caps border border-ink-700 px-8 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 disabled:opacity-50 transition-colors"
        >
          {t("continue")}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="editorial-caps text-forest-700 mb-2 block">
        {label}
        {required && <span className="text-seal ml-1">·</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700"
      />
    </label>
  );
}
