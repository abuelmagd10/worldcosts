-- Update auth redirect URLs to use query parameters instead of hash
CREATE OR REPLACE FUNCTION public.update_auth_redirect_urls()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_config jsonb;
BEGIN
  -- Only allow service role to execute this function
  IF NOT (SELECT EXISTS (
    SELECT 1
    FROM pg_roles
    WHERE rolname = current_user
    AND rolsuper = true
  )) THEN
    RAISE EXCEPTION 'Only superuser can update auth redirect URLs';
  END IF;

  -- Get current config
  SELECT config INTO current_config FROM auth.config LIMIT 1;

  -- Update redirect URLs to use query parameters instead of hash
  UPDATE auth.config
  SET config = jsonb_set(
    current_config,
    '{external_email_enabled}',
    'true'
  );
  
  -- Update redirect URLs to use query parameters instead of hash
  UPDATE auth.config
  SET config = jsonb_set(
    config,
    '{uri_allow_list}',
    '["https://worldcosts.com/auth/confirm", "https://worldcosts.com/auth/reset-password", "https://www.worldcosts.com/auth/confirm", "https://www.worldcosts.com/auth/reset-password"]'::jsonb
  );
  
  -- Update redirect URLs to use query parameters instead of hash
  UPDATE auth.config
  SET config = jsonb_set(
    config,
    '{redirect_urls}',
    '["https://worldcosts.com/auth/confirm", "https://worldcosts.com/auth/reset-password", "https://www.worldcosts.com/auth/confirm", "https://www.worldcosts.com/auth/reset-password"]'::jsonb
  );

  RETURN true;
END;
$$;
