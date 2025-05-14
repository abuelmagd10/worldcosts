-- Create function to set user admin status
CREATE OR REPLACE FUNCTION public.set_user_admin_status(user_id UUID, admin_status BOOLEAN)
RETURNS VOID
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
    RAISE EXCEPTION 'Only superuser can set admin status';
  END IF;

  -- Update user's is_admin field
  UPDATE auth.users
  SET is_admin = admin_status
  WHERE id = user_id;
END;
$$;
