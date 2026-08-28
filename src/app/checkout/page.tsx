"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { useUserStore } from "@/store/use-user-store";
import { formatFCFA } from "@/lib/utils";
import { GABON_PROVINCES, ProvinceData } from "@/lib/constants/gabon-locations";
import { PaymentMethod } from "@/lib/types/marketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/marketplace/navbar";
import { PaymentModal } from "@/components/marketplace/payment-modal";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  Sparkles,
  PlusCircle,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const {
    items,
    getSubtotal,
    getTotalAmount,
    discountAmount,
    deliveryFee,
    promoCode,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCartStore();

  const { user, selectedLocation, setLocation } = useUserStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Recipient form state
  const [fullName, setFullName] = React.useState(user?.nom || "Ndong Mba Marc");
  const [phone, setPhone] = React.useState(selectedLocation?.telephone || "+241 077 45 89 12");
  const [provinceId, setProvinceId] = React.useState("estuaire");
  const [villeName, setVilleName] = React.useState(selectedLocation?.ville || "Libreville");
  const [quartierName, setQuartierName] = React.useState(selectedLocation?.quartier || "Nzeng-Ayong");
  const [isCustomDistrict, setIsCustomDistrict] = React.useState(false);
  const [customDistrictName, setCustomDistrictName] = React.useState("");
  const [landmark, setLandmark] = React.useState(
    selectedLocation?.repere_texte || "Face pharmacie de Nzeng-Ayong, grand portail vert à 50m du carrefour GP"
  );
  const [instructions, setInstructions] = React.useState("Appeler dès que vous arrivez au carrefour");

  // Payment state
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentMethod>("airtel_money");
  const [mobileMoneyPhone, setMobileMoneyPhone] = React.useState(phone);
  const [enteredPromo, setEnteredPromo] = React.useState("");
  const [promoError, setPromoError] = React.useState("");
  const [promoSuccess, setPromoSuccess] = React.useState("");

  // Processing & Success
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [orderConfirmed, setOrderConfirmed] = React.useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = React.useState("");

  // Transactional USSD Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [activeTransaction, setActiveTransaction] = React.useState<{
    orderId: string;
    amount: number;
    phone: string;
    operator: "airtel" | "moov";
    requestId: string;
    promptInstructions?: string;
  } | null>(null);

  const subtotal = mounted ? getSubtotal() : 0;
  const discount = mounted ? discountAmount : 0;
  const fee = mounted ? (promoCode === "NEXORA241" ? 0 : deliveryFee) : 2000;
  const finalTotal = mounted ? Math.max(0, subtotal + fee - discount) : 0;

  const currentProvince =
    GABON_PROVINCES.find((p: ProvinceData) => p.id === provinceId) || GABON_PROVINCES[0];
  const currentVille =
    currentProvince.villes.find((v) => v.nom === villeName) || currentProvince.villes[0];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPromo.trim()) return;
    const success = applyPromoCode(enteredPromo.trim());
    if (success) {
      setPromoSuccess(`Code ${enteredPromo.toUpperCase()} appliqué avec succès !`);
      setPromoError("");
    } else {
      setPromoError("Code promotionnel invalide. Essayez NEXORA241");
      setPromoSuccess("");
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setProvinceId(newId);
    const prov = GABON_PROVINCES.find((p: ProvinceData) => p.id === newId);
    if (prov && prov.villes.length > 0) {
      setVilleName(prov.villes[0].nom);
      setQuartierName(prov.villes[0].quartiers[0] || "Centre");
      setIsCustomDistrict(false);
    }
  };

  const handleVilleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVille = e.target.value;
    setVilleName(newVille);
    const v = currentProvince.villes.find((item) => item.nom === newVille);
    if (v && v.quartiers.length > 0) {
      setQuartierName(v.quartiers[0]);
      setIsCustomDistrict(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);

    const targetQuartier = isCustomDistrict
      ? customDistrictName.trim() || "Quartier non précisé"
      : quartierName;

    // Sync to user store
    setLocation({
      province: currentProvince.nom,
      ville: villeName,
      quartier: targetQuartier,
      repere_texte: landmark.trim(),
      telephone: phone.trim(),
    });

    const generatedId = `NX-LBV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (selectedPayment === "airtel_money" || selectedPayment === "moov_money") {
      const operator = selectedPayment === "airtel_money" ? "airtel" : "moov";
      try {
        const res = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: generatedId,
            phone: mobileMoneyPhone.trim() || phone.trim(),
            operator,
            amount: finalTotal,
            idempotencyKey: `${generatedId}-${operator}-${finalTotal}`,
          }),
        });

        const data = await res.json();
        setIsProcessing(false);

        if (data.success) {
          setActiveTransaction({
            orderId: generatedId,
            amount: finalTotal,
            phone: mobileMoneyPhone.trim() || phone.trim(),
            operator,
            requestId: data.requestId,
            promptInstructions: data.promptInstructions,
          });
          setIsPaymentModalOpen(true);
        } else {
          alert(`Erreur d'initiation du paiement: ${data.error || "Veuillez réessayer"}`);
        }
      } catch (err) {
        console.error("Erreur API initiate:", err);
        setIsProcessing(false);
        alert("Impossible de contacter la passerelle de paiement Mobile Money.");
      }
    } else {
      // Cash on delivery
      setTimeout(() => {
        setIsProcessing(false);
        setConfirmedOrderId(generatedId);
        setOrderConfirmed(true);
        clearCart();
      }, 1200);
    }
  };

  const handlePaymentSuccess = (transaction: {
    requestId: string;
    orderId: string;
    operator: string;
    amount: number;
  }) => {
    setIsPaymentModalOpen(false);
    setConfirmedOrderId(transaction.orderId);
    setOrderConfirmed(true);
    clearCart();
  };

  // If order is confirmed, show Success Receipt View
  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center space-y-6">
            {/* Top Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge variant="emerald" className="text-xs uppercase font-bold px-3 py-1">
                🇬🇦 Commande Validée avec Succès
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
                Merci pour votre confiance !
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Votre commande a été transmise aux commerçants et un coursier a été assigné pour votre livraison.
              </p>
            </div>

            {/* Tracking Reference Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-4 dark:border-emerald-800/30 dark:bg-emerald-950/30 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Numéro de suivi Nexora
                  </p>
                  <p className="font-mono text-base font-black text-emerald-700 dark:text-emerald-300">
                    {confirmedOrderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Délai estimé
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    25 à 45 minutes
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Destination : </span>
                    <span>{villeName} ({isCustomDistrict ? customDistrictName : quartierName})</span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      📍 Repère : {landmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Contact : </span>
                    <span>{phone} ({fullName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Paiement : </span>
                    <span className="capitalize font-semibold text-emerald-700 dark:text-emerald-300">
                      {selectedPayment.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coursier Notification Box */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 text-left text-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                YO
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Coursier : Yannick Obame (Moto Express 241)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Il vous appellera à l&apos;arrivée au point de repère.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full font-semibold"
              >
                Suivre dans mon espace
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="emerald"
                className="w-full font-bold shadow-md shadow-emerald-600/20"
              >
                Continuer mes achats
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (mounted && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Votre panier est vide
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            Découvrez les meilleures boutiques de Libreville et ajoutez vos articles préférés.
          </p>
          <Button onClick={() => router.push("/")} variant="emerald" className="font-bold gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Explorer la Marketplace</span>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-emerald-600 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black italic text-[#111827] tracking-tight">
                Finaliser votre commande
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Livraison à votre repère &amp; paiements locaux au Gabon
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Form & Payment Choice (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Coordonnées & Destinataire */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#065f46] text-white font-bold text-xs">
                  1
                </div>
                <h2 className="text-base font-black italic text-[#111827]">
                  Coordonnées du destinataire
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom & Prénom"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Marc Ndong Mba"
                />

                <Input
                  label="Numéro de téléphone joignable (Airtel / Moov)"
                  type="tel"
                  required
                  icon={<Phone className="w-4 h-4" />}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (selectedPayment === "airtel_money" || selectedPayment === "moov_money") {
                      setMobileMoneyPhone(e.target.value);
                    }
                  }}
                  placeholder="+241 077 00 00 00"
                />
              </div>
            </div>

            {/* Step 2: Zone de Livraison & Repère au Gabon */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#065f46] text-white font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-base font-black italic text-[#111827]">
                    Adresse &amp; Point de Repère précis
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Essentiel au Gabon pour que le livreur arrive directement chez vous
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Province (Gabon)"
                  value={provinceId}
                  onChange={handleProvinceChange}
                >
                  {GABON_PROVINCES.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.code} - {prov.nom} ({prov.chefLieu})
                    </option>
                  ))}
                </Select>

                <Select
                  label="Ville / Commune"
                  value={villeName}
                  onChange={handleVilleChange}
                >
                  {currentProvince.villes.map((ville) => (
                    <option key={ville.nom} value={ville.nom}>
                      {ville.nom} {ville.isChefLieu ? "★" : ""}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Quartier selection or Custom input */}
              <div>
                {!isCustomDistrict ? (
                  <div className="space-y-1.5">
                    <Select
                      label="Quartier / Secteur"
                      value={quartierName}
                      onChange={(e) => setQuartierName(e.target.value)}
                    >
                      {currentVille?.quartiers.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </Select>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDistrict(true);
                        setCustomDistrictName("");
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#065f46] hover:text-[#10b981] font-medium underline pt-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Mon quartier n&apos;apparaît pas dans la liste
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-50/40 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#065f46] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Saisie manuelle du quartier
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomDistrict(false)}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Revenir à la liste
                      </button>
                    </div>
                    <Input
                      label="Nom de votre quartier ou zone"
                      type="text"
                      required
                      value={customDistrictName}
                      onChange={(e) => setCustomDistrictName(e.target.value)}
                      placeholder="Ex : Derrière la prison, Camp de Police, PK 12..."
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Point de repère précis (Obligatoire) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Point de repère précis (Champ Obligatoire) <span className="text-[#065f46]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Ex : Barrière blanche en face de la pharmacie de Nzeng-Ayong, grand manguier à 50m après le carrefour GP..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#111827] placeholder:text-slate-400 focus:border-[#10b981] focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 font-medium"
                />
                <p className="text-[11px] text-slate-500 font-medium">
                  💡 Donnez des détails visuels (couleur de portail, commerce voisin, carrefour) pour une livraison sans appel d&apos;orientation.
                </p>
              </div>

              <Input
                label="Instructions complémentaires pour le livreur (Optionnel)"
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex : Appeler dès que vous arrivez au carrefour, sonner à la barrière..."
              />
            </div>

            {/* Step 3: Mode de Paiement au Gabon */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#065f46] text-white font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-base font-black italic text-[#111827]">
                    Mode de Paiement Sécurisé
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Paiements directs via Mobile Money ou Cash à la livraison
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Airtel Money */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("airtel_money")}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPayment === "airtel_money"
                      ? "border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/30 shadow-md"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black italic bg-rose-600 text-white uppercase">
                      Airtel Money
                    </span>
                    {selectedPayment === "airtel_money" && (
                      <CheckCircle2 className="w-4 h-4 text-rose-600 fill-rose-100" />
                    )}
                  </div>
                  <div>
                    <p className="font-black italic text-xs sm:text-sm text-[#111827]">
                      Airtel Gabon
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      Invite USSD push sur votre mobile (+241)
                    </p>
                  </div>
                </button>

                {/* Moov Money */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("moov_money")}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPayment === "moov_money"
                      ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/30 shadow-md"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black italic bg-blue-600 text-white uppercase">
                      Moov Flooz
                    </span>
                    {selectedPayment === "moov_money" && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                    )}
                  </div>
                  <div>
                    <p className="font-black italic text-xs sm:text-sm text-[#111827]">
                      Moov Money
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      Validation par code secret Moov Flooz
                    </p>
                  </div>
                </button>

                {/* Cash à la livraison */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("cash_on_delivery")}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPayment === "cash_on_delivery"
                      ? "border-[#065f46] bg-emerald-50/70 ring-2 ring-[#065f46]/30 shadow-md"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black italic bg-[#065f46] text-white uppercase">
                      Espèces
                    </span>
                    {selectedPayment === "cash_on_delivery" && (
                      <CheckCircle2 className="w-4 h-4 text-[#065f46] fill-emerald-100" />
                    )}
                  </div>
                  <div>
                    <p className="font-black italic text-xs sm:text-sm text-[#111827]">
                      Cash Livraison
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      Payez directement le coursier en main propre
                    </p>
                  </div>
                </button>
              </div>

              {/* Mobile Money Prompt Input */}
              {(selectedPayment === "airtel_money" || selectedPayment === "moov_money") && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Numéro de compte {selectedPayment === "airtel_money" ? "Airtel Money" : "Moov Money"} à débiter :
                  </label>
                  <Input
                    type="tel"
                    required
                    icon={<Smartphone className="w-4 h-4" />}
                    value={mobileMoneyPhone}
                    onChange={(e) => setMobileMoneyPhone(e.target.value)}
                    placeholder="+241 077 00 00 00"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    📲 Dès que vous cliquerez sur &quot;Confirmer la commande&quot;, une invite de validation automatique apparaîtra sur votre téléphone pour saisir votre code PIN secret.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-lg space-y-5">
              <h3 className="text-base font-black italic text-[#111827] flex items-center justify-between">
                <span>Récapitulatif de votre panier</span>
                <Badge variant="emerald" className="text-xs font-bold">
                  {mounted ? items.length : 0} article(s)
                </Badge>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1 space-y-2">
                {mounted &&
                  items.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center gap-3">
                      <img
                        src={item.productImage || "/placeholder.jpg"}
                        alt={item.productTitle}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#111827] truncate">
                          {item.productTitle}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate font-medium">
                          Qté : {item.quantity} × {formatFCFA(item.productPrice)}
                        </p>
                      </div>
                      <span className="font-black italic text-xs text-[#065f46]">
                        {formatFCFA(item.productPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Code promotionnel Gabon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={enteredPromo}
                    onChange={(e) => setEnteredPromo(e.target.value.toUpperCase())}
                    placeholder="Ex : NEXORA241"
                    className="w-full uppercase rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:border-[#10b981] focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={handleApplyPromo}
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                  >
                    Appliquer
                  </Button>
                </div>

                {promoSuccess && (
                  <p className="text-xs font-medium text-[#065f46] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {promoSuccess}
                  </p>
                )}
                {promoError && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {promoError}
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total articles :</span>
                  <span className="font-semibold text-[#111827]">
                    {formatFCFA(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#065f46] font-semibold">
                    <span>Remise promotionnelle :</span>
                    <span>-{formatFCFA(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    Frais de livraison express :
                    <span className="text-[10px] text-slate-400">({villeName})</span>
                  </span>
                  <span className="font-semibold text-[#111827]">
                    {fee === 0 ? (
                      <span className="text-[#065f46] font-bold uppercase">Gratuit</span>
                    ) : (
                      formatFCFA(fee)
                    )}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-sm font-black italic text-[#111827]">
                      Total TTC à payer
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">Devise officielle FCFA (XAF)</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-black italic text-[#065f46]">
                    {formatFCFA(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isProcessing}
                variant="emerald"
                size="lg"
                className="w-full font-black text-sm sm:text-base py-3 shadow-xl shadow-emerald-600/30 gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Traitement du paiement en cours...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirmer la commande ({formatFCFA(finalTotal)})</span>
                  </>
                )}
              </Button>

              {/* Guarantees Badge */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 text-center">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  🔒 Transaction 100% Sécurisée au Gabon
                </p>
                <p>
                  Remboursement garanti si votre colis n&apos;est pas livré à votre repère.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Mobile Money USSD Push & Status Polling Modal */}
      {activeTransaction && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderId={activeTransaction.orderId}
          amount={activeTransaction.amount}
          phone={activeTransaction.phone}
          operator={activeTransaction.operator}
          requestId={activeTransaction.requestId}
          promptInstructions={activeTransaction.promptInstructions}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
