CREATE OR REPLACE FUNCTION public.update_username_on_trees_watered ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
    SECURITY DEFINER
	AS $function$
BEGIN
	UPDATE
		trees_watered
	SET
		username = NEW.username
	WHERE
		uuid = OLD.id::text;
	RETURN NEW;
END;
$function$;