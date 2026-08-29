import { NextRequest, NextResponse } from "next/server";
import { SocialGrowthCoach } from "@/lib/services/social-coach";

const SYSTEM_PROMPT = `# SYSTEM PROMPT — NEXORA AI SELLER GROWTH COACH & SOCIAL STRATEGIST

## 1. RÔLE & MISSION
Tu es un stratège d'élite en acquisition organique et conversion e-commerce sur les réseaux sociaux (Instagram Reels, TikTok, Facebook, WhatsApp, Telegram).
Ta mission est d'aider les commerçants de la marketplace Nexora à convertir l'attention en commandes réelles en transformant chaque produit ajouté au catalogue en une opportunité de vente immédiate.
Tu ne produis AUCUNE idée générique. Chaque contenu doit adresser un problème douloureux et servir de pont direct vers le produit du vendeur sur Nexora.

## 2. RÈGLES ÉDITORIALES STRICTES
- Accroches (Hooks) : Stopper le scroll immédiatement en exposant une erreur coûteuse que fait l'audience cible ou en promettant un résultat chiffré/concret.
- Corps du message (Bridge) : Démontrer pourquoi ce produit spécifique surpasse les alternatives du marché en termes de qualité, de durabilité ou de rapport qualité-prix.
- Ton : Direct, persuasif, professionnel et profondément humanisé.
- Zéro Emoji : Bannir strictement les emojis dans les textes et descriptions pour conserver un style authentique, premium et naturel.
- SEO Réseaux Sociaux 2026 : Intégrer les mots-clés de recherche intentionnelle directement dans les phrases de la description.
- Hashtags : Exactement 5 hashtags ultra-ciblés.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      store_name,
      category,
      product_name,
      price_xaf,
      product_description,
      location,
      product_url,
    } = body;

    if (!product_name) {
      return NextResponse.json(
        { error: "Le nom du produit est obligatoire." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY;

    let aiGeneratedContent: any = null;

    // Optional LLM execution if API Key is configured
    if (apiKey) {
      try {
        if (apiKey.startsWith("AIzaSy") || process.env.GEMINI_API_KEY) {
          // Google Gemini API call
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nDonnées du produit:\n${JSON.stringify(
                        body,
                        null,
                        2
                      )}`,
                    },
                  ],
                },
              ],
            }),
          });
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) aiGeneratedContent = rawText;
        } else {
          // OpenAI API call
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify(body) },
              ],
              temperature: 0.7,
            }),
          });
          const data = await res.json();
          aiGeneratedContent = data?.choices?.[0]?.message?.content;
        }
      } catch (err) {
        console.warn("AI LLM call fallback to algorithmic coach:", err);
      }
    }

    // Always generate structured deterministic kit
    const structuredKit = SocialGrowthCoach.generateKit({
      storeName: store_name || "Boutique Officielle",
      category: category || "Alimentation & Terroir",
      productName: product_name,
      priceXaf: Number(price_xaf) || 0,
      productDescription: product_description || "",
      location: location || "Libreville, Gabon",
      productUrl: product_url || "https://nexora.ga",
    });

    return NextResponse.json({
      success: true,
      kit: structuredKit,
      rawAiOutput: aiGeneratedContent,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erreur interne lors de la génération du kit." },
      { status: 500 }
    );
  }
}
