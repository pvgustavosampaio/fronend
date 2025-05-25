/*
  # Add academy_name to users table

  1. Changes
    - Add academy_name column to users table
*/

-- Add academy_name column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'academy_name'
  ) THEN
    ALTER TABLE users ADD COLUMN academy_name text;
  END IF;
END $$;

-- Add status column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE users ADD COLUMN status text DEFAULT 'Ativo';
  END IF;
END $$;