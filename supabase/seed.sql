-- =============================================================================
-- NEXORA GABON - SEED DATA (SUPABASE)
-- Boutiques, Produits, Quartiers Pilotes de Libreville et Profils de Démonstration
-- =============================================================================

-- Clean up existing seed data if needed
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.stores CASCADE;
TRUNCATE TABLE public.courier_profiles CASCADE;
TRUNCATE TABLE public.custom_districts CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- -----------------------------------------------------------------------------
-- 1. PILOT DISTRICTS (Quartiers Pilotes de Libreville & Akanda)
-- -----------------------------------------------------------------------------

INSERT INTO public.custom_districts (id, province, city, district_name, is_approved) VALUES
('d1111111-1111-1111-1111-111111111101', 'Estuaire', 'Libreville', 'Akanda (Château)', true),
('d1111111-1111-1111-1111-111111111102', 'Estuaire', 'Libreville', 'Louis (Bord de Mer)', true),
('d1111111-1111-1111-1111-111111111103', 'Estuaire', 'Libreville', 'Glass', true),
('d1111111-1111-1111-1111-111111111104', 'Estuaire', 'Libreville', 'Nzeng-Ayong', true),
('d1111111-1111-1111-1111-111111111105', 'Estuaire', 'Libreville', 'Batterie IV', true),
('d1111111-1111-1111-1111-111111111106', 'Estuaire', 'Libreville', 'Mont-Bouët', true),
('d1111111-1111-1111-1111-111111111107', 'Estuaire', 'Libreville', 'Angondjé', true),
('d1111111-1111-1111-1111-111111111108', 'Estuaire', 'Libreville', 'Charbonnages', true),
('d1111111-1111-1111-1111-111111111109', 'Estuaire', 'Libreville', 'Owendo (Port)', true),
('d1111111-1111-1111-1111-111111111110', 'Ogooué-Maritime', 'Port-Gentil', 'Grand Village', true)
ON CONFLICT (city, district_name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. TEST USERS (AUTH & PROFILES)
-- Note: Insert matching auth.users records if auth table exists, then public.profiles
-- -----------------------------------------------------------------------------

-- 2.1 Profiles for Customer, Vendors, Courier and Admin
INSERT INTO public.profiles (id, role, full_name, phone, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'customer', 'Ndong Mba Marc', '+241077458912', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('00000000-0000-0000-0000-000000000002', 'vendor',   'Tatiana Mengue (Saveurs du Terroir)', '+241065123456', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('00000000-0000-0000-0000-000000000003', 'vendor',   'Patrick Nzé (Tech Hub)', '+241074987654', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('00000000-0000-0000-0000-000000000004', 'vendor',   'Carine Mougoula (Élégance Wax)', '+241077889900', 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150'),
('00000000-0000-0000-0000-000000000005', 'vendor',   'Maman Esther (Street Food Libreville)', '+241066332211', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
('00000000-0000-0000-0000-000000000006', 'vendor',   'Maître Sculpteur Moussavou (Art Gabon)', '+241077112233', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('00000000-0000-0000-0000-000000000007', 'courier',  'Yannick Obame (Moto Express 241)', '+241076554433', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
('00000000-0000-0000-0000-000000000008', 'admin',    'Superviseur Nexora Gabon', '+241011760000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;

-- 2.2 Courier Profile (Yannick Obame)
INSERT INTO public.courier_profiles (id, is_active_duty, vehicle_type, verified_by_admin, base_delivery_rate_xaf) VALUES
('00000000-0000-0000-0000-000000000007', true, 'moto', true, 1500)
ON CONFLICT (id) DO UPDATE SET is_active_duty = EXCLUDED.is_active_duty;

-- -----------------------------------------------------------------------------
-- 3. 5 TEST STORES (Boutiques Pilotes du Gabon)
-- -----------------------------------------------------------------------------

INSERT INTO public.stores (id, vendor_id, name, slug, bio, category, logo_url, banner_url, province, city, district, address_landmark, is_verified, rating) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Saveurs & Terroir du Gabon',
    'saveurs-terroir-gabon',
    'Épicerie fine locale : Chocolat artisanal fèves de Kango, Odika moulu de Makokou, miel pur de la Ngounié et piments d''Oyem.',
    'Épicerie & Terroir',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800',
    'Estuaire',
    'Libreville',
    'Louis',
    'En face du restaurant La Voile Rouge, Rue des Bars, Louis',
    true,
    4.95
),
(
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Tech Libreville Hub',
    'tech-libreville-hub',
    'Smartphones neufs sous garantie officielle, laptops ultraportables, écouteurs sans fil et accessoires certifiés avec livraison express.',
    'Électronique & High-Tech',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800',
    'Estuaire',
    'Libreville',
    'Mont-Bouët',
    'Avenue du Colonel Parant, Galerie marchande Mont-Bouët, niveau 1',
    true,
    4.80
),
(
    'a0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    'Élégance Afro & Wax Couture',
    'elegance-afro-wax',
    'Robes modernes en Wax hollandais, chemises homme lin & broderies gabonaises, tenues sur-mesure et accessoires faits main.',
    'Mode & Wax',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'Estuaire',
    'Libreville',
    'Glass',
    'Carrefour Glass, Immeuble Rose en face de la station Total',
    true,
    4.88
),
(
    'a0000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    'Chez Maman Esther - Street Food Gabon',
    'chez-maman-esther-street-food',
    'Le meilleur de la Street Food et des grillades de Libreville : Coupé-Coupé braisé, Poulet Nyembwe, Bananes pesées et piment maison.',
    'Street Food & Restauration',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    'Estuaire',
    'Libreville',
    'Nzeng-Ayong',
    'Carrefour GP Nzeng-Ayong, grand kiosque vert près de la pharmacie',
    true,
    4.92
),
(
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000006',
    'L''Atelier Pierre de Mbigou & Arts',
    'atelier-pierre-mbigou',
    'Authentiques sculptures traditionnelles gabonaises, statuettes protectrices taillées dans la célèbre pierre de Mbigou et masques Punu sculptés main.',
    'Art & Culture Gabonaise',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
    'Estuaire',
    'Libreville',
    'Batterie IV',
    'À côté du Centre Culturel Gabonais, Batterie IV',
    true,
    5.00
)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, bio = EXCLUDED.bio;

-- -----------------------------------------------------------------------------
-- 4. 15 TEST PRODUCTS (Produits Réalistes en Francs CFA / XAF)
-- -----------------------------------------------------------------------------

INSERT INTO public.products (id, store_id, name, description, price_xaf, stock, category, images, is_active) VALUES
-- Saveurs & Terroir du Gabon (3 produits)
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Coffret Chocolat Artisanal Pur Kango (70% Cacao)',
    'Sélection de 4 tablettes d''exception fabriquées à partir des fèves de cacao de la région de Kango. Notes fruitées et torréfaction artisanale.',
    9900,
    45,
    'Épicerie & Terroir',
    ARRAY['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Pot d''Odika Sauvage Moulu de Makokou (500g)',
    'Véritable chocolat indigène récolté en forêt primaire dans l''Ogooué-Ivindo. Idéal pour sauces traditionnelles gabonaises parfumées et onctueuses.',
    7500,
    30,
    'Épicerie & Terroir',
    ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Miel Sauvage Pur des Forêts de la Ngounié (1L)',
    'Miel doré récolté de manière écoresponsable dans les arbres centenaires de la vallée de la Ngounié. Sans additifs ni conservateurs.',
    12000,
    20,
    'Épicerie & Terroir',
    ARRAY['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
    true
),

-- Tech Libreville Hub (3 produits)
(
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000003',
    'Smartphone Samsung Galaxy S24 Ultra (256Go)',
    'Écran Dynamic AMOLED 2X 120Hz, Processeur Snapdragon 8 Gen 3, Quad caméra 200MP, stylet S-Pen inclus. Garantie officielle constructeur 12 mois.',
    750000,
    8,
    'Électronique & High-Tech',
    ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000003',
    'Écouteurs Sans Fil Pro Active Noise Cancelling',
    'Son haute fidélité avec réduction active du bruit ambiant, autonomie 32h avec boîtier de charge rapide USB-C.',
    32000,
    25,
    'Électronique & High-Tech',
    ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000003',
    'PowerBank Haute Capacité 20 000 mAh Fast Charge 65W',
    'Batterie de secours ultra-robuste avec double port USB-C et affichage LED du pourcentage. Parfait pour les déplacements au Gabon.',
    22500,
    40,
    'Électronique & High-Tech',
    ARRAY['https://images.unsplash.com/photo-1609592426504-4c4f99ec05a5?w=600'],
    true
),

-- Élégance Afro & Wax Couture (3 produits)
(
    'b0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000004',
    'Ensemble Chic Veste & Pantalon Wax & Lin Moderne',
    'Création exclusive alliant lin beige respirant et finitions en véritable Wax hollandais aux motifs contemporains. Tailles S à XXL.',
    45000,
    12,
    'Mode & Wax',
    ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000004',
    'Robe Évasée Soirée Wax Motif Gabon Émeraude',
    'Coupe flatteuse cintrée à la taille avec détails brodés fil doré. Tissu 100% coton grand teint.',
    35000,
    15,
    'Mode & Wax',
    ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000004',
    'Chemise Homme Col Officier & Empiècement Wax',
    'Chemise moderne en coton égyptien blanc avec empiècement Wax sur la boutonnière et les poignets. Style casual chic.',
    28000,
    18,
    'Mode & Wax',
    ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
    true
),

-- Chez Maman Esther - Street Food Gabon (3 produits)
(
    'b0000000-0000-0000-0000-000000000010',
    'a0000000-0000-0000-0000-000000000005',
    'Plat Grand Format Coupé-Coupé Braisé & Bananes Pesées',
    'Viande de bœuf marinée aux épices secrètes du pays, braisée minute au feu de bois, servie avec bananes pesées croustillantes et piment rouge pilé.',
    6500,
    50,
    'Street Food & Restauration',
    ARRAY['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000011',
    'a0000000-0000-0000-0000-000000000005',
    'Poulet Fermier Nyembwe Traditionnel & Bâton de Manioc',
    'Recette emblématique gabonaise à base de sauce de noix de palme onctueuse et poulet fermier fumé, accompagné de bâtons de manioc tendres.',
    8500,
    35,
    'Street Food & Restauration',
    ARRAY['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000012',
    'a0000000-0000-0000-0000-000000000005',
    'Plateau Dégustation Brochettes Capitaine & Gambas Braisées',
    'Assortiment de 6 brochettes de filet de capitaine de l''Estuaire et gambas royales, sauce piment vert et oignons marinés.',
    15000,
    20,
    'Street Food & Restauration',
    ARRAY['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600'],
    true
),

-- L'Atelier Pierre de Mbigou & Arts (3 produits)
(
    'b0000000-0000-0000-0000-000000000013',
    'a0000000-0000-0000-0000-000000000002',
    'Sculpture Façonnée Main en Pierre de Mbigou (Motif Protecteur)',
    'Œuvre originale sculptée dans la stéatite grise et rose par un maître artisan de la Ngounié. Hauteur 25cm, socle en bois de padouk poli.',
    39000,
    5,
    'Art & Culture Gabonaise',
    ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000014',
    'a0000000-0000-0000-0000-000000000002',
    'Masque Traditionnel Punu Blanc Sculpté Main',
    'Masque d''initiation traditionnel Punu représentant la sérénité avec kaolin blanc naturel et coiffe sculptée à double coques. Pièce de collection.',
    55000,
    4,
    'Art & Culture Gabonaise',
    ARRAY['https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600'],
    true
),
(
    'b0000000-0000-0000-0000-000000000015',
    'a0000000-0000-0000-0000-000000000002',
    'Paire de Bougeoirs Design en Pierre de Mbigou Polie',
    'Duo de bougeoirs taillés dans la roche tendre de Mbigou avec finitions cirées soignées. Idéal pour décoration de table contemporaine.',
    18500,
    14,
    'Art & Culture Gabonaise',
    ARRAY['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600'],
    true
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_xaf = EXCLUDED.price_xaf;

-- -----------------------------------------------------------------------------
-- 5. SAMPLE ORDERS & ORDER ITEMS (Commandes Démo avec Repères)
-- -----------------------------------------------------------------------------

INSERT INTO public.orders (
    id, customer_id, store_id, courier_id, status,
    total_amount_xaf, delivery_fee_xaf, payment_method, payment_status,
    delivery_address_landmark, delivery_district, delivery_city, delivery_phone
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000007',
    'delivering',
    30300,
    1500,
    'airtel_money',
    'paid',
    'Face pharmacie de Nzeng-Ayong, grand portail vert à 50m du carrefour GP',
    'Nzeng-Ayong',
    'Libreville',
    '+241077458912'
),
(
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000007',
    'accepted',
    41500,
    2500,
    'moov_money',
    'paid',
    'Angondjé Château, après le stade d''entraînement, 2ème ruelle à droite',
    'Akanda (Château)',
    'Libreville',
    '+241077458912'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price_xaf) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 2, 9900),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 1, 7500),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000013', 1, 39000)
ON CONFLICT (id) DO NOTHING;
