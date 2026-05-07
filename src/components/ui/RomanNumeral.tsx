import { cn } from "@/lib/cn";

type Props = {
  value: number;
  className?: string;
};

/**
 * Section number — formerly Roman, now plain Arabic numerals
 * (kept the component name to avoid touching every call site).
 * Padded to 2 digits so "01", "02" line up like a chapter book.
 */
export function RomanNumeral({ value, className }: Props) {
  return (
    <span
      className={cn(
        "font-display italic text-forest-700 tracking-tight",
        className,
      )}
      aria-label={`Section ${value}`}
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}
