ALTER TABLE trees_adopted DROP CONSTRAINT fk_trees_adopted_trees;
ALTER TABLE trees_watered DROP CONSTRAINT fk_trees_watered_trees;
ALTER TABLE trees DROP CONSTRAINT trees_pkey;
ALTER TABLE trees DROP COLUMN id;

ALTER TABLE trees ADD PRIMARY KEY (gml_id);

ALTER TABLE trees_adopted
ADD CONSTRAINT fk_trees_adopted_trees
FOREIGN KEY (tree_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trees_watered
ADD CONSTRAINT fk_trees_watered_trees
FOREIGN KEY (tree_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

DROP TRIGGER insert_uuid on public.trees;

DROP FUNCTION public.uuid_insert_trigger;


