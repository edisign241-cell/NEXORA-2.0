"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { GABON_PROVINCES } from "@/lib/constants/gabon-locations";
import {
  User,
  Store,
  Bike,
  Mail,
  Lock,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Car,
  Eye,
  EyeOff,
} from "lucide-react";

type AccountRole = "customer" | "vendor" | "courier";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<AccountRole>("customer");

  React.useEffect(() => {
    if (roleParam) {
      const lower = roleParam.toLowerCase();
      if (lower === "vendor" || lower === "vendeur" || lower === "marchand") {
        setSelectedRole("vendor");
      } else if (lower === "courier" || lower === "livreur" || lower === "coursier") {
        setSelectedRole("courier");
      } else if (lower === "customer" || lower === "client") {
        setSelectedRole("customer");
      }
    }
  }, [roleParam]);

  // Common Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+241 ");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Vendor Fields
  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("Mode & Beauté");
  const [district, setDistrict] = useState("Akanda");
  const [addressLandmark, setAddressLandmark] = useState("");

  // Courier Fields
  const [vehicleType, setVehicleType] = useState<"moto" | "voiture" | "velo" | "a_pied">("moto");

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("role", selectedRole);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);

    if (selectedRole === "vendor") {
      formData.append("storeName", storeName || `Boutique de ${fullName}`);
      formData.append("storeCategory", storeCategory);
      formData.append("district", district);
      formData.append("addressLandmark", addressLandmark || "Face voie principale");
    }

    if (selectedRole === "courier") {
      formData.append("vehicleType", vehicleType);
    }

    try {
      const result = await signUp(formData);
      if (!result.success) {
        setErrorMessage(result.error || "Erreur lors de l'inscription.");
        setIsLoading(false);
      } else {
        setSuccessMessage(result.message || "Inscription réussie !");
        setTimeout(() => {
          router.push(result.redirectUrl || "/auth/login?registered=true");
          router.refresh();
        }, 800);
      }
    } catch {
      setErrorMessage("Une erreur imprévue est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 sm:py-12 flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#065f46] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Rejoignez l&apos;écosystème Nexora Gabon</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-[#111827] tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Choisissez votre profil pour commencer vos achats, vendre vos articles ou effectuer des livraisons.
            </p>
          </div>

          {/* Account Role Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Client Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedRole === "customer"
                  ? "border-[#065f46] bg-emerald-50/60 shadow-md ring-2 ring-[#065f46]/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-[#065f46]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm text-[#111827]">Client / Acheteur</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Commander des produits locaux et payer par Airtel/Moov Money.
                  </p>
                </div>
              </div>
              {selectedRole === "customer" && (
                <Badge variant="emerald" className="mt-3 w-fit text-[10px]">Sélectionné</Badge>
              )}
            </button>

            {/* 2. Vendeur Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("vendor")}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedRole === "vendor"
                  ? "border-[#065f46] bg-emerald-50/60 shadow-md ring-2 ring-[#065f46]/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#d97706]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm text-[#111827]">Vendeur Pro</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Créer votre vitrine, gérer vos stocks et recevoir vos virements.
                  </p>
                </div>
              </div>
              {selectedRole === "vendor" && (
                <Badge variant="emerald" className="mt-3 w-fit text-[10px]">Sélectionné</Badge>
              )}
            </button>

            {/* 3. Livreur Card */}
            <button
              type="button"
              onClick={() => setSelectedRole("courier")}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedRole === "courier"
                  ? "border-[#065f46] bg-emerald-50/60 shadow-md ring-2 ring-[#065f46]/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm text-[#111827]">Livreur Partenaire</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Prendre en charge des courses géolocalisées avec repères visuels.
                  </p>
                </div>
              </div>
              {selectedRole === "courier" && (
                <Badge variant="emerald" className="mt-3 w-fit text-[10px]">Sélectionné</Badge>
              )}
            </button>
          </div>

          {/* Form Card */}
          <Card className="border-slate-200/90 shadow-xl bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-900 to-[#065f46] text-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-black italic text-white tracking-tight">
                  Informations de votre compte{" "}
                  {selectedRole === "customer"
                    ? "Client"
                    : selectedRole === "vendor"
                    ? "Vendeur"
                    : "Livreur"}
                </CardTitle>
                <span className="text-xs bg-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-200 font-bold">
                  Étape unique
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* SECTION 1: COMMON PERSONAL DETAILS */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    1. Identité &amp; Contact
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Nom complet *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Tatiana Mengue"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Numéro de téléphone Gabon (Airtel / Moov) *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+241 077 XX XX XX"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-mono font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="tatiana@exemple.ga"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mot de passe (6 caractères min.) *</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-[#111827] font-medium placeholder:text-slate-400 focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: VENDOR SPECIFIC FIELDS */}
                {selectedRole === "vendor" && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
                    <h4 className="text-xs font-black uppercase text-[#d97706] tracking-wider flex items-center gap-1.5">
                      <Store className="w-4 h-4" />
                      <span>2. Informations de votre Boutique Pro</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111827]">Nom de l&apos;enseigne / Boutique *</label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Ex: Saveurs & Terroir du Gabon"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-slate-500" />
                          <span>Catégorie principale *</span>
                        </label>
                        <select
                          value={storeCategory}
                          onChange={(e) => setStoreCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium focus:border-[#065f46] focus:bg-white focus:outline-none"
                        >
                          <option value="Mode & Beauté">Mode &amp; Beauté</option>
                          <option value="High-Tech & Électronique">High-Tech &amp; Électronique</option>
                          <option value="Alimentation & Terroir">Alimentation &amp; Terroir Gabonais</option>
                          <option value="Maison & Artisanat">Maison &amp; Artisanat</option>
                          <option value="Santé & Bien-être">Santé &amp; Bien-être</option>
                          <option value="Auto & Moto">Auto &amp; Moto</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>Quartier (Libreville / Akanda / Port-Gentil) *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Ex: Angondjé Château"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium focus:border-[#065f46] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111827]">Repère visuel (Indispensable au Gabon) *</label>
                        <input
                          type="text"
                          required
                          value={addressLandmark}
                          onChange={(e) => setAddressLandmark(e.target.value)}
                          placeholder="Ex: En face de la pharmacie, portail vert"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#111827] font-medium focus:border-[#065f46] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: COURIER SPECIFIC FIELDS */}
                {selectedRole === "courier" && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
                    <h4 className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                      <Bike className="w-4 h-4" />
                      <span>2. Informations du Livreur</span>
                    </h4>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111827]">Moyen de déplacement pour les courses *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: "moto", label: "Moto", icon: Bike },
                          { id: "voiture", label: "Voiture / Van", icon: Car },
                          { id: "velo", label: "Vélo", icon: Bike },
                          { id: "a_pied", label: "À pied", icon: User },
                        ].map((item) => {
                          const IconComp = item.icon;
                          const isSelected = vehicleType === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setVehicleType(item.id as any)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                                isSelected
                                  ? "border-[#065f46] bg-emerald-50 text-[#065f46] font-bold"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                              <span className="text-xs">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms and Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="emerald"
                    disabled={isLoading}
                    className="w-full font-bold py-3 text-sm rounded-xl gap-2 shadow-md shadow-emerald-900/10"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Création du compte en cours...</span>
                      </div>
                    ) : (
                      <>
                        <span>Créer mon compte {selectedRole === "vendor" ? "Vendeur" : selectedRole === "courier" ? "Livreur" : "Client"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600 font-medium">
                    Vous avez déjà un compte ?{" "}
                    <Link href="/auth/login" className="font-bold text-[#065f46] hover:underline">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs text-slate-500">
          Chargement de l'inscription Nexora...
        </div>
      }
    >
      <RegisterFormContent />
    </React.Suspense>
  );
}
