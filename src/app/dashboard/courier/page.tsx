"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatFCFA } from "@/lib/utils";
import {
  Bike,
  Navigation,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Power,
  Zap,
  KeyRound,
  ExternalLink,
  ChevronRight,
  User,
} from "lucide-react";
import { UserDrawer } from "@/components/navigation/UserDrawer";

interface DeliveryMission {
  id: string;
  orderNumber: string;
  storeName: string;
  storeDistrict: string;
  storeLandmark: string;
  storePhone: string;
  customerName: string;
  customerPhone: string;
  customerDistrict: string;
  customerLandmark: string;
  deliveryFeeEarnings: number; // Earnings in FCFA
  distanceKm: string;
  estimatedTime: string;
  status: "available" | "in_progress" | "delivered";
  currentStep?: "pickup" | "transit" | "otp";
}

const INITIAL_AVAILABLE_MISSIONS: DeliveryMission[] = [
  {
    id: "miss-1",
    orderNumber: "NX-LBV-2026-9041",
    storeName: "Saveurs & Terroir du Gabon",
    storeDistrict: "Angondjé Château, Akanda",
    storeLandmark: "À 50m du carrefour Amissa, barrière verte",
    storePhone: "+241 077 45 89 12",
    customerName: "Marc Ndong Mba",
    customerPhone: "+241 077 45 89 12",
    customerDistrict: "Nzeng-Ayong, Libreville",
    customerLandmark: "Face pharmacie de Nzeng-Ayong, grand portail vert à 50m du carrefour GP",
    deliveryFeeEarnings: 2000,
    distanceKm: "9.2 km",
    estimatedTime: "25 min",
    status: "available",
  },
  {
    id: "miss-2",
    orderNumber: "NX-LBV-2026-8820",
    storeName: "Élégance Afro & Wax Couture",
    storeDistrict: "Batterie IV, Libreville",
    storeLandmark: "Immeuble face clinique Chambrier",
    storePhone: "+241 074 11 22 33",
    customerName: "Audrey Moukagni",
    customerPhone: "+241 066 99 88 77",
    customerDistrict: "Louis, Libreville",
    customerLandmark: "Barrière bleue à côté de l'Ambassade du Bénin",
    deliveryFeeEarnings: 1500,
    distanceKm: "3.4 km",
    estimatedTime: "12 min",
    status: "available",
  },
  {
    id: "miss-3",
    orderNumber: "NX-LBV-2026-7731",
    storeName: "Tech Libreville Hub",
    storeDistrict: "Oloumi, Libreville",
    storeLandmark: "Zone industrielle Oloumi, en face de Foberd",
    storePhone: "+241 077 00 11 22",
    customerName: "Jean-Paul Emane",
    customerPhone: "+241 077 33 44 55",
    customerDistrict: "PK 8, Libreville",
    customerLandmark: "Après le marché banane, 2ème ruelle goudronnée à droite",
    deliveryFeeEarnings: 2500,
    distanceKm: "12.0 km",
    estimatedTime: "35 min",
    status: "available",
  },
];

