import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Width control: full | narrow */
  width?: "full" | "narrow";
};

/**
 * Chapter-style horizontal divider with a centred floral motif.
 * Used between sections; replaces the ubiquitous "card grid" rhythm.
 */
export function OrnamentRule({ className, width = "full" }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-forest-600",
        width === "narrow" ? "max-w-md mx-auto" : "w-full",
        className,
      )}
      aria-hidden
    >
      <span className="h-px flex-1 bg-current opacity-40" />
      <svg viewBox="0 0 80 24" width="80" height="24" className="text-forest-700">
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M 4 12 Q 12 4 20 12 Q 28 20 36 12" />
          <path d="M 76 12 Q 68 4 60 12 Q 52 20 44 12" />
        </g>
        <g fill="currentColor">
          <circle cx="40" cy="12" r="2.2" />
          <circle cx="40" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </g>
      </svg>
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  );
}
