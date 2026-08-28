"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Search,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  Store,
  Bike,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { useUserStore } from "@/store/use-user-store";
import { useUser } from "@/hooks/useUser";
import { formatFCFA } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function Navbar({ onSearch }: { onSearch?: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const { toggleCart, getTotalItemsCount, getSubtotal } = useCartStore();
  const { selectedLocation, toggleLocationModal } = useUserStore();
  const { user, profile, role, isVendor, isCourier, isAdmin, signOut, isAuthenticated } = useUser();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItemsCount() : 0;
  const subtotal = mounted ? getSubtotal() : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const displayName = profile?.full_name || (user ? user.email?.split("@")[0] : null);

  const getDashboardLink = () => {
    if (isVendor) return "/dashboard/vendor";
    if (isCourier) return "/dashboard/courier";
    if (isAdmin) return "/dashboard/admin";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#065f46] via-[#047857] to-[#064e3b] px-4 py-1.5 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-[#d97706] animate-pulse" />
            <span className="truncate font-medium">
              🇬🇦 <strong>Nexora Gabon</strong> : Marketplace 100% connectée (Airtel Money, Moov Money, Cash)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-medium text-emerald-100">
            <span>📞 Service Client Libreville : 077 45 89 12</span>
            <span>⚡ Livraison express avec repères visuels</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#065f46] to-[#10b981] text-white shadow-md shadow-[#065f46]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic tracking-tight text-[#111827] flex items-center gap-1">
                NEXORA
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-[#065f46]">
                  GA
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 -mt-0.5">
                Marketplace du Gabon
              </span>
            </div>
          </Link>

          {/* Quick Location Selector (Desktop) */}
          <button
            onClick={toggleLocationModal}
            className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Changer de ville ou quartier"
          >
            <div className="rounded-full bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                Livraison à
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                {selectedLocation.ville}, {selectedLocation.quartier}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="relative hidden md:flex flex-1 max-w-lg items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher un produit, chocolat de Kango, smartphone, artisanat..."
            className="w-full rounded-full border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-sm text-[#111827] placeholder:text-slate-400 transition-all focus:border-[#065f46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-role / Dashboard quick link */}
          <Link href={getDashboardLink()}>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1.5 border-slate-200 hover:border-slate-300 dark:border-slate-700 text-xs font-bold"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Tableau de bord</span>
              <Badge variant="emerald" className="text-[10px] py-0 px-1.5 capitalize">
                {role}
              </Badge>
            </Button>
          </Link>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {mounted && isAuthenticated && displayName ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-bold text-[#111827]"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#065f46] flex items-center justify-center font-black text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-2 z-50 animate-scale space-y-1"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-xs text-[#111827] truncate">{displayName}</p>
                      <Badge variant="emerald" className="text-[9px] mt-1 capitalize">
                        Compte {role}
                      </Badge>
                    </div>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>Mon Compte &amp; Adresses</span>
                    </Link>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#065f46]" />
                      <span>Espace {role.toUpperCase()}</span>
                    </Link>

                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-bold text-slate-700">
                    <LogIn className="w-3.5 h-3.5 text-[#065f46]" />
                    <span>Connexion</span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="emerald" size="sm" className="gap-1.5 text-xs font-bold">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>S&apos;inscrire</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Button
            onClick={toggleCart}
            variant="emerald"
            size="md"
            className="relative gap-2 font-semibold shadow-sm"
            aria-label="Voir le panier"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 animate-scale">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Panier</span>
            {subtotal > 0 && (
              <span className="hidden md:inline font-bold border-l border-emerald-500/50 pl-2 text-xs">
                {formatFCFA(subtotal)}
              </span>
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Location Row */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50 space-y-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher au Gabon..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-[#111827] focus:border-[#065f46] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <button
          onClick={toggleLocationModal}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Zone : <strong>{selectedLocation.ville} ({selectedLocation.quartier})</strong>
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 underline">
            Modifier
          </span>
        </button>

        {/* Mobile Auth Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-[#065f46]" />
              <span>Connexion</span>
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button variant="emerald" size="sm" className="w-full text-xs font-bold gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>S&apos;inscrire</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
