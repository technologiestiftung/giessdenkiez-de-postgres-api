SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.username_append_uuid()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $function$
BEGIN
	IF EXISTS(
		SELECT
			1
		FROM
			public.profiles
		WHERE
			username = NEW.username) THEN
	NEW.username := NEW.username || '-' || TRIM(BOTH FROM SUBSTRING(
		LEFT(extensions.uuid_generate_v4()::text, 8), 1, 6));
END IF;
	RETURN NEW;
END;
$function$;

