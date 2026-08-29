import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types/database";
import { Store, Product } from "@/lib/types/marketplace";
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
 * Mapper helper to transform Supabase DB stores into frontend Store objects
 */
export function mapDbStoreToStore(row: any): Store {
  return {
    id: row.id,
    nom: row.name || "Boutique",
    slug: row.slug || row.id,
    description: row.bio || "",
    logo: row.logo_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
    banner: row.banner_url || undefined,
    ownerId: row.vendor_id,
    ownerName: row.name || "Marchand Nexora",
    rating: Number(row.rating || 5.0),
    reviewsCount: 0,
    verified: Boolean(row.is_verified),
    location: {
      province: row.province || "Estuaire",
      ville: row.city || "Libreville",
      quartier: row.district || "Centre-Ville",
      repere_texte: row.address_landmark || "Face voie principale",
    },
    categories: [row.category as any],
    totalSales: 0,
  };
}

/**
 * Mapper helper to transform Supabase DB products into frontend Product objects
 */
export function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    storeId: row.store_id,
    storeName: row.stores?.name || "Boutique Partenaire",
    nom: row.name || "Article",
    slug: row.id,
    description: row.description || "",
    prix: Number(row.price_xaf || 0),
    categorie: row.category as any,
    images:
      Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"],
    stock: Number(row.stock || 0),
    rating: 5,
    reviewsCount: 0,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Real Production Data Access Layer (Without mock fallbacks)
 */
export const nexoraApi = {
  isLive: isSupabaseConfigured,

  async getStores(): Promise<{ data: Store[]; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: null };
    }
    try {
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
  },

  async getProducts(
    storeId?: string,
    category?: string
  ): Promise<{ data: Product[]; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: null };
    }
    try {
      let query = supabase.from("products").select("*, stores(name)").eq("is_active", true);
      if (storeId) query = query.eq("store_id", storeId);
      if (category && category !== "all" && category !== "Tous les Rayons") {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) {
        return { data: [], error: new Error(error.message) };
      }
      return { data: (data || []).map(mapDbProductToProduct), error: null };
    } catch (err: any) {
      return { data: [], error: err instanceof Error ? err : new Error("Erreur de chargement") };
    }
  },

  async getDistricts(city: string = "Libreville"): Promise<{ data: string[]; error: Error | null }> {
    const getFallbackDistricts = (targetCity: string): string[] => {
      const estuaire = GABON_PROVINCES.find((p: ProvinceData) => p.nom === "Estuaire");
      const ville = estuaire?.villes.find((v) => v.nom.toLowerCase() === targetCity.toLowerCase());
      return (
        ville?.quartiers || [
          "Louis",
          "Glass",
          "Nzeng-Ayong",
          "Batterie IV",
          "Akanda",
          "Mont-Bouët",
          "Oloumi",
        ]
      );
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
