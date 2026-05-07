"use client";

import * as React from "react";

/**
 * Hairline reading progress bar fixed at the very top of the page.
 * Like the slim ribbon glued at the top of a leather-bound book.
 */
export function ScrollProgress() {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const ratio = max > 0 ? Math.max(0, Math.min(1, doc.scrollTop / max)) : 0;
        el.style.transform = `scaleX(${ratio.toFixed(4)})`;
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
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 inset-x-0 h-px z-[60] pointer-events-none origin-left"
    >
      <div
        ref={ref}
        className="h-full bg-seal/70 origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
