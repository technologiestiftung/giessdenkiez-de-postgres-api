drop policy "Enable read access for all users" on "public"."profiles";

create policy "Enable read access for users's own profile" on "public"."profiles"
	for select to authenticated using (auth.uid() = id);