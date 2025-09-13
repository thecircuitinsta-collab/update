/*
  # Zentra Holdings - Initial Database Schema

  1. New Tables
    - `services` - Service offerings with images and categories
    - `projects` - Completed work showcases with before/after images  
    - `gallery` - Image gallery for showcasing work
    - `testimonials` - Customer reviews with approval workflow
    - `slider_images` - Homepage hero slider management
    - `admin_credentials` - Secure admin login management

  2. Storage Buckets
    - Services, projects, gallery, and slider image storage

  3. Security
    - Enable RLS on all tables
    - Public read access for approved content
    - Admin-only write access
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Projects table  
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  before_image text,
  after_image text,
  client_name text,
  created_at timestamptz DEFAULT now()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  review_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Slider images table
CREATE TABLE IF NOT EXISTS slider_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Admin credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL DEFAULT 'admin123',
  password_hash text NOT NULL DEFAULT '$2b$10$rBV2nBFRxQH4s6P8X7Dc5e1MjwYZvGxKyRrNJMpVcCc5K4Dkz6pqK',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT  
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read gallery"
  ON gallery FOR SELECT
  TO anon, authenticated  
  USING (true);

CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Public can read slider images"
  ON slider_images FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin policies (authenticated users can manage content)
CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage gallery"
  ON gallery FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage slider images"
  ON slider_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can read credentials"
  ON admin_credentials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update credentials"
  ON admin_credentials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default admin credentials (password: admin123)
INSERT INTO admin_credentials (username, password_hash) 
VALUES ('admin123', '$2b$10$rBV2nBFRxQH4s6P8X7Dc5e1MjwYZvGxKyRrNJMpVcCc5K4Dkz6pqK')
ON CONFLICT (username) DO NOTHING;

-- Sample data
INSERT INTO services (title, description, category) VALUES
('Lawn Mowing', 'Professional lawn mowing service with precision cutting and cleanup', 'maintenance'),
('Landscape Design', 'Custom landscape design and installation services', 'design'),
('Tree Trimming', 'Expert tree trimming and pruning services', 'maintenance'),
('Garden Installation', 'Complete garden planning and installation', 'installation');

INSERT INTO testimonials (client_name, review_text, rating, status) VALUES
('Sarah Johnson', 'Excellent service! My lawn has never looked better. The team is professional and reliable.', 5, 'approved'),
('Mike Chen', 'Outstanding landscape design. They transformed our backyard into a beautiful oasis.', 5, 'approved'),
('Lisa Williams', 'Quick response time and fair pricing. Highly recommend Zentra Holdings!', 4, 'approved');

INSERT INTO projects (title, description, client_name) VALUES
('Modern Front Yard Makeover', 'Complete transformation of a residential front yard with new plants and hardscaping', 'The Smith Family'),
('Commercial Landscape Installation', 'Large-scale landscaping project for office complex', 'Downtown Business Center');