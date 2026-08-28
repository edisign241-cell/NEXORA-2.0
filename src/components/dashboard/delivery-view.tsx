"use client";

import * as React from "react";
import { formatFCFA } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MOCK_DELIVERIES } from "@/lib/constants/mock-data";
import { Delivery } from "@/lib/types/marketplace";
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle2,
  Navigation,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export function DeliveryView() {
  const [deliveries, setDeliveries] = React.useState<Delivery[]>(MOCK_DELIVERIES);

  const handleCompleteDelivery = (delId: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === delId
          ? {
              ...d,
              status: "delivered",
              timeline: d.timeline.map((t) => ({ ...t, completed: true })),
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Driver Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#065f46] via-[#047857] to-[#064e3b] p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
            alt="Yannick Obame"
            className="h-16 w-16 rounded-2xl border-2 border-white/80 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black italic">Yannick Obame</h2>
              <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-[10px] uppercase font-black italic">
                Moto Express Libreville
              </Badge>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5 font-medium">
              📞 +241 066 98 74 12 • Zone active : Libreville &amp; Akanda
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md text-right">
          <p className="text-xs text-emerald-100 font-medium">Gains du jour</p>
          <p className="text-xl font-black italic text-white">{formatFCFA(14000)}</p>
          <p className="text-[10px] text-emerald-300 font-semibold">7 courses effectuées</p>
        </div>
      </div>

      {/* Active Missions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black italic text-[#111827] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#065f46]" />
            <span>Missions de Livraison en Cours</span>
          </h3>
          <Badge variant="blue">1 active</Badge>
        </div>

        {deliveries.map((del) => (
          <Card
            key={del.id}
            className="border-emerald-200/80 shadow-md bg-white overflow-hidden"
          >
            <div className="bg-emerald-50/70 p-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#111827]">
                  {del.orderNumber}
                </span>
                <Badge
                  variant={del.status === "delivered" ? "emerald" : "amber"}
                  className="text-[10px] capitalize font-bold"
                >
                  {del.status === "delivered" ? "Livré avec succès" : "En cours de livraison"}
                </Badge>
              </div>
              <span className="text-xs font-black italic text-[#065f46]">
                Course : {formatFCFA(del.deliveryFee)}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Pickup & Dropoff Route */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Point */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Point de Collecte (Boutique)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {del.pickupLocation.ville} ({del.pickupLocation.quartier})
                  </p>
                  <p className="text-xs text-slate-500">
                    📍 {del.pickupLocation.repere_texte}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    📞 {del.pickupLocation.telephone}
                  </p>
                </div>

                {/* Dropoff Point */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-1.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Point de Livraison (Client)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {del.dropoffLocation.ville} ({del.dropoffLocation.quartier})
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    📍 <strong>Repère Visuel :</strong> {del.repereLivraison}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold">
                    Client : {del.clientName} ({del.clientPhone})
                  </p>
                </div>
              </div>

              {/* Note / Specific Instructions */}
              {del.notes && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Instruction Spéciale :</strong> {del.notes}
                  </span>
                </div>
              )}

              {/* Timeline Progress */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Statut de l'acheminement
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {del.timeline.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs ${
                        step.completed
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{step.time}</span>
                      </div>
                      <p className="text-[11px] truncate mt-0.5">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${del.clientPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-100"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Appeler le Client ({del.clientName})</span>
                </a>

                {del.status !== "delivered" && (
                  <Button
                    onClick={() => handleCompleteDelivery(del.id)}
                    variant="emerald"
                    size="sm"
                    className="font-bold gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmer la Remise en Main Propre</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
