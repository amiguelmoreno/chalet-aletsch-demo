"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  /** Threshold 0–1 — proportion of element visible before triggering. */
  threshold?: number;
  /** Once revealed, stay revealed (default true). */
  once?: boolean;
  /** Element tag — default div. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Reveal direction: "up" (default) | "fade" (no movement) | "left" | "right" */
  from?: "up" | "fade" | "left" | "right";
  className?: string;
};

/**
 * Wraps children and applies a gentle reveal animation when they enter the
 * viewport. CSS-only transitions (no animation library), driven by
 * IntersectionObserver. Designed to feel like a printed page being turned
 * rather than a SaaS hero — short distance, no bounce, organic easing.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.12,
  once = true,
  as = "div",
  from = "up",
  className,
}: Props) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setVisible(true);
        return;
      }
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  const Tag = as as React.ElementType;
  const baseTransition =
    "transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform";

  const hidden: Record<NonNullable<Props["from"]>, string> = {
    up: "opacity-0 translate-y-4",
    fade: "opacity-0",
    left: "opacity-0 -translate-x-4",
    right: "opacity-0 translate-x-4",
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        baseTransition,
        visible ? "opacity-100 translate-x-0 translate-y-0" : hidden[from],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
