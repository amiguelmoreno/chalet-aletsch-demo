import { cn } from "@/lib/cn";

type Props = {
  value: number;
  className?: string;
};

const map: Array<[number, string]> = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  let result = "";
  let remainder = n;
  for (const [value, symbol] of map) {
    while (remainder >= value) {
      result += symbol;
      remainder -= value;
    }
  }
  return result;
}

/** Roman numeral display — used for section numbering. */
export function RomanNumeral({ value, className }: Props) {
  return (
    <span
      className={cn(
        "font-display text-forest-600 tracking-wide-md",
        className,
      )}
      aria-label={`Section ${value}`}
    >
      {toRoman(value)}
    </span>
  );
}
