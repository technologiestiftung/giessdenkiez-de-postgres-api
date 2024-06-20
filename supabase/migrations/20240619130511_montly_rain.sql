create table if not exists daily_weather_data (
    id serial primary key,
    measure_day timestamp not null,
    day_finished boolean not null default false,
    sum_precipitation_mm_per_sqm float,
    avg_temperature_celsius float,
    avg_pressure_msl float,
    sum_sunshine_minutes float,
    avg_wind_direction_deg float,
    avg_wind_speed_kmh float,
    avg_cloud_cover_percentage float,
    avg_dew_point_celcius float,
    avg_relative_humidity_percentage float,
    avg_visibility_m float,
    avg_wind_gust_direction_deg float,
    avg_wind_gust_speed_kmh float,
    source_dwd_station_ids text[]
);