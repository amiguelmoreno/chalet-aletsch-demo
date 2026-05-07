"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatCHF } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import type { FlowAction, FlowState, RoomOption } from "./types";

export function StepRoom({
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
  const t = useTranslations("booking.stepRoom");
  const locale = useLocale();

  return (
    <div>
      <header className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-display italic text-display-md mt-4">{t("title")}</h2>
        <p className="mt-5 text-ink-600 leading-relaxed">
          {t("intro", { nights: state.rooms[0]?.price.nights ?? 0 })}
        </p>
      </header>

      {state.rooms.length === 0 ? (
        <div className="border border-ink-700/15 bg-parchment-100/30 p-10 text-center max-w-2xl mx-auto">
          <p className="font-display italic text-2xl text-ink-700">{t("noneTitle")}</p>
          <p className="mt-3 text-ink-600">{t("noneBody")}</p>
        </div>
      ) : (
        <ul className="border-t border-ink-700/15 max-w-4xl mx-auto">
          {state.rooms.map((room) => (
            <RoomRow
              key={room.slug}
              room={room}
              locale={locale}
              selected={state.selectedRoomSlug === room.slug}
              onSelect={() => dispatch({ type: "SELECT_ROOM", slug: room.slug })}
            />
          ))}
        </ul>
      )}

      <div className="flex justify-between items-center max-w-4xl mx-auto mt-12">
        <button
          onClick={onBack}
          className="ink-link editorial-caps text-forest-700"
        >
          ← {t("back")}
        </button>
        <button
          onClick={onContinue}
          disabled={!state.selectedRoomSlug}
          className="editorial-caps border border-ink-700 px-8 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 disabled:opacity-50 transition-colors"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}

function RoomRow({
  room,
  locale,
  selected,
  onSelect,
}: {
  room: RoomOption;
  locale: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const name = locale === "en" ? room.nameEn : room.nameDe;
  const subtitle = locale === "en" ? room.subtitleEn : room.subtitleDe;

  return (
    <li
      className={cn(
        "border-b border-ink-700/15 transition-colors",
        selected && "bg-parchment-100/60 border-l-2 border-l-seal",
      )}
    >
      <button
        onClick={onSelect}
        className="w-full text-left grid grid-cols-12 gap-4 md:gap-8 items-baseline py-7 px-4 md:px-6 group"
      >
        <div className="col-span-12 md:col-span-5">
          <h3 className="font-display text-2xl md:text-3xl text-ink-700 group-hover:text-seal transition-colors">
            {name}
          </h3>
          {subtitle && (
            <p className="editorial-caps mt-2 text-forest-700/80">{subtitle}</p>
          )}
        </div>
        <div className="col-span-7 md:col-span-4 text-sm text-ink-600">
          <p>
            <span className="editorial-caps text-forest-700">{room.price.nights}</span>{" "}
            <span className="italic">×</span>{" "}
            <span className="font-display">CHF {Math.round(room.price.subtotal / room.price.nights)}</span>
          </p>
          {room.price.breakdown.some((n) => n.ruleApplied) && (
            <p className="text-xs italic text-forest-700 mt-1">— Saisonpreis</p>
          )}
        </div>
        <div className="col-span-5 md:col-span-3 text-right">
          <p className="font-display text-2xl text-ink-700">{formatCHF(room.price.total)}</p>
          <p className="text-xs editorial-caps text-forest-700/70 mt-1">
            {selected ? "✓ ausgewählt" : "wählen"}
          </p>
        </div>
      </button>
    </li>
  );
}
