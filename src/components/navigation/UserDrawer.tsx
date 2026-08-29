"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserStore } from "@/store/use-user-store";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  X,
  LogOut,
  Settings,
  Store,
  Bike,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Heart,
  MapPin,
  Sparkles,
  ChevronRight,
  Phone,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer({ isOpen, onClose }: UserDrawerProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { role: storeRole, selectedLocation, setLocation } = useUserStore();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(
    profile?.full_name || user?.user_metadata?.full_name || "Utilisateur Nexora"
  );
  const [editPhone, setEditPhone] = useState(
    profile?.phone || user?.user_metadata?.phone || "+241 "
  );
  const [editDistrict, setEditDistrict] = useState(selectedLocation.quartier || "Centre-Ville");
  const [editLandmark, setEditLandmark] = useState(selectedLocation.repere_texte || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentRole = profile?.role || storeRole || "customer";
  const fullName = profile?.full_name || user?.user_metadata?.full_name || "Utilisateur Nexora";
  const email = profile?.email || user?.email || "utilisateur@nexora.ga";
  const phone = profile?.phone || user?.user_metadata?.phone || "+241 -- -- --";

  // Role Badge Mapping
  const roleConfig = {
    customer: { label: "Client VIP", variant: "emerald" as const, icon: <User className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/customer" },
    client: { label: "Client VIP", variant: "emerald" as const, icon: <User className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/customer" },
    vendor: { label: "Vendeur Vérifié", variant: "amber" as const, icon: <Store className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/vendor" },
    vendeur: { label: "Vendeur Vérifié", variant: "amber" as const, icon: <Store className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/vendor" },
    courier: { label: "Livreur Actif", variant: "blue" as const, icon: <Bike className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/courier" },
    livreur: { label: "Livreur Actif", variant: "blue" as const, icon: <Bike className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/courier" },
    admin: { label: "Super Admin", variant: "purple" as const, icon: <ShieldCheck className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/admin" },
  }[currentRole] || { label: "Client Nexora", variant: "emerald" as const, icon: <User className="w-3.5 h-3.5" />, dashboardUrl: "/dashboard/customer" };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setLocation({
        province: "Estuaire",
        ville: "Libreville",
        quartier: editDistrict,
        repere_texte: editLandmark,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditProfileOpen(false);
      }, 1200);
    }, 600);
  };

  const handleLogout = async () => {
    onClose();
    await signOutAction();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-[#064e3b] text-white">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={roleConfig.variant} className="gap-1 text-[11px] font-black uppercase px-2.5 py-0.5">
              {roleConfig.icon}
              <span>{roleConfig.label}</span>
            </Badge>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-13 w-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl text-white shadow-inner">
              {fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-black text-base italic truncate text-white">{fullName}</h3>
              <p className="text-xs text-slate-300 truncate">{email}</p>
              <p className="text-[11px] font-mono text-emerald-300 mt-0.5">{phone}</p>
            </div>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6 text-xs text-slate-800 dark:text-slate-200">
          {/* Quick Nav by Role */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Espace &amp; Navigation
            </span>

            <div className="space-y-1">
              <Link
                href={roleConfig.dashboardUrl}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all font-bold text-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Mon Tableau de Bord</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {(currentRole === "customer" || currentRole === "client") && (
                <>
                  <Link
                    href="/#catalogue"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>Explorer la Marketplace</span>
                    </div>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Mon Panier &amp; Paiement</span>
                    </div>
                  </Link>
                </>
              )}

              {(currentRole === "vendor" || currentRole === "vendeur") && (
                <>
                  <Link
                    href="/dashboard/vendor/add-product"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Ajouter un produit (Kit IA)</span>
                    </div>
                  </Link>
                </>
              )}

              {(currentRole === "courier" || currentRole === "livreur") && (
                <Link
                  href="/dashboard/courier"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Bike className="w-4 h-4 text-blue-600" />
                    <span>Courses en direct &amp; OTP</span>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Location / Landmark Info */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Votre Repère de Livraison Actuel</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">
              {selectedLocation.quartier}, {selectedLocation.ville}
            </p>
            <p className="text-[11px] text-slate-500 italic">
              {selectedLocation.repere_texte || "Aucun repère renseigné"}
            </p>
          </div>

          {/* Profile Settings Trigger */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Paramètres &amp; Sécurité
            </span>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-slate-800">Modifier mon profil &amp; repère</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-center gap-2 text-xs font-bold text-rose-600 border-rose-200 bg-rose-50/60 hover:bg-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5 border border-slate-200 animate-scale">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black italic text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>Modifier mes coordonnées</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Profil mis à jour avec succès !</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Nom &amp; Prénom
                  </label>
                  <Input
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    required
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Numéro de Téléphone (Airtel / Moov)
                  </label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="text-xs h-9 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Quartier (Libreville)
                    </label>
                    <Input
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Point de Repère
                    </label>
                    <Input
                      value={editLandmark}
                      onChange={(e) => setEditLandmark(e.target.value)}
                      placeholder="ex: Face Pharmacie"
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="text-xs"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="emerald"
                    size="sm"
                    disabled={isSaving}
                    className="text-xs font-bold"
                  >
                    {isSaving ? "Enregistrement..." : "Sauvegarder"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
