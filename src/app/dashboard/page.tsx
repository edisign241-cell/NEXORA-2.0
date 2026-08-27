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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/lib/constants/mock-data";
import { formatFCFA } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { role, user } = useUserStore();

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
              {role} ({user.nom} {user.prenom || ""})
            </Badge>
          </div>
        </div>

        {/* Role Switcher Component */}
        <RoleSwitcher />

        {/* Dynamic View rendering based on current role */}
        <section className="transition-all duration-300">
          {role === "vendeur" && <SellerView />}
          {role === "livreur" && <DeliveryView />}
          {role === "admin" && <AdminView />}
          {role === "client" && (
            <div className="space-y-6">
              {/* Client Profile Card */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.nom}
                    className="h-16 w-16 rounded-2xl border-2 border-white/80 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-black">
                      {user.nom} {user.prenom}
                    </h2>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Client vérifié • {user.email} • {user.telephone}
                    </p>
                    <p className="text-xs text-emerald-100 mt-1">
                      📍 {user.location?.ville} ({user.location?.quartier}) — {user.location?.repere_texte}
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
                  {MOCK_ORDERS.map((ord) => (
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
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950">
        Nexora Gabon • Tableau de bord interactif multi-acteurs (Acheteurs, Vendeurs, Livreurs, Administrateurs)
      </footer>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
