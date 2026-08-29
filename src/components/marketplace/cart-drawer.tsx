"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { useUserStore } from "@/store/use-user-store";
import { formatFCFA } from "@/lib/utils";
import { PAYMENT_METHODS_CONFIG } from "@/lib/constants/gabon-locations";
import { PaymentMethod } from "@/lib/types/marketplace";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
} from "lucide-react";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTotalAmount,
    deliveryFee,
    deliveryLocation,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  const toggleLocationModal = useUserStore((state) => state.toggleLocationModal);

  const [inputPromo, setInputPromo] = React.useState("");
  const [promoError, setPromoError] = React.useState(false);

  const subtotal = getSubtotal();
  const total = getTotalAmount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const success = applyPromoCode(inputPromo);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2500);
    } else {
      setInputPromo("");
    }
  };

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl dark:bg-slate-900 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#065f46]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black italic text-[#111827]">
                  Mon Panier Nexora
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {items.length} {items.length > 1 ? "articles" : "article"} sélectionné{items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items & Settings */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Empty State */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-800">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Votre panier est vide
                </p>
                <p className="text-xs text-slate-500 max-w-[240px]">
                  Ajoutez des produits de nos boutiques gabonaises pour commander.
                </p>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200/80 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="h-16 w-16 rounded-xl object-cover border border-slate-200/60 dark:border-slate-700"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.productTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.storeName}
                        </p>
                        <p className="text-xs font-black italic text-[#065f46] mt-1">
                          {formatFCFA(item.productPrice)}
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="h-5 w-5 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="h-5 w-5 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Location Section */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Lieu de livraison au Gabon</span>
                    </div>
                    <button
                      onClick={toggleLocationModal}
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      Changer
                    </button>
                  </div>

                  {deliveryLocation ? (
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 pl-5">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {deliveryLocation.ville} ({deliveryLocation.quartier})
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        📍 <strong>Repère :</strong> {deliveryLocation.repere_texte || "Non précisé"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 pl-5">
                      Aucune adresse définie
                    </p>
                  )}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Code promo (ex: NEXORA241)"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      className="h-9 text-xs"
                      icon={<Tag className="w-3.5 h-3.5" />}
                    />
                    <Button type="submit" variant="secondary" size="sm" className="h-9 font-semibold text-xs">
                      Appliquer
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-500">
                      Code promo invalide. Essayez avec <strong>NEXORA241</strong>
                    </p>
                  )}
                  {promoCode && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <span>🎉 Code <strong>{promoCode}</strong> appliqué (-{formatFCFA(discountAmount)})</span>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-slate-200/80 bg-slate-50/80 p-5 space-y-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sous-total articles</span>
                  <span>{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Frais de livraison ({deliveryLocation?.ville || "Libreville"})</span>
                  <span>{formatFCFA(deliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Réduction Code Promo</span>
                    <span>-{formatFCFA(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black italic text-[#111827]">
                  <span>Total à régler</span>
                  <span className="text-base font-black italic text-[#065f46]">
                    {formatFCFA(total)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleProceedToCheckout}
                variant="emerald"
                size="lg"
                className="w-full font-bold gap-2 text-sm shadow-md"
              >
                <span>Finaliser la commande</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiements Airtel Money, Moov Flooz &amp; Cash</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
