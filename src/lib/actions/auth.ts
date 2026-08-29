"use server";

import { createClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { UserRole } from "@/lib/types/marketplace";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
  redirectUrl?: string;
}

/**
 * Sign in with Email and Password & Redirect to role dashboard
 */
export async function signInWithPassword(
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "";

  if (!email || !password) {
    return { success: false, error: "Veuillez saisir votre adresse email et votre mot de passe." };
  }

  if (!isServerSupabaseConfigured) {
    // Demo mode: Return success and redirect
    return {
      success: true,
      message: "Connexion réussie (Mode démonstration).",
      redirectUrl: redirectTo || "/dashboard/customer",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { success: false, error: "Email ou mot de passe incorrect." };
      }
      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Veuillez confirmer votre adresse email via le lien reçu avant de vous connecter.",
        };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Impossible de récupérer votre profil." };
    }

    // Determine target dashboard based on public.profiles or user_metadata
    let role = (data.user.user_metadata?.role as string) || "customer";
    try {
      const { data: profileData } = await (supabase.from("profiles") as any)
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profileData?.role) {
        role = profileData.role;
      }
    } catch {
      // Use user_metadata fallback
    }

    const normRole = role.toLowerCase();
    let targetUrl = redirectTo;

    if (!targetUrl) {
      if (normRole === "vendor" || normRole === "vendeur") targetUrl = "/dashboard/vendor";
      else if (normRole === "courier" || normRole === "livreur") targetUrl = "/dashboard/courier";
      else if (normRole === "admin" || normRole === "superadmin") targetUrl = "/dashboard/admin";
      else targetUrl = "/dashboard/customer";
    }

    revalidatePath("/", "layout");
    return { success: true, redirectUrl: targetUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inattendue lors de la connexion.";
    return { success: false, error: message };
  }
}

/**
 * Sign Up with localized Gabonese metadata (Role, Phone, Store name or Vehicle type)
 */
export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const role = (formData.get("role") as string) || "customer";

  // Optional role-specific metadata
  const storeName = (formData.get("storeName") as string)?.trim();
  const storeCategory = (formData.get("storeCategory") as string)?.trim();
  const vehicleType = (formData.get("vehicleType") as string)?.trim();
  const district = (formData.get("district") as string)?.trim();
  const addressLandmark = (formData.get("addressLandmark") as string)?.trim();

  if (!email || !password || !fullName || !phone) {
    return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (password.length < 6) {
    return { success: false, error: "Le mot de passe doit comporter au moins 6 caractères." };
  }

  const normRole = role.toLowerCase();
  const targetDashboard =
    normRole === "vendor" || normRole === "vendeur"
      ? "/dashboard/vendor"
      : normRole === "courier" || normRole === "livreur"
      ? "/dashboard/courier"
      : normRole === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  if (!isServerSupabaseConfigured) {
    // Demo mode: Return success and redirect directly to role dashboard
    return {
      success: true,
      message: "Compte créé avec succès (Mode Démonstration).",
      redirectUrl: targetDashboard,
    };
  }

  try {
    const supabase = await createClient();

    const userMetadata: Record<string, string> = {
      full_name: fullName,
      phone,
      role: normRole,
    };

    if ((normRole === "vendor" || normRole === "vendeur") && storeName) {
      userMetadata.store_name = storeName;
      userMetadata.store_category = storeCategory || "Mode & Beauté";
      if (district) userMetadata.district = district;
      if (addressLandmark) userMetadata.address_landmark = addressLandmark;
    }

    if ((normRole === "courier" || normRole === "livreur") && vehicleType) {
      userMetadata.vehicle_type = vehicleType;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return {
          success: false,
          error: "Cette adresse email est déjà associée à un compte Nexora.",
        };
      }
      return { success: false, error: error.message };
    }

    // Direct insertion backup to guarantee public.profiles synchronization
    if (data.user?.id) {
      try {
        await (supabase.from("profiles") as any).upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          phone,
          role: normRole === "vendor" || normRole === "vendeur" ? "vendor" : normRole === "courier" || normRole === "livreur" ? "courier" : "customer",
          updated_at: new Date().toISOString(),
        });
      } catch (profileErr) {
        console.warn("Profil auto-insert fallback handled by trigger:", profileErr);
      }
    }

    revalidatePath("/", "layout");

    // If email confirmation is strictly enforced in Supabase Auth settings
    if (data.user && !data.session) {
      return {
        success: true,
        message: "Compte créé ! Redirection vers votre tableau de bord...",
        redirectUrl: targetDashboard,
      };
    }

    return {
      success: true,
      message: "Bienvenue sur Nexora Gabon !",
      redirectUrl: targetDashboard,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création du compte.";
    return { success: false, error: message };
  }
}

/**
 * Sign Out user from current session
 */
export async function signOutAction(): Promise<void> {
  if (isServerSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Request Password Reset Email
 */
export async function resetPassword(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { success: false, error: "Veuillez renseigner votre adresse email." };
  }

  if (!isServerSupabaseConfigured) {
    return {
      success: true,
      message: "Lien de réinitialisation simulé envoyé à votre adresse email.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Un lien de réinitialisation vous a été envoyé par email.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email.";
    return { success: false, error: message };
  }
}
