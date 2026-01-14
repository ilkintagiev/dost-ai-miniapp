-- DOST AI Mini App Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('phones', 'glasses', 'devices')),
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster category queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Index for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL,
    user_name TEXT,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index for order status
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products policies (everyone can read and write for now - we'll add admin checks in app)
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert products" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete products" ON products
    FOR DELETE USING (true);

-- Orders policies (everyone can read and write for now)
CREATE POLICY "Anyone can view orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update orders" ON orders
    FOR UPDATE USING (true);

-- Users policies
CREATE POLICY "Anyone can view users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update users" ON users
    FOR UPDATE USING (true);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
    ('AI Phone Pro', 'Смартфон с AI-процессором', 89990, 'phones', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png', 10),
    ('Smart Phone X', 'Флагманский смартфон', 59990, 'phones', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png', 15),
    ('AI Glasses Vision', 'Умные AR очки', 45990, 'glasses', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/smart_glasses_product_1768405799963.png', 8),
    ('Smart Glasses Pro', 'Очки с AI-ассистентом', 34990, 'glasses', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/smart_glasses_product_1768405799963.png', 12),
    ('AI Assistant Hub', 'Умный дом-центр', 29990, 'devices', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png', 20),
    ('Neural Processor', 'AI-устройство для дома', 79990, 'devices', '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png', 5)
ON CONFLICT DO NOTHING;
