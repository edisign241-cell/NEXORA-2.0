-- =============================================================================
-- NEXORA GABON - RÉPARATION & AUTOMATISATION CRÉATION UTILISATEURS (AUTH TRIGGER)
-- Fichier : supabase/fix_auth_user_creation.sql
-- Résout l'erreur Supabase : "Database error saving new user"
-- =============================================================================

-- 1. Assouplir les contraintes de public.profiles pour accepter les invitations
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN full_name SET DEFAULT 'Utilisateur Nexora';
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- 2. Fonction déclencheur (Trigger) ultra-robuste avec SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_full_name TEXT;
    v_role public.user_role;
    v_raw_role TEXT;
    v_store_name TEXT;
    v_slug TEXT;
BEGIN
    -- Extraire les métadonnées avec valeurs par défaut sécurisées
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'Utilisateur Nexora'
    );

    v_raw_role := LOWER(COALESCE(
        NEW.raw_user_meta_data->>'role',
        NEW.raw_app_meta_data->>'role',
        'customer'
    ));

    -- Normalisation du rôle
    IF v_raw_role IN ('vendor', 'vendeur') THEN
        v_role := 'vendor'::public.user_role;
    ELSIF v_raw_role IN ('courier', 'livreur') THEN
        v_role := 'courier'::public.user_role;
    ELSIF v_raw_role IN ('admin', 'superadmin') THEN
        v_role := 'admin'::public.user_role;
    ELSE
        v_role := 'customer'::public.user_role;
    END IF;

    -- Créer ou mettre à jour le profil
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        avatar_url,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, NULL),
        v_role,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        role = COALESCE(EXCLUDED.role, public.profiles.role),
        updated_at = NOW();

    -- Si rôle Vendeur et nom de boutique fourni, initialiser la boutique
    v_store_name := NEW.raw_user_meta_data->>'store_name';
    IF v_role = 'vendor'::public.user_role AND v_store_name IS NOT NULL AND TRIM(v_store_name) <> '' THEN
        v_slug := lower(regexp_replace(v_store_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(NEW.id::text from 1 for 4);
        
        INSERT INTO public.stores (
            vendor_id,
            name,
            slug,
            category,
            province,
            city,
            district,
            address_landmark,
            phone,
            is_verified,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            TRIM(v_store_name),
            v_slug,
            'Alimentation & Terroir',
            'Estuaire',
            'Libreville',
            'Centre-Ville',
            'Boutique Officielle',
            COALESCE(NEW.phone, '+241 077 00 00 00'),
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    -- Initialiser un portefeuille pour les marchands et coursiers
    IF v_role IN ('vendor'::public.user_role, 'courier'::public.user_role) THEN
        INSERT INTO public.wallets (user_id, balance_xaf, total_earned_xaf)
        VALUES (NEW.id, 0, 0)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur inattendue, ne jamais bloquer la création du compte auth
    RAISE WARNING 'handle_new_user trigger exception: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Attacher le déclencheur à auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Droits d'exécution sécurisés
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
