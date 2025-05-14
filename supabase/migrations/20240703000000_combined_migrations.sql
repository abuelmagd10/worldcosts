-- Add UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to get SMTP settings
CREATE OR REPLACE FUNCTION public.get_smtp_settings()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user has admin privileges
  IF NOT (SELECT is_admin FROM auth.users WHERE id = auth.uid())
  THEN
    RAISE EXCEPTION 'Only administrators can get SMTP settings';
  END IF;

  -- Return SMTP settings from auth.config table
  RETURN (
    SELECT config->'mailer'->'smtp'
    FROM auth.config
    LIMIT 1
  );
END;
$$;

-- Create function to update SMTP settings
CREATE OR REPLACE FUNCTION public.update_smtp_settings(
  sender_email text,
  sender_name text,
  host text,
  port integer,
  username text,
  password text DEFAULT NULL,
  min_interval_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_config json;
  new_config json;
BEGIN
  -- Check if the user has admin privileges
  IF NOT (SELECT is_admin FROM auth.users WHERE id = auth.uid())
  THEN
    RAISE EXCEPTION 'Only administrators can update SMTP settings';
  END IF;

  -- Get current configuration
  SELECT config INTO current_config FROM auth.config LIMIT 1;

  -- Create new SMTP configuration
  SELECT json_build_object(
    'sender_email', sender_email,
    'sender_name', sender_name,
    'host', host,
    'port', port,
    'username', username,
    'password', COALESCE(password, current_config->'mailer'->'smtp'->>'password'),
    'auth_method', 'LOGIN',
    'secure', true,
    'min_interval_seconds', min_interval_seconds
  ) INTO new_config;

  -- Update configuration
  UPDATE auth.config
  SET config = jsonb_set(
    jsonb_set(config, '{mailer,smtp}', new_config::jsonb),
    '{mailer,enabled}',
    'true'::jsonb
  );

  RETURN true;
END;
$$;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL,
  customer_id TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB,
  UNIQUE(user_id, subscription_id)
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON public.user_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Create function to update updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at field
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies for the table
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Read policy: Users can only read their own subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policy: Admins can manage all subscriptions
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions"
  ON public.user_subscriptions
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.is_admin = true
    )
  );

-- Create function to get current user subscription
CREATE OR REPLACE FUNCTION public.get_current_user_subscription()
RETURNS SETOF public.user_subscriptions
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.user_subscriptions
  WHERE user_id = auth.uid()
  AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Create function to check if current user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = auth.uid()
    AND status IN ('active', 'trialing')
    AND current_period_end > NOW()
  );
$$;
