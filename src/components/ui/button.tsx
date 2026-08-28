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
        "bg-[#065f46] text-white hover:bg-[#047857] shadow-sm shadow-[#065f46]/20 focus-visible:ring-[#065f46]",
      emerald:
        "bg-[#10b981] text-white hover:bg-[#059669] shadow-sm shadow-[#10b981]/25 focus-visible:ring-[#10b981] active:bg-[#047857]",
      amber:
        "bg-[#d97706] text-white hover:bg-[#b45309] shadow-sm shadow-[#d97706]/20 focus-visible:ring-[#d97706] active:bg-[#92400e]",
      blue:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/20 focus-visible:ring-blue-600 active:bg-blue-700",
      purple:
        "bg-purple-600 text-white hover:bg-purple-500 shadow-sm shadow-purple-500/20 focus-visible:ring-purple-600 active:bg-purple-700",
      secondary:
        "bg-[#f9fafb] text-[#111827] border border-slate-200 hover:bg-emerald-50 hover:text-[#065f46] hover:border-emerald-200 focus-visible:ring-[#065f46]",
      outline:
        "border border-slate-200 bg-white text-[#111827] hover:bg-[#f9fafb] hover:border-[#10b981] hover:text-[#065f46] focus-visible:ring-[#065f46]",
      ghost:
        "bg-transparent text-[#111827] hover:bg-emerald-50 hover:text-[#065f46] focus-visible:ring-[#065f46]",
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
