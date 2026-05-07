import { cn } from "@/lib/cn";

type Props = { className?: string };

/**
 * Hand-drawn line illustration of the chalet against mountains.
 * Replaces the typical AI-website hero photograph.
 */
export function ChaletSketch({ className }: Props) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={cn("text-forest-800 w-full h-auto", className)}
      aria-hidden
    >
      <g
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Far mountain range */}
        <g strokeWidth="0.8" opacity="0.45">
          <path d="M 0 180 L 60 130 L 110 165 L 175 105 L 240 155 L 320 95 L 400 145 L 480 110 L 480 200 L 0 200 Z" />
          <path d="M 175 105 L 200 130 M 320 95 L 345 125 M 480 110 L 460 140" strokeWidth="0.5" />
        </g>

        {/* Closer range, more detailed */}
        <g strokeWidth="1" opacity="0.85">
          <path d="M 0 220 L 70 175 L 140 215 L 220 150 L 300 200 L 380 150 L 480 195" />
          <path d="M 220 150 L 245 178 M 220 150 L 200 175" strokeWidth="0.6" />
          <path d="M 380 150 L 405 175 M 380 150 L 360 178" strokeWidth="0.6" />
          {/* Snow shading */}
          <path d="M 215 158 L 225 162 M 218 165 L 230 170" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* The chalet */}
        <g strokeWidth="1.2">
          {/* Stone foundation */}
          <path d="M 175 280 L 175 260 L 305 260 L 305 280 Z" />
          <path d="M 200 280 L 200 260 M 230 280 L 230 260 M 260 280 L 260 260 M 285 280 L 285 260" strokeWidth="0.5" opacity="0.6" />
          {/* Wooden body — first floor */}
          <path d="M 180 260 L 180 220 L 300 220 L 300 260" />
          {/* Window 1 */}
          <rect x="195" y="232" width="20" height="20" />
          <path d="M 205 232 L 205 252 M 195 242 L 215 242" strokeWidth="0.6" />
          {/* Door */}
          <rect x="225" y="232" width="30" height="28" />
          <circle cx="248" cy="246" r="0.8" fill="currentColor" />
          {/* Window 2 */}
          <rect x="265" y="232" width="20" height="20" />
          <path d="M 275 232 L 275 252 M 265 242 L 285 242" strokeWidth="0.6" />
          {/* Triangular gable */}
          <path d="M 175 220 L 240 175 L 305 220 Z" />
          {/* Gable details — heart cutout, balcony */}
          <path d="M 235 200 Q 230 195 235 192 Q 240 188 240 195 Q 240 188 245 192 Q 250 195 245 200 L 240 205 Z" strokeWidth="0.6" />
          {/* Roof overhang lines */}
          <path d="M 165 222 L 175 220 M 305 220 L 315 222" strokeWidth="0.6" />
          {/* Balcony rail */}
          <path d="M 180 235 L 300 235" strokeWidth="0.4" opacity="0.5" />
          {/* Chimney */}
          <rect x="265" y="190" width="12" height="20" strokeWidth="0.8" />
          <path d="M 265 195 L 277 195" strokeWidth="0.5" />
          {/* Smoke */}
          <path d="M 271 188 Q 268 182 274 178 Q 280 174 277 168" strokeWidth="0.6" opacity="0.55" />
        </g>

        {/* Pine trees — left side */}
        <g strokeWidth="0.9">
          <path d="M 100 280 L 100 240 M 100 245 L 90 255 L 110 255 L 100 245 M 100 252 L 88 262 L 112 262 L 100 252 M 100 260 L 86 272 L 114 272 L 100 260" />
          <path d="M 130 285 L 130 255 M 130 258 L 122 266 L 138 266 L 130 258 M 130 264 L 120 274 L 140 274 L 130 264" strokeWidth="0.7" />
        </g>

        {/* Pine trees — right side */}
        <g strokeWidth="0.9">
          <path d="M 360 285 L 360 245 M 360 250 L 350 260 L 370 260 L 360 250 M 360 257 L 348 268 L 372 268 L 360 257 M 360 266 L 346 278 L 374 278 L 360 266" />
          <path d="M 395 290 L 395 258 M 395 262 L 385 272 L 405 272 L 395 262 M 395 269 L 383 280 L 407 280 L 395 269" strokeWidth="0.7" />
        </g>

        {/* Ground line — broken, hand-drawn feel */}
        <path d="M 0 290 L 80 290 M 95 290 L 165 290 M 175 290 L 305 290 M 320 290 L 380 290 L 410 292 L 480 290" strokeWidth="0.8" opacity="0.7" />

        {/* Sun/moon */}
        <circle cx="400" cy="80" r="22" strokeWidth="0.7" opacity="0.4" />
      </g>
    </svg>
  );
}
