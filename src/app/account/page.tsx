"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useUserStore } from "@/store/use-user-store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Store,
  Bike,
  LogOut,
  Sparkles,
  Edit,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function AccountPage() {
  const { user, profile, role, isVendor, isCourier, isAdmin, signOut } = useUser();
  const { selectedLocation, setLocation } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "Tatiana Mengue");
  const [phone, setPhone] = useState(profile?.phone || selectedLocation.telephone || "+241 077 45 89 12");
  const [district, setDistrict] = useState(selectedLocation.quartier || "Nzeng-Ayong");
  const [landmark, setLandmark] = useState(selectedLocation.repere_texte || "Face pharmacie, grand portail vert");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation({
      ...selectedLocation,
      quartier: district,
      repere_texte: landmark,
      telephone: phone,
    });
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 sm:py-12 flex-1 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-slate-400">Espace Membre Nexora</span>
              <span className="text-slate-300">•</span>
              <Badge variant="emerald" className="text-[10px] capitalize">
                {role}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
              Mon Profil &amp; Paramètres
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isVendor && (
              <Link href="/dashboard/vendor">
                <Button variant="emerald" size="sm" className="gap-1.5 font-bold text-xs">
                  <Store className="w-4 h-4" />
                  <span>Espace Vendeur Pro</span>
                </Button>
              </Link>
            )}

            {isCourier && (
              <Link href="/dashboard/courier">
                <Button variant="emerald" size="sm" className="gap-1.5 font-bold text-xs">
                  <Bike className="w-4 h-4" />
                  <span>Espace Livreur</span>
                </Button>
              </Link>
            )}

            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </Button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <p>Vos coordonnées et repères de livraison ont été mis à jour avec succès !</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-emerald-900 to-[#065f46]" />
              <div className="px-5 pb-5 -mt-10 space-y-3 text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-2xl font-black text-[#065f46] mx-auto shadow-md">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black italic text-base text-[#111827]">{fullName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{user?.email || "compte@nexora.ga"}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#065f46] text-xs font-bold capitalize">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Compte {role} Vérifié</span>
                </div>
              </div>
            </Card>

            {/* Role Switcher in Demo mode */}
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Type de profil actif
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {isVendor
                  ? "Vous disposez des droits marchands pour créer des vitrines et vendre vos articles."
                  : isCourier
                  ? "Vous êtes enregistré comme livreur partenaire avec courses géolocalisées."
                  : isAdmin
                  ? "Vous disposez de tous les droits d'administration de la marketplace."
                  : "Vous êtes un acheteur particulier avec accès aux paiements Airtel Money & Moov Money."}
              </p>
            </Card>
          </div>

          {/* Details & Addresses */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 p-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-black italic text-[#111827]">
                  Coordonnées &amp; Adresse de Livraison par défaut
                </CardTitle>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-bold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Annuler" : "Modifier"}</span>
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#111827]">Nom complet</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-[#065f46] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#111827]">Téléphone Mobile Money</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-[#065f46] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#111827]">Quartier</label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-[#065f46] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#111827]">Point de repère visuel</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-[#065f46] focus:outline-none"
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="emerald" size="sm" className="gap-2 font-bold text-xs">
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </Button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Nom complet</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{fullName}</p>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Téléphone de livraison</span>
                        <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{phone}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Quartier &amp; Ville</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">
                          {district}, {selectedLocation.ville || "Libreville"} ({selectedLocation.province || "Estuaire"})
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Point de repère visuel</span>
                        <p className="font-semibold text-emerald-800 text-xs mt-0.5 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                          {landmark}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
