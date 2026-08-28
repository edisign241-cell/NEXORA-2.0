import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mdqaehruroyvyhfmzjer.supabase.co";
const supabaseAnonKey = "sb_publishable_PWhknEVfDEKMd28iwkyCqw_xigEd0kT";

async function testLiveConnection() {
  console.log("=== TEST DE CONNEXION SUPABASE LIVE ===");
  console.log("URL:", supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase.from("stores").select("*");
    if (error) {
      console.error("Erreur Supabase:", error.message);
    } else {
      console.log("✅ Connexion réussie à Supabase !");
      console.log("Nombre de magasins existants dans la base :", data?.length ?? 0);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

testLiveConnection();
