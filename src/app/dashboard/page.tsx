"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import { SellerView } from "@/components/dashboard/seller-view";
import { DeliveryView } from "@/components/dashboard/delivery-view";
import { AdminView } from "@/components/dashboard/admin-view";
import { useUserStore } from "@/store/use-user-store";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";
import { Order } from "@/lib/types/marketplace";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  CheckCircle2,
  PackageOpen,
  User as UserIcon,
} from "lucide-react";

export default function DashboardPage() {
  const { role: storeRole, selectedLocation } = useUserStore();
  const { user: authUser, profile } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  const activeRole = profile?.role || storeRole || "client";
  const displayName = profile?.full_name || authUser?.user_metadata?.full_name || "Utilisateur Nexora";
  const displayEmail = profile?.email || authUser?.email || "Non renseigné";
  const displayPhone = profile?.phone || authUser?.user_metadata?.phone || "Non renseigné";

  React.useEffect(() => {
    async function loadClientOrders() {
      if (!authUser) {
        setOrders([]);
        setIsLoadingOrders(false);
        return;
      }
      setIsLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("customer_id", authUser.id)
          .order("created_at", { ascending: false });

        if (data && !error) {
          const mapped: Order[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: `NEX-241-${o.id.slice(0, 6).toUpperCase()}`,
            clientId: o.customer_id,
            clientName: displayName,
            clientPhone: o.delivery_phone || displayPhone,
            storeIds: [o.store_id],
            items: (o.order_items || []).map((i: any) => ({
              id: i.id,
              productId: i.product_id,
              productTitle: "Article",
              productPrice: i.unit_price_xaf,
              productImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
              quantity: i.quantity,
              storeId: o.store_id,
              storeName: "Boutique",
            })),
            subtotalAmount: o.total_amount_xaf - o.delivery_fee_xaf,
            deliveryFee: o.delivery_fee_xaf,
            totalAmount: o.total_amount_xaf,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status === "paid" ? "paid" : "pending",
            status: o.status === "completed" ? "delivered" : "pending",
            deliveryLocation: {
              province: "Estuaire",
              ville: o.delivery_city || "Libreville",
              quartier: o.delivery_district || "Quartier",
              repere_texte: o.delivery_address_landmark || "Repère visuel",
            },
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadClientOrders();
  }, [authUser, displayName, displayPhone]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à la Marketplace</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">/</span>
              <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Espace Multi-Rôles Nexora
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Connecté en tant que :</span>
            <Badge variant="emerald" className="capitalize font-bold text-xs">
              {activeRole} ({displayName})
            </Badge>
          </div>
        </div>

        {/* Role Switcher Component */}
        <RoleSwitcher />

        {/* Dynamic View rendering based on current role */}
        <section className="transition-all duration-300">
          {(activeRole === "vendeur" || activeRole === "vendor") && <SellerView />}
          {(activeRole === "livreur" || activeRole === "courier") && <DeliveryView />}
          {activeRole === "admin" && <AdminView />}
          {(activeRole === "client" || activeRole === "customer") && (
            <div className="space-y-6">
              {/* Client Profile Card */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl border-2 border-white/80 bg-emerald-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black">
                      {displayName}
                    </h2>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Compte Client • {displayEmail} • {displayPhone}
                    </p>
                    <p className="text-xs text-emerald-100 mt-1">
                      📍 {selectedLocation.ville} ({selectedLocation.quartier}) — {selectedLocation.repere_texte}
                    </p>
                  </div>
                </div>

                <Link href="/">
                  <Button variant="amber" size="sm" className="font-bold">
                    Faire des achats
                  </Button>
                </Link>
              </div>

              {/* Client Orders History */}
              <Card className="border-slate-200/80">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>Mes Commandes Récentes au Gabon</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <PackageOpen className="w-10 h-10 text-slate-400 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        Aucune commande en cours
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Vos commandes passées sur les boutiques de Libreville et des provinces s&apos;afficheront ici avec le suivi en direct.
                      </p>
                      <Link href="/">
                        <Button size="sm" className="bg-[#065f46] hover:bg-[#044e3a] text-white text-xs font-bold mt-2">
                          Découvrir les boutiques
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold">
                              {ord.orderNumber}
                            </span>
                            <Badge
                              variant={
                                ord.status === "in_delivery"
                                  ? "blue"
                                  : ord.status === "confirmed"
                                  ? "amber"
                                  : "emerald"
                              }
                              className="text-[10px] capitalize"
                            >
                              {ord.status === "in_delivery"
                                ? "En cours de livraison"
                                : ord.status === "confirmed"
                                ? "Payé - Préparation"
                                : "Livré"}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {new Date(ord.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            {ord.items.map((i) => i.productTitle).join(", ")}
                          </div>

                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Livraison à : {ord.deliveryLocation.quartier}, {ord.deliveryLocation.ville} ({ord.deliveryLocation.repere_texte})
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            {formatFCFA(ord.totalAmount)}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Payé via {ord.paymentMethod}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950">
        Nexora Gabon • Tableau de bord multi-acteurs (Clients, Vendeurs, Livreurs, Administrateurs)
      </footer>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
