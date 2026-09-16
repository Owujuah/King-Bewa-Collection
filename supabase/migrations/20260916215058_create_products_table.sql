/*
# Create products table and product_images storage bucket

1. New Tables
- `products`
  - `id` (serial, primary key)
  - `name` (text, not null)
  - `category` (text, not null)
  - `price` (numeric, not null)
  - `image` (text, main display image URL)
  - `images` (text[], gallery image URLs)
  - `description` (text, short product description)
  - `details` (text[], bullet-point product specs)
  - `sizes` (text[], available sizes)
  - `created_at` (timestamp)
  - `updated_at` (timestamp, auto-updated)

2. Storage
- Create `product-images` public storage bucket for admin image uploads.

3. Security
- RLS enabled on `products`.
- Allow anon + authenticated full CRUD (single-tenant admin app, no sign-in).
- Storage bucket is public for reads; writes allowed for anon + authenticated.
*/

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  details text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated + anon write
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anon upload product images" ON storage.objects;
CREATE POLICY "Anon upload product images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anon update product images" ON storage.objects;
CREATE POLICY "Anon update product images" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Anon delete product images" ON storage.objects;
CREATE POLICY "Anon delete product images" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'product-images');
