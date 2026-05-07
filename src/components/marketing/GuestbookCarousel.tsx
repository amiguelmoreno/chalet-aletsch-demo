"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type GuestbookEntry = {
  id: string;
  body: string;
  authorName: string;
  location?: string;
  rating: number;
  formattedDate: string;
};

const NUMERAL = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function GuestbookCarousel({
  entries,
  prevLabel,
  nextLabel,
  /** Auto-advance interval in ms; 0 disables. */
  interval = 7000,
}: {
  entries: GuestbookEntry[];
  prevLabel: string;
  nextLabel: string;
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const total = entries.length;

  React.useEffect(() => {
    if (paused || total <= 1 || !interval) return;
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, interval);
    return () => clearInterval(id);
  }, [paused, total, interval]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + total) % total);

  // Touch swipe support
  const touchStart = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) {
      go(delta < 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      className="relative max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Cross-fade stage. min-height keeps the layout stable across entries. */}
      <div className="relative min-h-[280px] sm:min-h-[300px] md:min-h-[260px]">
        {entries.map((entry, i) => (
          <article
            key={entry.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none",
            )}
            aria-hidden={i !== index}
          >
            <div className="flex justify-center gap-2 text-forest-700 mb-7">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} filled={s < entry.rating} />
              ))}
            </div>

            <blockquote>
              <p className="font-display italic text-2xl md:text-[1.85rem] leading-snug text-ink-700 max-w-2xl mx-auto text-center">
                &ldquo;{entry.body}&rdquo;
              </p>
              <footer className="mt-7 md:mt-8 editorial-caps text-forest-700 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span>
                  {entry.authorName}
                  {entry.location ? `, ${entry.location}` : ""}
                </span>
                <span className="text-forest-700/40">·</span>
                <span>{entry.formattedDate}</span>
              </footer>
            </blockquote>
          </article>
        ))}
      </div>

      {/* Pagination + arrows */}
      {total > 1 && (
        <div className="mt-10 md:mt-12 flex items-center justify-center gap-5 md:gap-7">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={prevLabel}
            className="w-9 h-9 flex items-center justify-center text-ink-700/55 hover:text-ink-700 transition-colors"
          >
            <Arrow dir="left" />
          </button>

          <div className="flex items-center gap-3 md:gap-4">
            {entries.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "font-display tracking-wide-md text-sm leading-none transition-colors tabular-nums",
                  i === index
                    ? "text-ink-700"
                    : "text-ink-700/30 hover:text-ink-700/60",
                )}
              >
                {NUMERAL[i] ?? i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label={nextLabel}
            className="w-9 h-9 flex items-center justify-center text-ink-700/55 hover:text-ink-700 transition-colors"
          >
            <Arrow dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}

function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M 8 1 L 9.8 5.8 L 15 6.2 L 11 9.6 L 12.4 14.6 L 8 12 L 3.6 14.6 L 5 9.6 L 1 6.2 L 6.2 5.8 Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        transform: dir === "right" ? "scaleX(1)" : "scaleX(-1)",
      }}
    >
      <path d="M 5 3 L 10 8 L 5 13" />
    </svg>
  );
}
