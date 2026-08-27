"use client";

import * as React from "react";
import { Sparkles, Gift, Zap, Smartphone, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";

export function PromoBanner() {
  const [copied, setCopied] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const promos = [
    {
      id: "promo-1",
      tag: "Offre de Bienvenue Gabon",
      title: "Livraison 100% Offerte sur Libreville & Akanda",
      subtitle: "Utilisez le code promo exclusif lors de la validation de votre panier",
      code: "NEXORA241",
      badgeColor: "bg-emerald-500 text-white",
      bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
      icon: <Gift className="w-5 h-5 text-amber-300" />,
    },
    {
      id: "promo-2",
      tag: "Paiement Mobile Money",
      title: "Paiement en 1 Clic via Airtel Money & Moov Money",
      subtitle: "Zéro frais de transaction sur toutes vos commandes supérieures à 10 000 FCFA",
      code: "MOBILE241",
      badgeColor: "bg-rose-500 text-white",
      bgGradient: "from-slate-900 via-rose-950 to-slate-900",
      icon: <Smartphone className="w-5 h-5 text-rose-300" />,
    },
    {
      id: "promo-3",
      tag: "Street Food & Grillades",
      title: "Coupé-Coupé & Poulet Nyembwe Chaud en 30 min",
      subtitle: "Livré directement à votre repère (carrefour, barrière ou pharmacie)",
      code: "FOOD241",
      badgeColor: "bg-amber-500 text-slate-950",
      bgGradient: "from-amber-950 via-slate-900 to-emerald-950",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [promos.length]);

  const currentPromo = promos[activeSlide];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
      <div className={`p-4 sm:p-6 bg-gradient-to-r ${currentPromo.bgGradient} text-white transition-all duration-700`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider flex items-center gap-1 ${currentPromo.badgeColor}`}>
                {currentPromo.icon}
                {currentPromo.tag}
              </span>
              <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                🇬🇦 Spécial Gabon
              </span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-50 tracking-tight">
              {currentPromo.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentPromo.subtitle}
            </p>
          </div>

          {/* Promo Code Box & Action */}
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-700/80 rounded-xl p-2 sm:p-2.5 backdrop-blur-md self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left pl-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Code Promo</p>
              <p className="font-mono font-black text-amber-300 text-sm tracking-wider">
                {currentPromo.code}
              </p>
            </div>
            <Button
              onClick={() => handleCopyCode(currentPromo.code)}
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 text-xs font-semibold gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-3 mt-2 border-t border-slate-700/50">
          {promos.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === idx ? "w-6 bg-amber-400" : "w-1.5 bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={`Promo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
