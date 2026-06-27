-- ==================== EXTENSIONS ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== ENUMS ====================
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ==================== STORE SETTINGS (SINGLETON) ====================
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name VARCHAR(255) NOT NULL DEFAULT 'Akart',
  store_tagline TEXT,
  store_logo_url TEXT,
  store_favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  secondary_color VARCHAR(7) DEFAULT '#f59e0b',
  accent_color VARCHAR(7) DEFAULT '#8b5cf6',
  currency VARCHAR(3) DEFAULT 'INR',
  currency_symbol VARCHAR(5) DEFAULT '₹',
  support_email VARCHAR(255),
  support_phone VARCHAR(20),
  commission_rate DECIMAL(5, 2) DEFAULT 5.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT only_one_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid OR id IS NOT NULL)
);

-- ==================== USERS & PROFILES ====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vendors (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  store_name VARCHAR(255) NOT NULL,
  store_description TEXT,
  store_logo_url TEXT,
  store_banner_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  commission_rate DECIMAL(5, 2),
  total_sales DECIMAL(15, 2) DEFAULT 0,
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== CATEGORIES ====================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== PRODUCTS ====================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(15, 2) NOT NULL,
  compare_price DECIMAL(15, 2),
  cost_price DECIMAL(15, 2),
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
  ) STORED
);

CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;

-- ==================== PRODUCT IMAGES ====================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ==================== PRODUCT VARIANTS ====================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(15, 2),
  stock_quantity INT DEFAULT 0,
  attributes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ==================== CART ====================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);

-- ==================== WISHLIST ====================
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- ==================== ADDRESSES ====================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'home',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ==================== ORDERS ====================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(15, 2) NOT NULL,
  tax DECIMAL(15, 2) DEFAULT 0,
  shipping_cost DECIMAL(15, 2) DEFAULT 0,
  discount DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id UUID REFERENCES addresses(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- ==================== ORDER ITEMS ====================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_vendor ON order_items(vendor_id);

-- ==================== PAYMENTS ====================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id VARCHAR(255) UNIQUE,
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_signature VARCHAR(255),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status payment_status DEFAULT 'pending',
  payment_method VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_razorpay ON payments(razorpay_payment_id);

-- ==================== REVIEWS ====================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ==================== COUPONS ====================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) DEFAULT 'percentage',
  discount_value DECIMAL(15, 2) NOT NULL,
  min_purchase_amount DECIMAL(15, 2),
  max_discount_amount DECIMAL(15, 2),
  usage_limit INT,
  usage_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY ====================
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Cart: Users can only access their own cart
CREATE POLICY "Users can view their own cart" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Wishlist: Users can only access their own wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own wishlist" ON wishlist
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Addresses: Users can only access their own addresses
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Orders: Users can only view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Payments: Users can only view their own payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = payments.order_id 
      AND auth.uid()::text = o.user_id::text
    )
  );

-- Public read access for products and categories
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (is_active = TRUE);

-- ==================== TRIGGERS ====================
-- Update product rating when review is added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Update product updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_timestamp();

-- ==================== INITIAL DATA ====================
-- Insert default store settings (singleton)
INSERT INTO store_settings (
  id, store_name, store_tagline, primary_color, secondary_color, accent_color
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Akart',
  'Shop Everything',
  '#2563eb',
  '#f59e0b',
  '#8b5cf6'
) ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Electronics', 'electronics', 'Phones, laptops, and gadgets', '📱', 1),
  ('Fashion', 'fashion', 'Clothing, shoes, and accessories', '👕', 2),
  ('Home & Kitchen', 'home-kitchen', 'Furniture and kitchen appliances', '🏠', 3),
  ('Books', 'books', 'E-books and physical books', '📚', 4),
  ('Sports', 'sports', 'Sports equipment and gear', '⚽', 5),
  ('Beauty', 'beauty', 'Cosmetics and personal care', '💄', 6)
ON CONFLICT (slug) DO NOTHING;
