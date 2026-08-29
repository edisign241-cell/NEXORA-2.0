import { NextResponse } from "next/server";
import { SocialGrowthCoach } from "@/lib/services/social-coach";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support both camelCase and snake_case parameters
    const storeName = body.storeName || body.store_name || "Boutique Officielle";
    const category = body.category || "Alimentation & Terroir";
    const productName = body.productName || body.product_name;
    const priceXaf = Number(body.priceXaf || body.price_xaf) || 0;
    const productDescription = body.productDescription || body.product_description || "";
    const location = body.location || "Libreville, Gabon";
    const productUrl = body.productUrl || body.product_url || "https://nexora.ga";

    if (!productName) {
      return NextResponse.json(
        { error: "Le nom du produit est obligatoire." },
        { status: 400 }
      );
    }

    const systemPrompt = `
Tu es un stratège de croissance e-commerce d'élite.
Génère un kit de vente percutant pour ce produit.
Règles strictes :
1. AUCUN emoji dans l'ensemble de la réponse (textes 100% humanisés et sobres).
2. Fournis 3 accroches distinctes (Erreur coûteuse, Résultat concret, Différenciation).
3. Rédige un script vidéo de 30-45 secondes structuré (Hook, Problème, Preuve, Call To Action vers le lien Nexora).
4. Rédige une description SEO optimisée réseaux sociaux 2026.
5. Fournis exactement 5 hashtags pertinents sans espaces.

Réponds UNIQUEMENT sous forme d'un objet JSON valide ayant cette structure exacte :
{
  "hooks": ["Accroche 1", "Accroche 2", "Accroche 3"],
  "videoScript": {
    "hook": "...",
    "problem": "...",
    "proof": "...",
    "cta": "..."
  },
  "seoDescription": "...",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}
`;

    const userPrompt = `
Boutique: ${storeName}
Catégorie: ${category}
Produit: ${productName}
Prix: ${priceXaf} FCFA
Description: ${productDescription}
Localisation: ${location}
Lien: ${productUrl}
`;

    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.AI_API_KEY;

    let aiResult = null;

    // 1. Try direct LLM call if API key exists
    if (apiKey) {
      try {
        if (apiKey.startsWith("AIzaSy") || process.env.GEMINI_API_KEY) {
          // Google Gemini API
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
                      text: `${systemPrompt}\n\n${userPrompt}\n\nRéponds UNIQUEMENT avec le JSON demandé sans balises markdown.`,
                    },
                  ],
                },
              ],
            }),
          });
          const geminiData = await res.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            aiResult = JSON.parse(cleaned);
          }
        } else {
          // OpenAI API
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.7,
            }),
          });
          const aiData = await response.json();
          if (aiData?.choices?.[0]?.message?.content) {
            aiResult = JSON.parse(aiData.choices[0].message.content);
          }
        }
      } catch (err) {
        console.warn("LLM API execution fallback to local engine:", err);
      }
    }

    // 2. Deterministic Structured Fallback (100% uptime guarantee)
    if (!aiResult || !aiResult.hooks || !aiResult.videoScript) {
      const kit = SocialGrowthCoach.generateKit({
        storeName,
        category,
        productName,
        priceXaf,
        productDescription,
        location,
        productUrl,
      });

      aiResult = {
        hooks: [
          kit.hooks.costlyMistake,
          kit.hooks.concreteResult,
          kit.hooks.directComparison,
        ],
        videoScript: {
          hook: kit.videoScript.hook,
          problem: kit.videoScript.problemAndDemo,
          proof: kit.videoScript.proofAndDifferentiation,
          cta: kit.videoScript.callToAction,
        },
        seoDescription: kit.seoDescription,
        hashtags: kit.hashtags,
        shareLinks: kit.shareLinks,
      };
    }

    return NextResponse.json(aiResult);
  } catch (error) {
    console.error("Erreur Seller Coach API:", error);
    return NextResponse.json(
      { error: "Échec de la génération du kit marketing" },
      { status: 500 }
    );
  }
}
