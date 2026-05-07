"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Width control: full | narrow */
  width?: "full" | "narrow";
};

/**
 * Chapter-style horizontal divider with a centred floral motif.
 * On scroll-into-view, the lines draw outward from the centre and the
 * motif fades in — like ink being applied with a fountain pen.
 */
export function OrnamentRule({ className, width = "full" }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setDrawn(true);
        return;
      }
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setDrawn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4 text-forest-600",
        width === "narrow" ? "max-w-md mx-auto" : "w-full",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "h-px flex-1 bg-current opacity-40 origin-right transition-transform ease-[cubic-bezier(0.22,0.61,0.36,1)] duration-[1100ms]",
          drawn ? "scale-x-100" : "scale-x-0",
        )}
      />
      <svg
        viewBox="0 0 80 24"
        width="80"
        height="24"
        className={cn(
          "text-forest-700 transition-opacity duration-[700ms] ease-out",
          drawn ? "opacity-100 delay-[400ms]" : "opacity-0",
        )}
      >
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M 4 12 Q 12 4 20 12 Q 28 20 36 12" />
          <path d="M 76 12 Q 68 4 60 12 Q 52 20 44 12" />
        </g>
        <g fill="currentColor">
          <circle cx="40" cy="12" r="2.2" />
          <circle cx="40" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </g>
      </svg>
      <span
        className={cn(
          "h-px flex-1 bg-current opacity-40 origin-left transition-transform ease-[cubic-bezier(0.22,0.61,0.36,1)] duration-[1100ms]",
          drawn ? "scale-x-100" : "scale-x-0",
        )}
      />
    </div>
  );
}
