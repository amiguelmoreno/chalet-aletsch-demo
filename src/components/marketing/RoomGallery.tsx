"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type Photo = { src: string; alt: string };

const NUMERAL = ["1", "2", "3", "4", "5", "6", "7", "8"];

/**
 * Editorial room gallery — cross-fade between photos with Roman-numeral
 * pagination, hover prev/next arrows, and auto-advance that pauses on
 * hover. Fits the "leafing through a postcard album" feel.
 */
export function RoomGallery({
  photos,
  caption,
  /** Auto-advance interval in ms; 0 disables auto-play. */
  interval = 6000,
}: {
  photos: Photo[];
  caption: string;
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const total = photos.length;

  // Auto-advance
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

  return (
    <figure
      className="ken-burns relative aspect-[16/10] overflow-hidden border border-ink-700/15 bg-parchment-100 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Layered photos — cross-fade */}
      {photos.map((p, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover ken-burns-img"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Hover-only prev/next arrows — editorial, hairline */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="previous"
            onClick={() => go(-1)}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-parchment-50 bg-ink-700/40 hover:bg-ink-700/70 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            aria-label="next"
            onClick={() => go(1)}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-parchment-50 bg-ink-700/40 hover:bg-ink-700/70 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
          >
            <Arrow dir="right" />
          </button>
        </>
      )}

      {/* Caption + Roman numeral pagination */}
      <figcaption className="absolute bottom-0 inset-x-0 bg-ink-700/70 text-parchment-50 px-4 py-2 flex items-center justify-between gap-4">
        <span className="editorial-caps-sm truncate">{caption}</span>
        {total > 1 && (
          <span className="flex items-center gap-2 shrink-0">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "font-display tracking-wide-md text-xs leading-none transition-colors",
                  i === index
                    ? "text-parchment-50"
                    : "text-parchment-50/40 hover:text-parchment-50/70",
                )}
              >
                {NUMERAL[i] ?? i + 1}
              </button>
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
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
