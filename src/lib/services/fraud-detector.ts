import { FraudAlert, FraudRiskLevel, Order } from "@/lib/types/marketplace";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface RiskAnalysisResult {
  riskLevel: FraudRiskLevel;
  score: number; // 0 to 100
  reasons: string[];
  recommendation: string;
  requiredAction: "log" | "verify_sms" | "suspend_transaction" | "freeze_account";
}

/**
 * Nexora Fraud & Security Engine (Pilier 7)
 * Continuous real-time risk assessment across 4 tiers:
 * - LOW: Simple logging and passive monitoring.
 * - MEDIUM: Identity check / SMS-WhatsApp verification.
 * - HIGH: Temporary hold on transaction + Admin alert.
 * - CRITICAL: Immediate account/wallet freeze + Urgent notification to Admin.
 */
export class FraudDetector {
  /**
   * Evaluates an incoming order or transaction against fraud rules.
   */
  static async evaluateOrder(order: {
    customerId: string;
    totalAmount: number;
    phone: string;
    paymentMethod: string;
    deliveryDistrict: string;
    itemsCount: number;
  }): Promise<RiskAnalysisResult> {
    const reasons: string[] = [];
    let score = 0;

    // Rule 1: High Transaction Amount (> 500,000 FCFA)
    if (order.totalAmount >= 500000) {
      score += 45;
      reasons.push("Montant inhabituellement élevé (> 500 000 FCFA).");
    } else if (order.totalAmount >= 200000) {
      score += 20;
      reasons.push("Montant important (> 200 000 FCFA).");
    }

    // Rule 2: Phone number format & operator verification
    const cleanPhone = order.phone.replace(/[\s\-\+\(\)]/g, "");
    if (!cleanPhone.startsWith("241") && !cleanPhone.startsWith("07") && !cleanPhone.startsWith("06")) {
      score += 35;
      reasons.push("Indicatif ou numéro de téléphone non conventionnel pour le Gabon.");
    }

    // Rule 3: High Quantity of Single Items (reseller fraud pattern)
    if (order.itemsCount > 20) {
      score += 25;
      reasons.push("Volume d'articles élevé dans une seule commande.");
    }

    // Determine risk tier
    let riskLevel: FraudRiskLevel = "low";
    let requiredAction: "log" | "verify_sms" | "suspend_transaction" | "freeze_account" = "log";
    let recommendation = "Transaction autorisée sans restriction.";

    if (score >= 75) {
      riskLevel = "critical";
      requiredAction = "freeze_account";
      recommendation = "Gel immédiat des fonds et notification d'urgence administrateur requise.";
    } else if (score >= 50) {
      riskLevel = "high";
      requiredAction = "suspend_transaction";
      recommendation = "Suspension temporaire de la commande en attente d'approbation manuelle.";
    } else if (score >= 25) {
      riskLevel = "medium";
      requiredAction = "verify_sms";
      recommendation = "Demande de confirmation par code SMS / WhatsApp avant expédition.";
    }

    // Log to Supabase fraud_logs if risk is above low
    if (riskLevel !== "low") {
      try {
        await supabaseAdmin.from("fraud_logs").insert({
          user_id: order.customerId,
          risk_level: riskLevel,
          rule_triggered: reasons.join(" | "),
          details: {
            score,
            totalAmount: order.totalAmount,
            phone: order.phone,
            deliveryDistrict: order.deliveryDistrict,
          },
          action_taken: requiredAction,
        } as any);
      } catch (e) {
        console.error("Erreur enregistrement fraud log:", e);
      }
    }

    return {
      riskLevel,
      score,
      reasons,
      recommendation,
      requiredAction,
    };
  }

  /**
   * Formats an operational alert matching the strict executive template.
   */
  static formatAlert(alert: {
    riskLevel: FraudRiskLevel;
    domain: string;
    context: string;
    diagnostic: string;
    impact: string;
    recommendation: string;
  }): string {
    const levelEmoji =
      alert.riskLevel === "critical"
        ? "🚨 [CRITIQUE]"
        : alert.riskLevel === "high"
        ? "⚠️ [ÉLEVÉ]"
        : alert.riskLevel === "medium"
        ? "⚡ [MOYEN]"
        : "ℹ️ [FAIBLE]";

    return `
${levelEmoji} — ${alert.domain.toUpperCase()}
- Contexte : ${alert.context}
- Diagnostic : ${alert.diagnostic}
- Impact : ${alert.impact}
- Recommandation Opérationnelle : ${alert.recommendation}
- Décision Requise : Confirmation attendue de l'administrateur [OUI / NON]
`.trim();
  }
}
