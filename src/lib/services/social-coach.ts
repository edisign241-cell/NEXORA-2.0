export interface ProductSocialKitInput {
  storeName: string;
  category: string;
  productName: string;
  priceXaf: number;
  productDescription: string;
  location: string;
  productUrl: string;
}

export interface GeneratedSocialKit {
  productName: string;
  hooks: {
    costlyMistake: string;
    concreteResult: string;
    directComparison: string;
  };
  videoScript: {
    hook: string;
    problemAndDemo: string;
    proofAndDifferentiation: string;
    callToAction: string;
  };
  seoDescription: string;
  hashtags: string[];
  shareLinks: {
    whatsapp: string;
    facebook: string;
    telegram: string;
    rawUrl: string;
  };
}

/**
 * Nexora AI Seller Growth Coach & Social Strategist Service
 * Generates high-converting social media sales kits for merchant products.
 * Zero emojis in descriptions, high-retention hooks, SEO keywords and 1-click share links.
 */
export class SocialGrowthCoach {
  static generateKit(input: ProductSocialKitInput): GeneratedSocialKit {
    const cleanStore = input.storeName.trim() || "Boutique Officielle";
    const cleanProduct = input.productName.trim() || "Article de qualité";
    const cleanCategory = input.category.trim() || "Commerce";
    const cleanLocation = input.location.trim() || "Libreville, Gabon";
    const cleanPrice = input.priceXaf.toLocaleString("fr-FR");
    const cleanDesc = input.productDescription.trim() || "Qualité supérieure garantie.";
    const cleanUrl = input.productUrl.trim();

    // 1. Hooks
    const costlyMistake = `L'erreur que font 90% des acheteurs lorsqu'ils choisissent un ${cleanProduct.toLowerCase()} est de privilégier les imitations bon marché qui se détériorent en quelques semaines.`;
    const concreteResult = `Comment obtenir un résultat impeccable avec ${cleanProduct} disponible dès maintenant à ${cleanPrice} FCFA à ${cleanLocation}.`;
    const directComparison = `Pourquoi continuer à gaspiller votre argent dans des alternatives décevantes quand ${cleanProduct} chez ${cleanStore} vous garantit une durabilité maximale ?`;

    // 2. Video Script
    const hook = costlyMistake;
    const problemAndDemo = `Si vous en avez assez de renouveler constamment vos achats sans trouver la qualité promise, voici pourquoi ${cleanProduct} change la donne. Conçu pour répondre aux exigences du quotidien, il offre ${cleanDesc.toLowerCase()} tout en restant accessible au tarif officiel de ${cleanPrice} FCFA.`;
    const proofAndDifferentiation = `Contrairement aux produits ordinaires du marché, cette sélection disponible chez ${cleanStore} bénéficie d'un contrôle de conformité strict, d'une authenticité certifiée et d'un service après-vente réactif.`;
    const callToAction = `Commandez directement sur notre boutique officielle Nexora pour être livré rapidement à ${cleanLocation}. Cliquez sur le lien pour voir les disponibilités.`;

    // 3. SEO Description (Strict Zero Emojis)
    const seoDescription = `Retrouvez ${cleanProduct} au prix direct de ${cleanPrice} FCFA sur la marketplace Nexora chez ${cleanStore}. Profitez d'une livraison rapide à ${cleanLocation} et dans tout le Gabon avec paiement sécurisé par Airtel Money, Moov Money ou à la livraison. Stock limité disponible immédiatement pour votre achat en ligne.`;

    // 4. Hashtags (5 target hashtags)
    const categorySlug = cleanCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
    const citySlug = cleanLocation.toLowerCase().includes("akanda")
      ? "akanda"
      : cleanLocation.toLowerCase().includes("port-gentil")
      ? "portgentil"
      : "libreville";

    const hashtags = [
      `#${cleanProduct.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      `#achat${citySlug}`,
      `#shoppinggabon`,
      `#${categorySlug}gabon`,
      `#nexoragabon`,
    ].slice(0, 5);

    // 5. 1-Click Share Links
    const whatsappMsg = `Découvrez notre ${cleanProduct} disponible sur Nexora : ${cleanUrl}`;
    const shareLinks = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(`Disponible sur Nexora : ${cleanProduct}`)}`,
      rawUrl: cleanUrl,
    };

    return {
      productName: cleanProduct,
      hooks: {
        costlyMistake,
        concreteResult,
        directComparison,
      },
      videoScript: {
        hook,
        problemAndDemo,
        proofAndDifferentiation,
        callToAction,
      },
      seoDescription,
      hashtags,
      shareLinks,
    };
  }

  /**
   * Autonomously writes a persuasive, high-converting product description
   * optimized for e-commerce conversion, zero emojis, local relevance in Gabon.
   */
  static generateAutonomousProductDescription(input: {
    productName: string;
    category?: string;
    priceXaf?: number;
    storeName?: string;
    location?: string;
  }): string {
    const name = input.productName.trim() || "Article sélectionné";
    const cat = (input.category || "commerce").toLowerCase();
    const priceStr = input.priceXaf ? `${input.priceXaf.toLocaleString("fr-FR")} FCFA` : "tarif officiel";
    const store = input.storeName || "Boutique Officielle Nexora";
    const loc = input.location || "Libreville";

    if (cat.includes("alimentation") || cat.includes("terroir") || cat.includes("street_food") || cat.includes("epicerie")) {
      return `Découvrez ${name}, sélectionné avec soin auprès des meilleurs producteurs locaux pour vous garantir une fraîcheur et une authenticité incomparables. Idéal pour vos repas du quotidien et vos recettes traditionnelles gabonaises, cet article respecte des normes strictes de préparation et d'hygiène. Disponible au prix de ${priceStr} chez ${store}, avec livraison rapide à votre domicile ou point de repère à ${loc} et expédition sécurisée dans tout le Gabon.`;
    }

    if (cat.includes("mode") || cat.includes("wax") || cat.includes("beaute") || cat.includes("vetement")) {
      return `${name} allie élégance, finitions soignées et confort exceptionnel. Conçu à partir de matières durables et agréables à porter, ce modèle valorise votre style aussi bien pour vos sorties que pour vos événements formels. Proposé au tarif de ${priceStr} chez ${store}, il bénéficie d'une confection de haute qualité avec un tombé parfait. Commandez dès maintenant pour une livraison directe à ${loc} et un paiement simplifié par Airtel Money ou Moov Money.`;
    }

    if (cat.includes("tech") || cat.includes("electronique") || cat.includes("smartphone")) {
      return `${name} vous offre des performances optimales, une grande autonomie et une fiabilité éprouvée pour répondre à tous vos besoins professionnels et personnels. Testé et certifié conforme, cet équipement est proposé au prix de ${priceStr} avec garantie constructeur chez ${store}. Bénéficiez d'une livraison express en moins de 24h à ${loc} avec contrôle et validation par code OTP à la remise en main propre.`;
    }

    if (cat.includes("artisanat") || cat.includes("pierre") || cat.includes("maison") || cat.includes("culture")) {
      return `Véritable pièce d'exception issue de l'artisanat gabonais, ${name} apporte une touche d'élégance unique et authentique à votre intérieur. Fabriqué selon des techniques traditionnelles transmises de génération en génération, chaque exemplaire témoigne d'un savoir-faire méticuleux. Disponible à ${priceStr} chez ${store}, avec emballage soigné et livraison sécurisée à ${loc}.`;
    }

    // Generic fallback for any other category
    return `${name} est un article de qualité supérieure sélectionné pour sa durabilité, son efficacité et son excellent rapport qualité-prix. Disponible au prix de ${priceStr} chez ${store}, il répond parfaitement aux attentes des utilisateurs les plus exigeants. Commandez en toute sérénité sur Nexora avec livraison suivie à votre repère à ${loc} et paiement flexible à la livraison ou par Mobile Money.`;
  }
}

/**
 * Helper client/server function to generate AI Seller Marketing Kit
 */
export async function generateSellerMarketingKit(productData: {
  store_name: string;
  category: string;
  product_name: string;
  price_xaf: number;
  product_description: string;
  location: string;
  product_url: string;
}) {
  return SocialGrowthCoach.generateKit({
    storeName: productData.store_name,
    category: productData.category,
    productName: productData.product_name,
    priceXaf: productData.price_xaf,
    productDescription: productData.product_description,
    location: productData.location,
    productUrl: productData.product_url,
  });
}
