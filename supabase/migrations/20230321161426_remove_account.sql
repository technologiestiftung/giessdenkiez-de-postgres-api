SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.remove_account ()
	RETURNS void
	LANGUAGE sql
	SECURITY DEFINER
	AS $function$
	DELETE FROM auth.users
	WHERE id = auth.uid ();

$function$;

