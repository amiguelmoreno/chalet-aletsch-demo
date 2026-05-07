"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  /** Maximum vertical translate in pixels at the extremes of the scroll range. */
  amplitude?: number;
  className?: string;
};

/**
 * Subtle vertical parallax driven by the element's own position in the
 * viewport. Uses requestAnimationFrame + transform on a child wrapper so
 * paint is cheap. Movement caps at ~amplitude px in either direction —
 * never enough to feel "scroll-jacked", just enough to make the foreground
 * feel slightly closer than the page behind it.
 */
export function Parallax({ children, amplitude = 24, className }: Props) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 when bottom of wrap is at top of viewport, +1 at the opposite.
        const center = rect.top + rect.height / 2;
        const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
        const clamped = Math.max(-1, Math.min(1, progress));
        inner.style.transform = `translate3d(0, ${(-clamped * amplitude).toFixed(2)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [amplitude]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
