"use client";

import * as React from "react";
import { Product } from "@/lib/types/marketplace";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatFCFA } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import {
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Store as StoreIcon,
  MapPin,
  Zap,
  Truck,
  Star,
  Film,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = React.useState(1);
  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  React.useEffect(() => {
    setQuantity(1);
    setActiveMediaIndex(0);
    setIsPlayingVideo(false);
    setAddedAnimation(false);
  }, [product, isOpen]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];
  const hasVideo = Boolean(product.videoUrl);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 800);
  };

  const handleDirectCheckout = () => {
    addItem(product, quantity);
    onClose();
    router.push("/checkout");
  };

  const activePrice = product.prixPromo ?? product.prix;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Badge variant="emerald" className="text-xs uppercase font-bold">
            {product.categorie.replace("_", " ")}
          </Badge>
          {product.prixPromo && (
            <Badge variant="destructive" className="text-xs font-bold bg-rose-600 text-white">
              Promo
            </Badge>
          )}
          {hasVideo && (
            <Badge variant="blue" className="text-xs font-bold gap-1">
              <Film className="w-3 h-3" />
              Vidéo HD
            </Badge>
          )}
        </div>
      }
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
        {/* Left: Media Display (Images + Video) */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center">
            {isPlayingVideo && product.videoUrl ? (
              <video
                src={product.videoUrl}
                controls
                autoPlay
                className="h-full w-full object-contain bg-black"
              />
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={images[activeMediaIndex] || images[0]}
                  alt={product.nom}
                  className="h-full w-full object-cover"
                />

                {hasVideo && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl"
                    title="Lire la vidéo du produit"
                  >
                    <Play className="w-6 h-6 ml-0.5" />
                  </button>
                )}
              </div>
            )}

            {product.stock <= 5 && product.stock > 0 && !isPlayingVideo && (
              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold">
                Plus que {product.stock} en stock !
              </div>
            )}
          </div>

          {/* Thumbnails (Images and Video selector) */}
          <div className="flex gap-2 overflow-x-auto pb-1 items-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveMediaIndex(idx);
                  setIsPlayingVideo(false);
                }}
                className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  !isPlayingVideo && activeMediaIndex === idx
                    ? "border-emerald-600 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}

            {hasVideo && (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 bg-slate-900 flex flex-col items-center justify-center text-white transition-all ${
                  isPlayingVideo
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-slate-300 dark:border-slate-700 opacity-75 hover:opacity-100"
                }`}
                title="Regarder la vidéo"
              >
                <Play className="w-4 h-4 text-amber-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 text-slate-300">
                  Vidéo
                </span>
              </button>
            )}
          </div>

          {/* Store Info Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {product.storeName}
                </span>
              </div>
              <Link
                href={`/boutique/${product.storeId}`}
                onClick={onClose}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Voir la boutique →
              </Link>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Livré par coursier certifié Nexora (25-45 min)</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1 text-[#d97706] text-xs font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} avis)</span>
              </div>
              <h2 className="text-xl font-black italic text-[#111827] tracking-tight leading-snug">
                {product.nom}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black italic text-[#065f46]">
                  {formatFCFA(activePrice)}
                </span>
                {product.prixPromo && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatFCFA(product.prix)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {product.description}
            </p>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    ★ {b}
                  </span>
                ))}
              </div>
            )}

            {/* Delivery Highlights */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 space-y-2 text-xs border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Livraison Express à Libreville, Akanda &amp; Owendo</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Paiements acceptés : Airtel Money, Moov Money, Cash</span>
              </div>
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Quantité :
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-slate-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="w-full gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-500 font-bold text-xs"
              >
                {addedAnimation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ajouté !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ajouter au Panier</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleDirectCheckout}
                variant="emerald"
                className="w-full font-bold text-xs shadow-md shadow-emerald-600/20 gap-1.5"
              >
                <span>Commander</span>
                <span className="opacity-90">({formatFCFA(activePrice * quantity)})</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
