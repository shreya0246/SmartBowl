"use client";

type ButtonVariant = "default" | "lavender" | "outline" | "ghost";
type ButtonSize = "sm" | "default" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-charcoal text-white hover:bg-deep-lavender hover:text-white",
  lavender: "bg-lavender text-charcoal hover:bg-deep-lavender hover:text-white",
  outline:
    "border border-charcoal/20 bg-white text-charcoal hover:bg-charcoal hover:text-white",
  ghost: "text-charcoal/70 hover:text-deep-lavender hover:bg-soft-grey/30",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  lg: "h-12 px-8 text-base",
};

const Button = ({ className, variant = "default", size = "default", href, ...props }: ButtonProps) => {
  const Comp = href ? "a" : "button";
  const rest = props as Record<string, unknown>;

  return (
    <Comp
      {...(href ? { href } : { type: "button" })}
      {...rest}
      className={[
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lavender focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export { Button };
export type { ButtonVariant, ButtonSize };
