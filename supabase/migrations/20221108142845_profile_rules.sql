alter table "public"."profiles" enable row level security;

create policy "Enable delete for users based on user id"
on "public"."profiles"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on id"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



