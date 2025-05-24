/*
  # Add role field to users table

  1. Changes
    - Add `role` column to users table with default value 'member'
    - Add check constraint to ensure role is one of 'member', 'staff', or 'admin'
*/

-- Add role column to users table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'staff', 'admin'));
  END IF;
END $$;