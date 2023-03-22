CREATE POLICY "Enable delete for users based on uuid" ON "public"."trees_adopted" AS permissive
	FOR DELETE TO authenticated
		USING (((auth.uid ())::text = uuid));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."trees_watered" AS permissive
	FOR DELETE TO authenticated
		USING (((auth.uid ())::text = uuid));

CREATE POLICY "Enable update for users based on uuid" ON "public"."trees_watered" AS permissive
	FOR UPDATE TO authenticated
		USING (((auth.uid ())::text = uuid))
		WITH CHECK (((auth.uid ())::text = uuid));

