CREATE UNIQUE INDEX trees_adopted_tree_id_uuid_key ON public.trees_adopted USING btree (tree_id, uuid);

CREATE INDEX trees_adopted_uuid ON public.trees_adopted USING btree (uuid);

alter table "public"."trees_adopted" add constraint "trees_adopted_tree_id_uuid_key" UNIQUE using index "trees_adopted_tree_id_uuid_key";


