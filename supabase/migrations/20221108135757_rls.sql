alter table "public"."radolan_data" enable row level security;

alter table "public"."radolan_geometry" enable row level security;

alter table "public"."radolan_harvester" enable row level security;

alter table "public"."radolan_temp" enable row level security;

alter table "public"."trees" enable row level security;

alter table "public"."trees_adopted" enable row level security;

alter table "public"."trees_watered" enable row level security;

create policy "Enable read access for all users"
on "public"."trees"
as permissive
for select
to public
using (true);


create policy "Enable read for authenticated users only"
on "public"."trees_adopted"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."trees_watered"
as permissive
for select
to authenticated
using (true);



