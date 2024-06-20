CREATE OR REPLACE FUNCTION public.calculate_avg_waterings_per_month()
 RETURNS TABLE(month text, watering_count bigint, avg_amount_per_watering numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT to_char(trees_watered.timestamp, 'yyyy-mm') AS month, COUNT(1) AS watering_count, SUM(trees_watered.amount) / COUNT(1) as avg_amount_per_watering
    FROM trees_watered
    GROUP BY to_char(trees_watered.timestamp, 'yyyy-mm')
    ORDER BY to_char(trees_watered.timestamp, 'yyyy-mm') DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_top_tree_percentages()
 RETURNS TABLE(gattung_deutsch text, percentage numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT trees.gattung_deutsch, (COUNT(1) * 100.0) / (SELECT COUNT(1) FROM trees) AS percentage
    FROM trees
    GROUP BY trees.gattung_deutsch
    ORDER BY COUNT(1) DESC
    LIMIT 20;
END;
$function$;