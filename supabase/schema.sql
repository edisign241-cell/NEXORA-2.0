-- =============================================================================
-- NEXORA GABON - POSTGRESQL SCHEMA (SUPABASE)
-- Marketplace nationale du Gabon avec paiements Airtel/Moov Money et repères visuels
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'courier', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'delivering', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('airtel_money', 'moov_money', 'cash_on_delivery', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('unpaid', 'paid', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type_enum AS ENUM ('moto', 'voiture', 'velo', 'a_pied');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------------------------------

-- 2.1 PROFILES (Utilisateurs : Clients, Vendeurs, Livreurs, Administrateurs)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 STORES (Boutiques des vendeurs sur le marché gabonais)
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    category TEXT NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    province TEXT NOT NULL DEFAULT 'Estuaire',
    city TEXT NOT NULL DEFAULT 'Libreville',
    district TEXT NOT NULL,
    address_landmark TEXT NOT NULL, -- Repère visuel (ex: "Face pharmacie, grand portail vert")
    is_verified BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 PRODUCTS (Produits vendus en FCFA)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_xaf INTEGER NOT NULL CHECK (price_xaf >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 ORDERS (Commandes avec paiements Airtel/Moov Money et repères de livraison)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    courier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'pending',
    total_amount_xaf INTEGER NOT NULL CHECK (total_amount_xaf >= 0),
    delivery_fee_xaf INTEGER NOT NULL DEFAULT 1500 CHECK (delivery_fee_xaf >= 0),
    payment_method payment_method_type NOT NULL DEFAULT 'airtel_money',
    payment_status payment_status_type NOT NULL DEFAULT 'unpaid',
    delivery_address_landmark TEXT NOT NULL, -- Ex: "Face École publique d'Angondjé, portail noir"
    delivery_district TEXT NOT NULL,         -- Ex: "Angondjé"
    delivery_city TEXT NOT NULL DEFAULT 'Libreville',
    delivery_phone TEXT NOT NULL,            -- Numéro Gabon (+241...)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 ORDER ITEMS (Lignes d'articles par commande)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_xaf INTEGER NOT NULL CHECK (unit_price_xaf >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 COURIER PROFILES (Profils détaillés des livreurs gabonais)
CREATE TABLE IF NOT EXISTS public.courier_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active_duty BOOLEAN NOT NULL DEFAULT false,
    vehicle_type vehicle_type_enum NOT NULL DEFAULT 'moto',
    id_document_url TEXT,
    verified_by_admin BOOLEAN NOT NULL DEFAULT false,
    base_delivery_rate_xaf INTEGER NOT NULL DEFAULT 1500 CHECK (base_delivery_rate_xaf >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 CUSTOM DISTRICTS (Quartiers locaux ajoutés ou suggérés par les utilisateurs)
CREATE TABLE IF NOT EXISTS public.custom_districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province TEXT NOT NULL DEFAULT 'Estuaire',
    city TEXT NOT NULL DEFAULT 'Libreville',
    district_name TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_city_district UNIQUE (city, district_name)
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH PERFORMANCE
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_stores_vendor_id ON public.stores(vendor_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_district ON public.stores(district);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_courier_id ON public.orders(courier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_custom_districts_city ON public.custom_districts(city);

-- -----------------------------------------------------------------------------
-- 4. AUTOMATIC TRIGGERS (UPDATED_AT & AUTH USER SYNC)
-- -----------------------------------------------------------------------------

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_stores_updated_at ON public.stores;
CREATE TRIGGER tr_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_courier_profiles_updated_at ON public.courier_profiles;
CREATE TRIGGER tr_courier_profiles_updated_at
    BEFORE UPDATE ON public.courier_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role := 'customer';
BEGIN
    -- Parse role from user metadata
    IF (NEW.raw_user_meta_data->>'role') IS NOT NULL AND (NEW.raw_user_meta_data->>'role') IN ('customer', 'vendor', 'courier', 'admin') THEN
        assigned_role := (NEW.raw_user_meta_data->>'role')::user_role;
    END IF;

    -- Insert or update profile
    INSERT INTO public.profiles (id, email, full_name, phone, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Utilisateur Nexora'),
        NEW.raw_user_meta_data->>'phone',
        assigned_role,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = timezone('utc'::text, now());

    -- Automatically create a default store entry if the registered user is a vendor
    IF assigned_role = 'vendor' AND (NEW.raw_user_meta_data->>'store_name') IS NOT NULL THEN
        INSERT INTO public.stores (
            vendor_id,
            name,
            slug,
            bio,
            category,
            province,
            city,
            district,
            address_landmark
        ) VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'store_name',
            LOWER(REGEXP_REPLACE(NEW.raw_user_meta_data->>'store_name', '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(NEW.id::text, 1, 6),
            COALESCE(NEW.raw_user_meta_data->>'store_bio', 'Boutique officielle sur la Marketplace Nexora Gabon'),
            COALESCE(NEW.raw_user_meta_data->>'store_category', 'Général'),
            COALESCE(NEW.raw_user_meta_data->>'province', 'Estuaire'),
            COALESCE(NEW.raw_user_meta_data->>'city', 'Libreville'),
            COALESCE(NEW.raw_user_meta_data->>'district', 'Centre-Ville'),
            COALESCE(NEW.raw_user_meta_data->>'address_landmark', 'Face voie principale')
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- Automatically create a courier profile if the registered user is a courier
    IF assigned_role = 'courier' THEN
        INSERT INTO public.courier_profiles (
            id,
            vehicle_type,
            is_active_duty
        ) VALUES (
            NEW.id,
            COALESCE((NEW.raw_user_meta_data->>'vehicle_type')::vehicle_type_enum, 'moto'::vehicle_type_enum),
            false
        ) ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_districts ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own profile or admin can manage"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles"
    ON public.profiles FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 5.2 STORES POLICIES
CREATE POLICY "Stores are viewable by everyone"
    ON public.stores FOR SELECT
    USING (true);

CREATE POLICY "Vendors can insert their own store"
    ON public.stores FOR INSERT
    WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own store"
    ON public.stores FOR UPDATE
    USING (auth.uid() = vendor_id);

-- 5.3 PRODUCTS POLICIES
CREATE POLICY "Active products are viewable by everyone"
    ON public.products FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = products.store_id AND stores.vendor_id = auth.uid()
    ));

CREATE POLICY "Vendors can insert products in their stores"
    ON public.products FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = store_id AND stores.vendor_id = auth.uid()
    ));

CREATE POLICY "Vendors can update products in their stores"
    ON public.products FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = products.store_id AND stores.vendor_id = auth.uid()
    ));

CREATE POLICY "Vendors can delete products in their stores"
    ON public.products FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = products.store_id AND stores.vendor_id = auth.uid()
    ));

-- 5.4 ORDERS POLICIES
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = customer_id
        OR auth.uid() = courier_id
        OR EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = orders.store_id AND stores.vendor_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated customers can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Involved parties can update order status"
    ON public.orders FOR UPDATE
    USING (
        auth.uid() = customer_id
        OR auth.uid() = courier_id
        OR EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = orders.store_id AND stores.vendor_id = auth.uid()
        )
    );

-- 5.5 ORDER ITEMS POLICIES
CREATE POLICY "Involved users can view order items"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (
            orders.customer_id = auth.uid()
            OR orders.courier_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.stores
                WHERE stores.id = orders.store_id AND stores.vendor_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Customers can insert order items for their orders"
    ON public.order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()
    ));

-- 5.6 COURIER PROFILES POLICIES
CREATE POLICY "Courier profiles are viewable by authenticated users"
    ON public.courier_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Couriers can update their own courier profile"
    ON public.courier_profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5.7 CUSTOM DISTRICTS POLICIES
CREATE POLICY "Districts are viewable by everyone"
    ON public.custom_districts FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can submit custom districts"
    ON public.custom_districts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
