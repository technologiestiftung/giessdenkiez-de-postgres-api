UPDATE trees_watered SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_watered.tree_id);
UPDATE trees_adopted SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_adopted.tree_id);

ALTER TABLE trees_watered RENAME COLUMN tree_id TO gml_id;
ALTER TABLE trees_adopted RENAME COLUMN tree_id TO gml_id;

ALTER TABLE trees_adopted DROP CONSTRAINT fk_trees_adopted_trees;
ALTER TABLE trees_watered DROP CONSTRAINT fk_trees_watered_trees;
ALTER TABLE trees DROP CONSTRAINT trees_pkey;
ALTER TABLE trees DROP COLUMN id;

ALTER TABLE trees ADD PRIMARY KEY (gml_id);

ALTER TABLE trees_adopted
ADD CONSTRAINT fk_trees_adopted_trees
FOREIGN KEY (gml_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trees_watered
ADD CONSTRAINT fk_trees_watered_trees
FOREIGN KEY (gml_id)
REFERENCES trees (gml_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

DROP TRIGGER insert_uuid on public.trees;

DROP FUNCTION public.uuid_insert_trigger;