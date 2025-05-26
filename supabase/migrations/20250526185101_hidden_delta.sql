/*
  # Churn Prediction System

  1. New Tables
    - `churn_predictions` - Stores predictions about user churn probability
    - `churn_model_metrics` - Stores metrics about the prediction model performance
    - `churn_actions` - Stores actions taken to prevent churn

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create churn_predictions table
CREATE TABLE IF NOT EXISTS churn_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prediction_date timestamptz DEFAULT now(),
  churn_probability numeric NOT NULL CHECK (churn_probability >= 0 AND churn_probability <= 1),
  confidence_score numeric NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  risk_level text NOT NULL CHECK (risk_level IN ('baixo', 'médio', 'alto')),
  factors jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create churn_model_metrics table
CREATE TABLE IF NOT EXISTS churn_model_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_date timestamptz DEFAULT now(),
  accuracy numeric NOT NULL CHECK (accuracy >= 0 AND accuracy <= 1),
  precision numeric NOT NULL CHECK (precision >= 0 AND precision <= 1),
  recall numeric NOT NULL CHECK (recall >= 0 AND recall <= 1),
  f1_score numeric NOT NULL CHECK (f1_score >= 0 AND f1_score <= 1),
  feature_importance jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create churn_actions table
CREATE TABLE IF NOT EXISTS churn_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES churn_predictions(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('mensagem', 'desconto', 'ligação', 'aula_gratis', 'outro')),
  action_description text,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  assigned_to text,
  result text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies for churn_predictions if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_predictions' AND policyname = 'Users can view their own predictions') THEN
    DROP POLICY "Users can view their own predictions" ON churn_predictions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_predictions' AND policyname = 'Admins can view all predictions') THEN
    DROP POLICY "Admins can view all predictions" ON churn_predictions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_predictions' AND policyname = 'Admins can insert predictions') THEN
    DROP POLICY "Admins can insert predictions" ON churn_predictions;
  END IF;
  
  -- Drop policies for churn_model_metrics if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_model_metrics' AND policyname = 'Admins can view model metrics') THEN
    DROP POLICY "Admins can view model metrics" ON churn_model_metrics;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_model_metrics' AND policyname = 'Admins can insert model metrics') THEN
    DROP POLICY "Admins can insert model metrics" ON churn_model_metrics;
  END IF;
  
  -- Drop policies for churn_actions if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_actions' AND policyname = 'Users can view their own actions') THEN
    DROP POLICY "Users can view their own actions" ON churn_actions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_actions' AND policyname = 'Admins can view all actions') THEN
    DROP POLICY "Admins can view all actions" ON churn_actions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_actions' AND policyname = 'Admins can insert actions') THEN
    DROP POLICY "Admins can insert actions" ON churn_actions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'churn_actions' AND policyname = 'Admins can update actions') THEN
    DROP POLICY "Admins can update actions" ON churn_actions;
  END IF;
END $$;

-- Create policies for churn_predictions
CREATE POLICY "Users can view their own predictions" 
  ON churn_predictions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all predictions" 
  ON churn_predictions 
  FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can insert predictions" 
  ON churn_predictions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Create policies for churn_model_metrics
CREATE POLICY "Admins can view model metrics" 
  ON churn_model_metrics 
  FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can insert model metrics" 
  ON churn_model_metrics 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Create policies for churn_actions
CREATE POLICY "Users can view their own actions" 
  ON churn_actions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all actions" 
  ON churn_actions 
  FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can insert actions" 
  ON churn_actions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can update actions" 
  ON churn_actions 
  FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));