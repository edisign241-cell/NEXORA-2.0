/**
 * Nexora Marketplace Gabon - Core TypeScript Definitions
 * Tailored for Gabonese e-commerce, localized logistics & Operations COO Engine
 */

export type UserRole = "client" | "vendeur" | "livreur" | "admin" | "customer" | "vendor" | "courier";

export type PaymentMethod =
  | "airtel_money"
  | "moov_money"
  | "cash_on_delivery"
  | "card";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "in_delivery"
  | "delivered"
  | "cancelled";

export type DeliveryStatus =
  | "pending_assignment"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "failed"
  | "returned";

export type ProductCategory =
  | "mode_beaute"
  | "high_tech"
  | "alimentation_terroir"
  | "maison_artisanat"
  | "sante_bien_etre"
  | "auto_moto"
  | "services";

export type FraudRiskLevel = "low" | "medium" | "high" | "critical";

/**
 * Gabonese specific Location Interface
 * In Gabon, addresses primarily rely on Province, City, Neighborhood (Quartier)
 * and a descriptive landmark (Repère visuel : ex. "en face de la pharmacie").
 */
export interface Location {
  id?: string;
  label?: string; // e.g. "Maison", "Bureau", "Boutique"
  province: string; // e.g. "Estuaire", "Ogooué-Maritime", "Haut-Ogooué"
  ville: string; // e.g. "Libreville", "Port-Gentil", "Franceville"
  quartier: string; // e.g. "Nzeng-Ayong", "Mont-Bouët", "Louis"
  repere_texte: string; // e.g. "Face pharmacie, grand portail bleu à côté de l'épicerie"
  gps?: {
    lat: number;
    lng: number;
  };
  telephone?: string; // Contact phone for delivery driver
  precision_acces?: string; // e.g. "Route goudronnée", "Piste accessible 4x4"
}

/**
 * User Interface (Client, Vendeur, Livreur, Admin)
 */
export interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string; // Gabonese number (+241 ...)
  role: UserRole;
  avatar?: string;
  location?: Location;
  addresses?: Location[];
  storeId?: string; // If role === 'vendeur'
  vehicleType?: "moto" | "voiture" | "fourgon" | "velo"; // If role === 'livreur'
  isVerified: boolean;
  createdAt: string;
}

/**
 * Store / Vendor Interface
 */
export interface Store {
  id: string;
  nom: string;
  slug: string;
  description: string;
  logo: string;
  banner?: string;
  ownerId: string;
  ownerName: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  location: Location;
  phoneAirtelMoney?: string;
  phoneMoovMoney?: string;
  categories: ProductCategory[];
  totalSales: number;
  isFeatured?: boolean;
  openingHours?: string;
  badge?: "Gabon Pro" | "Artisan Local" | "Boutique Officielle" | "Top Vendeur";
}

/**
 * Product Interface
 */
export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  nom: string;
  slug: string;
  description: string;
  prix: number; // Price in FCFA (XAF)
  prixPromo?: number; // Discounted price in FCFA
  categorie: ProductCategory;
  images: string[];
  videoUrl?: string; // Optional product presentation video (.mp4, .webm)
  videos?: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isAvailableForExpressDelivery?: boolean; // Same-day delivery in Libreville/Akanda/Owendo
  badges?: string[]; // e.g. ["Terroir Gabonais", "Promo", "Nouveau", "Bio"]
  specifications?: Record<string, string>;
  createdAt: string;
}

/**
 * Order Item Interface
 */
export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number; // Unit price in FCFA
  productImage: string;
  quantity: number;
  storeId: string;
  storeName: string;
  selectedVariant?: string;
}

/**
 * Order Interface
 */
export interface Order {
  id: string;
  orderNumber: string; // e.g. "NEX-241-89012"
  clientId: string;
  clientName: string;
  clientPhone: string;
  storeIds: string[];
  items: OrderItem[];
  subtotalAmount: number; // in FCFA
  deliveryFee: number; // in FCFA
  totalAmount: number; // in FCFA
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  deliveryLocation: Location;
  deliveryId?: string;
  otpCode?: string; // 4 digits delivery confirmation OTP
  notes?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Delivery Assignment Interface for Drivers & Logistics
 */
export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  livreurId?: string;
  livreurName?: string;
  livreurPhone?: string;
  status: DeliveryStatus;
  otpCode: string; // 4-digit OTP to validate delivery on customer handover
  pickupLocation: Location; // Boutique / Vendor location
  dropoffLocation: Location; // Client location with repère
  clientName: string;
  clientPhone: string;
  repereLivraison: string;
  deliveryFee: number; // in FCFA
  courierPayout: number; // in FCFA (e.g. 1200 FCFA for driver)
  notes?: string;
  timeline: {
    time: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
}

/**
 * Wallet Interface for Vendors & Couriers
 */
export interface Wallet {
  id: string;
  userId: string;
  balanceXaf: number; // Available balance in FCFA
  pendingXaf: number; // Escrow / pending orders balance
  totalEarnedXaf: number; // Lifetime earnings in FCFA
  operator: "airtel" | "moov";
  mobileMoneyPhone: string;
  isFrozen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wallet Transaction Interface
 */
export interface WalletTransaction {
  id: string;
  walletId: string;
  orderId?: string;
  type: "credit_sale" | "commission_deduction" | "payout_airtel" | "payout_moov" | "refund" | "adjustment";
  amountXaf: number;
  feeXaf: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  referenceCode: string;
  notes?: string;
  createdAt: string;
}

/**
 * Review Interface
 */
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  storeId: string;
  productId?: string;
  orderId?: string;
  rating: number; // 1 to 5
  comment: string;
  reply?: string;
  createdAt: string;
}

/**
 * Notification Interface
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "payment" | "delivery" | "promo" | "security" | "system";
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Promo Code Interface
 */
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed_xaf" | "free_delivery";
  discountValue: number;
  minOrderAmountXaf: number;
  maxDiscountXaf?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

/**
 * Fraud Log / Risk Alert Interface
 */
export interface FraudAlert {
  id: string;
  userId?: string;
  orderId?: string;
  riskLevel: FraudRiskLevel;
  ruleTriggered: string;
  details: Record<string, any>;
  isResolved: boolean;
  actionTaken?: string;
  createdAt: string;
}
