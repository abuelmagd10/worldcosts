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
