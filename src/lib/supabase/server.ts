import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import { MOCK_STORES, MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/constants/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseServiceKey &&
    supabaseUrl !== "https://your-project.supabase.co"
);

/**
 * Server-Side Supabase Client (Service Role / Admin or Anon)
 * Safe for Server Components, Server Actions, and Route Handlers.
 */
export function createServerClient() {
  if (!isServerSupabaseConfigured) {
    return createSupabaseClient<Database>(
      "https://placeholder-nexora.supabase.co",
      "placeholder-service-key-nexora"
    );
  }
  return createSupabaseClient<Database>(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Server Data Fetchers with Mock Fallback
 */
export async function getServerStores() {
  if (!isServerSupabaseConfigured) {
    return { data: MOCK_STORES, error: null };
  }
  try {
    const supabase = createServerClient();
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
    const supabase = createServerClient();
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
    const supabase = createServerClient();
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
