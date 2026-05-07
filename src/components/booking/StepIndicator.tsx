"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { Step } from "./types";

const order: Step[] = ["dates", "room", "extras", "details", "review"];

export function StepIndicator({ current }: { current: Step }) {
  const t = useTranslations("booking.steps");
  const currentIndex = order.indexOf(current);

  return (
    <ol className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3">
      {order.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={cn(
                "font-display tracking-wide-md text-sm",
                active ? "text-ink-700" : done ? "text-forest-700" : "text-ink-400",
              )}
            >
              {romanFor(i + 1)}
            </span>
            <span
              className={cn(
                "editorial-caps",
                active ? "text-ink-700" : done ? "text-forest-700" : "text-ink-400",
              )}
            >
              {t(step)}
            </span>
            {i < order.length - 1 && (
              <span className="hidden md:block w-6 h-px bg-ink-700/20 ml-3" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function romanFor(n: number) {
  return String(n);
}
