"use client";

import * as React from "react";
import { formatFCFA } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Zap,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  phone: string;
  operator: "airtel" | "moov";
  requestId: string;
  promptInstructions?: string;
  onPaymentSuccess: (transaction: {
    requestId: string;
    orderId: string;
    operator: string;
    amount: number;
  }) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  amount,
  phone,
  operator,
  requestId,
  promptInstructions,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [status, setStatus] = React.useState<"polling" | "success" | "failed" | "timeout">("polling");
  const [secondsRemaining, setSecondsRemaining] = React.useState(30);
  const [isChecking, setIsChecking] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const isAirtel = operator === "airtel";
  const operatorTitle = isAirtel ? "Airtel Money Gabon" : "Moov Money Flooz";
  const operatorColor = isAirtel ? "rose" : "blue";

  // Polling function to check status
  const checkStatus = React.useCallback(async () => {
    if (!requestId) return;
    try {
      setIsChecking(true);
      const res = await fetch(`/api/payments/status/${encodeURIComponent(requestId)}`);
      const data = await res.json();

      if (data.success) {
        if (data.status === "successful") {
          setStatus("success");
          setTimeout(() => {
            onPaymentSuccess({
              requestId: data.requestId,
              orderId: data.orderId,
              operator: data.operator,
              amount: data.amount,
            });
          }, 1200);
        } else if (data.status === "failed") {
          setStatus("failed");
          setErrorMessage(data.failureReason || "Transaction rejetée ou solde insuffisant.");
        } else if (data.status === "expired") {
          setStatus("timeout");
          setErrorMessage("Délai de validation USSD dépassé.");
        }
      }
    } catch (err) {
      console.error("Erreur de polling:", err);
    } finally {
      setIsChecking(false);
    }
  }, [requestId, onPaymentSuccess]);

  // Simulate Instant Webhook Approval for demo testing
  const handleSimulateInstantApproval = async () => {
    try {
      setIsChecking(true);
      const res = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status: "successful",
          gatewayReference: `GW-MOCK-APPROVED-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          onPaymentSuccess({
            requestId,
            orderId,
            operator,
            amount,
          });
        }, 800);
      }
    } catch (err) {
      console.error("Erreur simulation approval:", err);
    } finally {
      setIsChecking(false);
    }
  };

  // 30 seconds polling interval & countdown
  React.useEffect(() => {
    if (!isOpen || status !== "polling") return;

    setSecondsRemaining(30);

    // Initial check after 2 seconds
    const initialTimer = setTimeout(() => {
      checkStatus();
    }, 2000);

    // Poll every 3 seconds
    const pollInterval = setInterval(() => {
      checkStatus();
    }, 3000);

    // Decrement countdown every 1s
    const countdownTimer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(pollInterval);
          setStatus("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollInterval);
      clearInterval(countdownTimer);
    };
  }, [isOpen, status, checkStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center space-y-5">
        {/* Header with Operator Branding */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black text-white uppercase tracking-wider ${
                isAirtel ? "bg-rose-600" : "bg-blue-600"
              }`}
            >
              {isAirtel ? "Airtel Money" : "Moov Money"}
            </span>
            <span className="text-xs font-bold text-slate-500">Paiement Sécurisé</span>
          </div>
          <span className="font-mono text-xs text-slate-400 font-bold">{orderId}</span>
        </div>

        {/* State: Polling (Waiting for PIN) */}
        {status === "polling" && (
          <div className="space-y-4">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                  isAirtel ? "bg-rose-500" : "bg-blue-500"
                }`}
              />
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${
                  isAirtel
                    ? "bg-gradient-to-tr from-rose-600 to-rose-500 shadow-rose-500/30"
                    : "bg-gradient-to-tr from-blue-600 to-blue-500 shadow-blue-500/30"
                }`}
              >
                <Smartphone className="h-8 w-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">
                Saisissez votre code PIN {operatorTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Une invite USSD a été envoyée sur le mobile{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
              </p>
            </div>

            {/* USSD Prompt Alert Box */}
            <div
              className={`rounded-2xl p-4 text-left border space-y-2 ${
                isAirtel
                  ? "bg-rose-50/70 border-rose-200 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-200"
                  : "bg-blue-50/70 border-blue-200 text-blue-950 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Montant à débiter :</span>
                <span className="text-sm font-black">{formatFCFA(amount)}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {promptInstructions ||
                  "Consultez l'écran de votre téléphone et entrez votre code PIN secret pour autoriser le prélèvement."}
              </p>
            </div>

            {/* Countdown & Polling Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Délai de validation restant
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {secondsRemaining}s / 30s
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    isAirtel ? "bg-rose-600" : "bg-blue-600"
                  }`}
                  style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => checkStatus()}
                disabled={isChecking}
                variant="outline"
                className="w-full text-xs font-bold gap-1.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                <span>Vérifier la transaction maintenant</span>
              </Button>

              {/* Dev/Demo Helper Button */}
              <button
                type="button"
                onClick={handleSimulateInstantApproval}
                className="inline-flex items-center justify-center gap-1 w-full text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simuler approbation immédiate (Démo)</span>
              </button>
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="space-y-4 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <Badge variant="emerald" className="text-xs font-bold uppercase">
                Paiement Validé
              </Badge>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">
                {formatFCFA(amount)} reçus avec succès !
              </h3>
              <p className="text-xs text-slate-500">
                Votre paiement {operatorTitle} a été confirmé. Génération de votre reçu...
              </p>
            </div>
          </div>
        )}

        {/* State: Failed */}
        {status === "failed" && (
          <div className="space-y-4 py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <XCircle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <Badge variant="destructive" className="text-xs font-bold uppercase">
                Échec du Paiement
              </Badge>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                La transaction n&apos;a pas pu aboutir
              </h3>
              <p className="text-xs text-slate-500">
                {errorMessage || "Solde insuffisant ou saisie du code PIN incorrecte."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={() => onClose()} variant="outline" className="w-full text-xs">
                Changer de mode
              </Button>
              <Button
                onClick={() => {
                  setStatus("polling");
                  setSecondsRemaining(30);
                }}
                variant={isAirtel ? "destructive" : "default"}
                className="w-full text-xs font-bold"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* State: Timeout */}
        {status === "timeout" && (
          <div className="space-y-4 py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <Badge variant="amber" className="text-xs font-bold uppercase">
                Session Expirée
              </Badge>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                Délai de saisie de 30s dépassé
              </h3>
              <p className="text-xs text-slate-500">
                Aucune confirmation reçue de votre mobile {operatorTitle}. Votre compte n&apos;a pas été débité.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={() => onClose()} variant="outline" className="w-full text-xs">
                Annuler
              </Button>
              <Button
                onClick={() => {
                  setStatus("polling");
                  setSecondsRemaining(30);
                }}
                variant="emerald"
                className="w-full text-xs font-bold"
              >
                Relancer l&apos;invite USSD
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chiffrement bancaire de bout en bout conforme CEMAC / BEAC</span>
        </div>
      </div>
    </div>
  );
}
