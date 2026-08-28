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
 * Sign in with Email and Password
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
      redirectUrl: redirectTo || "/dashboard",
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

    // Determine target dashboard based on role
    const role = (data.user.user_metadata?.role as UserRole) || "client";
    let targetUrl = redirectTo;

    if (!targetUrl) {
      if (role === "vendor" || role === "vendeur") targetUrl = "/dashboard/vendor";
      else if (role === "courier" || role === "livreur") targetUrl = "/dashboard/courier";
      else if (role === "admin") targetUrl = "/dashboard/admin";
      else targetUrl = "/";
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

  if (!isServerSupabaseConfigured) {
    // Demo mode: Return success and redirect
    return {
      success: true,
      message: "Compte créé avec succès (Mode Démonstration).",
      redirectUrl:
        role === "vendor"
          ? "/dashboard/vendor"
          : role === "courier"
          ? "/dashboard/courier"
          : "/",
    };
  }

  try {
    const supabase = await createClient();

    const userMetadata: Record<string, string> = {
      full_name: fullName,
      phone,
      role,
    };

    if (role === "vendor" && storeName) {
      userMetadata.store_name = storeName;
      userMetadata.store_category = storeCategory || "Général";
      if (district) userMetadata.district = district;
      if (addressLandmark) userMetadata.address_landmark = addressLandmark;
    }

    if (role === "courier" && vehicleType) {
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

    // Determine target dashboard
    let targetUrl = "/";
    if (role === "vendor") targetUrl = "/dashboard/vendor";
    else if (role === "courier") targetUrl = "/dashboard/courier";

    revalidatePath("/", "layout");

    // If confirmation email is required
    if (data.user && !data.session) {
      return {
        success: true,
        message: "Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription.",
        redirectUrl: `/auth/login?registered=true&email=${encodeURIComponent(email)}`,
      };
    }

    return {
      success: true,
      message: "Bienvenue sur Nexora Gabon !",
      redirectUrl: targetUrl,
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
