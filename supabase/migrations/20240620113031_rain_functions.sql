CREATE OR REPLACE FUNCTION public.accumulated_weather_per_month()
 RETURNS TABLE(measure_day text, sum_precipitation_mm_per_sqm float, avg_temperature_celsius float, avg_pressure_msl float, sum_sunshine_minutes float, avg_wind_direction_deg float, avg_wind_speed_kmh float, avg_cloud_cover_percentage float, avg_dew_point_celcius float, avg_relative_humidity_percentage float, avg_visibility_m float, avg_wind_gust_direction_deg float, avg_wind_gust_speed_kmh float)
 LANGUAGE plpgsql
 SECURITY INVOKER
AS $function$
BEGIN
	RETURN query
	
	SELECT
	to_char(daily_weather_data.measure_day, 'YYYY-MM'),
	sum(daily_weather_data.sum_precipitation_mm_per_sqm) as sum_precipitation_mm_per_sqm,
	avg(daily_weather_data.avg_temperature_celsius) as avg_temperature_celsius,
	avg(daily_weather_data.avg_pressure_msl) as avg_pressure_msl,
	sum(daily_weather_data.sum_sunshine_minutes) as sum_sunshine_minutes,
    avg(daily_weather_data.avg_wind_direction_deg) as avg_wind_direction_deg,
    avg(daily_weather_data.avg_wind_speed_kmh) as avg_wind_speed_kmh,
    avg(daily_weather_data.avg_cloud_cover_percentage) as avg_cloud_cover_percentage,
    avg(daily_weather_data.avg_dew_point_celcius) as avg_dew_point_celcius,
    avg(daily_weather_data.avg_relative_humidity_percentage) as avg_relative_humidity_percentage,
    avg(daily_weather_data.avg_visibility_m) as avg_visibility_m,
    avg(daily_weather_data.avg_wind_gust_direction_deg) as avg_wind_gust_direction_deg,
    avg(daily_weather_data.avg_wind_gust_speed_kmh) as avg_wind_gust_speed_kmh
FROM
	daily_weather_data
GROUP BY
	to_char(daily_weather_data.measure_day, 'YYYY-MM');
		
END;
$function$;