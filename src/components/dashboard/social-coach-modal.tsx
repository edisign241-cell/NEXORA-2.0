"use client";

import React, { useState } from "react";
import { GeneratedSocialKit, SocialGrowthCoach } from "@/lib/services/social-coach";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  Video,
  FileText,
  ExternalLink,
  X,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

interface SocialCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    description?: string;
    category?: string;
    storeName?: string;
    location?: string;
    slug?: string;
  };
}

export function SocialCoachModal({ isOpen, onClose, product }: SocialCoachModalProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://nexora.ga";
  const productUrl = `${currentOrigin}/boutique/${product.slug || "boutique"}`;

  const kit: GeneratedSocialKit = SocialGrowthCoach.generateKit({
    storeName: product.storeName || "Ma Boutique",
    category: product.category || "Mode & Tendances",
    productName: product.name,
    priceXaf: product.price,
    productDescription: product.description || "Article de qualité supérieure",
    location: product.location || "Libreville, Gabon",
    productUrl,
  });

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden my-4 sm:my-8 border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#064e3b] p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-black italic">Kit de Vente Réseaux Sociaux (IA)</h2>
                <Badge variant="amber" className="text-[9px] sm:text-[10px] uppercase font-black px-1.5 py-0.2">
                  Conversion Rapide
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate max-w-[220px] sm:max-w-none">
                Pour : <strong>{product.name}</strong> ({product.price.toLocaleString("fr-FR")} FCFA)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-800">
          {/* Section 1 : Hooks */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#065f46]" />
                <span>1. Trois Accroches &quot;Stop-Scroll&quot; (Choisis la plus percutante)</span>
              </h3>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[11px] text-amber-800 uppercase tracking-wider block mb-0.5">
                    Option 1 (Angle Erreur Coûteuse)
                  </span>
                  <p className="text-slate-700 italic">&quot;{kit.hooks.costlyMistake}&quot;</p>
                </div>
                <Button
                  onClick={() => handleCopy(kit.hooks.costlyMistake, "hook1")}
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-7 text-[11px]"
                >
                  {copiedSection === "hook1" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[11px] text-emerald-800 uppercase tracking-wider block mb-0.5">
                    Option 2 (Angle Résultat Concret)
                  </span>
                  <p className="text-slate-700 italic">&quot;{kit.hooks.concreteResult}&quot;</p>
                </div>
                <Button
                  onClick={() => handleCopy(kit.hooks.concreteResult, "hook2")}
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-7 text-[11px]"
                >
                  {copiedSection === "hook2" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[11px] text-blue-800 uppercase tracking-wider block mb-0.5">
                    Option 3 (Angle Comparatif Direct)
                  </span>
                  <p className="text-slate-700 italic">&quot;{kit.hooks.directComparison}&quot;</p>
                </div>
                <Button
                  onClick={() => handleCopy(kit.hooks.directComparison, "hook3")}
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-7 text-[11px]"
                >
                  {copiedSection === "hook3" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2 : Script Vidéo */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-600" />
                <span>2. Script Court Vidéo (Reels / TikTok / Statut WhatsApp — 30 à 45s)</span>
              </h3>
              <Button
                onClick={() =>
                  handleCopy(
                    `Hook (0-3s) : ${kit.videoScript.hook}\n\nProblème & Démo (4-20s) : ${kit.videoScript.problemAndDemo}\n\nPreuve & Différenciation (21-30s) : ${kit.videoScript.proofAndDifferentiation}\n\nAppel à l'action (31-40s) : ${kit.videoScript.callToAction}`,
                    "script"
                  )
                }
                variant="outline"
                size="sm"
                className="h-7 text-xs font-bold gap-1"
              >
                {copiedSection === "script" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier Tout le Script</span>
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-2.5">
              <div>
                <span className="font-bold text-purple-900">Hook (0 à 3 sec) :</span>
                <p className="text-slate-700 mt-0.5">{kit.videoScript.hook}</p>
              </div>
              <div>
                <span className="font-bold text-purple-900">Problème &amp; Démonstration (4 à 20 sec) :</span>
                <p className="text-slate-700 mt-0.5">{kit.videoScript.problemAndDemo}</p>
              </div>
              <div>
                <span className="font-bold text-purple-900">Preuve &amp; Différenciation (21 à 30 sec) :</span>
                <p className="text-slate-700 mt-0.5">{kit.videoScript.proofAndDifferentiation}</p>
              </div>
              <div>
                <span className="font-bold text-purple-900">Appel à l&apos;action (31 à 40 sec) :</span>
                <p className="text-slate-700 mt-0.5 italic">&quot;{kit.videoScript.callToAction}&quot;</p>
              </div>
            </div>
          </div>

          {/* Section 3 : SEO Description (Zero Emojis) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>3. Description Optimisée SEO (Sans Emojis)</span>
              </h3>
              <Button
                onClick={() => handleCopy(`${kit.seoDescription}\n\nMots-clés : ${kit.hashtags.join(" ")}`, "seo")}
                variant="outline"
                size="sm"
                className="h-7 text-xs font-bold gap-1"
              >
                {copiedSection === "seo" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier la Description</span>
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2">
              <p className="text-slate-800 leading-relaxed">{kit.seoDescription}</p>
              <div className="pt-2 border-t border-emerald-200/60 font-mono text-[11px] text-emerald-800">
                <strong>Mots-clés de ciblage :</strong> {kit.hashtags.join(" ")}
              </div>
            </div>
          </div>

          {/* Section 4 : Liens de Partage */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>4. Liens de Partage en 1 Clic</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a href={kit.shareLinks.whatsapp} target="_blank" rel="noreferrer" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs font-bold text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100">
                  <MessageCircle className="w-4 h-4" />
                  <span>Partager sur WhatsApp</span>
                </Button>
              </a>

              <a href={kit.shareLinks.facebook} target="_blank" rel="noreferrer" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs font-bold text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100">
                  <Share2 className="w-4 h-4" />
                  <span>Partager sur Facebook</span>
                </Button>
              </a>

              <Button
                onClick={() => handleCopy(kit.shareLinks.rawUrl, "url")}
                variant="outline"
                size="sm"
                className="w-full justify-center gap-1.5 text-xs font-bold border-slate-200 bg-slate-50 hover:bg-slate-100"
              >
                {copiedSection === "url" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier le Lien Produit</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <Button onClick={onClose} variant="default" size="sm" className="bg-slate-900 text-white font-bold text-xs">
            Fermer le Kit
          </Button>
        </div>
      </div>
    </div>
  );
}
