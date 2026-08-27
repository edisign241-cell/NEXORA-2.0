"use client";

import * as React from "react";
import Link from "next/link";
import { Store } from "@/lib/types/marketplace";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star, MapPin, CheckCircle2, ShoppingBag, Zap, ArrowRight } from "lucide-react";

export function StoreCard({
  store,
  onSelectStore,
}: {
  store: Store;
  onSelectStore?: (store: Store) => void;
}) {
  const storeUrl = `/boutique/${store.slug || store.id}`;

  return (
    <Card className="group overflow-hidden border-slate-200/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white dark:bg-slate-900">
      <Link href={storeUrl} className="block relative">
        {/* Banner / Header */}
        <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {store.banner ? (
            <img
              src={store.banner}
              alt={store.nom}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-emerald-800 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Delivery estimate badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/30">
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>25-45 min</span>
          </div>

          {/* Badge in top right */}
          {store.badge && (
            <div className="absolute top-2.5 right-2.5">
              <Badge
                variant="amber"
                className="bg-amber-400 text-slate-950 font-bold text-[10px] shadow-sm"
              >
                ★ {store.badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Logo and Store Name */}
        <div className="px-4 pt-0 relative">
          <div className="flex items-start gap-3 -mt-9 mb-2">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl border-2 border-white bg-white p-0.5 shadow-md overflow-hidden dark:border-slate-900 group-hover:scale-105 transition-transform">
              <img
                src={store.logo}
                alt={store.nom}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div className="pt-6 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors">
                  {store.nom}
                </h3>
                {store.verified && (
                  <span title="Boutique certifiée Nexora">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0 dark:fill-emerald-950" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Gérant : {store.ownerName}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {store.description}
          </p>

          {/* Store Metadata */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 pb-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{store.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({store.reviewsCount} avis)
                </span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                <ShoppingBag className="w-3 h-3" />
                <span>{store.totalSales} commandes</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">
                {store.location.quartier}, {store.location.ville}
              </span>
            </div>

            {/* Payment Badges & Action */}
            <div className="flex items-center justify-between pt-1.5">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                  Airtel Money
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                  Moov Flooz
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                Visiter <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
