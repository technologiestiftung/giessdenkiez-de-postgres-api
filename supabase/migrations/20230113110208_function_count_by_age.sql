alter table "public"."trees" alter column "pflanzjahr" set data type integer using "pflanzjahr"::integer;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.count_by_age(start_year integer, end_year integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
	 
	return (SELECT count(1) from trees t where t.pflanzjahr >= start_year AND t.pflanzjahr <= end_year);
end;
$function$
;


