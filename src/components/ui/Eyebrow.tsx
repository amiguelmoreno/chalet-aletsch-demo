import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  ornament?: boolean;
};

/**
 * Small-caps eyebrow label, with optional flanking hairlines like
 * a vintage menu chapter heading.
 */
export function Eyebrow({ className, children, ornament = false, ...rest }: Props) {
  if (!ornament) {
    return (
      <span
        className={cn(
          "inline-block editorial-caps text-forest-700",
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 editorial-caps text-forest-700",
        className,
      )}
      {...rest}
    >
      <span className="block w-8 h-px bg-current opacity-60" aria-hidden />
      {children}
      <span className="block w-8 h-px bg-current opacity-60" aria-hidden />
    </span>
  );
}
