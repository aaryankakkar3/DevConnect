-- PostgreSQL trigger to automatically sync auth.users email changes to public.User table
-- Run this SQL in your Supabase SQL Editor

-- Create function to sync auth.users changes to your public.User table
CREATE OR REPLACE FUNCTION sync_auth_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if email actually changed
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    -- Update the email in your public.User table when auth.users email changes
    UPDATE public."User" 
    SET 
      email = NEW.email, 
      "updatedAt" = NOW()
    WHERE id = NEW.id;
    
    -- Log the change (optional)
    RAISE NOTICE 'Email synced for user %: % -> %', NEW.id, OLD.email, NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;

-- Create the trigger
CREATE TRIGGER sync_user_email_trigger
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_user_email();

-- Verify the trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'sync_user_email_trigger';