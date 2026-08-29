import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types/database";
import { MOCK_STORES, MOCK_PRODUCTS } from "@/lib/constants/mock-data";
import { GABON_PROVINCES, ProvinceData } from "@/lib/constants/gabon-locations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
);

/**
 * Creates a browser-side Supabase client with SSR cookie support.
 */
export function createClient() {
  if (!isSupabaseConfigured) {
    return createBrowserClient<Database>(
      "https://placeholder-nexora.supabase.co",
      "placeholder-anon-key-nexora"
    );
  }
  return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
}

export const supabase = createClient();

export function getBrowserSupabase() {
  return supabase;
}

/**
 * Data Access Layer with Automatic Mock Fallback
 * Allows the Nexora frontend to run smoothly in demo mode or with real Supabase credentials.
 */
export const nexoraApi = {
  isLive: isSupabaseConfigured,

  async getStores() {
    if (!isSupabaseConfigured) {
      return { data: MOCK_STORES, error: null };
    }
    try {
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
  },

  async getProducts(storeId?: string, category?: string) {
    if (!isSupabaseConfigured) {
      let filtered = [...MOCK_PRODUCTS];
      if (storeId) filtered = filtered.filter((p) => p.storeId === storeId);
      if (category && category !== "Tous les Rayons")
        filtered = filtered.filter((p) => p.categorie === category);
      return { data: filtered, error: null };
    }
    try {
      let query = supabase.from("products").select("*").eq("is_active", true);
      if (storeId) query = query.eq("store_id", storeId);
      if (category && category !== "Tous les Rayons")
        query = query.eq("category", category);
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        let filtered = [...MOCK_PRODUCTS];
        if (storeId) filtered = filtered.filter((p) => p.storeId === storeId);
        if (category && category !== "Tous les Rayons")
          filtered = filtered.filter((p) => p.categorie === category);
        return { data: filtered, error: null };
      }
      return { data, error: null };
    } catch {
      return { data: MOCK_PRODUCTS, error: null };
    }
  },

  async getDistricts(city: string = "Libreville"): Promise<{ data: string[]; error: Error | null }> {
    const getFallbackDistricts = (targetCity: string): string[] => {
      const estuaire = GABON_PROVINCES.find((p: ProvinceData) => p.nom === "Estuaire");
      const ville = estuaire?.villes.find((v) => v.nom.toLowerCase() === targetCity.toLowerCase());
      return ville?.quartiers || ["Louis", "Glass", "Nzeng-Ayong", "Batterie IV", "Akanda", "Mont-Bouët", "Oloumi"];
    };

    if (!isSupabaseConfigured) {
      return { data: getFallbackDistricts(city), error: null };
    }
    try {
      const { data, error } = await supabase
        .from("custom_districts")
        .select("district_name")
        .eq("city", city)
        .eq("is_approved", true);
      if (error || !data || data.length === 0) {
        return { data: getFallbackDistricts(city), error: null };
      }
      return { data: (data as any[]).map((d) => d.district_name as string), error: null };
    } catch {
      return { data: getFallbackDistricts(city), error: null };
    }
  },
};
