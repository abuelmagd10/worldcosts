-- Create function to get auth config
CREATE OR REPLACE FUNCTION public.get_auth_config()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service role to execute this function
  IF NOT (SELECT EXISTS (
    SELECT 1
    FROM pg_roles
    WHERE rolname = current_user
    AND rolsuper = true
  )) THEN
    RAISE EXCEPTION 'Only superuser can get auth config';
  END IF;

  -- Return auth config
  RETURN (
    SELECT config
    FROM auth.config
    LIMIT 1
  );
END;
$$;

-- Create function to update SMTP settings directly
CREATE OR REPLACE FUNCTION public.update_smtp_settings_direct(
  sender_email text,
  sender_name text,
  host text,
  port integer,
  username text,
  password text,
  min_interval_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_config jsonb;
  smtp_config jsonb;
BEGIN
  -- Only allow service role to execute this function
  IF NOT (SELECT EXISTS (
    SELECT 1
    FROM pg_roles
    WHERE rolname = current_user
    AND rolsuper = true
  )) THEN
    RAISE EXCEPTION 'Only superuser can update SMTP settings';
  END IF;

  -- Get current config
  SELECT config INTO current_config FROM auth.config LIMIT 1;

  -- Create SMTP config
  smtp_config := jsonb_build_object(
    'sender_email', sender_email,
    'sender_name', sender_name,
    'host', host,
    'port', port,
    'username', username,
    'password', password,
    'auth_method', 'LOGIN',
    'secure', true,
    'min_interval_seconds', min_interval_seconds
  );

  -- Update config
  UPDATE auth.config
  SET config = jsonb_set(
    jsonb_set(
      current_config,
      '{mailer,smtp}',
      smtp_config
    ),
    '{mailer,enabled}',
    'true'
  );

  RETURN true;
END;
$$;
