CREATE OR REPLACE FUNCTION public.calculate_avg_waterings_per_month()
 RETURNS TABLE(month text, watering_count bigint, avg_amount_per_watering numeric, total_sum numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT to_char(trees_watered.timestamp, 'yyyy-mm') AS month, COUNT(1) AS watering_count, SUM(trees_watered.amount) / COUNT(1) as avg_amount_per_watering, SUM(trees_watered.amount) as total_sum
    FROM trees_watered
    GROUP BY to_char(trees_watered.timestamp, 'yyyy-mm')
    ORDER BY to_char(trees_watered.timestamp, 'yyyy-mm') DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_top_tree_species()
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

CREATE OR REPLACE FUNCTION public.get_waterings_with_location()
 RETURNS TABLE(id text, lat double precision, lng double precision, amount numeric, "timestamp" timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.id, ST_Y(t.geom) AS lat, ST_X(t.geom) AS lng, tw.amount, tw."timestamp"
	from trees_watered tw, trees t
	where tw.tree_id = t.id
	and tw."timestamp" > DATE_TRUNC('year', CURRENT_DATE)::date;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_adoptions()
 RETURNS TABLE(total_adoptions bigint, very_thirsty_adoptions bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
    WITH adoptions AS (
	SELECT
		ta.id AS adoption_id,
		t.id AS tree_id,
		t.pflanzjahr,
		date_part('year',
			now()) - t.pflanzjahr AS age,
		(date_part('year',
				now()) - t.pflanzjahr >= 5
			AND date_part('year',
				now()) - t.pflanzjahr <= 10) AS very_thirsty
	FROM
		trees_adopted ta,
		trees t
	WHERE
		ta.tree_id = t.id
)
SELECT
	count(1) total_adoptions,
	count(1) FILTER (WHERE adoptions.very_thirsty) AS very_thirsty_adoptions
FROM
	adoptions;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_monthly_weather()
 RETURNS TABLE(month text, avg_temperature_celsius double precision, total_rainfall_liters double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT to_char(daily_weather_data.measure_day, 'yyyy-mm') AS month, AVG(daily_weather_data.avg_temperature_celsius) as avg_temperature_celsius, SUM(daily_weather_data.sum_precipitation_mm_per_sqm) as total_rainfall_liters
    FROM daily_weather_data
    GROUP BY to_char(daily_weather_data.measure_day, 'yyyy-mm')
    ORDER BY to_char(daily_weather_data.measure_day, 'yyyy-mm') DESC;
END;
$function$;
