CREATE UNIQUE INDEX username_unique_constraint ON public.profiles USING btree (username);

ALTER TABLE "public"."profiles"
	ADD CONSTRAINT "username_length_constraint" CHECK (((length(username) >= 3) AND (length(username) <= 50))) NOT valid;

ALTER TABLE "public"."profiles" validate CONSTRAINT "username_length_constraint";

ALTER TABLE "public"."profiles"
	ADD CONSTRAINT "username_unique_constraint" UNIQUE USING INDEX "username_unique_constraint";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.username_append_uuid ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $function$
BEGIN
	IF EXISTS (
		SELECT
			1
		FROM
			public.profiles
		WHERE
			username = NEW.username) THEN
	NEW.username := NEW.username || '-' || TRIM(BOTH FROM SUBSTRING(
		LEFT (CAST(uuid_generate_v4 () AS text), 8), 1, 6));
END IF;
	RETURN NEW;
END;
$function$;

CREATE TRIGGER username_check_trigger
	BEFORE INSERT OR UPDATE ON public.profiles
	FOR EACH ROW
	EXECUTE FUNCTION username_append_uuid ();

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
	UPDATE
		trees_watered
	SET
		uuid = NULL,
		username = NULL
	WHERE
		uuid = OLD.id::text;
	DELETE FROM trees_adopted ta
	WHERE ta.uuid = OLD.id::text;
	RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.remove_account ()
	RETURNS void
	LANGUAGE sql
	SECURITY DEFINER
	AS $function$
	DELETE FROM auth.users
	WHERE id = auth.uid ();

$function$;

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

