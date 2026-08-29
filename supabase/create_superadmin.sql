-- =============================================================================
-- NEXORA GABON - NOMINATION DIRECTE DU SUPER-ADMINISTRATEUR
-- Fichier : supabase/create_superadmin.sql
-- Email cible : obamestephel20l@gmail.com
-- =============================================================================

-- OPTION 1 : EXÉCUTION DIRECTE (Copiez et exécutez tout ce bloc)
DO $$
DECLARE
    target_email TEXT := 'obamestephel20l@gmail.com';
    target_user_id UUID;
BEGIN
    -- 1. Récupérer l'ID de l'utilisateur
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(target_email));

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur introuvable avec l''email : %. Assurez-vous d''avoir créé le compte sur Nexora avant.', target_email;
    END IF;

    -- 2. Mettre à jour les métadonnées auth
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
        updated_at = NOW()
    WHERE id = target_user_id;

    -- 3. Mettre à jour / insérer le profil dans public.profiles
    INSERT INTO public.profiles (id, email, full_name, role, updated_at)
    VALUES (
        target_user_id,
        target_email,
        'Super Administrateur Nexora',
        'admin',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        email = EXCLUDED.email,
        updated_at = NOW();

    RAISE NOTICE 'Succès : % est maintenant Super-Administrateur (ID: %)', target_email, target_user_id;
END $$;

-- OPTION 2 : VÉRIFICATION DU RÔLE
SELECT 
    p.id, 
    p.email, 
    p.full_name, 
    p.role AS profile_role, 
    u.raw_user_meta_data->>'role' AS auth_role
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'obamestephel20l@gmail.com';
