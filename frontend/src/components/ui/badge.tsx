import React from "react";
import { clsx } from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "default";
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
      info: "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
      default: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
    };

    return (
      <span
        ref={ref}
        className={clsx("badge", variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
