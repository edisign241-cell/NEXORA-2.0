import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexora Gabon | Première Marketplace du Gabon (Airtel Money, Moov Money)",
  description:
    "Marketplace e-commerce adaptée au marché gabonais. Commandez en ligne à Libreville, Akanda, Port-Gentil et dans les 9 provinces. Paiements mobiles Airtel Money, Moov Money et livraison express avec repères.",
  keywords: [
    "Marketplace Gabon",
    "E-commerce Libreville",
    "Airtel Money Gabon",
    "Moov Money Flooz",
    "Boutiques Gabon",
    "Terroir Gabonais",
    "Livraison Libreville",
    "Artisanat Gabon Mbigou",
  ],
  authors: [{ name: "Nexora Technologies Gabon" }],
  openGraph: {
    title: "Nexora Gabon | Marketplace & E-commerce",
    description:
      "Achetez et vendez facilement au Gabon avec paiements Airtel Money / Moov Money et livraison à votre repère.",
    url: "https://nexora.ga",
    siteName: "Nexora Gabon",
    locale: "fr_GA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans font-medium bg-[#f9fafb] text-[#111827] dark:bg-[#022c22] dark:text-[#f9fafb] selection:bg-[#10b981] selection:text-white">
        {children}
      </body>
    </html>
  );
}
