"use client";

import React, { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("email", email);

    try {
      const result = await resetPassword(formData);
      if (!result.success) {
        setErrorMessage(result.error || "Erreur lors de la demande de réinitialisation.");
      } else {
        setSuccessMessage(result.message || "Un email de réinitialisation vous a été envoyé.");
      }
    } catch {
      setErrorMessage("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-md w-full px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        <Card className="border-slate-200/90 shadow-xl bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-900 to-[#065f46] text-white p-6">
            <CardTitle className="text-xl font-black italic text-white tracking-tight">
              Mot de passe oublié
            </CardTitle>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium">
              Saisissez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Adresse Email associée à votre compte *</span>
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

              <Button
                type="submit"
                variant="emerald"
                disabled={isLoading}
                className="w-full font-bold py-3 text-sm rounded-xl gap-2 shadow-md shadow-emerald-900/10"
              >
                {isLoading ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer le lien de réinitialisation</span>
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-slate-100 pt-4 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065f46] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la page de connexion</span>
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
