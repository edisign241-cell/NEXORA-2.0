"use client";

import * as React from "react";
import Link from "next/link";
import { useUserStore } from "@/store/use-user-store";
import { UserRole } from "@/lib/types/marketplace";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Store,
  Truck,
  ShieldAlert,
  UserCheck,
  ExternalLink,
} from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole, user } = useUserStore();

  const roles: {
    id: UserRole;
    label: string;
    description: string;
    href?: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: "client",
      label: "Client (Acheteur)",
      description: "Commandes & livraisons à votre repère",
      icon: <ShoppingBag className="w-4 h-4" />,
      color: "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      id: "vendeur",
      label: "Vendeur (Boutique)",
      description: "Gestion catalogue, stocks & ventes",
      href: "/dashboard/vendor",
      icon: <Store className="w-4 h-4" />,
      color: "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      id: "livreur",
      label: "Livreur (Coursier)",
      description: "Missions & courses par repères visuels",
      href: "/dashboard/courier",
      icon: <Truck className="w-4 h-4" />,
      color: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      id: "admin",
      label: "Administrateur",
      description: "Supervision centrale & flux Gabon",
      icon: <ShieldAlert className="w-4 h-4" />,
      color: "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Simulateur de Rôle Multi-Utilisateurs
            </h3>
            <p className="text-xs text-slate-500">
              Basculez instantanément de rôle ou accédez aux pages dédiées (Vendeur, Livreur, Admin).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {roles.map((r) => {
          const isActive = role === r.id;
          return (
            <div
              key={r.id}
              className={cn(
                "flex flex-col justify-between p-3 rounded-xl border text-left transition-all",
                isActive
                  ? `${r.color} ring-2 ring-emerald-500/20 font-bold`
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <button
                type="button"
                onClick={() => setRole(r.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    {r.icon}
                    {r.label}
                  </span>
                  {isActive && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      Actif
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate w-full">
                  {r.description}
                </span>
              </button>

              {r.href && (
                <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end">
                  <Link
                    href={r.href}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    <span>Ouvrir la page dédiée</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
