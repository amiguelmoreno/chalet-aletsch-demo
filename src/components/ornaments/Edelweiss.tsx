import { cn } from "@/lib/cn";

type Props = { className?: string; size?: number };

/**
 * Stylised edelweiss — the alpine flower used as a section glyph.
 * Six asymmetric petals, line-drawn, no fill except the centre.
 */
export function Edelweiss({ className, size = 28 }: Props) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={cn("text-forest-700", className)}
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Six elongated petals around centre */}
        <g transform="translate(40 40)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M 0 -6 Q -4 -16 -2 -28 Q 0 -32 2 -28 Q 4 -16 0 -6" />
              {/* small inner highlight stroke */}
              <path
                d="M 0 -10 Q 0 -20 0 -26"
                strokeWidth="0.5"
                opacity="0.55"
              />
            </g>
          ))}
        </g>
        {/* Centre cluster of small dots */}
        <g fill="currentColor" stroke="none">
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <circle
              key={i}
              cx={40 + Math.cos((deg * Math.PI) / 180) * 3}
              cy={40 + Math.sin((deg * Math.PI) / 180) * 3}
              r="1.1"
            />
          ))}
          <circle cx="40" cy="40" r="1.2" />
        </g>
      </g>
    </svg>
  );
}
