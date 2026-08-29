"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";
import { Store, Order } from "@/lib/types/marketplace";
import { nexoraApi, supabase } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Store as StoreIcon,
  Bike,
  Users,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  PackageOpen,
} from "lucide-react";
import { AdminCooControl } from "@/components/dashboard/admin-coo-control";

export default function AdminDashboardPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);
      try {
        const [storesRes, ordersRes] = await Promise.all([
          nexoraApi.getStores(),
          supabase.from("orders").select("*, stores(name)"),
        ]);
        setStores(storesRes.data || []);
        setOrders(ordersRes.data || []);
      } catch {
        setStores([]);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const totalVolume = orders.reduce((acc, o) => acc + (o.total_amount_xaf || o.totalAmount || 0), 0);
  const marketplaceCommission = totalVolume * 0.05;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-slate-400">Supervision Centrale</span>
              <span className="text-slate-300">•</span>
              <Badge variant="emerald" className="text-[10px]">
                Admin Nexora Gabon
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
              Tableau de Bord Administrateur
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/users">
              <Button variant="default" size="sm" className="bg-[#065f46] hover:bg-[#044e3a] text-white gap-1.5 text-xs font-bold shadow-sm">
                <Users className="w-4 h-4" />
                <span>Import &amp; Liens Utilisateurs</span>
              </Button>
            </Link>
            <Link href="/dashboard/vendor">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <StoreIcon className="w-4 h-4 text-[#065f46]" />
                <span>Vue Marchand</span>
              </Button>
            </Link>
            <Link href="/dashboard/courier">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <Bike className="w-4 h-4 text-blue-600" />
                <span>Vue Livreur</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Nexora COO IA Operations Control Room (10 Pillars & Anti-Fraud) */}
        <AdminCooControl />

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Volume Total des Ventes</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-[#065f46]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#111827] mt-3">{formatFCFA(totalVolume)}</h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">Transactionnel Mobile Money</p>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Commissions Plateforme (5%)</span>
              <div className="p-2 rounded-xl bg-amber-50 text-[#d97706]">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#d97706] mt-3">{formatFCFA(marketplaceCommission)}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Revenus nets Nexora</p>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Boutiques Enregistrées</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <StoreIcon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#111827] mt-3">{stores.length}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">En production</p>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Commandes Globales</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#111827] mt-3">{orders.length}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Clients & Livreurs</p>
          </Card>
        </div>

        {/* Supervision Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stores Oversight */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black italic text-[#111827] flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-[#065f46]" />
                <span>Boutiques Enregistrées</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">{stores.length} actives</Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100 text-xs">
              {stores.length > 0 ? (
                stores.map((store) => (
                  <div key={store.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 text-sm">{store.nom}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#065f46]" />
                        <span>{store.location?.quartier || "Quartier"}, {store.location?.ville || "Libreville"}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" className="text-[10px]">Vérifiée</Badge>
                      <Link href={`/boutique/${store.slug}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                          Voir
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2 text-slate-500">
                  <StoreIcon className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-slate-700">Aucune boutique enregistrée pour le moment</p>
                  <p className="text-[11px]">Les nouveaux commerçants inscrits apparaîtront ici.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Oversight */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black italic text-[#111827] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#065f46]" />
                <span>Dernières Commandes Plateforme</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">{orders.length} commandes</Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100 text-xs">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">#{order.id.slice(0, 8)}</span>
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-100 text-[#065f46]">
                          {order.payment_method === "airtel_money" ? "Airtel Money" : order.payment_method || "Mobile Money"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{order.delivery_district || "District"}, {order.delivery_city || "Libreville"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-sm">{formatFCFA(order.total_amount_xaf || 0)}</p>
                      <span className="text-[10px] font-semibold text-emerald-700 capitalize">
                        {order.status === "pending" ? "En attente" : order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2 text-slate-500">
                  <PackageOpen className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-slate-700">Aucune commande en cours</p>
                  <p className="text-[11px]">Les commandes passées par les clients s&apos;afficheront ici en temps réel.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
