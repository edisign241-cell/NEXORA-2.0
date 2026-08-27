/**
 * Référentiel géographique complet du Gabon & constantes Marketplace
 * 9 Provinces, Villes principales et Quartiers types (Libreville, Akanda, Port-Gentil, Franceville...)
 */

export interface ProvinceData {
  id: string;
  nom: string;
  chefLieu: string;
  code: string;
  villes: {
    nom: string;
    isChefLieu?: boolean;
    quartiers: string[];
  }[];
}

export const GABON_PROVINCES: ProvinceData[] = [
  {
    id: "estuaire",
    nom: "Estuaire",
    chefLieu: "Libreville",
    code: "G1",
    villes: [
      {
        nom: "Libreville",
        isChefLieu: true,
        quartiers: [
          "Louis",
          "Glass",
          "Mont-Bouët",
          "Nkembo",
          "Lalala",
          "Nzeng-Ayong",
          "Charbonnages",
          "Batterie IV",
          "Plein Ciel",
          "Sotéga",
          "Kinguélé",
          "Belle-Vue",
          "Oloumi",
          "Rio",
          "Awendjé",
          "Toulon",
          "Plaine Niger",
          "Mindoubé",
          "London",
          "Hauts de Gué-Gué",
          "Bas de Gué-Gué",
          "Camp de Police",
          "PK5",
          "PK6",
          "PK7",
          "PK8",
          "PK9",
          "PK10",
          "PK11",
          "PK12",
          "IAI",
          "Damás",
          "Bel Air",
          "Sibang",
          "Alenakiri",
        ],
      },
      {
        nom: "Akanda",
        quartiers: [
          "Angondjé Château",
          "Angondjé Amissa",
          "Angondjé Delta Postal",
          "Angondjé 1ère Cité",
          "Avorbam",
          "Sherko",
          "Cap Estérias",
          "Malibé 1",
          "Malibé 2",
          "Marseille",
          "Alibandeng",
          "Carrefour Gigi",
          "Okala",
        ],
      },
      {
        nom: "Owendo",
        quartiers: [
          "Alénakiri",
          "SNI Owendo",
          "Akournam 1",
          "Akournam 2",
          "Port d'Owendo",
          "Setrag",
          "Razel",
          "Barracuda",
          "Octra",
          "Viré",
        ],
      },
      {
        nom: "Ntoum",
        quartiers: ["Centre-Ville", "Essassa", "Bikélé", "Ayémé", "Nkoltang"],
      },
      {
        nom: "Cocobeach",
        quartiers: ["Centre-Ville", "Plage", "Frontière Guinée"],
      },
      {
        nom: "Kango",
        quartiers: ["Centre", "Bord du fleuve Komo", "Gare"],
      },
    ],
  },
  {
    id: "haut_ogooue",
    nom: "Haut-Ogooué",
    chefLieu: "Franceville",
    code: "G2",
    villes: [
      {
        nom: "Franceville",
        isChefLieu: true,
        quartiers: [
          "Poto-Poto",
          "Mingara",
          "Sable",
          "Ondimba",
          "Yéné",
          "Mbély",
          "Mamie",
          "Carrefour Élysée",
          "Plateau",
        ],
      },
      {
        nom: "Moanda",
        quartiers: ["Centre-Ville", "Comilog", "Léki", "Mont-Boudinga", "Alliance"],
      },
      {
        nom: "Mounana",
        quartiers: ["Centre", "Cité Comuf", "Village 1"],
      },
      {
        nom: "Bongoville",
        quartiers: ["Centre", "Stade", "Plateau"],
      },
      {
        nom: "Okondja",
        quartiers: ["Centre", "Mission", "Aéroport"],
      },
    ],
  },
  {
    id: "moyen_ogooue",
    nom: "Moyen-Ogooué",
    chefLieu: "Lambaréné",
    code: "G3",
    villes: [
      {
        nom: "Lambaréné",
        isChefLieu: true,
        quartiers: [
          "Adouma",
          "Isaac",
          "Hôpital Schweitzer",
          "Atongowanga",
          "Grand Village",
          "Abongo",
          "Moussamoukougou",
        ],
      },
      {
        nom: "Ndjolé",
        quartiers: ["Centre", "Gare Setrag", "Bord du fleuve"],
      },
    ],
  },
  {
    id: "ngounie",
    nom: "Ngounié",
    chefLieu: "Mouila",
    code: "G4",
    villes: [
      {
        nom: "Mouila",
        isChefLieu: true,
        quartiers: [
          "Balise",
          "Dikongo",
          "Val Marie",
          "Bavanga",
          "Grand Lac Bleu",
          "Quartier Commercial",
        ],
      },
      {
        nom: "Ndendé",
        quartiers: ["Centre", "Carrefour Congo", "Mission"],
      },
      {
        nom: "Fougamou",
        quartiers: ["Centre", "Chutes de Samba", "Rivière"],
      },
      {
        nom: "Lébamba",
        quartiers: ["Centre", "Bongolo", "Marché"],
      },
    ],
  },
  {
    id: "nyanga",
    nom: "Nyanga",
    chefLieu: "Tchibanga",
    code: "G5",
    villes: [
      {
        nom: "Tchibanga",
        isChefLieu: true,
        quartiers: ["Bavandji", "Minvoul", "Massanga", "Centre Administratif"],
      },
      {
        nom: "Mayumba",
        quartiers: ["Bord de mer", "Port", "Centre"],
      },
    ],
  },
  {
    id: "ogooue_ivindo",
    nom: "Ogooué-Ivindo",
    chefLieu: "Makokou",
    code: "G6",
    villes: [
      {
        nom: "Makokou",
        isChefLieu: true,
        quartiers: ["Centre", "Mboundou", "Epassendjé", "Chutes Kongou"],
      },
      {
        nom: "Booué",
        quartiers: ["Centre", "Gare Setrag", "Carrefour Ivindo"],
      },
    ],
  },
  {
    id: "ogooue_lolo",
    nom: "Ogooué-Lolo",
    chefLieu: "Koulamoutou",
    code: "G7",
    villes: [
      {
        nom: "Koulamoutou",
        isChefLieu: true,
        quartiers: ["Mayang", "Mikala", "Centre Commercial", "Aerodrome"],
      },
      {
        nom: "Lastoursville",
        quartiers: ["Grottes", "Centre", "Gare Setrag"],
      },
    ],
  },
  {
    id: "ogooue_maritime",
    nom: "Ogooué-Maritime",
    chefLieu: "Port-Gentil",
    code: "G8",
    villes: [
      {
        nom: "Port-Gentil",
        isChefLieu: true,
        quartiers: [
          "Grand Village",
          "Chic",
          "Matanda",
          "Balise",
          "Salsa",
          "Nouveau Port",
          "Mini-Prix",
          "Cap Lopez",
          "Quartier Sud",
          "Mosquée",
          "Sindara",
          "Trois Filaos",
          "Sogara",
        ],
      },
      {
        nom: "Gamba",
        quartiers: ["Cité Shell", "Plaine", "Aéroport"],
      },
      {
        nom: "Omboué",
        quartiers: ["Centre", "Lagune Fernan Vaz"],
      },
    ],
  },
  {
    id: "woleu_ntem",
    nom: "Woleu-Ntem",
    chefLieu: "Oyem",
    code: "G9",
    villes: [
      {
        nom: "Oyem",
        isChefLieu: true,
        quartiers: [
          "Mont-Miyele",
          "Ngouéma",
          "Akoakam",
          "Adjougou",
          "Centre Commercial",
          "Stade",
        ],
      },
      {
        nom: "Bitam",
        quartiers: ["Centre", "Grand Marché", "Frontière Cameroun"],
      },
      {
        nom: "Mitzic",
        quartiers: ["Centre", "Carrefour Scierie"],
      },
    ],
  },
];

