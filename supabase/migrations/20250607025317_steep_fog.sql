/*
  # Insights System Database Schema
  
  1. New Tables
    - `user_metrics` - Stores aggregated user metrics for insights
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `metric_type` (text) - Type of metric (payouts, deposits, active_plans, transactions)
      - `metric_value` (numeric) - The value of the metric
      - `metric_date` (date) - Date for the metric
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `performance_trends` - Stores trend data for performance analysis
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `trend_type` (text) - Type of trend (monthly_growth, average_payout, upcoming_payouts)
      - `current_value` (numeric) - Current period value
      - `previous_value` (numeric) - Previous period value
      - `percentage_change` (numeric) - Calculated percentage change
      - `period_start` (date) - Start of the period
      - `period_end` (date) - End of the period
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `vault_performance` - Stores individual vault performance data
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `payout_plan_id` (uuid, references payout_plans)
      - `total_amount` (numeric) - Total vault amount
      - `progress_percentage` (numeric) - Completion percentage
      - `next_payout_date` (date) - Next scheduled payout
      - `status` (text) - Vault status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Functions
    - `calculate_user_metrics()` - Calculates and updates user metrics
    - `calculate_performance_trends()` - Calculates trend data
    - `refresh_vault_performance()` - Updates vault performance data
  
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL CHECK (metric_type IN ('payouts', 'deposits', 'active_plans', 'transactions')),
  metric_value numeric NOT NULL DEFAULT 0,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, metric_type, metric_date)
);

-- Create performance_trends table
CREATE TABLE IF NOT EXISTS performance_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trend_type text NOT NULL CHECK (trend_type IN ('monthly_growth', 'average_payout', 'upcoming_payouts')),
  current_value numeric NOT NULL DEFAULT 0,
  previous_value numeric NOT NULL DEFAULT 0,
  percentage_change numeric NOT NULL DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, trend_type, period_start, period_end)
);

-- Create vault_performance table
CREATE TABLE IF NOT EXISTS vault_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  payout_plan_id uuid REFERENCES payout_plans(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  progress_percentage numeric NOT NULL DEFAULT 0,
  next_payout_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, payout_plan_id)
);

-- Enable RLS
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for user_metrics
CREATE POLICY "Users can view own metrics"
  ON user_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON user_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON user_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for performance_trends
CREATE POLICY "Users can view own trends"
  ON performance_trends
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trends"
  ON performance_trends
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trends"
  ON performance_trends
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for vault_performance
CREATE POLICY "Users can view own vault performance"
  ON vault_performance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vault performance"
  ON vault_performance
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vault performance"
  ON vault_performance
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_metrics_user_type_date ON user_metrics(user_id, metric_type, metric_date);
CREATE INDEX IF NOT EXISTS idx_performance_trends_user_type ON performance_trends(user_id, trend_type, period_start);
CREATE INDEX IF NOT EXISTS idx_vault_performance_user_status ON vault_performance(user_id, status);

-- Function to calculate user metrics
CREATE OR REPLACE FUNCTION calculate_user_metrics(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_month_start date := date_trunc('month', CURRENT_DATE);
  v_current_month_end date := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date;
  v_total_payouts numeric := 0;
  v_total_deposits numeric := 0;
  v_active_plans integer := 0;
  v_total_transactions integer := 0;
BEGIN
  -- Calculate total payouts for current month
  SELECT COALESCE(SUM(amount), 0) INTO v_total_payouts
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'payout'
    AND status = 'completed'
    AND created_at >= v_current_month_start
    AND created_at <= v_current_month_end;

  -- Calculate total deposits for current month
  SELECT COALESCE(SUM(amount), 0) INTO v_total_deposits
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'deposit'
    AND status = 'completed'
    AND created_at >= v_current_month_start
    AND created_at <= v_current_month_end;

  -- Count active plans
  SELECT COUNT(*) INTO v_active_plans
  FROM payout_plans
  WHERE user_id = p_user_id
    AND status = 'active';

  -- Count total transactions for current month
  SELECT COUNT(*) INTO v_total_transactions
  FROM transactions
  WHERE user_id = p_user_id
    AND created_at >= v_current_month_start
    AND created_at <= v_current_month_end;

  -- Insert or update metrics
  INSERT INTO user_metrics (user_id, metric_type, metric_value, metric_date)
  VALUES 
    (p_user_id, 'payouts', v_total_payouts, CURRENT_DATE),
    (p_user_id, 'deposits', v_total_deposits, CURRENT_DATE),
    (p_user_id, 'active_plans', v_active_plans, CURRENT_DATE),
    (p_user_id, 'transactions', v_total_transactions, CURRENT_DATE)
  ON CONFLICT (user_id, metric_type, metric_date)
  DO UPDATE SET
    metric_value = EXCLUDED.metric_value,
    updated_at = now();
END;
$$;

-- Function to calculate performance trends
CREATE OR REPLACE FUNCTION calculate_performance_trends(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_month_start date := date_trunc('month', CURRENT_DATE);
  v_current_month_end date := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date;
  v_previous_month_start date := (date_trunc('month', CURRENT_DATE) - interval '1 month');
  v_previous_month_end date := (date_trunc('month', CURRENT_DATE) - interval '1 day')::date;
  
  v_current_payouts numeric := 0;
  v_previous_payouts numeric := 0;
  v_growth_percentage numeric := 0;
  
  v_current_avg_payout numeric := 0;
  v_previous_avg_payout numeric := 0;
  v_avg_change_percentage numeric := 0;
  
  v_upcoming_payouts numeric := 0;
BEGIN
  -- Calculate monthly growth
  SELECT COALESCE(SUM(amount), 0) INTO v_current_payouts
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'payout'
    AND status = 'completed'
    AND created_at >= v_current_month_start
    AND created_at <= v_current_month_end;

  SELECT COALESCE(SUM(amount), 0) INTO v_previous_payouts
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'payout'
    AND status = 'completed'
    AND created_at >= v_previous_month_start
    AND created_at <= v_previous_month_end;

  -- Calculate growth percentage
  IF v_previous_payouts > 0 THEN
    v_growth_percentage := ((v_current_payouts - v_previous_payouts) / v_previous_payouts) * 100;
  ELSE
    v_growth_percentage := CASE WHEN v_current_payouts > 0 THEN 100 ELSE 0 END;
  END IF;

  -- Calculate average payout
  SELECT COALESCE(AVG(amount), 0) INTO v_current_avg_payout
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'payout'
    AND status = 'completed'
    AND created_at >= v_current_month_start
    AND created_at <= v_current_month_end;

  SELECT COALESCE(AVG(amount), 0) INTO v_previous_avg_payout
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'payout'
    AND status = 'completed'
    AND created_at >= v_previous_month_start
    AND created_at <= v_previous_month_end;

  -- Calculate average change percentage
  IF v_previous_avg_payout > 0 THEN
    v_avg_change_percentage := ((v_current_avg_payout - v_previous_avg_payout) / v_previous_avg_payout) * 100;
  ELSE
    v_avg_change_percentage := CASE WHEN v_current_avg_payout > 0 THEN 100 ELSE 0 END;
  END IF;

  -- Calculate upcoming payouts (next 30 days)
  SELECT COALESCE(SUM(payout_amount), 0) INTO v_upcoming_payouts
  FROM payout_plans
  WHERE user_id = p_user_id
    AND status = 'active'
    AND next_payout_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + interval '30 days');

  -- Insert or update trends
  INSERT INTO performance_trends (user_id, trend_type, current_value, previous_value, percentage_change, period_start, period_end)
  VALUES 
    (p_user_id, 'monthly_growth', v_current_payouts, v_previous_payouts, v_growth_percentage, v_current_month_start, v_current_month_end),
    (p_user_id, 'average_payout', v_current_avg_payout, v_previous_avg_payout, v_avg_change_percentage, v_current_month_start, v_current_month_end),
    (p_user_id, 'upcoming_payouts', v_upcoming_payouts, 0, 0, CURRENT_DATE, CURRENT_DATE + interval '30 days')
  ON CONFLICT (user_id, trend_type, period_start, period_end)
  DO UPDATE SET
    current_value = EXCLUDED.current_value,
    previous_value = EXCLUDED.previous_value,
    percentage_change = EXCLUDED.percentage_change,
    updated_at = now();
END;
$$;

-- Function to refresh vault performance
CREATE OR REPLACE FUNCTION refresh_vault_performance(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update vault performance data
  INSERT INTO vault_performance (user_id, payout_plan_id, total_amount, progress_percentage, next_payout_date, status)
  SELECT 
    pp.user_id,
    pp.id,
    pp.total_amount,
    CASE 
      WHEN pp.duration > 0 THEN ROUND((pp.completed_payouts::numeric / pp.duration::numeric) * 100, 2)
      ELSE 0
    END as progress_percentage,
    pp.next_payout_date,
    pp.status
  FROM payout_plans pp
  WHERE pp.user_id = p_user_id
  ON CONFLICT (user_id, payout_plan_id)
  DO UPDATE SET
    total_amount = EXCLUDED.total_amount,
    progress_percentage = EXCLUDED.progress_percentage,
    next_payout_date = EXCLUDED.next_payout_date,
    status = EXCLUDED.status,
    updated_at = now();
END;
$$;

-- Function to refresh all insights data for a user
CREATE OR REPLACE FUNCTION refresh_insights_data(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM calculate_user_metrics(p_user_id);
  PERFORM calculate_performance_trends(p_user_id);
  PERFORM refresh_vault_performance(p_user_id);
END;
$$;

-- Create trigger to automatically update insights when transactions are created
CREATE OR REPLACE FUNCTION trigger_refresh_insights()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Refresh insights data for the user
  PERFORM refresh_insights_data(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_transaction_insights ON transactions;
CREATE TRIGGER trigger_transaction_insights
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_insights();

DROP TRIGGER IF EXISTS trigger_payout_plan_insights ON payout_plans;
CREATE TRIGGER trigger_payout_plan_insights
  AFTER INSERT OR UPDATE ON payout_plans
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_insights();