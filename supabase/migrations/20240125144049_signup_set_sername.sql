set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
	INSERT INTO public.profiles (id, username)
		VALUES(NEW.id, (
				SELECT
					COALESCE(NEW.raw_user_meta_data ->> 'signup_username', REGEXP_REPLACE(NEW.email, '@.*?$', ''))));
	RETURN new;
END;
$function$
;


