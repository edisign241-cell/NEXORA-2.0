"use client";

import * as React from "react";
import { formatFCFA } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Store } from "@/lib/types/marketplace";
import { nexoraApi } from "@/lib/supabase/client";
import {
  TrendingUp,
  ShieldCheck,
  Store as StoreIcon,
  Users,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Activity,
  PackageOpen,
} from "lucide-react";

export function AdminView() {
  const [stores, setStores] = React.useState<Store[]>([]);

  React.useEffect(() => {
    async function loadStores() {
      const res = await nexoraApi.getStores();
      setStores(res.data || []);
    }
    loadStores();
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#022c22] via-[#065f46] to-[#047857] p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black italic">Supervision &amp; Direction Nexora Gabon</h2>
            <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-black italic">
              Production GA
            </Badge>
          </div>
          <p className="text-xs text-emerald-100 mt-0.5 font-medium">
            Supervision des flux marchands, commissions et conformité dans les 9 provinces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber" className="text-xs py-1 px-3 bg-[#d97706] text-white font-bold">
            Commission standard : 5.0%
          </Badge>
        </div>
      </div>

      {/* KPI Global */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Volume Global (GMV)</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#065f46]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            {formatFCFA(0)}
          </p>
          <span className="text-[10px] font-semibold text-[#065f46] mt-1 inline-block">
            Lancement en direct
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Commissions Nexora (5%)</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-purple-600">
            {formatFCFA(0)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
            Revenus nets plateforme
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Boutiques Actives</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#d97706]">
              <StoreIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            {stores.length}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
            En base Supabase
          </span>
        </Card>

        <Card className="p-4 border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Réseau &amp; Villes</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black italic text-[#111827]">
            9 Provinces
          </p>
          <span className="text-[10px] text-[#065f46] font-semibold mt-1 inline-block">
            Libreville, POG, Franceville...
          </span>
        </Card>
      </div>

      {/* Payment methods & Store Verification Queue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200/80">
          <h4 className="text-xs font-black italic uppercase text-slate-500 mb-3">
            Canaux de Paiements Intégrés
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-600">Airtel Money Gabon (*150#)</span>
                <span className="text-emerald-600 font-bold">Actif</span>
              </div>
              <div className="h-2 w-full rounded-full bg-rose-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-600">Moov Money (*555#)</span>
                <span className="text-emerald-600 font-bold">Actif</span>
              </div>
              <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700">Paiement Cash à la Livraison</span>
                <span className="text-emerald-600 font-bold">Actif</span>
              </div>
              <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        </Card>

        {/* Store Verification Queue */}
        <Card className="p-4 border-slate-200/80 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">
              Boutiques en Attente de Certification &quot;Gabon Pro&quot;
            </h4>
            <Badge variant="outline">{stores.filter((s) => !s.verified).length} demande(s)</Badge>
          </div>

          <div className="space-y-2">
            {stores.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-500">
                <PackageOpen className="w-8 h-8 mx-auto text-slate-400" />
                <p className="font-bold text-slate-700 text-xs">Aucune demande de certification en attente</p>
                <p className="text-[11px]">Les nouveaux commerces inscrits apparaîtront ici pour validation.</p>
              </div>
            ) : (
              stores.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.logo}
                      alt={s.nom}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {s.nom}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Gérant : {s.ownerName} • {s.location.ville} ({s.location.quartier})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="emerald" size="sm" className="text-xs font-bold">
                      {s.verified ? "Vérifiée" : "Certifier"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
