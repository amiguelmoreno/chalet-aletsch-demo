"use client";

import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { formatCHF } from "@/lib/pricing";
import type { FlowAction, FlowState } from "./types";

const EXTRA_PRICES: Record<string, number> = {
  halbpension: 78,
  "transfer-moerel": 25,
  "bergführer-tag": 480,
  "raclette-abend": 52,
};

export function StepReview({
  state,
  onSubmit,
  onBack,
}: {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("booking.stepReview");
  const tExtras = useTranslations("booking.stepExtras.items");
  const locale = useLocale();
  const dateLocale = locale === "de" ? deLocale : undefined;

  const room = state.rooms.find((r) => r.slug === state.selectedRoomSlug);
  if (!room) return null;

  const extrasTotal = Object.entries(state.extras).reduce(
    (sum, [slug, qty]) => sum + qty * (EXTRA_PRICES[slug] ?? 0),
    0,
  );
  const grand = room.price.total + extrasTotal;
  const deposit = Math.round(grand * 0.3);

  const fmt = (s: string) =>
    format(new Date(s), "EEEE, d. MMMM yyyy", { locale: dateLocale });

  return (
    <div>
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">{t("intro")}</p>
      </header>

      <div className="border border-ink-700/15 bg-parchment-100/30 p-8 md:p-12 max-w-3xl mx-auto">
        <SectionTitle label={t("stay")} />
        <div className="space-y-3 text-[1.05rem]">
          <Row label={t("checkIn")} value={fmt(state.checkIn)} />
          <Row label={t("checkOut")} value={fmt(state.checkOut)} />
          <Row
            label={t("guests")}
            value={`${state.adults} ${t("adultsLabel")}${state.children ? ` + ${state.children} ${t("childrenLabel")}` : ""}`}
          />
        </div>

        <div className="my-10">
          <OrnamentRule />
        </div>

        <SectionTitle label={t("room")} />
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-display text-2xl text-ink-700">
              {locale === "en" ? room.nameEn : room.nameDe}
            </p>
            <p className="text-sm text-ink-600">
              {room.price.nights} <span className="italic">×</span> CHF {Math.round(room.price.subtotal / room.price.nights)}
            </p>
          </div>
          <p className="font-display text-xl">{formatCHF(room.price.subtotal)}</p>
        </div>

        {extrasTotal > 0 && (
          <>
            <div className="my-10">
              <OrnamentRule />
            </div>
            <SectionTitle label={t("extras")} />
            <ul className="space-y-2 text-[1.02rem]">
              {Object.entries(state.extras)
                .filter(([, q]) => q > 0)
                .map(([slug, qty]) => (
                  <li key={slug} className="flex justify-between">
                    <span>
                      {tExtras(`${slug}.name`)} <span className="text-ink-500">× {qty}</span>
                    </span>
                    <span className="font-display">
                      {formatCHF(qty * (EXTRA_PRICES[slug] ?? 0))}
                    </span>
                  </li>
                ))}
            </ul>
          </>
        )}

        <div className="my-10">
          <OrnamentRule />
        </div>

        <div className="space-y-3 text-[1.05rem]">
          <Row label={t("subtotal")} value={formatCHF(grand)} />
          <Row label={t("deposit")} value={formatCHF(deposit)} muted />
          <div className="flex justify-between items-baseline pt-3 border-t border-ink-700/20">
            <p className="editorial-caps text-forest-700">{t("total")}</p>
            <p className="font-display text-3xl text-ink-700">{formatCHF(grand)}</p>
          </div>
        </div>

        <div className="my-10">
          <OrnamentRule />
        </div>

        <SectionTitle label={t("you")} />
        <div className="space-y-2 text-[1.02rem]">
          <Row label={t("name")} value={state.details.name} />
          <Row label={t("email")} value={state.details.email} />
          {state.details.phone && <Row label={t("phone")} value={state.details.phone} />}
          {state.details.notes && (
            <div className="pt-2">
              <p className="editorial-caps text-forest-700 mb-1">{t("notes")}</p>
              <p className="italic text-ink-600 leading-relaxed">{state.details.notes}</p>
            </div>
          )}
        </div>
      </div>

      {state.error && (
        <p className="mt-6 text-center text-seal">{state.error}</p>
      )}

      <div className="flex justify-between items-center max-w-3xl mx-auto mt-10">
        <button onClick={onBack} className="ink-link editorial-caps text-forest-700">
          ← {t("back")}
        </button>
        <button
          onClick={onSubmit}
          disabled={state.loading}
          className="editorial-caps border border-ink-700 bg-ink-700 px-10 py-4 text-parchment-50 hover:bg-ink-800 disabled:opacity-50 transition-colors"
        >
          {state.loading ? t("submitting") : t("submit")}
        </button>
      </div>

      <p className="text-center text-sm italic text-ink-500 mt-6">{t("note")}</p>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <p className="editorial-caps text-forest-700 mb-4">{label}</p>;
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="editorial-caps text-forest-700/80">{label}</span>
      <span className={muted ? "text-ink-500" : "text-ink-700 font-display"}>{value}</span>
    </div>
  );
}
