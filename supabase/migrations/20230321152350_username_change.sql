SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.update_username_on_trees_watered ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
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

CREATE TRIGGER update_username_on_trees_watered_trigger
	AFTER INSERT OR UPDATE ON public.profiles
	FOR EACH ROW
	EXECUTE FUNCTION update_username_on_trees_watered ();

