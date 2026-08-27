"use client";

import * as React from "react";
import {
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Smartphone,
  Palette,
  Home,
  Truck,
  ArrowRight,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  storesCount: number;
}

export const CATEGORIES_LIST: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Street Food & Grillades",
    slug: "street-food",
    description: "Coupé-Coupé braisé, Poulet Nyembwe, Bananes pesées",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50",
    storesCount: 8,
  },
  {
    id: "cat-2",
    name: "Mode & Wax",
    slug: "mode-wax",
    description: "Robes Wax, chemises lin, tenues traditionnelles",
    icon: <Shirt className="w-5 h-5" />,
    color: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50",
    storesCount: 14,
  },
  {
    id: "cat-3",
    name: "Épicerie & Terroir",
    slug: "epicerie-terroir",
    description: "Chocolat de Kango, Odika de Makokou, Miel pur",
    icon: <Sparkles className="w-5 h-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50",
    storesCount: 11,
  },
  {
    id: "cat-4",
    name: "Électronique & High-Tech",
    slug: "high-tech",
    description: "Smartphones neufs garantis, écouteurs, accessoires",
    icon: <Smartphone className="w-5 h-5" />,
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50",
    storesCount: 9,
  },
  {
    id: "cat-5",
    name: "Art & Culture Gabonaise",
    slug: "art-culture",
    description: "Pierre de Mbigou taillée, Masques Punu, sculptures",
    icon: <Palette className="w-5 h-5" />,
    color: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50",
    storesCount: 6,
  },
  {
    id: "cat-6",
    name: "Maison & Artisanat",
    slug: "maison-artisanat",
    description: "Décoration contemporaine, bougeoirs, vannerie",
    icon: <Home className="w-5 h-5" />,
    color: "text-orange-600 dark:text-orange-400",
    bgLight: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/50",
    storesCount: 7,
  },
  {
    id: "cat-7",
    name: "Services & Livraison",
    slug: "services-livraison",
    description: "Coursiers express 2 roues, livraisons de colis",
    icon: <Truck className="w-5 h-5" />,
    color: "text-teal-600 dark:text-teal-400",
    bgLight: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/50",
    storesCount: 15,
  },
];

export function CategoryGrid({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Rayons & Univers du Gabon
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explorez les meilleures boutiques certifiées par secteur d&apos;activité
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
              className={`group text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                cat.bgLight
              } hover:shadow-md hover:scale-[1.02] ${
                isSelected ? "ring-2 ring-emerald-500 shadow-md font-semibold" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {cat.storesCount} boutiques
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Découvrir</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
