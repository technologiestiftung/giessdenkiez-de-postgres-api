CREATE OR REPLACE FUNCTION is_username_taken(given_username text)
RETURNS BOOLEAN AS $$
DECLARE
    is_username_taken BOOLEAN;
BEGIN
    -- Check if the username exists in the profile table
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = given_username) INTO is_username_taken;
    
    -- Return the result
    RETURN is_username_taken;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;
