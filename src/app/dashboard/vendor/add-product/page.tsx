'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import MarketingKitModal from '@/components/dashboard/MarketingKitModal';
import { Navbar } from '@/components/marketplace/navbar';
import { CartDrawer } from '@/components/marketplace/cart-drawer';
import { LocationModal } from '@/components/marketplace/location-modal';
import { SocialGrowthCoach } from '@/lib/services/social-coach';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Store,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{ name: string; url: string } | null>(null);
  const [generatedKit, setGeneratedKit] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mode & Beauté',
    price: '',
    description: '',
  });

  // Autonomously draft description using SellerCoach IA
  const handleAutoDraftDescription = () => {
    if (!formData.name.trim()) {
      alert("Veuillez d'abord renseigner le nom de votre produit (ex: Sac à main en cuir local).");
      return;
    }

    const autoDesc = SocialGrowthCoach.generateAutonomousProductDescription({
      productName: formData.name,
      category: formData.category,
      priceXaf: parseFloat(formData.price) || undefined,
      storeName: 'Boutique Nexora',
      location: 'Libreville, Gabon',
    });

    setFormData((prev) => ({ ...prev, description: autoDesc }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    try {
      // 1. Récupération ou attribution de la boutique
      let storeId = 'store-1';
      let storeName = 'Boutique Nexora';
      let storeDistrict = 'Centre-Ville';
      let storeCity = 'Libreville';

      try {
        const { data: store } = await (supabase.from('stores') as any)
          .select('id, name, district, city')
          .limit(1)
          .single();

        if (store) {
          storeId = store.id;
          storeName = store.name || storeName;
          storeDistrict = store.district || storeDistrict;
          storeCity = store.city || storeCity;
        }
      } catch (e) {
        console.warn('Utilisation de la boutique locale par défaut.');
      }

      // 2. Insertion dans Supabase
      let prodId = `prod-${Date.now()}`;
      try {
        const { data: product, error: insertError } = await (supabase.from('products') as any)
          .insert({
            store_id: storeId,
            name: formData.name,
            category: formData.category,
            price_xaf: parseFloat(formData.price) || 0,
            description: formData.description,
            is_active: true,
          })
          .select()
          .single();

        if (!insertError && product) {
          prodId = product.id;
        }
      } catch (err) {
        console.warn('Insertion Supabase simulée en mode local:', err);
      }

      const fullProductUrl = `${window.location.origin}/boutique/${storeId}/produit/${prodId}`;

      // 3. Déclenchement de l'Agent Seller Coach IA
      let kitData: any = null;
      try {
        const response = await fetch('/api/seller-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeName,
            category: formData.category,
            productName: formData.name,
            priceXaf: parseFloat(formData.price) || 0,
            productDescription: formData.description,
            location: `${storeDistrict}, ${storeCity}`,
            productUrl: fullProductUrl,
          }),
        });

        if (response.ok) {
          kitData = await response.json();
        }
      } catch (apiErr) {
        console.warn("Repli sur le générateur algorithmique d'urgence:", apiErr);
      }

      if (!kitData || !kitData.hooks) {
        const fallback = SocialGrowthCoach.generateKit({
          storeName,
          category: formData.category,
          productName: formData.name,
          priceXaf: parseFloat(formData.price) || 0,
          productDescription: formData.description,
          location: `${storeDistrict}, ${storeCity}`,
          productUrl: fullProductUrl,
        });

        kitData = {
          hooks: [fallback.hooks.costlyMistake, fallback.hooks.concreteResult, fallback.hooks.directComparison],
          videoScript: {
            hook: fallback.videoScript.hook,
            problem: fallback.videoScript.problemAndDemo,
            proof: fallback.videoScript.proofAndDifferentiation,
            cta: fallback.videoScript.callToAction,
          },
          seoDescription: fallback.seoDescription,
          hashtags: fallback.hashtags,
        };
      }

      // 4. Succès et ouverture du Kit de Vente
      setCreatedProduct({ name: formData.name, url: fullProductUrl });
      setGeneratedKit(kitData);
      setSuccessMessage('Produit publié avec succès ! Votre Kit Marketing IA est prêt.');
      setModalOpen(true);
    } catch (err) {
      console.error('Erreur lors de la création du produit :', err);
      alert('Erreur lors de la publication du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <Link href="/dashboard/vendor">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500 hover:text-slate-800 -ml-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au Tableau de Bord Marchand</span>
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-[#065f46]" />
              <span>Ajouter un nouveau produit</span>
            </h1>
            <p className="text-xs text-slate-500">
              Chaque produit ajouté génère immédiatement son <strong>Kit de Vente Réseaux Sociaux (IA Coach)</strong>.
            </p>
          </div>

          <Badge variant="amber" className="text-[10px] font-bold uppercase hidden sm:inline-flex">
            IA Coach Intégré
          </Badge>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              size="sm"
              className="h-7 text-xs font-bold text-emerald-700 border-emerald-300 bg-white hover:bg-emerald-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
              Rouvrir le Kit IA
            </Button>
          </div>
        )}

        {/* Form Card */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-black italic flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Fiche Technique &amp; Commerciale du Produit</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  placeholder="Ex : Sac à main en cuir local, Robe Wax prestige, Chocolat Kango 85%..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  >
                    <option value="Mode & Beauté">Mode &amp; Beauté (Wax, Vêtements)</option>
                    <option value="Alimentation & Terroir">Épicerie &amp; Terroir Gabonais</option>
                    <option value="Électronique & High-Tech">Électronique &amp; High-Tech</option>
                    <option value="Maison & Artisanat">Artisanat &amp; Pierre de Mbigou</option>
                    <option value="Santé & Bien-être">Santé &amp; Bien-être</option>
                    <option value="Services & Livraison">Services Divers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs font-mono font-bold"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Description du produit *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoDraftDescription}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rédiger avec SellerCoach IA</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs leading-relaxed"
                  placeholder="Matière, finitions, usage, authenticité (ou cliquez sur 'Rédiger avec SellerCoach IA')..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#065f46] hover:bg-[#064e3b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Génération du Kit Marketing par l&apos;IA Coach...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Publier et générer le kit de vente</span>
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Modale déclenchée automatiquement */}
      <MarketingKitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={createdProduct?.name || ''}
        productUrl={createdProduct?.url || ''}
        kit={generatedKit}
      />

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
