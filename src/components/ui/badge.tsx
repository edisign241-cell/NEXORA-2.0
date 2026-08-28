import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "emerald"
    | "amber"
    | "secondary"
    | "outline"
    | "destructive"
    | "blue"
    | "purple";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#065f46] text-white",
    emerald:
      "bg-emerald-50 text-[#065f46] border border-emerald-200/80 font-medium",
    amber:
      "bg-amber-50 text-[#d97706] border border-amber-200 font-medium",
    blue: "bg-blue-50 text-blue-700 border border-blue-200 font-medium",
    purple:
      "bg-purple-50 text-purple-700 border border-purple-200 font-medium",
    secondary:
      "bg-[#f9fafb] text-[#111827] border border-slate-200 font-medium",
    outline: "border border-[#065f46]/30 text-[#111827] font-medium",
    destructive:
      "bg-rose-50 text-rose-700 border border-rose-200 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