export const CATEGORIES_CONFIG = [
  {
    id: "alimentation_terroir",
    nom: "Terroir & Épicerie",
    description: "Chocolat de Kango, Manioc, Huile de palme artisanale, Odika, Poivres...",
    icon: "Utensils",
    color: "from-emerald-500 to-green-700",
    itemCount: "140+ articles",
  },
  {
    id: "mode_beaute",
    nom: "Mode & Beauté Gabonaise",
    description: "Pagne Wax, tenues traditionnelles Iboga, soins au karité bio...",
    icon: "Sparkles",
    color: "from-amber-500 to-orange-600",
    itemCount: "250+ articles",
  },
  {
    id: "high_tech",
    nom: "High-Tech & Électronique",
    description: "Smartphones neufs & garantis, ordinateurs, écouteurs, accessoires...",
    icon: "Smartphone",
    color: "from-blue-500 to-indigo-700",
    itemCount: "320+ articles",
  },
  {
    id: "maison_artisanat",
    nom: "Maison & Artisanat Mbigou",
    description: "Sculptures en pierre de Mbigou, vannerie de la Nyanga, mobilier bois précieux...",
    icon: "Home",
    color: "from-purple-500 to-pink-600",
    itemCount: "95+ articles",
  },
  {
    id: "sante_bien_etre",
    nom: "Santé & Bien-être",
    description: "Produits naturels, huiles essentielles gabonaises, parapharmacie...",
    icon: "HeartPulse",
    color: "from-rose-500 to-red-600",
    itemCount: "80+ articles",
  },
  {
    id: "auto_moto",
    nom: "Auto, Moto & Pièces",
    description: "Batteries, pneumatiques, pièces 4x4 tropicalisées et entretien...",
    icon: "Car",
    color: "from-slate-600 to-slate-800",
    itemCount: "110+ articles",
  },
];

export const PAYMENT_METHODS_CONFIG = [
  {
    id: "airtel_money",
    nom: "Airtel Money Gabon",
    badge: "Le plus rapide",
    icon: "Smartphone",
    description: "Paiement instantané via votre compte Airtel Money (+241 074/077)",
    popular: true,
  },
  {
    id: "moov_money",
    nom: "Moov Money (Flooz)",
    badge: "Populaire",
    icon: "PhoneCall",
    description: "Paiement instantané via votre compte Moov Africa Gabon (+241 062/066)",
    popular: true,
  },
  {
    id: "cash_on_delivery",
    nom: "Paiement à la livraison (Cash)",
    badge: "Sans risque",
    icon: "Banknote",
    description: "Réglez en espèces directement au livreur Nexora lors de la remise en main propre",
    popular: false,
  },
  {
    id: "card",
    nom: "Carte Bancaire (BGFI, UBA, Ecobank, Visa)",
    badge: "Sécurisé",
    icon: "CreditCard",
    description: "Cartes Visa, Mastercard et cartes bancaires locales sécurisées 3D Secure",
    popular: false,
  },
];
