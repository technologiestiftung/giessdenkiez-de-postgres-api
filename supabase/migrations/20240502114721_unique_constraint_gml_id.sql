CREATE UNIQUE INDEX gml_id_unique ON public.trees USING btree (gml_id);

alter table "public"."trees" add constraint "gml_id_unique" UNIQUE using index "gml_id_unique";

