"use client";

import * as React from "react";
import Link from "next/link";
import { formatFCFA } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Order } from "@/lib/types/marketplace";
import {
  TrendingUp,
  PackageCheck,
  ShoppingBag,
  Star,
  Plus,
  Phone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Film,
  Image as ImageIcon,
  PackageOpen,
} from "lucide-react";

export function SellerView() {
  const [orders, setOrders] = React.useState<Order[]>([]);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: nextStatus as any } : ord
      )
    );
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#065f46] via-[#047857] to-[#064e3b] p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl border-2 border-white/80 bg-emerald-950 flex items-center justify-center font-bold text-2xl shadow-md">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black italic">Espace Marchand Officiel</h2>
              <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-black italic uppercase tracking-wider backdrop-blur-md">
                Certifié Gabon Pro
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5 font-medium">
              📍 Marketplace Nationale du Gabon • Gestion des commandes et catalogues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/vendor">
            <Button
              variant="default"
              size="sm"
              className="bg-slate-950 text-white hover:bg-slate-900 gap-1.5 font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Gérer Produits &amp; Médias (Photos/Vidéos)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Chiffre d&apos;Affaires</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#065f46]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            {formatFCFA(totalSales)}
          </p>
          <span className="text-[10px] font-semibold text-[#065f46] mt-1 inline-block">
            Ventes en direct
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Commandes Reçues</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            {orders.length}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
            En production
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Boutique Live</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#d97706]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            Actif
          </p>
          <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
            Paiements Airtel / Moov
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Note Client</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#d97706]">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            5.0 / 5
          </p>
          <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
            Avis vérifiés
          </span>
        </Card>
      </div>

      {/* Orders Management Table */}
      <Card className="border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <CardTitle className="text-base font-black italic text-[#111827]">Commandes Récentes à Traiter</CardTitle>
            <p className="text-xs text-slate-500 font-medium">
              Préparez les colis pour la collecte par les coursiers Nexora.
            </p>
          </div>
          <Badge variant="outline">{orders.length} en attente</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <PackageOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Aucune commande à traiter pour le moment
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Les nouvelles commandes passées par les acheteurs apparaîtront ici instantanément avec les repères de livraison.
              </p>
              <Link href="/dashboard/vendor">
                <Button size="sm" className="bg-[#065f46] hover:bg-[#044e3a] text-white text-xs font-bold mt-2">
                  Gérer mes articles
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
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
                          ? "À préparer"
                          : "Livré"}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Client : <strong>{ord.clientName}</strong> ({ord.clientPhone})
                    </p>

                    <p className="text-xs text-slate-500">
                      📍 Destination : {ord.deliveryLocation.quartier}, {ord.deliveryLocation.ville} — <em>{ord.deliveryLocation.repere_texte}</em>
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 pt-1">
                      <span>{ord.items.length} produit(s)</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatFCFA(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        (Payé via {ord.paymentMethod})
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2">
                    {ord.status === "confirmed" ? (
                      <Button
                        onClick={() => handleUpdateOrderStatus(ord.id, "in_delivery")}
                        variant="emerald"
                        size="sm"
                        className="text-xs font-bold gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Colis Prêt pour Livreur</span>
                      </Button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pris en charge par coursier
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
