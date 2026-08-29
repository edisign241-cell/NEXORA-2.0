"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Store, Product } from "@/lib/types/marketplace";
import { nexoraApi, mapDbStoreToStore } from "@/lib/supabase/client";
import { supabase } from "@/lib/supabase/client";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { ProductCard } from "@/components/marketplace/product-card";
import { ProductModal } from "@/components/marketplace/product-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  Zap,
  ShoppingBag,
  Search,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Building2,
  PackageOpen,
} from "lucide-react";

export default function BoutiquePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [store, setStore] = React.useState<Store | null>(null);
  const [storeProducts, setStoreProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedProductForModal, setSelectedProductForModal] = React.useState<Product | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    async function fetchBoutiqueData() {
      if (!slug) return;
      setIsLoading(true);
      try {
        // Find store by slug or id
        const { data: storeData } = await supabase
          .from("stores")
          .select("*")
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .maybeSingle();

        if (storeData) {
          const mappedStore = mapDbStoreToStore(storeData);
          setStore(mappedStore);
          const productsRes = await nexoraApi.getProducts(mappedStore.id);
          setStoreProducts(productsRes.data || []);
        } else {
          setStore(null);
        }
      } catch {
        setStore(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBoutiqueData();
  }, [slug]);

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return storeProducts.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || p.categorie === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [storeProducts, searchQuery, selectedCategory]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#065f46] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Chargement de la boutique...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#d97706] flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black italic text-slate-900">Boutique introuvable</h2>
            <p className="text-xs text-slate-500">
              Cette boutique n&apos;existe pas ou a été déplacée. Découvrez les autres commerçants disponibles sur Nexora.
            </p>
            <Button onClick={() => router.push("/")} className="bg-[#065f46] hover:bg-[#044e3a] text-white w-full text-xs font-bold">
              Explorer les boutiques
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const phoneCall = store.phoneAirtelMoney || store.location.telephone || "+241";
  const whatsappNumber = phoneCall.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Top Breadcrumb & Navigation */}
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux commerces</span>
          </Link>
        </div>

        {/* Store Banner Hero */}
        <div className="relative bg-slate-900">
          <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden">
            {store.banner ? (
              <img
                src={store.banner}
                alt={store.nom}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all border border-white/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? "Lien copié !" : "Partager"}</span>
            </button>
          </div>
        </div>

        {/* Store Profile Card Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
              {/* Left Column: Logo & Info */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl border-4 border-white dark:border-slate-800 bg-white shadow-lg overflow-hidden">
                  <img
                    src={store.logo}
                    alt={store.nom}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] dark:text-white tracking-tight">
                      {store.nom}
                    </h1>
                    {store.verified && (
                      <Badge
                        variant="emerald"
                        className="bg-emerald-100 text-[#065f46] text-[11px] font-bold border-emerald-300"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Boutique Vérifiée
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
                    {store.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{store.location.quartier}, {store.location.ville}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{store.rating} ({store.reviewsCount} avis)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact & Quick Actions */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 md:flex-none"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 font-bold text-xs h-10 shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Marchand</span>
                    </Button>
                  </a>
                )}

                <a href={`tel:${phoneCall}`} className="flex-1 md:flex-none">
                  <Button variant="outline" className="w-full gap-2 font-bold text-xs h-10">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>Appeler la boutique</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog & Products Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 space-y-6">
          {/* Catalog Header & Search Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black italic text-[#111827] tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#065f46]" />
                Catalogue de la boutique ({filteredProducts.length} articles)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Commandez avec livraison immédiate à votre repère à {store.location.ville}
              </p>
            </div>

            {/* In-store Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher dans la boutique..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
              />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenQuickView={(p) => setSelectedProductForModal(p)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center space-y-3 dark:border-slate-800">
              <PackageOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {searchQuery ? "Aucun produit ne correspond à votre recherche" : "Cette boutique n'a pas encore mis d'articles en vente"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery ? "Essayez un autre terme de recherche." : "Les nouveaux produits seront disponibles très prochainement."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs font-bold"
                >
                  Réinitialiser la recherche
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
      />

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
