set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.uuid_insert_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id = uuid_generate_v4()::text;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER insert_uuid BEFORE INSERT ON public.trees FOR EACH ROW EXECUTE FUNCTION uuid_insert_trigger();


