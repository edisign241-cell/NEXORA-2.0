"use client";

import React, { useState, useEffect } from "react";
import { formatFCFA } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FraudDetector, RiskAnalysisResult } from "@/lib/services/fraud-detector";
import { WhatsAppService } from "@/lib/services/whatsapp-service";
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Users,
  Activity,
  Phone,
  FileText,
  Clock,
  Sparkles,
  Zap,
  Lock,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

interface OperationalMetric {
  title: string;
  value: string | number;
  subtext: string;
  status: "good" | "warning" | "alert";
  icon: React.ReactNode;
}

export function AdminCooControl() {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "fraud" | "financials" | "logistics" | "daily_report">("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated live fraud alerts for supervision
  const [fraudAlerts, setFraudAlerts] = useState<Array<{
    id: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    domain: string;
    customerName: string;
    amount: number;
    phone: string;
    reason: string;
    status: "pending" | "resolved" | "frozen";
    createdAt: string;
  }>>([
    {
      id: "FRD-241-01",
      riskLevel: "medium",
      domain: "Paiement Mobile Money",
      customerName: "Utilisateur Libreville",
      amount: 285000,
      phone: "+241 077 45 89 12",
      reason: "Commande supérieure au panier moyen habituel",
      status: "pending",
      createdAt: "Il y a 12 min",
    },
    {
      id: "FRD-241-02",
      riskLevel: "low",
      domain: "Fréquence Commandes",
      customerName: "Client Port-Gentil",
      amount: 45000,
      phone: "+241 066 12 34 56",
      reason: "2 commandes consécutives en 5 minutes",
      status: "pending",
      createdAt: "Il y a 35 min",
    },
  ]);

  const handleResolveAlert = (id: string, action: "resolved" | "frozen") => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
  };

  const operationalMetrics: OperationalMetric[] = [
    {
      title: "Santé Opérationnelle Globale",
      value: "99.8%",
      subtext: "Tous services actifs (API, Auth, Paiements)",
      status: "good",
      icon: <Activity className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: "Volume Transactionnel (GMV)",
      value: formatFCFA(0),
      subtext: "Lancement production Gabon",
      status: "good",
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: "Revenus Plateforme (5%)",
      value: formatFCFA(0),
      subtext: "Commissions nettes Nexora",
      status: "good",
      icon: <DollarSign className="w-4 h-4 text-purple-600" />,
    },
    {
      title: "Index de Risque Anti-Fraude",
      value: "FAIBLE (Niv. 1)",
      subtext: "Surveillance active des flux",
      status: "good",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* COO Executive Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#064e3b] p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-black tracking-wider">
              COO IA — Posture Opérationnelle 24/7
            </Badge>
            <span className="text-xs text-slate-400">• App ID: 6a50e093433de4f870585c19</span>
          </div>
          <h2 className="text-xl font-black italic tracking-tight">
            Directoire d&apos;Exploitation &amp; Supervision Nexora
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Supervision continue des 10 piliers : Commandes, Paiements Mobile Money, Gestion Vendeurs, Dispatch Logistique OTP, Support WhatsApp et Détection Anti-Fraude.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={WhatsAppService.getCustomerSupportLink({ issueTopic: "Support Direction Opérationnelle" })}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="emerald" size="sm" className="gap-1.5 text-xs font-bold shadow-md">
              <MessageSquare className="w-4 h-4" />
              <span>Canal WhatsApp Support</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
        {[
          { id: "overview", label: "Vue 10 Piliers", icon: <Activity className="w-3.5 h-3.5" /> },
          { id: "fraud", label: "Anti-Fraude (4 Niveaux)", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: "financials", label: "Rapprochement Financier", icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: "logistics", label: "Dispatch & Livraisons OTP", icon: <Truck className="w-3.5 h-3.5" /> },
          { id: "daily_report", label: "Rapport COO (08h00)", icon: <FileText className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1 : OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {operationalMetrics.map((m, idx) => (
              <Card key={idx} className="border-slate-200 bg-white p-4 shadow-sm rounded-2xl">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>{m.title}</span>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    {m.icon}
                  </div>
                </div>
                <p className="text-xl font-black italic text-slate-900">{m.value}</p>
                <span className="text-[10px] font-semibold text-emerald-600 mt-1 inline-block">
                  {m.subtext}
                </span>
              </Card>
            ))}
          </div>

          {/* Pillars Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Piliers 1 à 5 : Flux Marchands &amp; Logistique</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">1. Cycle des Commandes</span>
                  <Badge variant="emerald" className="text-[10px]">Temps Réel Actif</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">2. Flux Financiers (Airtel/Moov)</span>
                  <Badge variant="emerald" className="text-[10px]">Commission 5% Configurée</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">3. Gestion Vendeurs &amp; Badges</span>
                  <Badge variant="emerald" className="text-[10px]">Gabon Pro Actif</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">4. Qualité Catalogue (Photos/Vidéos)</span>
                  <Badge variant="emerald" className="text-[10px]">Modération Active</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">5. Logistique &amp; Validation OTP</span>
                  <Badge variant="emerald" className="text-[10px]">Code 4 Chiffres Actif</Badge>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Piliers 6 à 10 : Sécurité, Support &amp; Intelligence</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">6. Support WhatsApp &amp; Médiation</span>
                  <Badge variant="blue" className="text-[10px]">Deep Links Configurés</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">7. Lutte Anti-Fraude (4 Paliers)</span>
                  <Badge variant="blue" className="text-[10px]">Moteur Actif</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">8. Monitoring Temps Réel</span>
                  <Badge variant="emerald" className="text-[10px]">Latence &lt; 50ms</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">9. Rapports d&apos;Activité Automatisés</span>
                  <Badge variant="purple" className="text-[10px]">Générateur 08h00</Badge>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">10. Intelligence &amp; Code Promo</span>
                  <Badge variant="amber" className="text-[10px]">NEXORA241 Actif</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2 : FRAUD ENGINE */}
      {activeSubTab === "fraud" && (
        <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black italic text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Journal de Surveillance Anti-Fraude (Pilier 7)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Paliers : FAIBLE (Log) • MOYEN (Vérif SMS/WhatsApp) • ÉLEVÉ (Suspension) • CRITIQUE (Gel Portefeuille).
              </p>
            </div>
            <Badge variant="amber">{fraudAlerts.filter((a) => a.status === "pending").length} alerte(s) active(s)</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{alert.id}</span>
                    <Badge
                      variant={
                        alert.riskLevel === "critical"
                          ? "destructive"
                          : alert.riskLevel === "high"
                          ? "amber"
                          : alert.riskLevel === "medium"
                          ? "blue"
                          : "outline"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      Risque {alert.riskLevel}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{alert.createdAt}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {alert.customerName} • {alert.phone} • <span className="text-emerald-700">{formatFCFA(alert.amount)}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{alert.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === "pending" ? (
                    <>
                      <Button
                        onClick={() => handleResolveAlert(alert.id, "resolved")}
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Valider Transaction
                      </Button>
                      <Button
                        onClick={() => handleResolveAlert(alert.id, "frozen")}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Lock className="w-3.5 h-3.5 mr-1" />
                        Geler le compte
                      </Button>
                    </>
                  ) : alert.status === "frozen" ? (
                    <Badge variant="destructive" className="text-xs">Compte Gelé</Badge>
                  ) : (
                    <Badge variant="emerald" className="text-xs">Validé Conforme</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3 : FINANCIALS */}
      {activeSubTab === "financials" && (
        <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black italic text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Rapprochement des Flux Financiers &amp; Commissions (Pilier 2)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Modèle économique : 95% pour le commerçant / 5% commission marketplace Nexora.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
              <span className="text-xs font-bold text-rose-700">Airtel Money Gabon (*150#)</span>
              <p className="text-lg font-black text-rose-950">{formatFCFA(0)}</p>
              <p className="text-[10px] text-rose-600">Disponibilité passerelle : 100%</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
              <span className="text-xs font-bold text-blue-700">Moov Money Gabon (*555#)</span>
              <p className="text-lg font-black text-blue-950">{formatFCFA(0)}</p>
              <p className="text-[10px] text-blue-600">Disponibilité passerelle : 100%</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-emerald-700">Commissions Nettes Nexora</span>
              <p className="text-lg font-black text-emerald-950">{formatFCFA(0)}</p>
              <p className="text-[10px] text-emerald-600">Taux standard : 5.0%</p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4 : LOGISTICS */}
      {activeSubTab === "logistics" && (
        <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black italic text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Supervision du Dispatch Logistique &amp; Code OTP (Pilier 5)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chaque livraison est sécurisée par un code OTP à 4 chiffres échangé à la remise du colis.
            </p>
          </div>

          <div className="p-8 text-center space-y-2 text-slate-500">
            <Truck className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="text-xs font-bold text-slate-800">Aucun coursier en mission active</h4>
            <p className="text-[11px] max-w-sm mx-auto">
              Dès qu&apos;une commande est validée et assignée à un coursier, la position et le code OTP s&apos;afficheront ici.
            </p>
          </div>
        </Card>
      )}

      {/* TAB 5 : DAILY COO REPORT */}
      {activeSubTab === "daily_report" && (
        <Card className="border-slate-200 bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black italic text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Rapport d&apos;Activité Opérationnel Quotidien (08h00)</span>
              </h3>
              <p className="text-xs text-slate-500">Synthèse exécutive générée par le COO IA pour la direction.</p>
            </div>
            <Badge variant="purple">Automatisé</Badge>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed">
{`===================================================================
NEXORA GABON — RAPPORT EXÉCUTIF QUOTIDIEN DU COO IA (08h00)
Date : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Périmètre : Plateforme Nationale Nexora Gabon (App ID: 6a50e093433de4f870585c19)
===================================================================

1. SYNTHÈSE D'EXPLOITATION
- Statut global du système : 🟢 OPÉRATIONNEL (Disponibilité 100%)
- Volume total des transactions (GMV) : 0 FCFA (Démarrage production)
- Commissions nettes générées (5%) : 0 FCFA
- Nombre de commandes traitées : 0
- Délai moyen de préparation marchands : Conforme (< 30 min)

2. SITUATION LOGISTIQUE & LIVRAISONS
- Missions de livraison effectuées : 0
- Taux de validation OTP : 100%
- Incidents de repères visuels signalés : 0

3. INTÉGRITÉ & SÉCURITÉ ANTI-FRAUDE
- Tentatives de fraude critique : 0 détectée
- Alertes moyennes en surveillance : ${fraudAlerts.filter(a => a.status === 'pending').length}
- Comptes ou portefeuilles gelés : 0

4. PLAN D'ACTIONS POUR LA JOURNÉE
- Accélération de l'onboarding des boutiques à Libreville et Akanda.
- Distribution des liens d'inscription marchands & coursiers via WhatsApp.
- Veille continue sur les passerelles Mobile Money (*150# et *555#).

Rapport validé par le COO IA Nexora Operations.`}
          </div>
        </Card>
      )}
    </div>
  );
}
