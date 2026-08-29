-- =============================================================================
-- NEXORA GABON - SCRIPT D'INSERTION ET CRÉATION MASSIVE D'UTILISATEURS (SQL)
-- Fichier : supabase/bulk_insert_users.sql
-- Description : Crée des utilisateurs en masse dans auth.users et public.profiles
--               avec mots de passe fonctionnels et emails confirmés.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Procédure d'insertion massive
CREATE OR REPLACE FUNCTION public.bulk_create_users(users_data JSONB)
RETURNS TABLE (
    created_count INT,
    details JSONB
) AS $$
DECLARE
    u RECORD;
    v_user_id UUID;
    v_password TEXT;
    v_role TEXT;
    v_full_name TEXT;
    v_email TEXT;
    v_phone TEXT;
    v_store_name TEXT;
    v_slug TEXT;
    v_count INT := 0;
    v_results JSONB := '[]'::jsonb;
BEGIN
    FOR u IN SELECT * FROM jsonb_array_elements(users_data)
    LOOP
        v_email := lower(trim(u.value->>'email'));
        v_full_name := COALESCE(u.value->>'fullName', u.value->>'full_name', 'Utilisateur Nexora');
        v_phone := COALESCE(u.value->>'phone', '+241 077 00 00 00');
        v_role := COALESCE(u.value->>'role', 'customer');
        v_password := COALESCE(u.value->>'password', 'NexoraPass2026!');
        v_store_name := u.value->>'storeName';

        -- Vérifier si l'utilisateur existe déjà
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

        IF v_user_id IS NULL THEN
            v_user_id := gen_random_uuid();

            -- 1. Insertion dans auth.users
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                confirmation_token,
                recovery_token,
                email_change_token_new,
                email_change
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                v_user_id,
                'authenticated',
                'authenticated',
                v_email,
                crypt(v_password, gen_salt('bf')),
                now(),
                '{"provider":"email","providers":["email"]}'::jsonb,
                jsonb_build_object('full_name', v_full_name, 'phone', v_phone, 'role', v_role),
                now(),
                now(),
                '',
                '',
                '',
                ''
            );

            -- 2. Insertion dans public.profiles
            INSERT INTO public.profiles (id, email, full_name, phone, role, updated_at)
            VALUES (
                v_user_id,
                v_email,
                v_full_name,
                v_phone,
                v_role,
                now()
            )
            ON CONFLICT (id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                phone = EXCLUDED.phone,
                role = EXCLUDED.role,
                updated_at = now();

            -- 3. Si c'est un marchand, créer sa boutique
            IF v_role IN ('vendor', 'vendeur') AND v_store_name IS NOT NULL THEN
                v_slug := lower(regexp_replace(v_store_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(v_user_id::text from 1 for 4);
                
                INSERT INTO public.stores (
                    vendor_id,
                    name,
                    slug,
                    category,
                    city,
                    district,
                    address_landmark,
                    phone,
                    is_verified
                ) VALUES (
                    v_user_id,
                    v_store_name,
                    v_slug,
                    'Commerce Général',
                    'Libreville',
                    'Centre-Ville',
                    'Face voie principale',
                    v_phone,
                    true
                )
                ON CONFLICT (slug) DO NOTHING;
            END IF;

            -- 4. Si c'est un coursier, créer son profil livreur
            IF v_role IN ('courier', 'livreur') THEN
                INSERT INTO public.courier_profiles (
                    user_id,
                    vehicle_type,
                    zone_city,
                    is_active
                ) VALUES (
                    v_user_id,
                    'moto',
                    'Libreville',
                    true
                )
                ON CONFLICT (user_id) DO NOTHING;
            END IF;

            v_count := v_count + 1;
            v_results := v_results || jsonb_build_object('email', v_email, 'status', 'créé', 'id', v_user_id, 'role', v_role);
        ELSE
            -- Mise à jour du rôle existant
            UPDATE public.profiles SET role = v_role, full_name = v_full_name, phone = v_phone WHERE id = v_user_id;
            UPDATE auth.users SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', v_role) WHERE id = v_user_id;
            v_results := v_results || jsonb_build_object('email', v_email, 'status', 'mis à jour', 'id', v_user_id, 'role', v_role);
        END IF;
    END LOOP;

    RETURN QUERY SELECT v_count, v_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================================
-- EXÉCUTION D'EXEMPLE : AJOUTEZ VOS UTILISATEURS DANS LE TABLEAU JSON CI-DESSOUS
-- =============================================================================

SELECT * FROM public.bulk_create_users('[
  {
    "fullName": "Commerçant Test Libreville",
    "email": "boutique.mode@nexora.ga",
    "phone": "+241 077 12 34 56",
    "role": "vendor",
    "password": "Password2026!",
    "storeName": "Mode & Beauté Akanda"
  },
  {
    "fullName": "Coursier Express Gabon",
    "email": "livreur.express@nexora.ga",
    "phone": "+241 066 98 76 54",
    "role": "courier",
    "password": "Password2026!"
  },
  {
    "fullName": "Client Partenaire",
    "email": "client.fidele@nexora.ga",
    "phone": "+241 074 55 44 33",
    "role": "customer",
    "password": "Password2026!"
  }
]'::jsonb);
