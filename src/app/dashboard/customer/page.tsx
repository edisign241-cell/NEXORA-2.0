"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { UserDrawer } from "@/components/navigation/UserDrawer";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserStore } from "@/store/use-user-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import {
  ShoppingBag,
  Truck,
  Heart,
  Wallet,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  PackageOpen,
  ArrowRight,
  User,
  CreditCard,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Receipt,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { user, profile } = useAuth();
  const { selectedLocation } = useUserStore();
  const [activeTab, setActiveTab] = useState<"orders" | "tracking" | "favorites" | "wallet">("orders");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Client VIP";
  const displayEmail = profile?.email || user?.email || "client@nexora.ga";
  const displayPhone = profile?.phone || user?.user_metadata?.phone || "+241 077 00 00 00";

  // Mock initial demo orders if database empty
  const defaultOrders = [
    {
      id: "ord-1",
      orderNumber: "NEX-241-8902",
      date: "Aujourd'hui à 14:15",
      status: "in_delivery",
      statusLabel: "En cours de livraison",
      statusBadge: "blue" as const,
      storeName: "Saveurs & Terroir du Gabon",
      storePhone: "+241 077 45 89 12",
      courierName: "Patrick Ondo (Moto Express)",
      courierPhone: "+241 066 98 76 54",
      items: [
        { name: "Chocolat Noir Kango 85%", qty: 2, price: 9900 },
        { name: "Miel pur de Makokou 500g", qty: 1, price: 6500 },
      ],
      totalAmount: 26300,
      deliveryFee: 2000,
      paymentMethod: "Airtel Money",
      location: {
        district: selectedLocation.quartier || "Batterie 4",
        city: "Libreville",
        landmark: selectedLocation.repere_texte || "Face ancienne mairie, portail noir",
      },
      eta: "15-20 min",
    },
    {
      id: "ord-2",
      orderNumber: "NEX-241-7651",
      date: "Hier à 11:30",
      status: "completed",
      statusLabel: "Livré avec succès",
      statusBadge: "emerald" as const,
      storeName: "Boutique Prestige Wax",
      storePhone: "+241 066 12 34 56",
      courierName: "Brice Mba",
      courierPhone: "+241 074 11 22 33",
      items: [
        { name: "Chemise Wax Royale Homme (Taille L)", qty: 1, price: 28000 },
      ],
      totalAmount: 30000,
      deliveryFee: 2000,
      paymentMethod: "Moov Money",
      location: {
        district: "Louis",
        city: "Libreville",
        landmark: "Derrière pharmacie des cocotiers",
      },
      eta: "Livré",
    },
  ];

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setOrders(defaultOrders);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await (supabase.from("orders") as any)
          .select("*, stores(name, phone), order_items(*)")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setOrders(
            data.map((o: any) => ({
              id: o.id,
              orderNumber: `NEX-241-${o.id.slice(0, 4).toUpperCase()}`,
              date: new Date(o.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
              status: o.status,
              statusLabel: o.status === "completed" ? "Livré avec succès" : o.status === "delivering" ? "En cours de livraison" : "En préparation",
              statusBadge: o.status === "completed" ? "emerald" : o.status === "delivering" ? "blue" : "amber",
              storeName: o.stores?.name || "Boutique Officielle",
              storePhone: o.stores?.phone || "+241 077 00 00 00",
              courierName: "Coursier Assigné",
              courierPhone: "+241 066 00 00 00",
              items: (o.order_items || []).map((i: any) => ({
                name: "Article commandé",
                qty: i.quantity,
                price: i.unit_price_xaf,
              })),
              totalAmount: o.total_amount_xaf,
              deliveryFee: o.delivery_fee_xaf,
              paymentMethod: o.payment_method === "airtel_money" ? "Airtel Money" : o.payment_method === "moov_money" ? "Moov Money" : "Espèces",
              location: {
                district: o.delivery_district || "Libreville",
                city: o.delivery_city || "Libreville",
                landmark: o.delivery_address_landmark || "Repère visuel",
              },
            }))
          );
        } else {
          setOrders(defaultOrders);
        }
      } catch (e) {
        setOrders(defaultOrders);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const activeTrackingOrder = orders.find((o) => o.status === "in_delivery" || o.status === "delivering") || orders[0];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-6 sm:space-y-8">
        {/* Customer Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#064e3b] to-[#065f46] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 sm:gap-5 z-10">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl text-white shadow-inner shrink-0">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="emerald" className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                  Client VIP Nexora
                </Badge>
                <span className="text-xs text-emerald-300 font-mono">ID: #{user?.id?.slice(0, 6) || "241-VIP"}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black italic text-white tracking-tight mt-1">
                Bienvenue, {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{selectedLocation.quartier}, {selectedLocation.ville} — {selectedLocation.repere_texte || "Point de repère personnalisé"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Link href="/#catalogue">
              <Button variant="amber" size="sm" className="font-bold text-xs gap-1.5 h-10 px-4">
                <ShoppingBag className="w-4 h-4" />
                <span>Faire des achats</span>
              </Button>
            </Link>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="outline"
              size="sm"
              className="font-bold text-xs gap-1.5 h-10 px-4 text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
              <User className="w-4 h-4" />
              <span>Mon Profil &amp; Menu</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black italic text-xs transition-all shrink-0 ${
              activeTab === "orders"
                ? "bg-[#065f46] text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mes Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black italic text-xs transition-all shrink-0 ${
              activeTab === "tracking"
                ? "bg-[#065f46] text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Suivi de Livraison en Direct</span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black italic text-xs transition-all shrink-0 ${
              activeTab === "favorites"
                ? "bg-[#065f46] text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favoris &amp; Boutiques Coup de Cœur</span>
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black italic text-xs transition-all shrink-0 ${
              activeTab === "wallet"
                ? "bg-[#065f46] text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portefeuille &amp; Mobile Money</span>
          </button>
        </div>

        {/* TAB 1: MES COMMANDES */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="border-slate-200 bg-white p-12 text-center space-y-3 rounded-2xl">
                <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Vous n&apos;avez aucune commande enregistrée</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Découvrez les meilleurs marchands du Gabon et commandez avec livraison directe à votre repère.
                </p>
                <Link href="/#catalogue">
                  <Button variant="emerald" size="sm" className="font-bold text-xs mt-2">
                    Explorer la Marketplace
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((ord) => (
                  <Card key={ord.id} className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 transition-all">
                    <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#111827]">{ord.orderNumber}</span>
                          <Badge variant={ord.statusBadge} className="text-[10px] font-bold">
                            {ord.statusLabel}
                          </Badge>
                          <span className="text-xs text-slate-400 font-medium">• {ord.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Boutique : <strong className="text-slate-900">{ord.storeName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-lg font-black text-[#065f46]">{formatFCFA(ord.totalAmount)}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Paiement : {ord.paymentMethod}</p>
                        </div>
                        <Button
                          onClick={() => setActiveTab("tracking")}
                          variant="outline"
                          size="sm"
                          className="h-9 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Suivre le colis</span>
                        </Button>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Articles commandés
                        </span>
                        <ul className="space-y-1">
                          {ord.items.map((it: any, idx: number) => (
                            <li key={idx} className="flex items-center justify-between text-slate-700">
                              <span>• {it.name} (x{it.qty})</span>
                              <span className="font-semibold">{formatFCFA(it.price * it.qty)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Point de livraison au Gabon
                        </span>
                        <p className="text-slate-800 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ord.location.district}, {ord.location.city}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          Repère : {ord.location.landmark}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUIVI DE LIVRAISON EN DIRECT */}
        {activeTab === "tracking" && activeTrackingOrder && (
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 p-5 bg-gradient-to-r from-slate-900 to-[#064e3b] text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Badge variant="blue" className="text-[10px] uppercase font-bold mb-1">
                    Course en Direct
                  </Badge>
                  <CardTitle className="text-base font-black italic text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <span>Commande {activeTrackingOrder.orderNumber}</span>
                  </CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 uppercase">Temps d&apos;arrivée estimé</span>
                  <p className="text-lg font-black text-amber-400">{activeTrackingOrder.eta}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Stepper Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-emerald-900">1. Commande Validée</p>
                    <p className="text-[10px] text-emerald-700">Paiement confirmé par la boutique</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-xs text-blue-900">2. En cours d&apos;acheminement</p>
                    <p className="text-[10px] text-blue-700">Livreur en route vers votre repère</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 opacity-60">
                  <div className="h-6 w-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-700">3. Remise en main propre</p>
                    <p className="text-[10px] text-slate-500">Validation par code OTP</p>
                  </div>
                </div>
              </div>

              {/* Courier Contact Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                    PO
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-300">Livreur Assigné</span>
                    <h4 className="font-black text-sm text-white">{activeTrackingOrder.courierName}</h4>
                    <p className="text-xs text-slate-300 font-mono">{activeTrackingOrder.courierPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${activeTrackingOrder.courierPhone}`}>
                    <Button variant="emerald" size="sm" className="font-bold text-xs gap-1.5 h-9">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appeler le livreur</span>
                    </Button>
                  </a>
                  <a href={`https://wa.me/${activeTrackingOrder.courierPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5 h-9 text-emerald-400 border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: FAVORIS */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 bg-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="amber" className="text-[10px] font-bold">Boutique Vérifiée</Badge>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 cursor-pointer" />
              </div>
              <h4 className="font-black text-base italic text-slate-900">Saveurs &amp; Terroir du Gabon</h4>
              <p className="text-xs text-slate-500">Chocolat de Kango, Miel de Makokou, Épicerie fine gabonaise.</p>
              <Link href="/boutique/saveurs-du-gabon">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold mt-2">
                  Visiter la boutique
                </Button>
              </Link>
            </Card>

            <Card className="border-slate-200 bg-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="emerald" className="text-[10px] font-bold">Mode &amp; Wax</Badge>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 cursor-pointer" />
              </div>
              <h4 className="font-black text-base italic text-slate-900">Boutique Prestige Wax Libreville</h4>
              <p className="text-xs text-slate-500">Tenues de cérémonie, prêt-à-porter wax et accessoires sur mesure.</p>
              <Link href="/boutique/prestige-wax">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold mt-2">
                  Visiter la boutique
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* TAB 4: WALLET & MOBILE MONEY */}
        {activeTab === "wallet" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Solde Cashback &amp; Remboursements</span>
              <p className="text-3xl font-black text-[#065f46]">4 500 FCFA</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ce solde est automatiquement déductible lors de vos prochaines commandes sur les boutiques participantes.
              </p>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-4">
              <h3 className="font-black text-base italic text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Comptes Mobile Money Associés</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900">Airtel Money Gabon</span>
                    <p className="font-mono text-slate-700">{displayPhone}</p>
                  </div>
                  <Badge variant="emerald" className="text-[10px]">Actif</Badge>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-900">Moov Money Gabon</span>
                    <p className="font-mono text-slate-700">+241 066 12 34 56</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Configuré</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Slide-over User Drawer */}
      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <CartDrawer />
      <LocationModal />
    </div>
  );
}
