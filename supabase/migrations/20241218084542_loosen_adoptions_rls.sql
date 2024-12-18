drop policy "Authenticated users can select their own adoptions" on "public"."trees_adopted";

create policy "Everyon can select all adoptions"
on trees_adopted for select
to anon
using ( true );