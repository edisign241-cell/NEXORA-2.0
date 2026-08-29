"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketplace/navbar";
import { CartDrawer } from "@/components/marketplace/cart-drawer";
import { LocationModal } from "@/components/marketplace/location-modal";
import { MediaUploader, MediaItem } from "@/components/dashboard/media-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatFCFA } from "@/lib/utils";
import { ProductCategory, Product } from "@/lib/types/marketplace";
import {
  Store as StoreIcon,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Smartphone,
  Sparkles,
  Trash2,
  Check,
  DollarSign,
  Truck,
  ExternalLink,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { SocialCoachModal } from "@/components/dashboard/social-coach-modal";
import { SocialGrowthCoach } from "@/lib/services/social-coach";
import { UserDrawer } from "@/components/navigation/UserDrawer";
import { User } from "lucide-react";

interface VendorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: { title: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: "airtel_money" | "moov_money" | "cash_on_delivery";
  deliveryDistrict: string;
  deliveryLandmark: string;
  status: "pending" | "preparing" | "ready_for_pickup" | "completed" | "cancelled";
  createdAt: string;
}

const INITIAL_VENDOR_ORDERS: VendorOrder[] = [
  {
    id: "ord-1",
    orderNumber: "NX-LBV-2026-8912",
    customerName: "Marc Ndong Mba",
    customerPhone: "+241 077 45 89 12",
    items: [
      { title: "Chocolat Artisanal Pur Kango (70%)", quantity: 2, price: 9900 },
      { title: "Miel Pur de la Ngounié (500g)", quantity: 1, price: 6500 },
    ],
    totalAmount: 26300,
    paymentMethod: "airtel_money",
    deliveryDistrict: "Nzeng-Ayong",
    deliveryLandmark: "Face pharmacie de Nzeng-Ayong, grand portail vert",
    status: "pending",
    createdAt: "Il y a 10 min",
  },
  {
    id: "ord-2",
    orderNumber: "NX-LBV-2026-7840",
    customerName: "Sylvie Boussamba",
    customerPhone: "+241 066 12 34 56",
    items: [
      { title: "Odika Moulu Artisanal de Makokou (250g)", quantity: 3, price: 5500 },
    ],
    totalAmount: 16500,
    paymentMethod: "moov_money",
    deliveryDistrict: "Angondjé Château",
    deliveryLandmark: "À côté de l'école publique, barrière bleue",
    status: "preparing",
    createdAt: "Il y a 35 min",
  },
  {
    id: "ord-3",
    orderNumber: "NX-LBV-2026-6120",
    customerName: "Arnaud Ondo",
    customerPhone: "+241 074 88 99 00",
    items: [
      { title: "Pâte de Piment Rouge d'Oyem Extra Fort", quantity: 2, price: 3000 },
      { title: "Chocolat Artisanal Pur Kango (70%)", quantity: 1, price: 9900 },
    ],
    totalAmount: 15900,
    paymentMethod: "cash_on_delivery",
    deliveryDistrict: "Louis",
    deliveryLandmark: "Immeuble en face de la clinique Chambrier",
    status: "ready_for_pickup",
    createdAt: "Il y a 1h",
  },
];

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "preset-kango-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80",
    name: "feves-cacao-kango-gabon.jpg",
    size: "1.4 MB",
    isCover: true,
  },
  {
    id: "preset-kango-video",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    name: "fabrication-kango-demo.mp4",
    size: "4.2 MB",
    isCover: false,
  },
];

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"products" | "orders" | "finances">("products");
  const [orders, setOrders] = React.useState<VendorOrder[]>([]);
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [selectedCoachProduct, setSelectedCoachProduct] = React.useState<any | null>(null);

  // New product form state
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newNom, setNewNom] = React.useState("");
  const [newPrix, setNewPrix] = React.useState("");
  const [newPrixPromo, setNewPrixPromo] = React.useState("");
  const [newStock, setNewStock] = React.useState("10");
  const [newCategorie, setNewCategorie] = React.useState<ProductCategory>("alimentation_terroir");
  const [newDescription, setNewDescription] = React.useState("");
  const [mediaList, setMediaList] = React.useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [isAdding, setIsAdding] = React.useState(false);
  const [formSuccess, setFormSuccess] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Order status actions
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: "preparing" | "ready_for_pickup" | "completed" | "cancelled"
  ) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Stock quick adjustment
  const handleAdjustStock = (productId: string, delta: number) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  // Autonomously generate product description via SellerCoach IA
  const handleAutoGenerateDescription = () => {
    if (!newNom.trim()) {
      alert("Veuillez d'abord renseigner le nom de votre produit (ex: Chocolat Noir Kango).");
      return;
    }
    const autoDesc = SocialGrowthCoach.generateAutonomousProductDescription({
      productName: newNom,
      category: newCategorie,
      priceXaf: Number(newPrix) || undefined,
      storeName: "Saveurs & Terroir du Gabon",
      location: "Libreville",
    });
    setNewDescription(autoDesc);
  };

  // Handle product creation
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom.trim() || !newPrix) return;

    setIsAdding(true);

    const priceNum = parseInt(newPrix, 10) || 0;
    const promoNum = newPrixPromo ? parseInt(newPrixPromo, 10) : undefined;
    const stockNum = parseInt(newStock, 10) || 0;

    const uploadedImages = mediaList
      .filter((m) => m.type === "image")
      .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
      .map((m) => m.url);

    const uploadedVideo = mediaList.find((m) => m.type === "video")?.url;

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      storeId: "store-1",
      storeName: "Saveurs & Terroir du Gabon",
      nom: newNom.trim(),
      slug: newNom.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: newDescription.trim() || "Produit certifié et garanti d'origine gabonaise.",
      prix: priceNum,
      prixPromo: promoNum,
      categorie: newCategorie,
      images:
        uploadedImages.length > 0
          ? uploadedImages
          : ["https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80"],
      videoUrl: uploadedVideo,
      stock: stockNum,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      isAvailableForExpressDelivery: true,
      badges: ["Terroir Gabonais", "Nouveau"],
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setProductsList((prev) => [newProd, ...prev]);
      setIsAdding(false);
      setFormSuccess(true);
      setNewNom("");
      setNewPrix("");
      setNewPrixPromo("");
      setNewDescription("");
      setTimeout(() => {
        setFormSuccess(false);
        setShowAddForm(false);
      }, 1500);
    }, 600);
  };

  // Key metrics calculation
  const pendingOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;
  const outOfStockCount = productsList.filter((p) => p.stock <= 2).length;
  const revenueToday = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Espace Multi-Rôles</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="emerald" className="text-xs font-bold gap-1">
                <StoreIcon className="w-3 h-3" />
                Espace Vendeur Pro
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111827] tracking-tight">
              Saveurs &amp; Terroir du Gabon
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Gérante : <strong>Tatiana Mengue</strong> • Angondjé Château, Akanda (Province de l&apos;Estuaire)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/boutique/saveurs-terroir-gabon" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                <span>Voir ma vitrine publique</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold text-xs"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Mon Profil</span>
            </Button>
            <Button
              onClick={() => {
                setActiveTab("products");
                setShowAddForm(true);
              }}
              variant="emerald"
              size="sm"
              className="gap-1.5 font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </Button>
          </div>
        </div>

        {/* 3 Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Metric 1: Daily Revenue */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Revenus du Jour (XAF)
                </p>
                <h3 className="text-2xl font-black italic text-[#065f46]">
                  {formatFCFA(revenueToday)}
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#065f46]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18% vs hier • Versements Airtel/Moov actifs</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#065f46]">
                <DollarSign className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Metric 2: Pending Orders */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Commandes en Cours
                </p>
                <h3 className="text-2xl font-black italic text-[#d97706]">
                  {pendingOrdersCount} commande(s)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  À préparer et confier aux coursiers moto
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#d97706]">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Metric 3: Critical / Out of Stock */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stock Critique / Rupture
                </p>
                <h3 className={`text-2xl font-black italic ${outOfStockCount > 0 ? "text-rose-600" : "text-[#065f46]"}`}>
                  {outOfStockCount} article(s)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {outOfStockCount > 0 ? "Réapprovisionnement conseillé" : "Tous les stocks sont OK"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "orders"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes Récentes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "products"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue &amp; Stocks ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("finances")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "finances"
                ? "border-[#065f46] text-[#065f46]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Versements Mobile Money</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black italic text-[#111827]">
                Traitement des commandes clients
              </h2>
              <span className="text-xs text-slate-500">
                Paiements vérifiés par Nexora Gabon
              </span>
            </div>

            {orders.length === 0 ? (
              <Card className="border border-dashed border-slate-200 bg-white/60 p-12 text-center space-y-3 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Aucune commande en attente</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dès qu&apos;un client passe une commande pour vos articles, elle apparaîtra ici avec son point de repère de livraison et son statut de paiement.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <Card
                    key={ord.id}
                    className="overflow-hidden border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm"
                  >
                  <div className="p-5 space-y-4">
                    {/* Top Row: Order ID, Time, Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-slate-900 dark:text-slate-100">
                          {ord.orderNumber}
                        </span>
                        <Badge
                          variant={
                            ord.status === "pending"
                              ? "amber"
                              : ord.status === "preparing"
                              ? "blue"
                              : ord.status === "ready_for_pickup"
                              ? "purple"
                              : ord.status === "completed"
                              ? "emerald"
                              : "destructive"
                          }
                          className="text-xs font-bold capitalize"
                        >
                          {ord.status === "pending" && "⏳ En attente d'acceptation"}
                          {ord.status === "preparing" && "👨‍🍳 En cours de préparation"}
                          {ord.status === "ready_for_pickup" && "🛵 Prêt pour le livreur"}
                          {ord.status === "completed" && "✓ Livré au client"}
                          {ord.status === "cancelled" && "✕ Annulé"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ord.createdAt}</span>
                      </div>
                    </div>

                    {/* Middle Row: Customer Info & Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Customer & Location (6 cols) */}
                      <div className="lg:col-span-6 space-y-2 text-xs">
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1">
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            Client : {ord.customerName} ({ord.customerPhone})
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            Quartier : <strong>{ord.deliveryDistrict}</strong>
                          </p>
                          <p className="text-slate-500 font-normal">
                            📍 <strong>Point de repère :</strong> {ord.deliveryLandmark}
                          </p>
                          <div className="pt-1 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="capitalize">
                              Mode de paiement : <strong>{ord.paymentMethod.replace("_", " ")}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items (6 cols) */}
                      <div className="lg:col-span-6 space-y-2 text-xs">
                        <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 space-y-1.5">
                          <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                            Articles commandés :
                          </p>
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                              <span>
                                {it.quantity}x {it.title}
                              </span>
                              <span className="font-bold">{formatFCFA(it.price * it.quantity)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-black text-sm text-emerald-600 dark:text-emerald-400">
                            <span>Total à percevoir :</span>
                            <span>{formatFCFA(ord.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                      {ord.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleUpdateOrderStatus(ord.id, "cancelled")}
                            variant="ghost"
                            size="sm"
                            className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 font-semibold"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refuser la commande
                          </Button>
                          <Button
                            onClick={() => handleUpdateOrderStatus(ord.id, "preparing")}
                            variant="emerald"
                            size="sm"
                            className="text-xs font-bold gap-1 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            Accepter la commande
                          </Button>
                        </>
                      )}

                      {ord.status === "preparing" && (
                        <Button
                          onClick={() => handleUpdateOrderStatus(ord.id, "ready_for_pickup")}
                          variant="emerald"
                          size="sm"
                          className="text-xs font-bold gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <Truck className="w-4 h-4" />
                          Prêt pour livraison (Alerter le livreur)
                        </Button>
                      )}

                      {ord.status === "ready_for_pickup" && (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <span>Coursier assigné en route vers votre boutique</span>
                        </div>
                      )}

                      {ord.status === "completed" && (
                        <span className="text-xs text-slate-400 font-semibold">
                          Commande clôturée et payée
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

        {/* TAB 2: PRODUCTS MANAGEMENT & ADD FORM */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Toggle Add Product Form */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  Catalogue &amp; Gestion des Stocks
                </h2>
                <p className="text-xs text-slate-500">
                  Mettez à jour vos prix, photos, vidéos et stocks en temps réel pour les acheteurs gabonais
                </p>
              </div>

              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "emerald"}
                size="sm"
                className="gap-1.5 font-bold text-xs"
              >
                {showAddForm ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Masquer le formulaire</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un produit</span>
                  </>
                )}
              </Button>
            </div>

            {/* Quick Add Product Form (Collapsible / Modal) */}
            {showAddForm && (
              <Card className="border-2 border-emerald-500/40 bg-white dark:bg-slate-900 dark:border-emerald-800/40 shadow-xl animate-scale">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>Formulaire d&apos;ajout rapide de produit (Photos &amp; Vidéos)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                  <form onSubmit={handleCreateProduct} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Input
                        label="Nom du produit *"
                        required
                        value={newNom}
                        onChange={(e) => setNewNom(e.target.value)}
                        placeholder="Ex : Chocolat Noir Kango 85%"
                      />

                      <Input
                        label="Prix de vente (FCFA) *"
                        type="number"
                        required
                        value={newPrix}
                        onChange={(e) => setNewPrix(e.target.value)}
                        placeholder="Ex : 9900"
                      />

                      <Input
                        label="Prix promotionnel (Optionnel FCFA)"
                        type="number"
                        value={newPrixPromo}
                        onChange={(e) => setNewPrixPromo(e.target.value)}
                        placeholder="Ex : 8500"
                      />

                      <Input
                        label="Stock initial *"
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Ex : 15"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <Select
                          label="Catégorie *"
                          value={newCategorie}
                          onChange={(e) => setNewCategorie(e.target.value as ProductCategory)}
                        >
                          <option value="alimentation_terroir">Épicerie &amp; Terroir Gabonais</option>
                          <option value="mode_beaute">Mode &amp; Wax</option>
                          <option value="high_tech">Électronique &amp; High-Tech</option>
                          <option value="maison_artisanat">Artisanat &amp; Pierre de Mbigou</option>
                          <option value="sante_bien_etre">Santé &amp; Bien-être</option>
                          <option value="services">Services &amp; Livraison</option>
                        </Select>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Description détaillée du produit
                          </label>
                          <Button
                            type="button"
                            onClick={handleAutoGenerateDescription}
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] font-bold gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Rédiger avec SellerCoach IA</span>
                          </Button>
                        </div>
                        <textarea
                          rows={3}
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Origine des ingrédients au Gabon, bienfaits, conseils d'utilisation (ou cliquez sur 'Rédiger avec SellerCoach IA')..."
                          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Media Uploader (Photos + Videos) */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <MediaUploader
                        mediaList={mediaList}
                        onChange={setMediaList}
                        maxImages={6}
                        maxVideos={2}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAddForm(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isAdding}
                        variant="emerald"
                        className="gap-2 font-bold shadow-md shadow-emerald-600/20"
                      >
                        {formSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Produit &amp; Médias Publiés !</span>
                          </>
                        ) : isAdding ? (
                          <span>Publication en cours...</span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Publier dans mon catalogue</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Products Table */}
            {productsList.length === 0 ? (
              <Card className="border border-dashed border-slate-200 bg-white/60 p-12 text-center space-y-4 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mx-auto">
                  <Package className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Vous n&apos;avez pas encore de produit en ligne</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Publiez vos premiers articles avec photos, vidéos et prix en FCFA pour commencer à recevoir des commandes.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="bg-[#065f46] hover:bg-[#044e3a] text-white gap-2 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter mon premier produit</span>
                </Button>
              </Card>
            ) : (
              <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Article</th>
                        <th className="p-4">Médias</th>
                        <th className="p-4">Catégorie</th>
                        <th className="p-4">Prix Public</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.nom}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{prod.nom}</p>
                            <p className="text-[10px] text-slate-400">Réf: {prod.id}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                              {prod.images.length}
                            </span>
                            {prod.videoUrl && (
                              <Badge variant="blue" className="text-[9px] px-1 py-0 gap-0.5">
                                <Film className="w-2.5 h-2.5" />
                                Vidéo
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="emerald" className="text-[10px] capitalize">
                            {prod.categorie.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-4 font-black text-slate-900 dark:text-slate-100">
                          {formatFCFA(prod.prixPromo ?? prod.prix)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdjustStock(prod.id, -1)}
                              className="h-6 w-6 rounded border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                            >
                              -
                            </button>
                            <span className={`w-8 text-center font-bold ${prod.stock <= 2 ? "text-rose-600" : "text-slate-900 dark:text-slate-100"}`}>
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleAdjustStock(prod.id, +1)}
                              className="h-6 w-6 rounded border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          {prod.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              En ligne
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Rupture
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <Button
                            onClick={() => setSelectedCoachProduct(prod)}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] font-bold gap-1 text-[#065f46] border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
                            title="Générer le Kit de Vente Réseaux Sociaux"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Kit Vente IA</span>
                          </Button>
                          <button
                            onClick={() => setProductsList((prev) => prev.filter((p) => p.id !== prod.id))}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Supprimer du catalogue"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

        {/* TAB 3: FINANCES & MOBILE MONEY PAYOUTS */}
        {activeTab === "finances" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Comptes de Versement Gabon</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase">
                      Airtel Money
                    </span>
                    <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                      +241 077 45 89 12
                    </p>
                    <p className="text-[10px] text-slate-500">Compte vérifié au nom de Tatiana Mengue</p>
                  </div>
                  <Badge variant="emerald" className="text-[10px]">Actif (Par défaut)</Badge>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px] uppercase">
                      Moov Money Flooz
                    </span>
                    <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                      +241 066 12 34 56
                    </p>
                    <p className="text-[10px] text-slate-500">Compte secondaire</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Actif</Badge>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Modifier mes coordonnées de virement
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Solde Disponible &amp; Demande de Retrait</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="rounded-2xl bg-emerald-950 text-white p-5 space-y-2">
                  <p className="text-xs uppercase font-bold text-emerald-300">Solde net des ventes à reverser</p>
                  <h3 className="text-3xl font-black text-amber-300">{formatFCFA(Math.round(orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 0.95))}</h3>
                  <p className="text-[11px] text-emerald-200">
                    Calculé après commission marketplace Nexora (5%)
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const balance = Math.round(orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 0.95);
                    if (balance < 2000) {
                      alert("Le montant minimum de retrait est de 2 000 FCFA. Votre solde actuel est de " + formatFCFA(balance));
                    } else {
                      alert(`Demande de virement immédiat de ${formatFCFA(balance)} initiée vers votre compte Airtel Money (+241 077 45 89 12).`);
                    }
                  }}
                  variant="emerald"
                  className="w-full font-bold shadow-md shadow-emerald-600/20"
                >
                  Transférer mon solde disponible vers Airtel Money (*150#)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedCoachProduct && (
          <SocialCoachModal
            isOpen={Boolean(selectedCoachProduct)}
            onClose={() => setSelectedCoachProduct(null)}
            product={{
              name: selectedCoachProduct.nom || selectedCoachProduct.name || "Article",
              price: selectedCoachProduct.prix || selectedCoachProduct.price_xaf || 0,
              description: selectedCoachProduct.description,
              category: selectedCoachProduct.categorie || selectedCoachProduct.category,
              slug: selectedCoachProduct.slug,
            }}
          />
        )}
      </main>

      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <CartDrawer />
      <LocationModal />
    </div>
  );
}
