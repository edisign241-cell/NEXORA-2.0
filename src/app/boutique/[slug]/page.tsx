"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MOCK_STORES, MOCK_PRODUCTS } from "@/lib/constants/mock-data";
import { Store, Product } from "@/lib/types/marketplace";
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
} from "lucide-react";

export default function BoutiquePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedProductForModal, setSelectedProductForModal] = React.useState<Product | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  // Find store by slug or ID
  const store: Store | undefined = React.useMemo(() => {
    return (
      MOCK_STORES.find((s) => s.slug === slug || s.id === slug) ||
      MOCK_STORES[0]
    );
  }, [slug]);

  // Find products of this store
  const storeProducts: Product[] = React.useMemo(() => {
    if (!store) return [];
    return MOCK_PRODUCTS.filter(
      (p) => p.storeId === store.id || p.storeName === store.nom
    );
  }, [store]);

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

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800">Boutique introuvable</h2>
        <Button onClick={() => router.push("/")} className="mt-4">
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  const phoneCall = store.phoneAirtelMoney || store.location.telephone || "+241 077 45 89 12";
  const whatsappNumber = phoneCall.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Top Breadcrumb & Navigation */}
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux boutiques de Libreville</span>
          </Link>
        </div>

        {/* Immersive Store Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
            {/* Banner Cover */}
            <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden bg-slate-900">
              <img
                src={store.banner || "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1200"}
                alt={store.nom}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Delivery Speed Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="rounded-full bg-slate-950/60 backdrop-blur-md p-2 text-white hover:bg-slate-900 border border-white/20 transition-all text-xs flex items-center gap-1.5 px-3"
                  title="Partager cette boutique"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">
                    {isCopied ? "Lien copié !" : "Partager"}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>Livraison en 30 min</span>
                </div>
              </div>
            </div>

            {/* Profile Info Row */}
            <div className="p-5 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                <div className="flex items-end gap-4">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-3xl border-4 border-white bg-white p-1 shadow-2xl overflow-hidden dark:border-slate-900">
                    <img
                      src={store.logo}
                      alt={store.nom}
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                        {store.nom}
                      </h1>
                      {store.verified && (
                        <Badge variant="emerald" className="gap-1 font-bold text-xs py-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certifié Gabon
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Gérant : <strong>{store.ownerName}</strong> • {store.categories.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20la%20Marketplace%20Nexora%20concernant%20vos%20produits.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-emerald-500/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Boutique</span>
                    </Button>
                  </a>

                  <a href={`tel:${phoneCall}`} className="flex-1 sm:flex-none">
                    <Button variant="emerald" size="sm" className="w-full gap-2 font-bold shadow-md shadow-emerald-600/20">
                      <Phone className="w-4 h-4" />
                      <span>Appeler</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Bio & Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mt-2 mb-4">
                {store.description}
              </p>

              {/* Metadata Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {store.rating.toFixed(2)} / 5.0
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Basé sur {store.reviewsCount} avis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {store.location.quartier}, {store.location.ville}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate" title={store.location.repere_texte}>
                      {store.location.repere_texte || "Point de repère fourni"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Ouvert aujourd&apos;hui
                    </p>
                    <p className="text-[10px] text-slate-500">08h30 - 20h00</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Paiements Sécurisés
                    </p>
                    <p className="text-[10px] text-slate-500">Airtel / Moov Money</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog & Products Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 space-y-6">
          {/* Catalog Header & Search Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                Catalogue de la boutique ({filteredProducts.length} articles)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Aucun produit ne correspond à votre recherche
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Essayez un autre mot-clé ou réinitialisez la barre de recherche.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Réinitialiser les filtres
              </Button>
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
