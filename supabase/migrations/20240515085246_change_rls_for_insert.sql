create policy "Authenticated users can insert their own waterings"
on trees_watered
for insert to authenticated
with check (auth.uid()::text = uuid);

create policy "Authenticated users can select their own rows"
on trees_watered
for select
to authenticated
using (uuid = auth.uid()::text);

create policy "Authenticated users can delete their own rows"
on trees_watered
for delete
to authenticated
using (uuid = auth.uid()::text);

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