"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { ShieldAlert, ArrowLeft, Store, Bike, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const requiredRole = searchParams.get("required") || "autorisé";
  const currentRole = searchParams.get("current") || "client";

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "vendor":
      case "vendeur":
        return "Vendeur Pro";
      case "courier":
      case "livreur":
        return "Livreur Indépendant";
      case "admin":
        return "Administrateur";
      default:
        return "Client / Acheteur";
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-lg w-full px-4 sm:px-6 py-16 flex-1 flex flex-col justify-center">
        <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden text-center">
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-8 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-[#d97706] shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black italic text-[#111827] tracking-tight">
              Accès Restreint
            </h1>
            <p className="text-xs text-amber-800 font-medium max-w-xs">
              Cette section est réservée aux utilisateurs ayant le rôle{" "}
              <strong>{getRoleLabel(requiredRole)}</strong>.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs text-slate-600 font-medium space-y-1">
              <p>
                Rôle actuel de votre session :{" "}
                <span className="font-bold text-[#111827] capitalize">{getRoleLabel(currentRole)}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Si vous possédez un compte marchand ou livreur, veuillez vous reconnecter avec le profil approprié.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {requiredRole.includes("vendeur") && (
                <Link href="/auth/register" className="w-full">
                  <Button variant="emerald" className="w-full font-bold gap-2 rounded-xl py-2.5 text-xs">
                    <Store className="w-4 h-4" />
                    <span>Créer un compte Vendeur Pro</span>
                  </Button>
                </Link>
              )}

              {requiredRole.includes("livreur") && (
                <Link href="/auth/register" className="w-full">
                  <Button variant="emerald" className="w-full font-bold gap-2 rounded-xl py-2.5 text-xs">
                    <Bike className="w-4 h-4" />
                    <span>Devenir Livreur Partenaire</span>
                  </Button>
                </Link>
              )}

              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full font-bold gap-2 rounded-xl py-2.5 text-xs">
                  <LogIn className="w-4 h-4" />
                  <span>Changer de compte / Se reconnecter</span>
                </Button>
              </Link>

              <Link href="/" className="w-full">
                <Button variant="ghost" className="w-full font-semibold gap-2 text-xs text-slate-500 hover:text-slate-900">
                  <Home className="w-4 h-4" />
                  <span>Retour à l&apos;accueil du marché</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
