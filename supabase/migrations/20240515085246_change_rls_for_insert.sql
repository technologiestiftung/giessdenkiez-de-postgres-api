
drop policy "Enable delete for users based on user_id" on trees_watered;
drop policy "Enable update for users based on uuid" on trees_watered;

create policy "Authenticated users can insert their own waterings"
on trees_watered
for insert to authenticated
with check (auth.uid()::text = uuid);

create policy "Authenticated users can select their own waterings"
on trees_watered
for select
to authenticated
using (uuid = auth.uid()::text);

create policy "Authenticated users can delete their own waterings"
on trees_watered
for delete
to authenticated
using (uuid = auth.uid()::text);

drop policy "Enable read for authenticated users only" on trees_adopted;
drop policy "Enable delete for users based on uuid" on trees_adopted;

create policy "Authenticated users can insert their own adoptions"
on trees_adopted
for insert to authenticated
with check (auth.uid()::text = uuid);

create policy "Authenticated users can select their own adoptions"
on trees_adopted
for select to authenticated
using (auth.uid()::text = uuid);

create policy "Authenticated users can delete their own adoptions"
on trees_adopted
for delete to authenticated
using (auth.uid()::text = uuid);