CREATE TABLE "public"."profiles" (
	"id" uuid NOT NULL,
	"username" text
);

CREATE OR REPLACE FUNCTION public.delete_user ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
DECLARE
	row_count int;
BEGIN
	DELETE FROM public.profiles p
	WHERE p.id = OLD.id;
	IF found THEN
		GET DIAGNOSTICS row_count = ROW_COUNT;
		RAISE NOTICE 'DELETEd % row(s) FROM profiles', row_count;
	END IF;
	RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path TO 'public'
	AS $function$
BEGIN
	INSERT INTO public.profiles (id, username)
		VALUES (NEW.id, (
				SELECT
					REGEXP_REPLACE(NEW.email, '@.*?$', '')));
	RETURN new;
END;
$function$;

CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION public.handle_new_user ();

CREATE TRIGGER on_auth_user_delete
	BEFORE DELETE ON auth.users
	FOR EACH ROW
	EXECUTE FUNCTION public.delete_user ();

