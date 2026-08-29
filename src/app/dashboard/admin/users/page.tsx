"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
  Store,
  Bike,
  User,
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";

interface ManualUserRow {
  fullName: string;
  email: string;
  phone: string;
  role: "customer" | "vendor" | "courier" | "admin";
  password: string;
  storeName?: string;
}

export default function AdminUsersBulkPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  // Existing Users State
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Bulk Form State
  const [activeTab, setActiveTab] = useState<"table" | "csv">("table");
  const [rows, setRows] = useState<ManualUserRow[]>([
    {
      fullName: "Commerçant Test",
      email: "marchand.libreville@nexora.ga",
      phone: "+241 077 12 34 56",
      role: "vendor",
      password: "NexoraPassword2026!",
      storeName: "Boutique Prestige Libreville",
    },
    {
      fullName: "Coursier Express",
      email: "coursier.express@nexora.ga",
      phone: "+241 066 98 76 54",
      role: "courier",
      password: "NexoraPassword2026!",
    },
    {
      fullName: "Client VIP Gabon",
      email: "client.vip@nexora.ga",
      phone: "+241 074 55 44 33",
      role: "customer",
      password: "NexoraPassword2026!",
    },
  ]);

  const [csvText, setCsvText] = useState(
    `Nom Complet,Email,Telephone,Role,MotDePasse,NomBoutique\nJean Dupont,jean.dupont@test.ga,+241 077 11 22 33,customer,Pass2026!,,\nMarie Ondo,marie.mode@test.ga,+241 066 44 55 66,vendor,Pass2026!,Marie Boutique Chic\nPaul Biyoghe,paul.moto@test.ga,+241 074 77 88 99,courier,Pass2026!,,`
  );

  // Bulk submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkResponse, setBulkResponse] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setIsLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setProfiles(data);
      }
    } catch {
      setProfiles([]);
    } finally {
      setIsLoadingProfiles(false);
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        fullName: "",
        email: "",
        phone: "+241 ",
        role: "customer",
        password: `Nexora@${Math.floor(100000 + Math.random() * 900000)}`,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof ManualUserRow, value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const downloadCsvTemplate = () => {
    const template = `Nom Complet,Email,Telephone,Role,MotDePasse,NomBoutique
Exemple Acheteur,client@exemple.ga,+241 077 00 00 01,customer,PassNexora2026!,,
Exemple Marchand,vendeur@exemple.ga,+241 066 00 00 02,vendor,PassNexora2026!,Boutique Mode Akanda
Exemple Coursier,livreur@exemple.ga,+241 074 00 00 03,courier,PassNexora2026!,,`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modele_import_utilisateurs_nexora.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setCsvText(text);
        parseCsvToRows(text);
      }
    };
    reader.readAsText(file);
  };

  const parseCsvToRows = (csvContent: string) => {
    const lines = csvContent.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return;

    // Remove header
    const dataLines = lines.slice(1);
    const parsedRows: ManualUserRow[] = [];

    for (const line of dataLines) {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cols.length >= 2 && cols[1].includes("@")) {
        const role = (cols[3] || "customer").toLowerCase() as any;
        parsedRows.push({
          fullName: cols[0] || "Utilisateur Nexora",
          email: cols[1],
          phone: cols[2] || "+241 077 00 00 00",
          role: ["customer", "vendor", "courier", "admin", "client", "vendeur", "livreur"].includes(role)
            ? role === "vendeur"
              ? "vendor"
              : role === "livreur"
              ? "courier"
              : role === "client"
              ? "customer"
              : role
            : "customer",
          password: cols[4] || `Nexora@${Math.floor(100000 + Math.random() * 900000)}`,
          storeName: cols[5] || undefined,
        });
      }
    }

    if (parsedRows.length > 0) {
      setRows(parsedRows);
    }
  };

  const handleExecuteBulkCreation = async () => {
    let payloadUsers: ManualUserRow[] = [];

    if (activeTab === "table") {
      payloadUsers = rows.filter((r) => r.email && r.email.includes("@"));
    } else {
      parseCsvToRows(csvText);
      payloadUsers = rows.filter((r) => r.email && r.email.includes("@"));
    }

    if (payloadUsers.length === 0) {
      alert("Veuillez renseigner au moins un utilisateur avec un email valide.");
      return;
    }

    setIsSubmitting(true);
    setBulkResponse(null);

    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: payloadUsers }),
      });

      const data = await res.json();
      setBulkResponse(data);
      loadProfiles();
    } catch (err: any) {
      setBulkResponse({ error: err.message || "Erreur réseau lors de l'importation." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationLinks = [
    {
      id: "vendor",
      title: "Lien Inscription Marchands / Vendeurs",
      description: "Pour inviter les commerces et boutiques à créer leur vitrine au Gabon.",
      url: `${origin}/auth/register?role=vendeur`,
      badge: "Vendeur Pro",
      variant: "amber" as const,
      icon: <Store className="w-5 h-5 text-amber-600" />,
    },
    {
      id: "courier",
      title: "Lien Inscription Livreurs / Coursiers",
      description: "Pour recruter les livreurs moto/voiture dans les 9 provinces.",
      url: `${origin}/auth/register?role=livreur`,
      badge: "Coursier Express",
      variant: "blue" as const,
      icon: <Bike className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "customer",
      title: "Lien Inscription Acheteurs / Clients",
      description: "Lien standard d'invitation et d'accueil des clients gabonais.",
      url: `${origin}/auth/register?role=client`,
      badge: "Client Standard",
      variant: "emerald" as const,
      icon: <User className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      (p.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      p.role === roleFilter ||
      (roleFilter === "vendor" && p.role === "vendeur") ||
      (roleFilter === "courier" && p.role === "livreur") ||
      (roleFilter === "customer" && p.role === "client");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500 hover:text-slate-800 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Supervision Centrale</span>
                </Button>
              </Link>
              <span className="text-slate-300">/</span>
              <Badge variant="purple" className="text-[10px] font-bold">
                Gestion des Utilisateurs
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
              Création &amp; Importation en Masse d&apos;Utilisateurs
            </h1>
            <p className="text-xs text-slate-500">
              Générez des liens d&apos;inscription ciblés ou importez directement des centaines de comptes (Clients, Marchands, Livreurs).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={loadProfiles}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser les profils</span>
            </Button>
          </div>
        </div>

        {/* SECTION 1 : LIENS D'INVITATION PARTAGEABLES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black italic text-slate-900">
                1. Liens d&apos;Inscription &amp; Recrutement Directs
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">À partager sur WhatsApp, Facebook ou SMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {registrationLinks.map((item) => (
              <Card
                key={item.id}
                className="border-slate-200 bg-white shadow-sm rounded-2xl p-5 space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {item.icon}
                    </div>
                    <Badge variant={item.variant} className="text-[10px] font-bold">
                      {item.badge}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-[11px] font-mono text-slate-600 truncate">
                    <span className="truncate flex-1">{item.url}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => copyToClipboard(item.url, item.id)}
                      variant={copiedLink === item.id ? "emerald" : "default"}
                      size="sm"
                      className="w-full text-xs font-bold gap-1.5"
                    >
                      {copiedLink === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Lien Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le Lien</span>
                        </>
                      )}
                    </Button>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="px-2.5">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 2 : CRÉATION & IMPORTATION EN MASSE */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-black italic flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#065f46]" />
                <span>2. Outil d&apos;Importation &amp; Création Massive</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Créez instantanément les comptes avec e-mail pré-confirmé dans Supabase.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={downloadCsvTemplate}
                variant="outline"
                size="sm"
                className="text-xs font-bold gap-1.5 border-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Télécharger Modèle CSV</span>
              </Button>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Charger un fichier .csv</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvFileUpload}
                />
              </label>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                onClick={() => setActiveTab("table")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "table"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Tableau Interactif ({rows.length} comptes)
              </button>
              <button
                onClick={() => setActiveTab("csv")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "csv"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Éditeur Texte / CSV Direct
              </button>
            </div>

            {/* TAB 1: INTERACTIVE TABLE */}
            {activeTab === "table" && (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Nom &amp; Prénom</th>
                        <th className="p-3">Email (Identifiant)</th>
                        <th className="p-3">Téléphone (+241)</th>
                        <th className="p-3">Rôle Plateforme</th>
                        <th className="p-3">Mot de Passe Initial</th>
                        <th className="p-3">Nom Boutique (Optionnel)</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5">
                            <Input
                              value={row.fullName}
                              onChange={(e) => handleUpdateRow(idx, "fullName", e.target.value)}
                              placeholder="ex: Tatiana Mengue"
                              className="h-8 text-xs min-w-[140px]"
                            />
                          </td>
                          <td className="p-2.5">
                            <Input
                              value={row.email}
                              onChange={(e) => handleUpdateRow(idx, "email", e.target.value)}
                              placeholder="ex: tatiana@domaine.ga"
                              className="h-8 text-xs min-w-[180px]"
                            />
                          </td>
                          <td className="p-2.5">
                            <Input
                              value={row.phone}
                              onChange={(e) => handleUpdateRow(idx, "phone", e.target.value)}
                              placeholder="+241 077 00 00 00"
                              className="h-8 text-xs min-w-[130px]"
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={row.role}
                              onChange={(e) => handleUpdateRow(idx, "role", e.target.value)}
                              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold"
                            >
                              <option value="customer">Client (Acheteur)</option>
                              <option value="vendor">Vendeur (Boutique)</option>
                              <option value="courier">Livreur (Coursier)</option>
                              <option value="admin">Administrateur</option>
                            </select>
                          </td>
                          <td className="p-2.5">
                            <Input
                              value={row.password}
                              onChange={(e) => handleUpdateRow(idx, "password", e.target.value)}
                              className="h-8 text-xs font-mono min-w-[130px]"
                            />
                          </td>
                          <td className="p-2.5">
                            {row.role === "vendor" ? (
                              <Input
                                value={row.storeName || ""}
                                onChange={(e) => handleUpdateRow(idx, "storeName", e.target.value)}
                                placeholder="ex: Saveurs du Terroir"
                                className="h-8 text-xs min-w-[140px]"
                              />
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Non applicable</span>
                            )}
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleRemoveRow(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    onClick={handleAddRow}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </Button>

                  <Button
                    onClick={handleExecuteBulkCreation}
                    disabled={isSubmitting || rows.length === 0}
                    className="bg-[#065f46] hover:bg-[#044e3a] text-white font-bold text-xs gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Création en cours sur Supabase...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Créer {rows.length} utilisateur(s) sur Nexora</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: RAW CSV EDITOR */}
            {activeTab === "csv" && (
              <div className="space-y-4">
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="Collez vos lignes CSV ici..."
                />

                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => parseCsvToRows(csvText)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Convertir en tableau interactif</span>
                  </Button>

                  <Button
                    onClick={handleExecuteBulkCreation}
                    disabled={isSubmitting}
                    className="bg-[#065f46] hover:bg-[#044e3a] text-white font-bold text-xs gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Importation en cours...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Importer et Créer les comptes</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* BULK RESPONSE DISPLAY */}
            {bulkResponse && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  bulkResponse.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    {bulkResponse.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>{bulkResponse.message || bulkResponse.error}</span>
                  </div>
                  {bulkResponse.successfulCount !== undefined && (
                    <Badge variant="emerald">
                      {bulkResponse.successfulCount} / {bulkResponse.totalCount} réussis
                    </Badge>
                  )}
                </div>

                {bulkResponse.results && (
                  <div className="max-h-40 overflow-y-auto divide-y divide-emerald-100 font-mono text-[11px] bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                    {bulkResponse.results.map((res: any, i: number) => (
                      <div key={i} className="py-1.5 flex items-center justify-between">
                        <span>
                          {res.email} ({res.role})
                        </span>
                        {res.success ? (
                          <span className="text-emerald-700 font-semibold">
                            ✅ Mot de passe : {res.generatedPassword}
                          </span>
                        ) : (
                          <span className="text-rose-600">❌ {res.error}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3 : LISTE EN DIRECT DES UTILISATEURS EXISTANTS */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-black italic flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>3. Utilisateurs Enregistrés en Base Supabase ({profiles.length})</span>
              </CardTitle>
              <p className="text-xs text-slate-500">
                Liste consolidée des profils clients, vendeurs, livreurs et administrateurs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher nom, email..."
                  className="h-8 pl-8 text-xs w-[180px]"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold"
              >
                <option value="all">Tous les rôles</option>
                <option value="customer">Clients uniquement</option>
                <option value="vendor">Vendeurs uniquement</option>
                <option value="courier">Livreurs uniquement</option>
                <option value="admin">Administrateurs uniquement</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoadingProfiles ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Chargement des profils Supabase...
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="p-10 text-center space-y-2 text-slate-500">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">Aucun utilisateur correspondant trouvé</p>
                <p className="text-[11px]">Utilisez le formulaire ci-dessus pour en ajouter ou partagez les liens d&apos;inscription.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Utilisateur</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Téléphone</th>
                      <th className="p-3.5">Rôle</th>
                      <th className="p-3.5">Date d&apos;inscription</th>
                      <th className="p-3.5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          {p.full_name || "Sans nom"}
                        </td>
                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                          {p.email}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {p.phone || "Non renseigné"}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              p.role === "admin"
                                ? "purple"
                                : p.role === "vendor" || p.role === "vendeur"
                                ? "amber"
                                : p.role === "courier" || p.role === "livreur"
                                ? "blue"
                                : "emerald"
                            }
                            className="text-[10px] capitalize font-bold"
                          >
                            {p.role}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Actif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        Nexora Gabon • Module d&apos;Administration et Gestion des Utilisateurs en Masse
      </footer>

      <CartDrawer />
      <LocationModal />
    </div>
  );
}
