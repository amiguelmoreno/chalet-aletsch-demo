"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";

export function AvailabilityNudge() {
  const t = useTranslations("home.availability");
  const locale = useLocale();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);

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
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end"
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
          <UnderlineField
            className="md:col-span-4"
            label={t("from")}
            type="date"
            value={from}
            onChange={setFrom}
          />
          <UnderlineField
            className="md:col-span-4"
            label={t("to")}
            type="date"
            value={to}
            onChange={setTo}
          />
          <UnderlineField
            className="md:col-span-2"
            label={t("guests")}
            type="number"
            value={String(guests)}
            onChange={(v) => setGuests(Math.max(1, parseInt(v || "1", 10)))}
            min={1}
            max={12}
          />
          <button
            type="submit"
            className="md:col-span-2 editorial-caps border border-ink-700 px-5 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            {t("cta")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-500 italic">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}

function UnderlineField({
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
