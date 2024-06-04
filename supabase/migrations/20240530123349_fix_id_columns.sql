ALTER TABLE trees_watered DROP CONSTRAINT fk_trees_watered_trees;
UPDATE trees_watered SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_watered.tree_id);

ALTER TABLE trees_adopted DROP CONSTRAINT fk_trees_adopted_trees;
UPDATE trees_adopted SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_adopted.tree_id);

UPDATE trees SET id = gml_id;

ALTER TABLE trees_watered
ADD CONSTRAINT fk_trees_watered_trees
FOREIGN KEY (tree_id)
REFERENCES trees (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trees_adopted
ADD CONSTRAINT fk_trees_adopted_trees
FOREIGN KEY (tree_id)
REFERENCES trees (id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trees DROP COLUMN gml_id;

DROP TRIGGER insert_uuid on public.trees;
DROP FUNCTION public.uuid_insert_trigger;