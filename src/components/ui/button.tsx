import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "emerald"
    | "amber"
    | "blue"
    | "purple"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-xl";

    const variantStyles = {
      default:
        "bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus-visible:ring-slate-950 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
      emerald:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-500/20 focus-visible:ring-emerald-600 active:bg-emerald-700",
      amber:
        "bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 shadow-sm shadow-amber-500/20 focus-visible:ring-amber-500 active:bg-amber-600",
      blue:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/20 focus-visible:ring-blue-600 active:bg-blue-700",
      purple:
        "bg-purple-600 text-white hover:bg-purple-500 shadow-sm shadow-purple-500/20 focus-visible:ring-purple-600 active:bg-purple-700",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      outline:
        "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-sm focus-visible:ring-rose-600",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
