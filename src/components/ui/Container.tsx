import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  width?: "default" | "narrow" | "wide";
  as?: React.ElementType;
};

export function Container({
  className,
  width = "default",
  as: Tag = "div",
  ...rest
}: Props) {
  const Component = Tag;
  return (
    <Component
      className={cn(
        "container-editorial above-grain",
        width === "narrow" && "max-w-3xl",
        width === "wide" && "max-w-screen-2xl",
        className,
      )}
      {...rest}
    />
  );
}
