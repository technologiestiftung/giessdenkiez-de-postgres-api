drop function if exists get_monthly_weather();

CREATE OR REPLACE FUNCTION public.get_monthly_weather()
 RETURNS TABLE(month text, avg_temperature_celsius double precision, max_temperature_celsius double precision, total_rainfall_liters double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT to_char(daily_weather_data.measure_day, 'yyyy-mm') AS month, AVG(daily_weather_data.avg_temperature_celsius) as avg_temperature_celsius, MAX(daily_weather_data.avg_temperature_celsius) as max_temperature_celsius,  SUM(daily_weather_data.sum_precipitation_mm_per_sqm) as total_rainfall_liters
    FROM daily_weather_data
    GROUP BY to_char(daily_weather_data.measure_day, 'yyyy-mm')
    ORDER BY to_char(daily_weather_data.measure_day, 'yyyy-mm') DESC;
END;
$function$
