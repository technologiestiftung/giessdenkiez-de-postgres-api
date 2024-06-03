UPDATE trees_watered SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_watered.tree_id);
UPDATE trees_adopted SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_adopted.tree_id);

ALTER TABLE trees_watered RENAME COLUMN tree_id TO gml_id;
ALTER TABLE trees_adopted RENAME COLUMN tree_id TO gml_id;

ALTER TABLE trees_adopted DROP CONSTRAINT fk_trees_adopted_trees;
ALTER TABLE trees_watered DROP CONSTRAINT fk_trees_watered_trees;
ALTER TABLE trees DROP CONSTRAINT trees_pkey;
ALTER TABLE trees DROP COLUMN id;

ALTER TABLE trees ADD PRIMARY KEY (gml_id);

ALTER TABLE trees_adopted
ADD CONSTRAINT fk_trees_adopted_trees
FOREIGN KEY (gml_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trees_watered
ADD CONSTRAINT fk_trees_watered_trees
FOREIGN KEY (gml_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

DROP TRIGGER insert_uuid on public.trees;

DROP FUNCTION public.uuid_insert_trigger;

-- Allow select waterings for a specific tree only via rpc
-- SECURITY DEFINER bypasses the RLS policy
DROP FUNCTION public.waterings_for_tree;
CREATE OR REPLACE FUNCTION public.waterings_for_tree(g_id text)
 RETURNS TABLE(amount numeric, "timestamp" timestamptz, username text, id int4, gml_id text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	
	SELECT trees_watered.amount, trees_watered.timestamp, trees_watered.username, trees_watered.id, trees_watered.gml_id FROM trees_watered WHERE trees_watered.gml_id = g_id;
		
END;
$function$;

-- Allow select waterings for a specific user only via rpc
-- SECURITY DEFINER bypasses the RLS policy
DROP FUNCTION public.waterings_for_user;
CREATE OR REPLACE FUNCTION public.waterings_for_user(u_id text)
 RETURNS TABLE(amount numeric, "timestamp" timestamp with time zone, username text, id integer, gml_id text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	
	SELECT trees_watered.amount, trees_watered.timestamp, trees_watered.username, trees_watered.id, trees_watered.gml_id FROM trees_watered WHERE trees_watered.uuid = u_id;
		
END;
$function$;

DROP FUNCTION public.get_watered_and_adopted;
CREATE OR REPLACE FUNCTION public.get_watered_and_adopted()
 RETURNS TABLE(gml_id text, adopted bigint, watered bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	SELECT
		t.gml_id,
		SUM(t._adopted)::int8 AS adopted,
		SUM(t._watered) AS watered
	FROM (
		SELECT
			ta.gml_id,
			1 AS _adopted,
			0 AS _watered
		FROM
			trees_adopted ta
		UNION ALL
		SELECT
			tw.gml_id,
			0 AS _adopted,
			1 AS _watered
		FROM
			trees_watered tw
		WHERE
			tw.timestamp >= NOW() - INTERVAL '30 days') AS t
	GROUP BY
		t.gml_id;
END;
$function$
;
