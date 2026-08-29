import { formatFCFA } from "@/lib/utils";

/**
 * Nexora WhatsApp Integration & Customer Service Engine (Pilier 6)
 * Generates formatted deep links (wa.me) for real-time customer, merchant, and courier messaging.
 */
export class WhatsAppService {
  private static SUPPORT_PHONE = "24177123456"; // Numéro support officiel Nexora Gabon

  /**
   * Cleans a phone number to WhatsApp international standard (+241...).
   */
  static formatPhoneForWhatsApp(phone: string): string {
    let clean = phone.replace(/[\s\-\+\(\)]/g, "");
    if (clean.startsWith("0")) {
      clean = "241" + clean.substring(1);
    } else if (!clean.startsWith("241")) {
      clean = "241" + clean;
    }
    return clean;
  }

  /**
   * Generates a WhatsApp deep link for customer support inquiries.
   */
  static getCustomerSupportLink(params: {
    orderNumber?: string;
    issueTopic?: string;
    userName?: string;
  }): string {
    const text = `Bonjour le Support Nexora Gabon 🇬🇦,\n\nJe suis ${params.userName || "un client"}.\n${
      params.orderNumber ? `Commande concernée : *${params.orderNumber}*\n` : ""
    }${params.issueTopic ? `Objet : ${params.issueTopic}\n` : ""}\nMerci de m'assister.`;

    return `https://wa.me/${this.SUPPORT_PHONE}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates a WhatsApp message link for the courier to contact the client.
   */
  static getCourierToCustomerLink(params: {
    customerPhone: string;
    orderNumber: string;
    courierName: string;
    landmark: string;
    otpCode: string;
  }): string {
    const phone = this.formatPhoneForWhatsApp(params.customerPhone);
    const text = `Bonjour ! 🛵 C'est votre livreur Nexora (${params.courierName}) pour la commande *${params.orderNumber}*.\n\nJe suis en route vers votre repère : *${params.landmark}*.\n\nVeuillez préparer votre code de confirmation *OTP* (${params.otpCode}) pour la réception du colis.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generates a WhatsApp message link for the merchant upon new order reception.
   */
  static getOrderAlertForVendorLink(params: {
    vendorPhone: string;
    orderNumber: string;
    itemCount: number;
    totalAmount: number;
    deliveryDistrict: string;
  }): string {
    const phone = this.formatPhoneForWhatsApp(params.vendorPhone);
    const text = `🔔 *Nouvelle commande reçue sur Nexora !*\n\nNuméro : *${params.orderNumber}*\nArticles : ${params.itemCount} produit(s)\nTotal : *${formatFCFA(params.totalAmount)}*\nDestination : ${params.deliveryDistrict}\n\nConnectez-vous à votre espace vendeur pour préparer le colis.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
}
