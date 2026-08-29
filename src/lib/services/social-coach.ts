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
}
