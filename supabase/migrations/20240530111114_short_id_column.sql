create extension if not exists "pg_hashids";

alter table trees add COLUMN short_id text default null;

create sequence trees_id_seq start 1;

alter table trees add column numeric_id bigint default nextval('trees_id_seq');

update trees set short_id = id_encode(numeric_id) where short_id is null;

CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.short_id := id_encode(NEW.numeric_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_on_insert_trees
   BEFORE INSERT ON trees
   FOR EACH ROW
   EXECUTE FUNCTION generate_short_id();