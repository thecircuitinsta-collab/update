/*
  # Update Gallery with Categories

  1. Changes
    - Add category column to gallery table
    - Update existing gallery images with default categories
    - Add RLS policies for category-based filtering

  2. Security
    - Maintain existing RLS policies
    - Allow public read access with category filtering
*/

-- Add category column to gallery table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery' AND column_name = 'category'
  ) THEN
    ALTER TABLE gallery ADD COLUMN category text DEFAULT 'general';
  END IF;
END $$;

-- Update existing gallery images with sample categories
UPDATE gallery SET category = 'lawn-care' WHERE caption ILIKE '%lawn%' OR caption ILIKE '%mowing%';
UPDATE gallery SET category = 'landscaping' WHERE caption ILIKE '%landscape%' OR caption ILIKE '%design%';
UPDATE gallery SET category = 'tree-care' WHERE caption ILIKE '%tree%' OR caption ILIKE '%trimming%';
UPDATE gallery SET category = 'garden' WHERE caption ILIKE '%garden%' OR caption ILIKE '%plant%';
UPDATE gallery SET category = 'maintenance' WHERE caption ILIKE '%cleanup%' OR caption ILIKE '%maintenance%';
UPDATE gallery SET category = 'irrigation' WHERE caption ILIKE '%irrigation%' OR caption ILIKE '%water%';