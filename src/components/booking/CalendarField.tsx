"use client";

import * as React from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { de, enUS, fr, it } from "date-fns/locale";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

const LOCALES = { de, en: enUS, fr, it } as const;

/**
 * Custom calendar field for the reservation flow.
 *
 * Replaces the browser-native <input type="date"> with an editorial
 * popover: hairline header, italic Fraunces month name, day numbers
 * in serif, hand-drawn circle on the selected day. Pure CSS + date-fns,
 * no external date-picker library.
 *
 * Value/onChange use yyyy-MM-dd strings (matching the existing form
 * state shape), so the field is a drop-in replacement.
 */
export function CalendarField({
  label,
  value,
  onChange,
  minDate,
  className,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  /** Disable any date strictly before this. Pass yyyy-MM-dd. */
  minDate?: string;
  className?: string;
  placeholder?: string;
}) {
  const localeKey = useLocale() as keyof typeof LOCALES;
  const dateFnsLocale = LOCALES[localeKey] ?? de;

  const today = React.useMemo(() => new Date(), []);
  const min = minDate ? parseISO(minDate) : startOfDay(today);

  const selected = value ? parseISO(value) : null;
  const [open, setOpen] = React.useState(false);
  const [viewMonth, setViewMonth] = React.useState<Date>(() =>
    startOfMonth(selected ?? min ?? today),
  );

  // Re-anchor view month when minDate or selected changes from outside.
  React.useEffect(() => {
    if (selected) setViewMonth(startOfMonth(selected));
  }, [value]);

  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click + Escape
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const days = React.useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const weekdayLabels = React.useMemo(
    () => buildWeekdayLabels(dateFnsLocale),
    [dateFnsLocale],
  );

  const display = selected
    ? format(selected, "EEE, d. MMM yyyy", { locale: dateFnsLocale })
    : "";

  const onPick = (day: Date) => {
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  const canGoBack = !isSameMonth(viewMonth, startOfMonth(min));

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <label className="block">
        <span className="editorial-caps-sm text-forest-700 mb-2 block">{label}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "w-full text-left bg-transparent border-0 border-b border-ink-700/40 hover:border-ink-700 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem]",
            display ? "text-ink-700" : "text-ink-400 italic",
          )}
        >
          {display || placeholder || "—"}
        </button>
      </label>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute z-30 mt-3 w-[320px] left-0",
            "bg-parchment-50 border border-ink-700/30 shadow-[0_8px_40px_-8px_rgba(20,19,15,0.35)]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-ink-700/15">
            <NavArrow
              dir="left"
              disabled={!canGoBack}
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
            />
            <p className="font-display italic text-lg text-ink-700">
              {format(viewMonth, "LLLL yyyy", { locale: dateFnsLocale })}
            </p>
            <NavArrow
              dir="right"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
            />
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {weekdayLabels.map((d) => (
              <div
                key={d}
                className="editorial-caps-sm text-forest-700/70 text-center text-[0.62rem]"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
            {days.map(({ date, inMonth }, i) => {
              const isPast = isBefore(date, startOfDay(min));
              const isSelected = selected && isSameDay(date, selected);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast || !inMonth}
                  onClick={() => onPick(date)}
                  aria-current={isToday ? "date" : undefined}
                  aria-selected={isSelected || undefined}
                  className={cn(
                    "relative h-9 w-9 mx-auto flex items-center justify-center",
                    "font-display text-[0.95rem] transition-colors",
                    inMonth ? "text-ink-700" : "text-ink-700/0 pointer-events-none",
                    isPast && "opacity-30 cursor-not-allowed",
                    !isPast && !isSelected && "hover:bg-parchment-100/80",
                    isSelected && "text-seal",
                    isToday && !isSelected && "italic",
                  )}
                >
                  <span className="relative z-10">{format(date, "d")}</span>
                  {isSelected && (
                    <span
                      aria-hidden
                      className="absolute inset-0.5 rounded-full border border-seal/80"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NavArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir}
      className={cn(
        "w-7 h-7 flex items-center justify-center text-forest-700",
        "hover:bg-parchment-100/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "right" ? "scaleX(1)" : "scaleX(-1)" }}
        aria-hidden
      >
        <path d="M 5 3 L 10 8 L 5 13" />
      </svg>
    </button>
  );
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildMonthGrid(viewMonth: Date) {
  const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
  const days: Array<{ date: Date; inMonth: boolean }> = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push({
      date: new Date(cur),
      inMonth: isSameMonth(cur, viewMonth),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function buildWeekdayLabels(locale: typeof de): string[] {
  // Monday-first (Swiss convention).
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return format(d, "EEEEEE", { locale }); // 2-letter day, e.g. "Mo"
  });
}
