-- Forbid select access to trees_watered table
drop policy "Enable select for authenticated users only" on "public"."trees_watered";

-- Allow select waterings for a specific tree only via rpc
-- SECURITY DEFINER bypasses the RLS policy
CREATE OR REPLACE FUNCTION public.waterings_for_tree(t_id text)
 RETURNS TABLE(amount numeric, "timestamp" timestamptz, username text, id int4, tree_id text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	
	SELECT amount, timestamp, username, id, tree_id FROM trees_watered WHERE trees_watered.tree_id = t_id;
		
END;
$function$;

-- Allow select waterings for a specific user only via rpc
-- SECURITY DEFINER bypasses the RLS policy
CREATE OR REPLACE FUNCTION public.waterings_for_user(u_id text)
 RETURNS TABLE(amount numeric, "timestamp" timestamptz, username text, id int4, tree_id text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	
	SELECT amount, timestamp, username, id, tree_id FROM trees_watered WHERE trees_watered.uuid = u_id;
		
END;
$function$;