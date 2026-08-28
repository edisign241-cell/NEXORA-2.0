"use client";

import * as React from "react";
import { CATEGORIES_CONFIG } from "@/lib/constants/gabon-locations";
import {
  Utensils,
  Sparkles,
  Smartphone,
  Home,
  HeartPulse,
  Car,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
};

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black italic uppercase tracking-wider text-[#111827]">
          Rayons & Univers
        </h2>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-[#065f46] hover:text-[#10b981]"
          >
            Tous les rayons
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
            selectedCategory === null
              ? "bg-[#065f46] text-white shadow-md shadow-[#065f46]/20"
              : "bg-white text-[#111827] hover:bg-[#f9fafb] border border-slate-200/80"
          )}
        >
          <Grid className="w-4 h-4" />
          <span>Tout voir</span>
        </button>

        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
                isSelected
                  ? "bg-[#065f46] text-white shadow-md shadow-[#065f46]/20"
                  : "bg-white text-[#111827] hover:bg-[#f9fafb] border border-slate-200/80"
              )}
            >
              <span className={isSelected ? "text-white" : "text-[#10b981]"}>
                {ICONS_MAP[cat.icon] || <Sparkles className="w-4 h-4" />}
              </span>
              <span>{cat.nom}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
