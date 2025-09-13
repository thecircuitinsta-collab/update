/*
  # Add bookings table for service booking requests

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `address` (text, required)
      - `service` (text, required)
      - `preferred_date` (date, required)
      - `preferred_time` (text, required)
      - `message` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for authenticated users to manage bookings
    - Add policy for anonymous users to create bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all bookings
CREATE POLICY "Admin can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update bookings
CREATE POLICY "Admin can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admin) to delete bookings
CREATE POLICY "Admin can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);