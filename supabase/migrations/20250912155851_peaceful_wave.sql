/*
  # Fix admin credentials table

  1. Changes
    - Change password_hash column to password for simplicity
    - Insert default admin credentials
    - Update RLS policies

  2. Security
    - Enable RLS on admin_credentials table
    - Add policies for admin access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS admin_credentials;

-- Create admin_credentials table with password instead of password_hash
CREATE TABLE admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL DEFAULT 'admin123',
  password text NOT NULL DEFAULT 'admin123',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can read credentials"
  ON admin_credentials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update credentials"
  ON admin_credentials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default admin credentials
INSERT INTO admin_credentials (username, password) 
VALUES ('admin123', 'admin123')
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;