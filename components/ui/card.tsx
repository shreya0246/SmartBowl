import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padded?: boolean;
  hoverLift?: boolean;
}

export function Card({
  children,
  className,
  padded = true,
  hoverLift = false,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-soft-grey bg-white text-charcoal shadow-sm",
        padded && "p-6",
        hoverLift && "transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
