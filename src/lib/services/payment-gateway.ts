import crypto from "crypto";

export type PaymentOperator = "airtel" | "moov";
export type PaymentStatus = "pending" | "successful" | "failed" | "expired";

export interface PaymentTransaction {
  requestId: string;
  idempotencyKey: string;
  orderId: string;
  phone: string;
  operator: PaymentOperator;
  amount: number;
  currency: "XAF";
  status: PaymentStatus;
  gatewayReference: string;
  ussdPushStatus: "SENT" | "ACKNOWLEDGED" | "TIMEOUT" | "REJECTED";
  createdAt: number; // timestamp
  updatedAt: number;
  completedAt?: number;
  failureReason?: string;
  rawWebhookPayload?: Record<string, unknown>;
}

// Global In-Memory Transaction & Idempotency Store (Preserved across Next.js dev hot reloads in globalThis)
const globalForPayment = globalThis as unknown as {
  paymentTransactions?: Map<string, PaymentTransaction>;
};

export const paymentStore =
  globalForPayment.paymentTransactions ?? new Map<string, PaymentTransaction>();

if (process.env.NODE_ENV !== "production") {
  globalForPayment.paymentTransactions = paymentStore;
}

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "nexora_gabon_secure_webhook_secret_2026";

/**
 * Generate a unique idempotency request ID if not provided
 */
export function generateRequestId(orderId: string, phone: string, amount: number): string {
  const hash = crypto
    .createHash("sha256")
    .update(`${orderId}-${phone}-${amount}-${Date.now()}-${Math.random()}`)
    .digest("hex")
    .substring(0, 16);
  return `NX-PAY-${hash.toUpperCase()}`;
}

/**
 * Compute HMAC-SHA256 signature for webhooks
 */
export function generateWebhookSignature(payload: string): string {
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");
}

/**
 * Verify Webhook Signature
 */
export function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  try {
    const expected = generateWebhookSignature(payload);
    return crypto.timingSafeEqual(Buffer.from(expected, "utf-8"), Buffer.from(signature, "utf-8"));
  } catch {
    return false;
  }
}

/**
 * Initiate Payment with Idempotency Check
 */
export function initiatePaymentTransaction({
  orderId,
  phone,
  operator,
  amount,
  idempotencyKey,
}: {
  orderId: string;
  phone: string;
  operator: PaymentOperator;
  amount: number;
  idempotencyKey?: string;
}): { transaction: PaymentTransaction; isDuplicate: boolean } {
  // If an idempotency key was supplied, check if an active transaction already exists
  const effectiveIdempotencyKey = idempotencyKey || `${orderId}-${operator}-${amount}`;

  // Find existing transaction matching idempotency key
  for (const existing of paymentStore.values()) {
    if (existing.idempotencyKey === effectiveIdempotencyKey) {
      return {
        transaction: existing,
        isDuplicate: true,
      };
    }
  }

  // Create new transaction
  const requestId = generateRequestId(orderId, phone, amount);
  const gatewayRef = `GW-GAB-${operator.toUpperCase()}-${Date.now()}`;

  const newTx: PaymentTransaction = {
    requestId,
    idempotencyKey: effectiveIdempotencyKey,
    orderId,
    phone,
    operator,
    amount,
    currency: "XAF",
    status: "pending",
    gatewayReference: gatewayRef,
    ussdPushStatus: "SENT",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  paymentStore.set(requestId, newTx);

  // Auto-schedule mock completion after 6 seconds (simulating user entering PIN on their phone)
  // if not in explicit test mode
  setTimeout(() => {
    const current = paymentStore.get(requestId);
    if (current && current.status === "pending") {
      current.status = "successful";
      current.ussdPushStatus = "ACKNOWLEDGED";
      current.completedAt = Date.now();
      current.updatedAt = Date.now();
      paymentStore.set(requestId, current);
    }
  }, 6500);

  return {
    transaction: newTx,
    isDuplicate: false,
  };
}

/**
 * Update transaction via Webhook
 */
export function processWebhookNotification({
  requestId,
  status,
  gatewayReference,
  failureReason,
  payload,
}: {
  requestId: string;
  status: PaymentStatus;
  gatewayReference?: string;
  failureReason?: string;
  payload?: Record<string, unknown>;
}): PaymentTransaction | null {
  const tx = paymentStore.get(requestId);
  if (!tx) return null;

  tx.status = status;
  if (gatewayReference) tx.gatewayReference = gatewayReference;
  if (failureReason) tx.failureReason = failureReason;
  if (status === "successful") {
    tx.completedAt = Date.now();
    tx.ussdPushStatus = "ACKNOWLEDGED";
  } else if (status === "failed") {
    tx.ussdPushStatus = "REJECTED";
  } else if (status === "expired") {
    tx.ussdPushStatus = "TIMEOUT";
  }
  tx.updatedAt = Date.now();
  tx.rawWebhookPayload = payload;

  paymentStore.set(requestId, tx);
  return tx;
}

/**
 * Get transaction status
 */
export function getPaymentStatus(requestId: string): PaymentTransaction | null {
  return paymentStore.get(requestId) ?? null;
}
