"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserStore } from "@/store/use-user-store";
import { Loader2, Sparkles } from "lucide-react";

export default function DashboardIndexRouter() {
  const router = useRouter();
  const { profile, user, isLoading } = useAuth();
  const { role: storeRole } = useUserStore();

  useEffect(() => {
    if (isLoading) return;

    const currentRole = (
      profile?.role ||
      user?.user_metadata?.role ||
      storeRole ||
      "customer"
    ).toLowerCase();

    if (currentRole === "vendor" || currentRole === "vendeur") {
      router.replace("/dashboard/vendor");
    } else if (currentRole === "courier" || currentRole === "livreur") {
      router.replace("/dashboard/courier");
    } else if (currentRole === "admin" || currentRole === "superadmin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [profile, user, storeRole, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#065f46] flex flex-col items-center gap-3 shadow-md">
        <div className="p-3 rounded-xl bg-white shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#065f46]" />
        </div>
        <div>
          <h2 className="text-base font-black italic text-[#111827]">
            Redirection vers votre espace dédié...
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nexora Gabon • Contrôle d&apos;accès sécurisé
          </p>
        </div>
      </div>
    </div>
  );
}
