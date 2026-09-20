import React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => {
  return (
    <label
      className={cn("block mb-2 text-left text-white font-bold", className)}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export { Label };
