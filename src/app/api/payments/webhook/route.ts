import { NextRequest, NextResponse } from "next/server";
import {
  processWebhookNotification,
  verifyWebhookSignature,
  PaymentStatus,
  generateWebhookSignature,
} from "@/lib/services/payment-gateway";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-nexora-signature") ||
      req.headers.get("x-webhook-signature") ||
      req.headers.get("x-signature");

    // 1. Signature verification (in production or when header is provided)
    const isSignatureValid = verifyWebhookSignature(rawBody, signature);

    // If signature header is explicitly provided and fails verification, reject with 401
    if (signature && !isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Signature HMAC invalide. Requête Webhook non autorisée.",
        },
        { status: 401 }
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: "Payload JSON malformé." },
        { status: 400 }
      );
    }

    const requestId =
      (payload.requestId as string) ||
      (payload.cpm_custom as string) || // CinetPay format
      (payload.reference as string); // Notch Pay format

    const rawStatus = (payload.status as string)?.toLowerCase();
    const gatewayRef =
      (payload.gatewayReference as string) ||
      (payload.cpm_trans_id as string) ||
      (payload.transaction_id as string);
    const failureReason = (payload.failureReason as string) || (payload.message as string);

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "Identifiant de transaction 'requestId' manquant dans le payload." },
        { status: 400 }
      );
    }

    // 2. Map status to standard PaymentStatus
    let mappedStatus: PaymentStatus = "pending";
    if (
      rawStatus === "successful" ||
      rawStatus === "accepted" ||
      rawStatus === "success" ||
      rawStatus === "paid" ||
      rawStatus === "completed"
    ) {
      mappedStatus = "successful";
    } else if (
      rawStatus === "failed" ||
      rawStatus === "rejected" ||
      rawStatus === "declined" ||
      rawStatus === "insufficient_funds"
    ) {
      mappedStatus = "failed";
    } else if (rawStatus === "expired" || rawStatus === "timeout") {
      mappedStatus = "expired";
    }

    // 3. Process transaction update
    const updatedTx = processWebhookNotification({
      requestId,
      status: mappedStatus,
      gatewayReference: gatewayRef,
      failureReason,
      payload,
    });

    if (!updatedTx) {
      return NextResponse.json(
        {
          success: false,
          error: `Transaction introuvable pour la référence '${requestId}'.`,
        },
        { status: 404 }
      );
    }

    // 4. Log and simulate vendor notification when paid
    if (mappedStatus === "successful") {
      console.log(`[PAYMENT_SUCCESS_WEBHOOK] Commande ${updatedTx.orderId} payée avec succès ! Montant: ${updatedTx.amount} XAF (${updatedTx.operator.toUpperCase()}). Notification envoyée au vendeur.`);
    } else {
      console.warn(`[PAYMENT_FAILURE_WEBHOOK] Transaction ${requestId} échouée. Raison: ${failureReason || mappedStatus}`);
    }

    return NextResponse.json({
      success: true,
      message: `Webhook traité avec succès. Statut: ${mappedStatus}.`,
      transaction: {
        requestId: updatedTx.requestId,
        orderId: updatedTx.orderId,
        status: updatedTx.status,
        operator: updatedTx.operator,
        amount: updatedTx.amount,
        completedAt: updatedTx.completedAt,
      },
    });
  } catch (error) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne lors du traitement du Webhook." },
      { status: 500 }
    );
  }
}

// Utility endpoint (GET) for generating sample test payload & HMAC signature for local simulation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId") || "NX-PAY-DEMO-2026";
  const status = searchParams.get("status") || "successful";

  const samplePayload = JSON.stringify({
    requestId,
    status,
    gatewayReference: `GW-MOCK-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });

  const signature = generateWebhookSignature(samplePayload);

  return NextResponse.json({
    documentation: "Webhook de paiement Nexora Gabon (Airtel Money / Moov Money)",
    samplePayload: JSON.parse(samplePayload),
    headers: {
      "Content-Type": "application/json",
      "x-nexora-signature": signature,
    },
    curlExample: `curl -X POST "${req.nextUrl.origin}/api/payments/webhook" -H "Content-Type: application/json" -H "x-nexora-signature: ${signature}" -d '${samplePayload}'`,
  });
}
