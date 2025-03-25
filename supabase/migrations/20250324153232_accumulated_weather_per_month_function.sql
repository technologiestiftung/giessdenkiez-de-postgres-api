CREATE OR REPLACE FUNCTION public.accumulated_weather_per_month(limit_monts integer) RETURNS TABLE(
		measure_day text,
		sum_precipitation_mm_per_sqm double precision,
		avg_temperature_celsius double precision,
		avg_pressure_msl double precision,
		sum_sunshine_minutes double precision,
		avg_wind_direction_deg double precision,
		avg_wind_speed_kmh double precision,
		avg_cloud_cover_percentage double precision,
		avg_dew_point_celcius double precision,
		avg_relative_humidity_percentage double precision,
		avg_visibility_m double precision,
		avg_wind_gust_direction_deg double precision,
		avg_wind_gust_speed_kmh double precision
	) LANGUAGE 'plpgsql' COST 100 VOLATILE PARALLEL UNSAFE ROWS 1000 AS $BODY$ BEGIN RETURN query
SELECT to_char(daily_weather_data.measure_day, 'YYYY-MM'),
	sum(daily_weather_data.sum_precipitation_mm_per_sqm) AS sum_precipitation_mm_per_sqm,
	avg(daily_weather_data.avg_temperature_celsius) AS avg_temperature_celsius,
	avg(daily_weather_data.avg_pressure_msl) AS avg_pressure_msl,
	sum(daily_weather_data.sum_sunshine_minutes) AS sum_sunshine_minutes,
	avg(daily_weather_data.avg_wind_direction_deg) AS avg_wind_direction_deg,
	avg(daily_weather_data.avg_wind_speed_kmh) AS avg_wind_speed_kmh,
	avg(daily_weather_data.avg_cloud_cover_percentage) AS avg_cloud_cover_percentage,
	avg(daily_weather_data.avg_dew_point_celcius) AS avg_dew_point_celcius,
	avg(
		daily_weather_data.avg_relative_humidity_percentage
	) AS avg_relative_humidity_percentage,
	avg(daily_weather_data.avg_visibility_m) AS avg_visibility_m,
	avg(daily_weather_data.avg_wind_gust_direction_deg) AS avg_wind_gust_direction_deg,
	avg(daily_weather_data.avg_wind_gust_speed_kmh) AS avg_wind_gust_speed_kmh
FROM daily_weather_data
GROUP BY to_char(daily_weather_data.measure_day, 'YYYY-MM')
ORDER BY to_char(daily_weather_data.measure_day, 'YYYY-MM') DESC
LIMIT limit_monts;
END;
$BODY$;
ALTER FUNCTION public.accumulated_weather_per_month(integer) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.accumulated_weather_per_month(integer) TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.accumulated_weather_per_month(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.accumulated_weather_per_month(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accumulated_weather_per_month(integer) TO postgres;
GRANT EXECUTE ON FUNCTION public.accumulated_weather_per_month(integer) TO service_role;