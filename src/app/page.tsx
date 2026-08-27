"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { HeroBanner } from "@/components/marketplace/hero-banner";
import { PromoBanner } from "@/components/marketplace/promo-banner";
import { CategoryGrid } from "@/components/marketplace/category-grid";
import { StoreCard } from "@/components/marketplace/store-card";
import { ProductCard } from "@/components/marketplace/product-card";
import { ProductModal } from "@/components/marketplace/product-modal";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { MOCK_STORES, MOCK_PRODUCTS } from "@/lib/constants/mock-data";
import { Product } from "@/lib/types/marketplace";
import { useUserStore } from "@/store/use-user-store";
import { useCartStore } from "@/store/use-cart-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Store,
  ShoppingBag,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MapPin,
  Smartphone,
  Flame,
  Home,
  User,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProductForModal, setSelectedProductForModal] = React.useState<Product | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const { selectedLocation, toggleLocationModal } = useUserStore();
  const { toggleCart, items } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const productsSectionRef = React.useRef<HTMLDivElement>(null);
  const storesSectionRef = React.useRef<HTMLDivElement>(null);

  const handleExploreClick = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStoresClick = () => {
    storesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter products by category and search query
  const filteredProducts = React.useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchCategory =
        !selectedCategory ||
        product.categorie.includes(selectedCategory as any) ||
        (selectedCategory === "street-food" && product.categorie === "alimentation_terroir") ||
        (selectedCategory === "mode-wax" && product.categorie === "mode_beaute") ||
        (selectedCategory === "high-tech" && product.categorie === "high_tech") ||
        (selectedCategory === "art-culture" && product.categorie === "maison_artisanat") ||
        (selectedCategory === "services-livraison" && product.categorie === "services");

      const matchSearch =
        !searchQuery ||
        product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between font-sans pb-20 md:pb-0">
      {/* Navigation Header */}
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Local Promotions Banner */}
        <PromoBanner />

        {/* Hero Section */}
        <HeroBanner
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            handleExploreClick();
          }}
          onExploreClick={handleExploreClick}
        />

        {/* Categories Grid (Rayons & Univers du Gabon) */}
        <section>
          <CategoryGrid
            selectedCategory={selectedCategory || undefined}
            onSelectCategory={(catSlug) => {
              setSelectedCategory(catSlug);
              handleExploreClick();
            }}
          />
        </section>

        {/* Popular Stores Near You Section */}
        <section ref={storesSectionRef} className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  Boutiques populaires près de vous
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Commerçants et artisans vérifiés livrant à <strong>{selectedLocation.ville} ({selectedLocation.quartier})</strong>.
              </p>
            </div>
            <button
              onClick={toggleLocationModal}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Changer de zone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_STORES.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* Featured & Trending Products Grid Section */}
        <section ref={productsSectionRef} className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {selectedCategory ? "Articles filtrés par catégorie" : "Produits tendances au Gabon"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Paiement instantané Airtel / Moov Money et livraison express à votre repère.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Effacer le filtre
                </button>
              )}
              <span className="text-xs font-semibold text-slate-500">
                {filteredProducts.length} produit(s) trouvé(s)
              </span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3 dark:border-slate-800">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Aucun produit ne correspond à votre sélection
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setSelectedProductForModal(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Gabonese Value Proposition Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                L&apos;Engagement Nexora Gabon
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Vous êtes commerçant ou artisan au Gabon ?
              </h3>
              <p className="text-sm text-emerald-100 max-w-xl">
                Ouvrez votre boutique en ligne en 5 minutes, recevez vos paiements directement sur votre compte Airtel Money ou Moov Money, et profitez de notre réseau de livreurs dédiés.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <Link href="/dashboard">
                <Button
                  variant="amber"
                  size="lg"
                  className="font-bold text-sm shadow-xl shadow-amber-500/20"
                >
                  Devenir Vendeur Nexora
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 py-12 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-sm">
                  N
                </div>
                <span className="text-base font-black text-slate-900 dark:text-slate-100">
                  NEXORA GABON
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                La première marketplace multi-vendeurs 100% pensée pour les spécificités logistiques et financières du Gabon.
              </p>
              <div className="flex items-center gap-2 pt-1 text-slate-700 dark:text-slate-300 font-semibold">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Paiements Airtel &amp; Moov intégrés</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 text-xs">
                Zones Desservies (9 Provinces)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>• Estuaire (Libreville, Akanda, Owendo, Ntoum)</li>
                <li>• Ogooué-Maritime (Port-Gentil, Gamba)</li>
                <li>• Haut-Ogooué (Franceville, Moanda)</li>
                <li>• Moyen-Ogooué (Lambaréné)</li>
                <li>• Woleu-Ntem, Ngounié, Nyanga, Ogooué-Ivindo...</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 text-xs">
                Moyens de Paiement
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>💳 Airtel Money (+241 074 / 077)</li>
                <li>📲 Moov Money Flooz (+241 062 / 066)</li>
                <li>💵 Paiement Cash à la livraison</li>
                <li>🏦 Cartes Bancaires (BGFI, UBA, Ecobank, Visa)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 text-xs">
                Assistance &amp; Contact
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>📍 Siège : Quartier Louis, Libreville</li>
                <li>📞 Service Client : +241 077 45 89 12</li>
                <li>✉️ Support : contact@nexora.ga</li>
                <li>🕒 7j/7 de 08h00 à 20h00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Nexora Technologies Gabon. Tous droits réservés.</p>
            <p>Conçu pour l&apos;économie numérique gabonaise 🇬🇦</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bottom Navigation Bar (Mobile-First UX) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-emerald-600"
        >
          <Home className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-semibold">Accueil</span>
        </button>

        <button
          onClick={handleStoresClick}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600"
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Boutiques</span>
        </button>

        <button
          onClick={toggleCart}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 relative"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
              {cartItemsCount}
            </span>
          )}
          <span className="text-[10px] font-semibold">Panier</span>
        </button>

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Espace Pro</span>
        </Link>
      </nav>

      {/* Interactive Modals & Drawers */}
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
