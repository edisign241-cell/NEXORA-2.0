import { NextRequest, NextResponse } from "next/server";
import {
  initiatePaymentTransaction,
  PaymentOperator,
} from "@/lib/services/payment-gateway";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, phone, operator, amount, idempotencyKey } = body;

    // 1. Validation of required parameters
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "Paramètre 'orderId' manquant ou invalide." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Numéro de téléphone gabonais requis (+241...)." },
        { status: 400 }
      );
    }

    if (!operator || (operator !== "airtel" && operator !== "moov")) {
      return NextResponse.json(
        {
          success: false,
          error: "Opérateur non supporté. Veuillez choisir 'airtel' ou 'moov'.",
        },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Montant de transaction invalide (XAF)." },
        { status: 400 }
      );
    }

    // 2. Transaction initialization with Idempotency check
    const { transaction, isDuplicate } = initiatePaymentTransaction({
      orderId,
      phone,
      operator: operator as PaymentOperator,
      amount,
      idempotencyKey,
    });

    const operatorName = operator === "airtel" ? "Airtel Money Gabon" : "Moov Money Flooz Gabon";

    // 3. Response with USSD Push instructions
    return NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Transaction existante récupérée (Idempotence activée)."
          : `Requête Push USSD transmise vers ${operatorName}.`,
        requestId: transaction.requestId,
        idempotencyKey: transaction.idempotencyKey,
        orderId: transaction.orderId,
        operator: transaction.operator,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        ussdPushStatus: transaction.ussdPushStatus,
        gatewayReference: transaction.gatewayReference,
        promptInstructions:
          operator === "airtel"
            ? "Une notification USSD a été envoyée sur votre mobile Airtel Gabon. Saisissez votre code PIN secret Airtel Money pour approuver."
            : "Une notification USSD a été envoyée sur votre mobile Moov Gabon. Composez votre code PIN Flooz pour valider la transaction.",
        isDuplicate,
        createdAt: transaction.createdAt,
      },
      { status: isDuplicate ? 200 : 201 }
    );
  } catch (error) {
    console.error("[PAYMENT_INITIATE_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de l'initiation du paiement transactionnel.",
      },
      { status: 500 }
    );
  }
}
