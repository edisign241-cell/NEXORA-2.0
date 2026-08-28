import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/types/database";
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/constants/mock-data";

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

    return {
      user,
      profile,
      role: profile?.role || (user.user_metadata?.role as string) || "customer",
    };
  } catch {
    return { user: null, profile: null, role: null };
  }
}

/**
 * Server Data Fetchers with Mock Fallback
 */
export async function getServerStores() {
  if (!isServerSupabaseConfigured) {
    return { data: MOCK_STORES, error: null };
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("rating", { ascending: false });
    if (error || !data || data.length === 0) {
      return { data: MOCK_STORES, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: MOCK_STORES, error: null };
  }
}

export async function getServerProducts(storeId?: string) {
  if (!isServerSupabaseConfigured) {
    let products = [...MOCK_PRODUCTS];
    if (storeId) products = products.filter((p) => p.storeId === storeId);
    return { data: products, error: null };
  }
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").eq("is_active", true);
    if (storeId) query = query.eq("store_id", storeId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let products = [...MOCK_PRODUCTS];
      if (storeId) products = products.filter((p) => p.storeId === storeId);
      return { data: products, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: MOCK_PRODUCTS, error: null };
  }
}

export async function getServerOrders() {
  if (!isServerSupabaseConfigured) {
    return { data: MOCK_ORDERS, error: null };
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)");
    if (error || !data || data.length === 0) {
      return { data: MOCK_ORDERS, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: MOCK_ORDERS, error: null };
  }
}
