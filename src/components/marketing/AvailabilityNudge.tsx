"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { CalendarField } from "@/components/booking/CalendarField";

export function AvailabilityNudge() {
  const t = useTranslations("home.availability");
  const locale = useLocale();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);

  // Departure can't be before arrival + 1 day
  const minTo = from
    ? new Date(new Date(from).getTime() + 86400000).toISOString().slice(0, 10)
    : undefined;

  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <OrnamentRule width="narrow" className="mb-12" />
        <div className="text-center mb-12">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="font-display italic text-display-md mt-4">
            {t("title")}
          </h2>
        </div>

        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            const qs = new URLSearchParams({
              from,
              to,
              adults: String(Math.max(1, guests)),
              children: "0",
            });
            router.push(`/booking/new?${qs.toString()}` as never, { locale });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <CalendarField label={t("from")} value={from} onChange={setFrom} />
            <CalendarField
              label={t("to")}
              value={to}
              onChange={setTo}
              minDate={minTo}
            />
            <NumberField
              label={t("guests")}
              value={guests}
              onChange={setGuests}
              min={1}
              max={12}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="editorial-caps border border-ink-700 px-10 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
            >
              {t("cta")}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-ink-500 italic">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="editorial-caps-sm block text-forest-700 mb-2">
        {label}
      </span>
      <div className="flex items-center justify-between border-b border-ink-700/40 py-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min ?? 1, value - 1))}
          aria-label="−"
          className="w-7 h-7 flex items-center justify-center font-display text-ink-700 hover:bg-parchment-100/80 transition-colors disabled:opacity-30"
          disabled={value <= (min ?? 1)}
        >
          −
        </button>
        <span className="font-serif text-[1.1rem] text-ink-700 tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max ?? 99, value + 1))}
          aria-label="+"
          className="w-7 h-7 flex items-center justify-center font-display text-ink-700 hover:bg-parchment-100/80 transition-colors disabled:opacity-30"
          disabled={value >= (max ?? 99)}
        >
          +
        </button>
      </div>
    </label>
  );
}
