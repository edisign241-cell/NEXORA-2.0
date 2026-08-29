"use client";

import * as React from "react";
import { Product } from "@/lib/types/marketplace";
import { useCartStore } from "@/store/use-cart-store";
import { formatFCFA } from "@/lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Check, Star, Zap, Store as StoreIcon, Eye } from "lucide-react";

export function ProductCard({
  product,
  onOpenQuickView,
}: {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const discountPercent = product.prixPromo
    ? Math.round(((product.prix - product.prixPromo) / product.prix) * 100)
    : 0;

  const activePrice = product.prixPromo ?? product.prix;

  return (
    <Card
      onClick={() => onOpenQuickView && onOpenQuickView(product)}
      className="group cursor-pointer overflow-hidden border-slate-200/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white dark:bg-slate-900"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.nom}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            Aperçu rapide
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <Badge
              variant="destructive"
              className="font-bold text-[9px] sm:text-[10px] uppercase shadow-sm bg-rose-600 text-white px-1.5 sm:px-2 py-0.5"
            >
              -{discountPercent}%
            </Badge>
          )}
          {product.badges && product.badges.length > 0 && (
            <Badge
              variant="emerald"
              className="font-bold text-[9px] sm:text-[10px] shadow-sm bg-emerald-600 text-white border-none px-1.5 sm:px-2 py-0.5"
            >
              {product.badges[0]}
            </Badge>
          )}
        </div>

        {/* Express Delivery Badge */}
        {product.isAvailableForExpressDelivery && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-300 backdrop-blur-md">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-amber-400" />
              Express
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Store Name */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 mb-0.5 sm:mb-1">
            <StoreIcon className="w-3 h-3 text-[#065f46] shrink-0" />
            <span className="truncate">{product.storeName}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-black italic text-xs sm:text-sm text-[#111827] line-clamp-2 group-hover:text-[#065f46] transition-colors leading-tight sm:leading-snug">
            {product.nom}
          </h3>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <div className="flex items-center gap-1 text-[#d97706] font-bold text-[11px] sm:text-xs">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">
              ({product.reviewsCount})
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-[#065f46] truncate max-w-[80px] sm:max-w-none text-right">
            {product.stock > 0 ? `En stock (${product.stock})` : "Sur commande"}
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-black italic text-[#111827]">
                {formatFCFA(activePrice)}
              </span>
            </div>
            {product.prixPromo && (
              <span className="text-[9px] sm:text-[11px] font-medium text-slate-400 line-through">
                {formatFCFA(product.prix)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            variant={isAdded ? "emerald" : "default"}
            size="sm"
            className="rounded-xl px-2 sm:px-3 h-7 sm:h-8 font-semibold gap-1 transition-all active:scale-95 shadow-sm text-xs"
            aria-label="Ajouter au panier"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline text-xs">Ajouté</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Ajouter</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
