"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { useUserStore } from "@/store/use-user-store";
import { UserRole } from "@/lib/types/marketplace";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Store,
  Bike,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const registered = searchParams.get("registered");
  const prefilledEmail = searchParams.get("email") || "";
  const initialError = searchParams.get("error");

  const [email, setEmail] = useState(prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError || "");
  const [successMessage, setSuccessMessage] = useState(
    registered ? "Votre compte a été créé avec succès ! Connectez-vous ci-dessous." : ""
  );

  const { setRole } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (redirectTarget) {
      formData.append("redirect", redirectTarget);
    }

    try {
      const result = await signInWithPassword(formData);
      if (!result.success) {
        setErrorMessage(result.error || "Erreur d'authentification.");
        setIsLoading(false);
      } else {
        setSuccessMessage(result.message || "Connexion réussie ! Redirection...");
        setTimeout(() => {
          router.push(result.redirectUrl || redirectTarget || "/");
          router.refresh();
        }, 600);
      }
    } catch {
      setErrorMessage("Une erreur imprévue est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  // Demo Quick-Login Helper for fast testing
  const handleQuickDemoLogin = (role: UserRole) => {
    setRole(role);
    setSuccessMessage(`Connecté en mode Démo en tant que : ${role.toUpperCase()}`);
    setTimeout(() => {
      if (role === "vendor" || role === "vendeur") router.push("/dashboard/vendor");
      else if (role === "courier" || role === "livreur") router.push("/dashboard/courier");
      else if (role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/customer");
      router.refresh();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & Security Notice */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#065f46] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>Authentification Sécurisée Nexora Auth</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-[#111827] tracking-tight leading-tight">
                Accédez à votre espace <span className="text-[#065f46]">Nexora Gabon</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                Connectez-vous pour suivre vos commandes avec Airtel Money &amp; Moov Flooz, gérer votre boutique gabonaise ou vos courses de livraison.
              </p>
            </div>

            {/* Quick Demo Role Selectors */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Test Rapide Multi-Rôles (Mode Démo)
                </span>
                <Badge variant="emerald" className="text-[10px]">1-Clic</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("client")}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#065f46] hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700 mb-1" />
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#065f46]">Client</p>
                  <p className="text-[10px] text-slate-500">Acheteur</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("vendeur")}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#065f46] hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <Store className="w-4 h-4 text-emerald-700 mb-1" />
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#065f46]">Vendeur</p>
                  <p className="text-[10px] text-slate-500">Boutique Pro</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("livreur")}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#065f46] hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <Bike className="w-4 h-4 text-emerald-700 mb-1" />
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#065f46]">Livreur</p>
                  <p className="text-[10px] text-slate-500">Missions</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("admin")}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#065f46] hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700 mb-1" />
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#065f46]">Admin</p>
                  <p className="text-[10px] text-slate-500">Superviseur</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card Form */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <Card className="border-slate-200/90 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-900 to-[#065f46] text-white p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-black italic text-white tracking-tight">
                    Connexion
                  </CardTitle>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-[11px] font-bold text-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Nexora ID</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1 font-medium">
                  Entrez vos identifiants pour accéder à votre compte.
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    <p>{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Adresse Email *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.ga"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mot de passe *</span>
                      </label>
                      <Link
                        href="/auth/reset-password"
                        className="text-xs font-bold text-[#065f46] hover:underline"
                      >
                        Oublié ?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-[#111827] font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="emerald"
                    disabled={isLoading}
                    className="w-full font-bold py-3 text-sm rounded-xl gap-2 shadow-md shadow-emerald-900/10 mt-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Vérification en cours...</span>
                      </div>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Footer Switcher */}
                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-600 font-medium">
                    Pas encore de compte ?{" "}
                    <Link
                      href="/auth/register"
                      className="font-bold text-[#065f46] hover:underline"
                    >
                      Créer un compte gratuitement
                    </Link>
                  </p>
                </div>
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#065f46] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
