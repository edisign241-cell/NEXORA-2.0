'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, Send, X, Sparkles } from 'lucide-react';

export interface MarketingKitProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productUrl: string;
  kit: {
    hooks: string[];
    videoScript: { hook: string; problem: string; proof: string; cta: string };
    seoDescription: string;
    hashtags: string[];
  } | null;
}

export default function MarketingKitModal({
  isOpen,
  onClose,
  productName,
  productUrl,
  kit,
}: MarketingKitProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen || !kit) return null;

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fullScript = `[ACCROCHE]\n${kit.videoScript.hook}\n\n[PROBLÈME & SOLUTION]\n${kit.videoScript.problem}\n\n[DIFFÉRENCIATION]\n${kit.videoScript.proof}\n\n[APPEL À L'ACTION]\n${kit.videoScript.cta}`;
  const fullPost = `${kit.seoDescription}\n\n${kit.hashtags.join(' ')}\n\nLien de commande : ${productUrl}`;

  // URLs de partage préformatées
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Découvrez ${productName} disponible sur Nexora : ${productUrl}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    productUrl
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    productUrl
  )}&text=${encodeURIComponent(`Disponible sur Nexora : ${productName}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 my-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Kit de Vente IA Prêt
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
          {/* Partage en 1 Clic */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Partage Direct
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-emerald-700 shadow-sm"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
              >
                <Share2 className="h-4 w-4" /> Facebook
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-sky-600 shadow-sm"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
            </div>
          </div>

          {/* Accroches */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-bold text-gray-900">3 Accroches Vidéo / Post</h3>
            <div className="mt-2 space-y-2">
              {kit.hooks.map((hook, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-xs sm:text-sm text-gray-700">
                  <span className="leading-relaxed">• {hook}</span>
                  <button
                    onClick={() => handleCopy(hook, `hook-${i}`)}
                    className="shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Copier l'accroche"
                  >
                    {copiedSection === `hook-${i}` ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Script Vidéo 30s */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Script Vidéo (30-45 secondes)</h3>
              <button
                onClick={() => handleCopy(fullScript, 'script')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-xs"
              >
                {copiedSection === 'script' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                Copier tout le script
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-600 bg-white/70 p-3 rounded-lg border border-gray-100">
              {fullScript}
            </pre>
          </div>

          {/* Description SEO sans Emoji */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Légende Réseaux Sociaux & Mots-Clés</h3>
              <button
                onClick={() => handleCopy(fullPost, 'post')}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-xs"
              >
                {copiedSection === 'post' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                Copier la légende
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-700 bg-white/70 p-3 rounded-lg border border-gray-100">
              {kit.seoDescription}
            </p>
            <p className="mt-3 text-xs font-medium text-blue-600 font-mono">{kit.hashtags.join(' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
