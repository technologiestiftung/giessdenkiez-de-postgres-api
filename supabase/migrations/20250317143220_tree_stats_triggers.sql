set check_function_bodies = off;
create materialized view "public"."most_frequent_tree_species" as
SELECT trees.gattung_deutsch,
	(
		((count(1))::numeric * 100.0) / (
			(
				SELECT count(1) AS count
				FROM trees trees_1
			)
		)::numeric
	) AS percentage
FROM trees
GROUP BY trees.gattung_deutsch
ORDER BY (count(1)) DESC
LIMIT 20;
CREATE OR REPLACE FUNCTION public.tg_refresh_most_frequent_tree_species_mv() RETURNS trigger LANGUAGE plpgsql AS $function$ BEGIN REFRESH MATERIALIZED VIEW CONCURRENTLY most_frequent_tree_species;
RETURN NULL;
END;
$function$;
CREATE OR REPLACE FUNCTION public.tg_refresh_total_tree_species_count_mv() RETURNS trigger LANGUAGE plpgsql AS $function$ BEGIN REFRESH MATERIALIZED VIEW CONCURRENTLY total_tree_species_count;
RETURN NULL;
END;
$function$;
CREATE OR REPLACE FUNCTION public.tg_refresh_trees_count_mv() RETURNS trigger LANGUAGE plpgsql AS $function$ BEGIN REFRESH MATERIALIZED VIEW CONCURRENTLY trees_count;
return null;
end;
$function$;
create materialized view "public"."total_tree_species_count" as
SELECT count(DISTINCT trees.gattung_deutsch) AS count
FROM trees;
create materialized view "public"."trees_count" as
SELECT count(1) AS count
FROM trees;
CREATE UNIQUE INDEX most_frequent_tree_species_gattung_deutsch_idx ON public.most_frequent_tree_species USING btree (gattung_deutsch);
CREATE UNIQUE INDEX total_tree_species_count_count_idx ON public.total_tree_species_count USING btree (count);
CREATE UNIQUE INDEX trees_count_count_idx ON public.trees_count USING btree (count);
CREATE TRIGGER tg_refresh_most_frequent_tree_species_mv
AFTER
INSERT
	OR DELETE
	OR
UPDATE ON public.trees FOR EACH STATEMENT EXECUTE FUNCTION tg_refresh_most_frequent_tree_species_mv();
CREATE TRIGGER tg_refresh_total_tree_species_count_mv
AFTER
INSERT
	OR DELETE
	OR
UPDATE ON public.trees FOR EACH STATEMENT EXECUTE FUNCTION tg_refresh_total_tree_species_count_mv();
CREATE TRIGGER tg_refresh_trees_count_mv
AFTER
INSERT
	OR DELETE
	OR
UPDATE ON public.trees FOR EACH STATEMENT EXECUTE FUNCTION tg_refresh_trees_count_mv();