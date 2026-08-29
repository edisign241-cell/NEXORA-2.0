import { Wallet, WalletTransaction } from "@/lib/types/marketplace";
import { supabaseAdmin } from "@/lib/supabase/admin";

export class WalletService {
  private static COMMISSION_RATE = 0.05; // 5% marketplace commission

  /**
   * Processes vendor and platform earnings when an order is completed.
   */
  static async creditVendorForOrder(params: {
    vendorId: string;
    orderId: string;
    orderTotalAmount: number;
    deliveryFee: number;
  }): Promise<{ vendorShare: number; commission: number }> {
    const productTotal = Math.max(0, params.orderTotalAmount - params.deliveryFee);
    const commission = Math.round(productTotal * this.COMMISSION_RATE);
    const vendorShare = productTotal - commission;

    try {
      // 1. Get or create vendor wallet
      const { data: wallet } = await (supabaseAdmin as any)
        .from("wallets")
        .select("*")
        .eq("user_id", params.vendorId)
        .single();

      let walletId = wallet?.id;

      if (!wallet) {
        const { data: newWallet } = await (supabaseAdmin as any)
          .from("wallets")
          .insert({
            user_id: params.vendorId,
            balance_xaf: vendorShare,
            total_earned_xaf: vendorShare,
          })
          .select()
          .single();
        walletId = newWallet?.id;
      } else {
        await (supabaseAdmin as any)
          .from("wallets")
          .update({
            balance_xaf: (wallet.balance_xaf || 0) + vendorShare,
            total_earned_xaf: (wallet.total_earned_xaf || 0) + vendorShare,
            updated_at: new Date().toISOString(),
          })
          .eq("id", wallet.id);
      }

      // 2. Log credit transaction
      if (walletId) {
        await (supabaseAdmin as any).from("wallet_transactions").insert({
          wallet_id: walletId,
          order_id: params.orderId,
          type: "credit_sale",
          amount_xaf: vendorShare,
          fee_xaf: commission,
          status: "completed",
          reference_code: `TX-SALE-${params.orderId.slice(0, 8).toUpperCase()}`,
          notes: `Vente finalisée (Net: ${vendorShare} FCFA, Commission 5%: ${commission} FCFA)`,
        });
      }
    } catch (e) {
      console.error("Erreur crédit portefeuille marchand:", e);
    }

    return { vendorShare, commission };
  }

  /**
   * Credits a courier's wallet upon verified delivery.
   */
  static async creditCourierForDelivery(params: {
    courierId: string;
    orderId: string;
    courierPayout: number;
  }): Promise<void> {
    try {
      const { data: wallet } = await (supabaseAdmin as any)
        .from("wallets")
        .select("*")
        .eq("user_id", params.courierId)
        .single();

      let walletId = wallet?.id;

      if (!wallet) {
        const { data: newWallet } = await (supabaseAdmin as any)
          .from("wallets")
          .insert({
            user_id: params.courierId,
            balance_xaf: params.courierPayout,
            total_earned_xaf: params.courierPayout,
          })
          .select()
          .single();
        walletId = newWallet?.id;
      } else {
        await (supabaseAdmin as any)
          .from("wallets")
          .update({
            balance_xaf: (wallet.balance_xaf || 0) + params.courierPayout,
            total_earned_xaf: (wallet.total_earned_xaf || 0) + params.courierPayout,
            updated_at: new Date().toISOString(),
          })
          .eq("id", wallet.id);
      }

      if (walletId) {
        await (supabaseAdmin as any).from("wallet_transactions").insert({
          wallet_id: walletId,
          order_id: params.orderId,
          type: "credit_sale",
          amount_xaf: params.courierPayout,
          fee_xaf: 0,
          status: "completed",
          reference_code: `TX-DELIV-${params.orderId.slice(0, 8).toUpperCase()}`,
          notes: `Course validée par code OTP (+${params.courierPayout} FCFA)`,
        });
      }
    } catch (e) {
      console.error("Erreur crédit livreur:", e);
    }
  }

  /**
   * Initiates a Mobile Money payout (Airtel *150# or Moov *555#).
   */
  static async requestPayout(params: {
    userId: string;
    amountXaf: number;
    operator: "airtel" | "moov";
    phone: string;
  }): Promise<{ success: boolean; message: string; transactionId?: string }> {
    if (params.amountXaf < 2000) {
      return { success: false, message: "Le montant minimum de retrait est de 2 000 FCFA." };
    }

    try {
      const { data: wallet } = await (supabaseAdmin as any)
        .from("wallets")
        .select("*")
        .eq("user_id", params.userId)
        .single();

      if (!wallet || (wallet.balance_xaf || 0) < params.amountXaf) {
        return { success: false, message: "Solde disponible insuffisant pour ce retrait." };
      }

      if (wallet.is_frozen) {
        return { success: false, message: "Ce portefeuille est actuellement gelé par le service de sécurité." };
      }

      // Deduct balance
      await (supabaseAdmin as any)
        .from("wallets")
        .update({
          balance_xaf: wallet.balance_xaf - params.amountXaf,
          updated_at: new Date().toISOString(),
        })
        .eq("id", wallet.id);

      const ref = `RET-${params.operator.toUpperCase()}-${Date.now().toString().slice(-6)}`;

      await (supabaseAdmin as any).from("wallet_transactions").insert({
        wallet_id: wallet.id,
        type: params.operator === "airtel" ? "payout_airtel" : "payout_moov",
        amount_xaf: params.amountXaf,
        fee_xaf: 0,
        status: "pending",
        reference_code: ref,
        notes: `Demande de retrait vers ${params.operator === "airtel" ? "Airtel Money" : "Moov Money"} (${params.phone})`,
      });

      return {
        success: true,
        message: `Retrait de ${params.amountXaf} FCFA initié vers votre compte ${params.operator === "airtel" ? "Airtel Money (*150#)" : "Moov Money (*555#)"}.`,
        transactionId: ref,
      };
    } catch (e: any) {
      return { success: false, message: e?.message || "Erreur lors du traitement du retrait." };
    }
  }
}
