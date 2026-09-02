import React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-border)] border border-transparent shadow-sm",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border border-transparent",
        outline:
          "bg-transparent border border-[var(--border)] text-[var(--text-h)] hover:bg-[var(--accent-bg)]",
        secondary:
          "bg-[var(--social-bg)] text-[var(--text-h)] hover:bg-opacity-80",
        ghost:
          "bg-transparent text-[var(--text-h)] hover:bg-[var(--accent-bg)]",
        link: "bg-transparent underline text-[var(--accent)] px-0 py-0 h-auto",
        hero: "bg-white text-[var(--heading)] shadow-md px-8 py-4 rounded-xl",
        heroOutline:
          "bg-transparent border-2 border-[var(--accent-border)] text-[var(--accent)] px-8 py-4 rounded-xl",
        accent:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-border)] ring-1 ring-[var(--accent-border)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
