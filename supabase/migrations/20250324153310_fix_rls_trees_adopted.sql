CREATE POLICY "Authenticated users can select their own adoptions again - staging fix" ON public.trees_adopted AS PERMISSIVE FOR
SELECT TO authenticated USING (((auth.uid())::text = uuid));
DROP POLICY IF EXISTS "Everyon can select all adoptions" ON public.trees_adopted;