create policy "Authenticated users can insert their own waterings" on trees_watered
  for insert to authenticated with check (auth.uid()::text = uuid);

create policy "Authenticated users can delete their own waterings" on trees_watered
  for delete to authenticated using(auth.uid()::text = uuid);


create policy "Authenticated users can insert their own adoptions" on trees_adopted
  for insert to authenticated with check (auth.uid()::text = uuid);

create policy "Authenticated users can delete their own adoptions" on trees_adopted
  for delete to authenticated using(auth.uid()::text = uuid);