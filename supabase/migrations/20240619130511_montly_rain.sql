create table if not exists monthly_aggregated_radolan_data (
    id serial primary key,
    year int2,
    month int2,
    last_harvest_day int2,
    avg_precipitation_liters_per_sm2 float default 0.0,
    harvesting_finished boolean default false
);

create table if not exists monthly_radolan_data_temp (
    id serial primary key,
    measured_at date not null,
    value int2,
    geom_id int2
);