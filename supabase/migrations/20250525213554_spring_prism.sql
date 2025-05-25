/*
  # Fix schema issues

  1. New Tables
    - `payment_plans` - Store payment plans configuration
    - `class_schedules` - Store class schedules configuration
  
  2. Changes
    - Add missing columns to users table
    - Add constraints for payment plans and class schedules
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
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

-- Create payment_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  duration_days integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  academy_id uuid REFERENCES users(id) ON DELETE CASCADE
);

-- Create class_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  instructor text,
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  capacity integer NOT NULL,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  academy_id uuid REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS on payment_plans
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

-- Enable RLS on class_schedules
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy for payment_plans
CREATE POLICY "Users can view their own academy's payment plans"
  ON payment_plans
  FOR SELECT
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert payment plans"
  ON payment_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (academy_id = auth.uid() OR 
              academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can update payment plans"
  ON payment_plans
  FOR UPDATE
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete payment plans"
  ON payment_plans
  FOR DELETE
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

-- Create policy for class_schedules
CREATE POLICY "Users can view their own academy's class schedules"
  ON class_schedules
  FOR SELECT
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert class schedules"
  ON class_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (academy_id = auth.uid() OR 
              academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can update class schedules"
  ON class_schedules
  FOR UPDATE
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete class schedules"
  ON class_schedules
  FOR DELETE
  TO authenticated
  USING (academy_id = auth.uid() OR 
         academy_id IN (SELECT id FROM users WHERE id = auth.uid()));