export default function CourierDashboardPage() {
  const [isOnDuty, setIsOnDuty] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"available" | "active" | "earnings">("available");
  const [availableMissions, setAvailableMissions] = React.useState<DeliveryMission[]>([]);
  const [activeMission, setActiveMission] = React.useState<DeliveryMission | null>(null);

  // OTP Validation state
  const [enteredOtp, setEnteredOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [deliverySuccess, setDeliverySuccess] = React.useState(false);

  // Accept a mission
  const handleAcceptMission = (mission: DeliveryMission) => {
    setAvailableMissions((prev) => prev.filter((m) => m.id !== mission.id));
    setActiveMission({
      ...mission,
      status: "in_progress",
      currentStep: "pickup",
    });
    setActiveTab("active");
  };

  // Step advancement
  const handleNextStep = () => {
    if (!activeMission) return;
    if (activeMission.currentStep === "pickup") {
      setActiveMission({ ...activeMission, currentStep: "transit" });
    } else if (activeMission.currentStep === "transit") {
      setActiveMission({ ...activeMission, currentStep: "otp" });
    }
  };

  // Validate OTP code
  const handleValidateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length < 4) {
      setOtpError(true);
      return;
    }

    setDeliverySuccess(true);
    setTimeout(() => {
      setDeliverySuccess(false);
      setActiveMission(null);
      setEnteredOtp("");
      setActiveTab("earnings");
    }, 1800);
  };

  // Mock Earnings
  const dailyEarnings = 16500;
  const weeklyEarnings = 94000;
  const completedTodayCount = 8;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Header & Service Status Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Espace Multi-Rôles</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="blue" className="text-xs font-bold gap-1">
                <Bike className="w-3.5 h-3.5" />
                Espace Livreur Nexora
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
              Yannick Obame
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              🛵 Moto Express Yamaha 125cc • Immatriculation : <strong>GA-4589-LBV</strong> (Libreville)
            </p>
          </div>

          {/* Switch On/Off Duty Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs">
              <p className="font-bold text-[#111827]">
                {isOnDuty ? "En Service (Prêt à rouler)" : "Hors Service (En pause)"}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {isOnDuty ? "GPS et notifications de courses actifs" : "Aucune course assignée"}
              </p>
            </div>

            <Button
              onClick={() => setIsOnDuty(!isOnDuty)}
              variant={isOnDuty ? "emerald" : "outline"}
              className={`gap-2 font-black italic text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-sm transition-all ${
                isOnDuty ? "bg-[#065f46] ring-2 ring-[#065f46]/30 text-white" : "text-slate-500 border-slate-300"
              }`}
            >
              <Power className={`w-4 h-4 ${isOnDuty ? "animate-pulse text-white" : ""}`} />
              <span>{isOnDuty ? "EN SERVICE" : "HORS SERVICE"}</span>
            </Button>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold text-xs"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Mon Profil</span>
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Gains du jour */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Gains du Jour (XAF)
                </p>
                <h3 className="text-2xl font-black italic text-[#065f46]">
                  {formatFCFA(dailyEarnings)}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {completedTodayCount} courses livrées aujourd&apos;hui
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#065f46]">
                <DollarSign className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Courses Disponibles */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Courses Disponibles
                </p>
                <h3 className="text-2xl font-black italic text-[#d97706]">
                  {isOnDuty ? `${availableMissions.length} autour de vous` : "0 (Hors service)"}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Libreville, Akanda &amp; Owendo
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#d97706]">
                <Navigation className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Gains de la Semaine */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Semaine en cours
                </p>
                <h3 className="text-2xl font-black italic text-[#065f46]">
                  {formatFCFA(weeklyEarnings)}
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#065f46]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Virement Airtel Money mardi</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "available"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Courses disponibles ({availableMissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all relative ${
              activeTab === "active"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Course en cours</span>
            {activeMission && (
              <span className="h-2 w-2 rounded-full bg-[#10b981] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "earnings"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Mes Gains &amp; Historique</span>
          </button>
        </div>

        {/* TAB 1: AVAILABLE MISSIONS */}
        {activeTab === "available" && (
          <div className="space-y-4">
            {!isOnDuty ? (
              <Card className="p-8 text-center border-dashed border-slate-300 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                <Power className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Vous êtes actuellement hors service
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Activez le mode « EN SERVICE » en haut de la page pour recevoir et accepter les livraisons à Libreville.
                </p>
                <Button onClick={() => setIsOnDuty(true)} variant="emerald" size="sm" className="font-bold">
                  Passer en service
                </Button>
              </Card>
            ) : availableMissions.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-slate-300 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Toutes les courses actuelles sont prises
                </h3>
                <p className="text-xs text-slate-500">
                  Restez en ligne, de nouvelles commandes arrivent en temps réel.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMissions.map((miss) => (
                  <Card
                    key={miss.id}
                    className="overflow-hidden border-slate-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top Header: Order ID & Fee */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                            {miss.orderNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">• {miss.distanceKm} ({miss.estimatedTime})</span>
                        </div>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {formatFCFA(miss.deliveryFeeEarnings)}
                        </span>
                      </div>

                      {/* Route Path (Point A -> Point B) */}
                      <div className="space-y-3 text-xs">
                        {/* Point A : Boutique */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                            A
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {miss.storeName}
                            </p>
                            <p className="text-slate-500">{miss.storeDistrict}</p>
                            <p className="text-[11px] text-slate-400 italic">
                              📍 Repère : {miss.storeLandmark}
                            </p>
                          </div>
                        </div>

                        {/* Arrow separator */}
                        <div className="ml-2.5 h-3 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />

                        {/* Point B : Client */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            B
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              Client : {miss.customerName}
                            </p>
                            <p className="text-slate-500">{miss.customerDistrict}</p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                              📍 Repère : {miss.customerLandmark}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Gain net livreur crédité à la livraison
                      </span>
                      <Button
                        onClick={() => handleAcceptMission(miss)}
                        variant="emerald"
                        size="sm"
                        className="font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Accepter la course</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE MISSION */}
        {activeTab === "active" && (
          <div>
            {!activeMission ? (
              <Card className="p-10 text-center border-dashed border-slate-300 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                <Bike className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Aucune course en cours
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Consultez l&apos;onglet « Courses disponibles » pour choisir votre prochaine mission de livraison.
                </p>
                <Button onClick={() => setActiveTab("available")} variant="emerald" size="sm" className="font-bold">
                  Voir les courses disponibles
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Mission details & direct actions (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <Card className="border-2 border-emerald-500/40 bg-white dark:bg-slate-900 dark:border-emerald-800/40 shadow-xl overflow-hidden">
                    <CardHeader className="bg-emerald-950 text-white p-5 flex flex-row items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                          Course en Cours • Moto Express
                        </span>
                        <h2 className="text-lg font-black text-white">
                          {activeMission.orderNumber}
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-200">Rémunération course</span>
                        <p className="text-lg font-black text-amber-300">
                          {formatFCFA(activeMission.deliveryFeeEarnings)}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 space-y-5">
                      {/* Step Progression Bar */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            activeMission.currentStep === "pickup"
                              ? "bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md"
                              : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                          }`}
                        >
                          1. Retrait Boutique
                        </div>
                        <div
                          className={`p-2.5 rounded-xl border ${
                            activeMission.currentStep === "transit"
                              ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md"
                              : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                          }`}
                        >
                          2. En Transit Client
                        </div>
                        <div
                          className={`p-2.5 rounded-xl border ${
                            activeMission.currentStep === "otp"
                              ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md"
                              : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                          }`}
                        >
                          3. Code OTP Client
                        </div>
                      </div>

                      {/* Point A : Boutique Retrait */}
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/40 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px]">
                            Point A : Récupérer le colis
                          </span>
                          <a href={`tel:${activeMission.storePhone}`}>
                            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 font-semibold">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Appeler la boutique</span>
                            </Button>
                          </a>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {activeMission.storeName}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {activeMission.storeDistrict}
                        </p>
                        <p className="text-slate-500 italic">
                          📍 {activeMission.storeLandmark}
                        </p>
                      </div>

                      {/* Point B : Client Destinataire */}
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 p-4 space-y-2 dark:border-emerald-800/30 dark:bg-emerald-950/20 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase text-[10px]">
                            Point B : Livrer le client à son repère
                          </span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${activeMission.customerPhone.replace(/[^0-9]/g, "")}?text=Bonjour%2C%20je%20suis%20votre%20coursier%20Nexora.%20Je%20suis%20en%20route%20avec%20votre%20colis.`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 font-semibold text-emerald-700 border-emerald-300">
                                <MessageCircle className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </Button>
                            </a>
                            <a href={`tel:${activeMission.customerPhone}`}>
                              <Button variant="emerald" size="sm" className="h-7 text-[11px] gap-1 font-bold">
                                <Phone className="w-3 h-3" />
                                <span>Appeler</span>
                              </Button>
                            </a>
                          </div>
                        </div>

                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {activeMission.customerName} ({activeMission.customerPhone})
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Quartier : <strong>{activeMission.customerDistrict}</strong>
                        </p>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                          <p className="font-bold text-[11px]">📍 Point de repère précis :</p>
                          <p className="text-xs mt-0.5">{activeMission.customerLandmark}</p>
                        </div>
                      </div>

                      {/* Advance Step Action */}
                      {activeMission.currentStep === "pickup" && (
                        <Button
                          onClick={handleNextStep}
                          variant="emerald"
                          size="lg"
                          className="w-full font-bold shadow-md shadow-emerald-600/20 gap-2"
                        >
                          <span>Colis récupéré en boutique → En route vers le client</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}

                      {activeMission.currentStep === "transit" && (
                        <Button
                          onClick={handleNextStep}
                          variant="emerald"
                          size="lg"
                          className="w-full font-bold shadow-md shadow-emerald-600/20 gap-2"
                        >
                          <span>Arrivé au point de repère → Valider la remise (OTP)</span>
                          <KeyRound className="w-4 h-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right: OTP Code Validation (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-emerald-600" />
                        <span>Validation de la remise (Code OTP)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4 text-xs">
                      {deliverySuccess ? (
                        <div className="p-6 text-center space-y-3 animate-scale">
                          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                            Course Validée avec Succès !
                          </h3>
                          <p className="text-xs text-slate-500">
                            Vos gains de <strong>{formatFCFA(activeMission.deliveryFeeEarnings)}</strong> ont été crédités sur votre solde.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleValidateOtp} className="space-y-4">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Demandez au client le <strong>Code OTP à 4 chiffres</strong> reçu par SMS / sur son écran pour débloquer la validation de la course.
                          </p>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              Code OTP Client (Ex: 2410)
                            </label>
                            <Input
                              type="text"
                              maxLength={6}
                              value={enteredOtp}
                              onChange={(e) => {
                                setEnteredOtp(e.target.value);
                                setOtpError(false);
                              }}
                              placeholder="Code à 4 chiffres"
                              className="text-center font-mono font-black text-lg tracking-widest"
                            />
                            {otpError && (
                              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Veuillez saisir le code OTP fourni par le client.
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            variant="emerald"
                            size="lg"
                            className="w-full font-black gap-2 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Valider la remise du colis</span>
                          </Button>

                          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-[11px] text-slate-500">
                            💡 La validation OTP protège les coursiers contre les litiges et garantit le versement immédiat.
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & PAYOUTS */}
        {activeTab === "earnings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Solde des Gains &amp; Retrait</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 space-y-2">
                  <span className="text-xs uppercase font-bold text-amber-300">Solde disponible pour retrait</span>
                  <h3 className="text-3xl font-black text-white">{formatFCFA(48500)}</h3>
                  <p className="text-[11px] text-emerald-200">
                    Gains de courses 100% reversés sans frais sur votre compte Mobile Money.
                  </p>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/20 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase">
                      Airtel Money
                    </span>
                    <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                      +241 077 88 99 00
                    </p>
                    <p className="text-[10px] text-slate-500">Compte coursier : Yannick Obame</p>
                  </div>
                  <Badge variant="emerald" className="text-[10px]">Par défaut</Badge>
                </div>

                <Button
                  onClick={() => alert("Retrait de 48 500 FCFA initié vers Airtel Money (+241 077 88 99 00) !")}
                  variant="emerald"
                  className="w-full font-bold shadow-md shadow-emerald-600/20"
                >
                  Transférer 48 500 FCFA sur mon compte Airtel
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Historique des courses récentes (Libreville)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Angondjé Château → Nzeng-Ayong
                    </p>
                    <p className="text-[11px] text-slate-500">Aujourd&apos;hui à 15h40 • OTP validé</p>
                  </div>
                  <span className="font-bold text-emerald-600">+2 000 FCFA</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Batterie IV → Quartier Louis
                    </p>
                    <p className="text-[11px] text-slate-500">Aujourd&apos;hui à 14h15 • OTP validé</p>
                  </div>
                  <span className="font-bold text-emerald-600">+1 500 FCFA</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Oloumi → Gros-Bouquet
                    </p>
                    <p className="text-[11px] text-slate-500">Aujourd&apos;hui à 11h20 • OTP validé</p>
                  </div>
                  <span className="font-bold text-emerald-600">+1 800 FCFA</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <CartDrawer />
      <LocationModal />
    </div>
  );
}
