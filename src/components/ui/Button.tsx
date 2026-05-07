import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "outline" | "ghost" | "seal";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

/**
 * Letterpress-style button. Sharp corners, letter-spaced caps text,
 * tight 1px borders. No drop shadows, no gradients, no rounding.
 */
export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "ink", size = "md", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 border transition-colors duration-200",
        "uppercase tracking-wide-md font-display",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "px-4 py-2 text-[0.7rem]",
        size === "md" && "px-6 py-3 text-[0.78rem]",
        size === "lg" && "px-8 py-4 text-[0.84rem]",
        variant === "ink" &&
          "bg-ink-700 text-parchment-50 border-ink-700 hover:bg-ink-800 hover:border-ink-800",
        variant === "outline" &&
          "bg-transparent text-ink-700 border-ink-700/50 hover:border-ink-700 hover:bg-ink-700 hover:text-parchment-50",
        variant === "ghost" &&
          "bg-transparent text-ink-700 border-transparent hover:border-ink-700/40",
        variant === "seal" &&
          "bg-seal text-parchment-50 border-seal hover:bg-seal-dark hover:border-seal-dark",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
