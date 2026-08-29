-- =============================================================================
-- NEXORA GABON - EXTENSION DU SCHÉMA COMPLET (12 ENTITÉS OPÉRATIONNELLES)
-- Fichier : supabase/complete_nexora_ecosystem.sql
-- Directoire d'Exploitation (COO IA) : Cycle Commandes, Wallets, Livraisons OTP,
-- Anti-Fraude, Avis, Favoris, Notifications & Codes Promo.
-- =============================================================================

BEGIN;

-- 1. ENUMS SUPPLÉMENTAIRES
DO $$ BEGIN
    CREATE TYPE delivery_status_enum AS ENUM ('pending_assignment', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE wallet_transaction_type AS ENUM ('credit_sale', 'commission_deduction', 'payout_airtel', 'payout_moov', 'refund', 'adjustment');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fraud_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PROMO CODES
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_xaf', 'free_delivery')),
    discount_value INT NOT NULL CHECK (discount_value > 0),
    min_order_amount_xaf INT NOT NULL DEFAULT 0,
    max_discount_xaf INT,
    usage_limit INT,
    used_count INT NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insérer le code promo national de bienvenue
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount_xaf, is_active)
VALUES ('NEXORA241', 'Livraison offerte sur Libreville et le Grand Libreville', 'free_delivery', 1500, 5000, true)
ON CONFLICT (code) DO NOTHING;

-- 4. DELIVERIES (Missions de livraison avec OTP à 4 chiffres)
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    courier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status delivery_status_enum NOT NULL DEFAULT 'pending_assignment',
    otp_code VARCHAR(6) NOT NULL DEFAULT (LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0')),
    pickup_address TEXT NOT NULL,
    pickup_landmark TEXT,
    dropoff_address TEXT NOT NULL,
    dropoff_landmark TEXT NOT NULL,
    estimated_distance_km NUMERIC(5,2) DEFAULT 5.0,
    delivery_fee_xaf INT NOT NULL DEFAULT 1500,
    courier_payout_xaf INT NOT NULL DEFAULT 1200,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. REVIEWS (Avis et notes sur les boutiques et produits)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reply TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_customer_order_review UNIQUE (customer_id, order_id)
);

-- 6. WALLETS (Portefeuilles marchands & livreurs)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance_xaf INT NOT NULL DEFAULT 0 CHECK (balance_xaf >= 0),
    pending_xaf INT NOT NULL DEFAULT 0 CHECK (pending_xaf >= 0),
    total_earned_xaf INT NOT NULL DEFAULT 0 CHECK (total_earned_xaf >= 0),
    mobile_money_operator TEXT DEFAULT 'airtel' CHECK (mobile_money_operator IN ('airtel', 'moov')),
    mobile_money_phone TEXT,
    is_frozen BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. WALLET TRANSACTIONS (Historique financier auditable)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    type wallet_transaction_type NOT NULL,
    amount_xaf INT NOT NULL,
    fee_xaf INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_code TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. NOTIFICATIONS (Alertes multi-canaux in-app et WhatsApp)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'order' CHECK (type IN ('order', 'payment', 'delivery', 'promo', 'security', 'system')),
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. FAVORITES (Articles et boutiques mis en favoris par les clients)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_customer_favorite_product UNIQUE (customer_id, product_id),
    CONSTRAINT unique_customer_favorite_store UNIQUE (customer_id, store_id)
);

-- 10. PAYMENTS (Journalisation précise des transactions Mobile Money)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount_xaf INT NOT NULL CHECK (amount_xaf > 0),
    payment_method TEXT NOT NULL,
    operator TEXT CHECK (operator IN ('airtel', 'moov', 'cash', 'card')),
    phone TEXT,
    transaction_reference TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'refunded')),
    ussd_prompt_code TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. FRAUD LOGS (Journal de surveillance anti-fraude)
CREATE TABLE IF NOT EXISTS public.fraud_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    risk_level fraud_risk_level NOT NULL DEFAULT 'low',
    rule_triggered TEXT NOT NULL,
    details JSONB,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    action_taken TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. AUTOMATIC DELIVERY CREATION ON ORDER INSERTION
CREATE OR REPLACE FUNCTION public.handle_new_order_delivery()
RETURNS TRIGGER AS $$
DECLARE
    v_store_address TEXT;
    v_store_landmark TEXT;
BEGIN
    SELECT city || ' (' || district || ')', address_landmark 
    INTO v_store_address, v_store_landmark
    FROM public.stores 
    WHERE id = NEW.store_id;

    INSERT INTO public.deliveries (
        order_id,
        status,
        pickup_address,
        pickup_landmark,
        dropoff_address,
        dropoff_landmark,
        delivery_fee_xaf,
        courier_payout_xaf
    ) VALUES (
        NEW.id,
        'pending_assignment',
        COALESCE(v_store_address, 'Libreville'),
        COALESCE(v_store_landmark, 'Boutique Partenaire'),
        NEW.delivery_city || ' (' || NEW.delivery_district || ')',
        NEW.delivery_address_landmark,
        NEW.delivery_fee_xaf,
        GREATEST(1000, NEW.delivery_fee_xaf - 300)
    )
    ON CONFLICT (order_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_order_create_delivery ON public.orders;
CREATE TRIGGER tr_order_create_delivery
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_order_delivery();

-- 13. INDEXES
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_courier_id ON public.deliveries(courier_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON public.reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

COMMIT;
