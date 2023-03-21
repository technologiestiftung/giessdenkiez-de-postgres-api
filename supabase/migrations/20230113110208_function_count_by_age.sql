-- data needs to be cleaned first
-- update trees set pflanzjahr = null where pflanzjahr like 'undefined';
ALTER TABLE "public"."trees"
	ALTER COLUMN "pflanzjahr" SET data TYPE integer USING "pflanzjahr"::integer;

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.count_by_age (start_year integer, end_year integer)
	RETURNS integer
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
BEGIN
	RETURN (
		SELECT
			count(1)
		FROM
			trees t
		WHERE
			t.pflanzjahr >= start_year
			AND t.pflanzjahr <= end_year);
END;
$function$;

