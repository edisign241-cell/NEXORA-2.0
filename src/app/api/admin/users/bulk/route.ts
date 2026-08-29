import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface BulkUserInput {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: "customer" | "vendor" | "courier" | "admin";
  district?: string;
  storeName?: string;
  storeCategory?: string;
  vehicleType?: "moto" | "voiture" | "velo" | "a_pied";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const users: BulkUserInput[] = body.users;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "La liste des utilisateurs est vide ou invalide." },
        { status: 400 }
      );
    }

    const results: Array<{
      email: string;
      success: boolean;
      userId?: string;
      role: string;
      generatedPassword?: string;
      error?: string;
    }> = [];

    for (const u of users) {
      const cleanEmail = u.email?.trim().toLowerCase();
      const cleanRole = u.role || "customer";
      const cleanName = u.fullName?.trim() || "Utilisateur Nexora";
      const cleanPhone = u.phone?.trim() || "+241 077 00 00 00";
      const initialPassword = u.password?.trim() || `Nexora@${Math.floor(100000 + Math.random() * 900000)}`;

      if (!cleanEmail || !cleanEmail.includes("@")) {
        results.push({
          email: u.email || "invalide",
          success: false,
          role: cleanRole,
          error: "Format d'email invalide.",
        });
        continue;
      }

      try {
        // 1. Créer l'utilisateur via l'API Admin Supabase (email pré-confirmé)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: initialPassword,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            phone: cleanPhone,
            role: cleanRole,
          },
        });

        if (authError || !authData.user) {
          results.push({
            email: cleanEmail,
            success: false,
            role: cleanRole,
            error: authError?.message || "Erreur lors de la création Auth.",
          });
          continue;
        }

        const userId = authData.user.id;

        // 2. Synchroniser dans public.profiles
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: userId,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: cleanRole as any,
            updated_at: new Date().toISOString(),
          } as any);

        if (profileError) {
          console.warn("Avertissement profil:", profileError.message);
        }

        // 3. Initialiser boutique ou livreur si applicable
        if (cleanRole === "vendor") {
          const storeName = u.storeName || `Boutique ${cleanName}`;
          const slug = storeName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") + `-${userId.slice(0, 4)}`;

          await supabaseAdmin.from("stores").insert({
            vendor_id: userId,
            name: storeName,
            slug: slug,
            category: u.storeCategory || "Alimentation & Épicerie",
            city: "Libreville",
            district: u.district || "Centre-Ville",
            address_landmark: "Face voie principale",
            phone: cleanPhone,
            is_verified: true,
          } as any);
        } else if (cleanRole === "courier") {
          await supabaseAdmin.from("courier_profiles").insert({
            user_id: userId,
            vehicle_type: u.vehicleType || "moto",
            zone_city: "Libreville",
            is_active: true,
          } as any);
        }

        results.push({
          email: cleanEmail,
          success: true,
          userId: userId,
          role: cleanRole,
          generatedPassword: initialPassword,
        });
      } catch (err: any) {
        results.push({
          email: cleanEmail,
          success: false,
          role: cleanRole,
          error: err?.message || "Exception inattendue.",
        });
      }
    }

    const successfulCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successfulCount} / ${users.length} utilisateur(s) créé(s) avec succès.`,
      successfulCount,
      totalCount: users.length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
