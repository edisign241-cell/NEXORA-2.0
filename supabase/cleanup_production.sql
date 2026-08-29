-- =============================================================================
-- NEXORA GABON - SCRIPT DE PURGE ET RÉINITIALISATION DE PRODUCTION
-- Fichier : supabase/cleanup_production.sql
-- Description : Purge transactionnelle et sécurisée de toutes les données 
--               fictives/mockées pour accueillir les vrais utilisateurs.
-- =============================================================================

BEGIN;

-- 1. Désactivation temporaire du contrôle de réplication pour suppression en cascade propre
SET session_replication_role = 'replica';

-- 2. Vidage des tables transactionnelles et catalogue (Ordre respectant l'intégrité référentielle)
-- TRUNCATE TABLE supprime instantanément toutes les lignes et réinitialise les compteurs
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.stores CASCADE;
TRUNCATE TABLE public.courier_profiles CASCADE;

-- 3. Nettoyage de la table des profils publics
TRUNCATE TABLE public.profiles CASCADE;

-- 4. Suppression des comptes utilisateurs fictifs dans auth.users
-- Note : L'administrateur pourra créer son compte superadmin juste après ce script
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DELETE FROM auth.users;
    END IF;
END $$;

-- 5. Nettoyage des quartiers non approuvés ou créés lors des tests
DELETE FROM public.custom_districts WHERE is_approved = false OR created_by IS NOT NULL;

-- 6. Réactivation du contrôle des contraintes et triggers
SET session_replication_role = 'origin';

-- 7. Réinsertion / Préservation des Données de Référence Structurelles (Quartiers & Villes du Gabon)
INSERT INTO public.custom_districts (id, province, city, district_name, is_approved, created_by) VALUES
('d1111111-1111-1111-1111-111111111101', 'Estuaire', 'Libreville', 'Akanda (Château)', true, NULL),
('d1111111-1111-1111-1111-111111111102', 'Estuaire', 'Libreville', 'Louis (Bord de Mer)', true, NULL),
('d1111111-1111-1111-1111-111111111103', 'Estuaire', 'Libreville', 'Glass', true, NULL),
('d1111111-1111-1111-1111-111111111104', 'Estuaire', 'Libreville', 'Nzeng-Ayong', true, NULL),
('d1111111-1111-1111-1111-111111111105', 'Estuaire', 'Libreville', 'Batterie IV', true, NULL),
('d1111111-1111-1111-1111-111111111106', 'Estuaire', 'Libreville', 'Mont-Bouët', true, NULL),
('d1111111-1111-1111-1111-111111111107', 'Estuaire', 'Libreville', 'Angondjé', true, NULL),
('d1111111-1111-1111-1111-111111111108', 'Estuaire', 'Libreville', 'Charbonnages', true, NULL),
('d1111111-1111-1111-1111-111111111109', 'Estuaire', 'Libreville', 'Owendo (Port)', true, NULL),
('d1111111-1111-1111-1111-111111111110', 'Ogooué-Maritime', 'Port-Gentil', 'Grand Village', true, NULL)
ON CONFLICT (city, district_name) DO UPDATE 
SET is_approved = true, created_by = NULL;

COMMIT;

-- 8. Rapport de vérification
DO $$
DECLARE
    stores_count INT;
    products_count INT;
    orders_count INT;
    profiles_count INT;
    districts_count INT;
BEGIN
    SELECT count(*) INTO stores_count FROM public.stores;
    SELECT count(*) INTO products_count FROM public.products;
    SELECT count(*) INTO orders_count FROM public.orders;
    SELECT count(*) INTO profiles_count FROM public.profiles;
    SELECT count(*) INTO districts_count FROM public.custom_districts;

    RAISE NOTICE '--- VÉRIFICATION DU NETTOYAGE NEXORA PRODUCTION ---';
    RAISE NOTICE 'Boutiques en base : % (attendu: 0)', stores_count;
    RAISE NOTICE 'Produits en base : % (attendu: 0)', products_count;
    RAISE NOTICE 'Commandes en base : % (attendu: 0)', orders_count;
    RAISE NOTICE 'Profils utilisateurs : % (attendu: 0)', profiles_count;
    RAISE NOTICE 'Quartiers de référence préservés : %', districts_count;
    RAISE NOTICE 'Base de données purgée avec succès et prête pour les vrais utilisateurs.';
END $$;
