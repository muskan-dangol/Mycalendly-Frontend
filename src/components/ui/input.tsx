import React from "react";
import { cn } from "../../lib/utils.ts";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, icon, wrapperClassName, type = "text", ...props }, ref) => {
		return (
			<div className={cn(icon && "relative", wrapperClassName)}>
				{icon ? (
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
						{icon}
					</span>
				) : null}
				<input
					ref={ref}
					type={type}
					className={cn(
						"block w-full border border-gray-300 rounded-md py-1 pr-4 focus:outline-none focus:border-green-400",
						icon ? "pl-10" : "px-4",
						className,
					)}
					{...props}
				/>
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
