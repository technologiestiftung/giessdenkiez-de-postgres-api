set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_watered_and_adopted()
 RETURNS TABLE(tree_id text, adopted bigint, watered bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
	RETURN query
	SELECT
		t.tree_id,
		SUM(t._adopted)::int8 AS adopted,
		SUM(t._watered) AS watered
	FROM (
		SELECT
			ta.tree_id,
			1 AS _adopted,
			0 AS _watered
		FROM
			trees_adopted ta
		UNION ALL
		SELECT
			tw.tree_id,
			0 AS _adopted,
			1 AS _watered
		FROM
			trees_watered tw
		WHERE
			tw.timestamp >= NOW() - INTERVAL '30 days') AS t
	GROUP BY
		t.tree_id;
END;
$function$
;


