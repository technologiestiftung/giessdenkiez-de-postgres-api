grant select on all tables in schema public to anon, authenticated;

grant insert, update, delete on all tables in schema public to authenticated;

grant all on all tables in schema public to service_role;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant select on tables to anon, authenticated;

alter default privileges in schema public grant all on tables to service_role;
