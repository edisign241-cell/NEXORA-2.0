import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/types/database";
import { Store, Product, Order } from "@/lib/types/marketplace";
import { mapDbStoreToStore, mapDbProductToProduct } from "./client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
);

/**
 * Server-Side Supabase Client with Cookie storage.
 * To be used in Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  if (!isServerSupabaseConfigured) {
    return createServerClient<Database>(
      "https://placeholder-nexora.supabase.co",
      "placeholder-anon-key-nexora",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );
  }

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Helper to fetch current authenticated user and profile on the server.
 */
export async function getServerUser() {
  if (!isServerSupabaseConfigured) {
    return { user: null, profile: null, role: null };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, role: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profileData = profile as any;
    return {
      user,
      profile: profileData,
      role: profileData?.role || (user.user_metadata?.role as string) || "customer",
    };
  } catch {
    return { user: null, profile: null, role: null };
  }
}

/**
 * Real Server Data Fetchers (Without mock data fallback)
 */
export async function getServerStores(): Promise<{ data: Store[]; error: Error | null }> {
  if (!isServerSupabaseConfigured) {
    return { data: [], error: null };
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("rating", { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }
    return { data: (data || []).map(mapDbStoreToStore), error: null };
  } catch (err: any) {
    return { data: [], error: err instanceof Error ? err : new Error("Erreur de chargement") };
  }
}

export async function getServerProducts(storeId?: string): Promise<{ data: Product[]; error: Error | null }> {
  if (!isServerSupabaseConfigured) {
    return { data: [], error: null };
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*, stores(name)").eq("is_active", true);
    if (storeId) query = query.eq("store_id", storeId);
    const { data, error } = await query;

    if (error) {
      return { data: [], error: new Error(error.message) };
    }
    return { data: (data || []).map(mapDbProductToProduct), error: null };
  } catch (err: any) {
    return { data: [], error: err instanceof Error ? err : new Error("Erreur de chargement") };
  }
}

export async function getServerOrders(): Promise<{ data: Order[]; error: Error | null }> {
  if (!isServerSupabaseConfigured) {
    return { data: [], error: null };
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)");

    if (error) {
      return { data: [], error: new Error(error.message) };
    }
    // Map db orders to frontend Order interface if needed
    const mappedOrders: Order[] = (data || []).map((o: any) => ({
      id: o.id,
      orderNumber: `NEX-241-${o.id.slice(0, 6).toUpperCase()}`,
      clientId: o.customer_id,
      clientName: "Client Nexora",
      clientPhone: o.delivery_phone || "+241",
      storeIds: [o.store_id],
      items: (o.order_items || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productTitle: "Article",
        productPrice: item.unit_price_xaf,
        productImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
        quantity: item.quantity,
        storeId: o.store_id,
        storeName: "Boutique",
      })),
      subtotalAmount: o.total_amount_xaf - o.delivery_fee_xaf,
      deliveryFee: o.delivery_fee_xaf,
      totalAmount: o.total_amount_xaf,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status === "paid" ? "paid" : "pending",
      status: o.status === "completed" ? "delivered" : "pending",
      deliveryLocation: {
        province: "Estuaire",
        ville: o.delivery_city || "Libreville",
        quartier: o.delivery_district || "Quartier",
        repere_texte: o.delivery_address_landmark || "Repère visuel",
      },
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    return { data: mappedOrders, error: null };
  } catch (err: any) {
    return { data: [], error: err instanceof Error ? err : new Error("Erreur de chargement") };
  }
}
