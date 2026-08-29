-- =============================================================================
-- NEXORA GABON - INITIALISATION & ÉLÉVATION DU SUPER-ADMINISTRATEUR
-- Fichier : supabase/create_superadmin.sql
-- Description : Crée ou élève un utilisateur au rôle 'admin' dans public.profiles
--               et synchronise auth.users.raw_user_meta_data.
-- =============================================================================

-- 1. Procédure idempotente d'élévation au rôle Super-Administrateur
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur dans auth.users
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(target_email));

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur introuvable avec l''email : %. Veuillez d''abord créer ce compte via l''inscription Nexora ou l''interface Auth de Supabase.', target_email;
    END IF;

    -- 1. Mettre à jour les métadonnées dans auth.users
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
    WHERE id = target_user_id;

    -- 2. Mettre à jour ou insérer le profil avec le rôle 'admin'
    INSERT INTO public.profiles (id, email, full_name, role, updated_at)
    VALUES (
        target_user_id,
        target_email,
        'Super Administrateur Nexora',
        'admin',
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());

    RAISE NOTICE 'Félicitations ! Le compte % (ID: %) est désormais Super-Administrateur de Nexora Gabon.', target_email, target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. EXÉCUTION IMMÉDIATE (Remplacez l'email ci-dessous par votre email réel)
-- =============================================================================

-- EXEMPLE D'UTILISATION :
-- 1. Inscrivez-vous sur l'application Nexora avec votre email (ex: contact@nexora.ga ou votre adresse perso)
-- 2. Décommentez et exécutez la ligne ci-dessous dans l'Éditeur SQL Supabase :

-- SELECT public.promote_user_to_admin('votre-email@domaine.com');

-- 3. Requête de vérification du statut Super-Admin :
-- SELECT p.id, p.email, p.full_name, p.role, u.raw_user_meta_data->>'role' as auth_role
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'admin';
