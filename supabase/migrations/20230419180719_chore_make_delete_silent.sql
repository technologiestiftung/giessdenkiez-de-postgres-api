set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
	row_count int;
BEGIN
	DELETE FROM public.profiles p
	WHERE p.id = OLD.id;
-- 	IF found THEN
-- 		GET DIAGNOSTICS row_count = ROW_COUNT;
-- 		RAISE NOTICE 'DELETEd % row(s) FROM profiles', row_count;
-- 	END IF;
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
$function$
;


