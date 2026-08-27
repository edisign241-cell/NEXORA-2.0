"use client";

import * as React from "react";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUserStore } from "@/store/use-user-store";

export function HeroBanner({
  onSelectCategory,
  onExploreClick,
}: {
  onSelectCategory?: (category: string) => void;
  onExploreClick?: () => void;
}) {
  const { selectedLocation, toggleLocationModal } = useUserStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="amber"
              className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 text-xs uppercase font-bold tracking-wider gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Plateforme E-Commerce #1 au Gabon
            </Badge>
            <button
              onClick={toggleLocationModal}
              className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-900/40 border border-emerald-700/50 rounded-full px-3 py-1 hover:bg-emerald-800/50 transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>
                Actif à <strong>{selectedLocation.ville}</strong>
              </span>
            </button>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              Le meilleur du commerce gabonais,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                livré chez vous.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Commandez auprès des meilleures boutiques certifiées de <strong>Libreville, Port-Gentil et Franceville</strong>. 
              Payez instantanément par <strong>Airtel Money</strong> ou <strong>Moov Money</strong> et soyez livré directement à votre repère.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={onExploreClick}
              variant="emerald"
              size="lg"
              className="font-bold gap-2 text-sm sm:text-base shadow-lg shadow-emerald-600/30"
            >
              <span>Acheter maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onSelectCategory && onSelectCategory("alimentation_terroir")}
              variant="outline"
              size="lg"
              className="border-slate-700 bg-slate-800/70 text-slate-100 hover:bg-slate-700/90 text-sm font-semibold"
            >
              🍯 Terroir Gabonais
            </Button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-100">Livraison Express</p>
                <p className="text-slate-400 text-[11px]">En 2h à Libreville & Akanda</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-100">Mobile Money</p>
                <p className="text-slate-400 text-[11px]">Airtel Money & Moov Money</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-100">Boutiques Vérifiées</p>
                <p className="text-slate-400 text-[11px]">Commerçants certifiés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Card */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-slate-200">
                  Commandes en direct à Libreville
                </span>
              </div>
              <Badge variant="emerald" className="text-[10px] uppercase font-bold">
                En temps réel
              </Badge>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=100&auto=format&fit=crop&q=80"
                  alt="Chocolat Kango"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-100 truncate">
                    Chocolat Pur Kango (70% Cacao)
                  </p>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    9 900 FCFA • Payé via Airtel Money
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Livraison en cours à Nzeng-Ayong
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80"
                  alt="Pierre de Mbigou"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-100 truncate">
                    Sculpture Pierre de Mbigou
                  </p>
                  <p className="text-[11px] text-amber-300 font-semibold">
                    39 000 FCFA • Payé via Moov Money
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Livraison en cours à Angondjé Château
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-200">🚀 15 livreurs actifs sur le réseau</span>
              <span className="font-bold text-emerald-400">Temps moyen : 28 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
