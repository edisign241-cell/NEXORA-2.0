import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/services/payment-gateway";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "Identifiant de transaction 'requestId' manquant." },
        { status: 400 }
      );
    }

    const transaction = getPaymentStatus(requestId);

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: `Aucune transaction trouvée pour la référence '${requestId}'.`,
        },
        { status: 404 }
      );
    }

    const elapsedSeconds = Math.floor((Date.now() - transaction.createdAt) / 1000);

    // Auto-expire transactions pending for more than 45 seconds if no webhook was received
    if (transaction.status === "pending" && elapsedSeconds > 45) {
      transaction.status = "expired";
      transaction.ussdPushStatus = "TIMEOUT";
      transaction.failureReason = "Délai de validation USSD dépassé (Session expirée).";
      transaction.updatedAt = Date.now();
    }

    return NextResponse.json({
      success: true,
      requestId: transaction.requestId,
      orderId: transaction.orderId,
      status: transaction.status,
      operator: transaction.operator,
      amount: transaction.amount,
      currency: transaction.currency,
      gatewayReference: transaction.gatewayReference,
      ussdPushStatus: transaction.ussdPushStatus,
      elapsedSeconds,
      completedAt: transaction.completedAt,
      failureReason: transaction.failureReason,
    });
  } catch (error) {
    console.error("[PAYMENT_STATUS_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération du statut." },
      { status: 500 }
    );
  }
}
